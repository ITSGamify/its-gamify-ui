import { useGetRoomDetail } from "@services/room";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import userSession from "@utils/user-session"; // Để lấy profile và xác định isHost
import { useSignalR } from "@providers/SignalRContext";
import { QuizQuestion } from "@interfaces/api/lesson";
import { Room, RoomUser } from "@interfaces/api/challenge";
import { RoomCleanupManager } from "@utils/roomCleanup"; // Import RoomCleanupManager

export const useMatchPage = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") || "";
  const profile = userSession.getUserProfile(); // Lấy profile để xác định isHost
  const { connection } = useSignalR(); // Lấy từ context

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [parsedRoom, setParsedRoom] = useState<Room | null>(null);
  const [roomResult, setRoomResult] = useState<RoomUser[] | null>(null);
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

  // Thiết lập RoomCleanupManager khi component mount
  useEffect(() => {
    if (connection && roomId && profile?.user.id) {
      RoomCleanupManager.setConnection(connection);

      RoomCleanupManager.setRoomData(roomId, profile.user.id, "Match");
    }

    return () => {
      // Khi component unmount, kiểm tra nếu đang chuyển đến waiting room
      // thì không cần cleanup (sẽ được xử lý trong handlePlayAgain)
      const currentPath = window.location.pathname;
      const waitingRoomPath = `/rooms/${roomId}`;

      if (!currentPath.includes(waitingRoomPath)) {
        // Nếu không phải đang chuyển đến waiting room thì thực hiện cleanup
        RoomCleanupManager.forceCleanup();
      }
    };
  }, [connection, roomId, profile?.user.id]);

  connection?.on("GameEnded", (result: string) => {
    const roomUser = JSON.parse(result) as RoomUser[];
    console.log(result);
    setShowResult(true);
    setRoomResult(roomUser);
  });

  connection?.on("RoomUpdated", (message: string) => {
    const roomData = JSON.parse(message) as Room;
    setParsedRoom(roomData);
    if (roomData.status === "FINISHED") {
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

  const handleAnswerSelect = useCallback(
    async (answerIndex: number) => {
      if (isAnswering || !connection) return;

      const question = questions[currentQuestion];
      setIsAnswering(true);

      if (answerIndex === -1) {
        setSelectedAnswer(null);
        await connection.invoke(
          "SubmitAnswer",
          roomId,
          profile?.user.id,
          currentQuestion,
          0
        );
        return;
      }

      const options = getOptions(question);
      const selected = options[answerIndex];
      setSelectedAnswer(selected);

      const isCorrect = selected === question.correct_answer;

      const speedBonus = Math.floor(timeLeft / 3);
      const points = isCorrect ? 100 + speedBonus : 0;
      // Invoke SignalR để gửi answer
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!isAnswering && questions.length > 0) {
            handleAnswerSelect(-1);
          }
          return roomDetail?.time_per_question || 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    currentQuestion,
    roomDetail?.time_per_question,
    isAnswering,
    questions,
    handleAnswerSelect,
  ]);
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
      // Gọi HandleMatchOut vì đây là match
      await connection.invoke("HandleMatchOut", roomId, profile.user.id);
      // Xóa dữ liệu cleanup
      RoomCleanupManager.clearRoomData();
    } catch (error) {
      console.error("Error leaving match:", error);
    }
  }, [connection, roomId, profile?.user.id]);

  const handlePlayAgain = () => {};

  return {
    roomDetail,
    questions,
    currentQuestion,
    timeLeft,
    selectedAnswer,
    showResult,
    isAnswering,
    loading: isLoadingRoom || questions.length === 0,
    getOptions,
    handleAnswerSelect,
    roomResult,
    profile,
    handlePlayAgain,
    activePlayers,
    handleLeaveRoom,
  };
};
