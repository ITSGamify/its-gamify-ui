import { useGetRoomDetail } from "@services/room";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import userSession from "@utils/user-session"; // Để lấy profile và xác định isHost
import { useSignalR } from "@providers/SignalRContext";
import { QuizQuestion } from "@interfaces/api/lesson";
import { Room } from "@interfaces/api/challenge";
import { PATH } from "@constants/path";
import { getRoute } from "@utils/route";

export const useMatchPage = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") || "";
  const profile = userSession.getUserProfile(); // Lấy profile để xác định isHost
  const { connection } = useSignalR(); // Lấy từ context

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [numOfCorrect, setNumOfCorrect] = useState(0);
  const [parsedRoom, setParsedRoom] = useState<Room | null>(null);
  const [roomResult, setRoomResult] = useState<Room | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); // State mới cho questions từ SignalR

  const { data: roomDetailFromApi, isFetching: isLoadingRoom } =
    useGetRoomDetail(roomId);

  const roomDetail = parsedRoom || roomDetailFromApi;
  const [timeLeft, setTimeLeft] = useState(roomDetail?.time_per_question || 60); // Mặc định, sẽ set từ roomDetail.time_per_question

  const getOptions = (question: QuizQuestion) => [
    question.answer_a,
    question.answer_b,
    question.answer_c,
    question.answer_d,
  ];
  const currentQuestion = roomDetail?.current_question_index || 0;

  connection?.on("RoomUpdated", (message: string) => {
    const roomData = JSON.parse(message) as Room;
    setParsedRoom(roomData);
    if (roomData.status === "FINISHED") {
      setNumOfCorrect(0);
      setShowResult(true);
      setRoomResult(roomData);
      setTimeLeft(roomData?.time_per_question || 60);
    }

    const newCurrentQuestion = roomData.current_question_index || 0;
    if (newCurrentQuestion !== currentQuestion) {
      setSelectedAnswer(null);
      setIsAnswering(false);
      setTimeLeft(roomData?.time_per_question || 60);
    }
  });

  // Lấy danh sách người chơi active
  const activePlayers = useMemo(() => {
    return (roomDetail?.room_users || []).filter((user) => !user.is_out_room);
  }, [roomDetail?.room_users]);

  // Timer effect (giữ nguyên, nhưng sẽ tách hiển thị trong component con)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return roomDetail?.time_per_question || 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, roomDetail?.time_per_question]);

  // Handle answer select (thêm tự động next sau 2 giây để show result)
  const handleAnswerSelect = useCallback(
    async (answerIndex: number) => {
      if (isAnswering || !connection) return;

      const question = questions[currentQuestion];
      const options = getOptions(question);
      const selected = options[answerIndex];
      setSelectedAnswer(selected);
      setIsAnswering(true);

      const isCorrect = selected === question.correct_answer;
      if (isCorrect) setNumOfCorrect((prev) => prev + 1);
      // Tính điểm (base 100 + speed bonus)
      const speedBonus = Math.floor(timeLeft / 3);
      const points = isCorrect ? 100 + speedBonus : 0;
      // Invoke SignalR để gửi answer (uncomment nếu sẵn sàng)
      await connection.invoke(
        "SubmitAnswer",
        roomId,
        profile?.user.id,
        currentQuestion,
        points
      );
    },
    [
      connection,
      currentQuestion,
      isAnswering,
      profile?.user.id,
      questions,
      roomId,
      timeLeft,
    ]
  );

  const initial = useRef(false);

  // Khởi tạo questions bằng invoke InitialMatch chỉ lần đầu
  useEffect(() => {
    if (!connection || !roomId || initial.current || questions.length > 0)
      return;

    const initMatch = async () => {
      try {
        // Giả sử invoke trả về array questions trực tiếp
        const fetchedQuestions = await connection.invoke(
          "InitialMatch",
          roomId
        );
        setQuestions(fetchedQuestions || []);
        initial.current = true;
      } catch (err) {
        console.error("Error initializing match:", err);
      }
    };

    initMatch();
  }, [connection, roomId, questions.length]);

  const handleLeaveRoom = useCallback(async () => {
    if (!connection || !roomId || !profile?.user.id) return;

    try {
      await connection.invoke("OutRoom", roomId, profile.user.id);
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  }, [connection, roomId, profile?.user.id]);

  useEffect(() => {
    let currentUrl = window.location.href;

    const route = getRoute(PATH.TOURNAMENT_WAITING_ROOM, {
      roomId: roomDetail && roomDetail?.id,
    });
    const cleanup = () => {
      if (roomDetail?.status === "PLAYING" && !showResult) {
        connection
          ?.invoke("OutMatch", roomId, profile?.user.id, numOfCorrect)
          .catch((err) => console.error("Error ending match:", err));
      } else {
        connection
          ?.invoke("OutRoom", roomId, profile?.user.id)
          .catch((err) => console.error("Error out room:", err));
      }
      initial.current = true;
    };

    const handleBeforeUnload = () => {
      cleanup();
    };

    const handleUrlChange = () => {
      if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;

        // Kiểm tra xem URL mới có phải là route đến waiting room không
        const newUrl = window.location.href;
        const waitingRoomUrl = new URL(route, window.location.origin).href;

        // Chỉ gọi cleanup nếu URL mới không phải là route đến waiting room
        if (newUrl !== waitingRoomUrl && !newUrl.includes(route)) {
          cleanup();
        }
      }
    };

    // Override history methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      handleUrlChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      handleUrlChange();
    };

    // Event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleUrlChange);

    return () => {
      // Restore original methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;

      // Remove listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [
    connection,
    handleLeaveRoom,
    numOfCorrect,
    profile?.user.id,
    roomDetail,
    roomDetail?.id,
    roomDetail?.status,
    roomId,
    showResult,
  ]);
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    connection
      ?.invoke("PlayAgain", roomId, profile?.user.id)
      .then(() => {
        const route = getRoute(PATH.TOURNAMENT_WAITING_ROOM, {
          roomId: roomDetail?.id,
        });
        navigate(route);
      })
      .catch((err) => console.error("Error out room:", err));
  };

  return {
    roomDetail,
    questions,
    currentQuestion,
    timeLeft, // Vẫn trả về để component con dùng
    selectedAnswer,
    showResult,
    isAnswering,
    loading: isLoadingRoom || questions.length === 0, // Cập nhật loading để bao gồm questions
    getOptions,
    handleAnswerSelect,
    roomResult,
    profile,
    handlePlayAgain,
    activePlayers,
  };
};
