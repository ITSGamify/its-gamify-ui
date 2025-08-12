import { useGetChallengeQuestions } from "@services/question";
import { useGetRoomDetail } from "@services/room";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import userSession from "@utils/user-session"; // Để lấy profile và xác định isHost
import { useSignalR } from "@providers/SignalRContext";
import { QuizQuestion } from "@interfaces/api/lesson";
import { Room } from "@interfaces/api/challenge";

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

  const { data: roomDetailFromApi, isFetching: isLoadingRoom } =
    useGetRoomDetail(roomId);

  const roomDetail = parsedRoom || roomDetailFromApi;
  const [timeLeft, setTimeLeft] = useState(roomDetail?.time_per_question || 60); // Mặc định, sẽ set từ roomDetail.time_per_question

  const getChallengeQuestionsReq = {
    page: 0,
    limit: roomDetail?.question_count || 12,
    courseId: roomDetail?.challenge.course_id || "",
    q: "",
  };

  const { data: questionsData, isFetching: isLoadingQuestion } =
    useGetChallengeQuestions(getChallengeQuestionsReq);

  const questions: QuizQuestion[] = useMemo(
    () => questionsData || [],
    [questionsData]
  );

  const isHost = profile?.user.id === roomDetail?.host_user_id;
  const userScore = isHost
    ? roomDetail?.host_score || 0
    : roomDetail?.opponent_score || 0;
  const opponentScore = isHost
    ? roomDetail?.opponent_score || 0
    : roomDetail?.host_score || 0;

  const getOptions = (question: QuizQuestion) => [
    question.answer_a,
    question.answer_b,
    question.answer_c,
    question.answer_d,
  ];

  connection?.on("RoomUpdated", (message: string) => {
    const roomData = JSON.parse(message);
    setParsedRoom(roomData);
  });

  const currentQuestion = roomDetail?.current_question || 0;

  // Handle next question
  const handleNextQuestion = useCallback(async () => {
    setSelectedAnswer(null);
    setIsAnswering(false);
    setTimeLeft(roomDetail?.time_per_question || 15);

    if (currentQuestion < questions.length - 1) {
      connection
        ?.invoke("MoveToNextQuestion", roomId)
        .catch((err) => console.error("Error ending match:", err));
    } else {
      if (profile?.user.id == roomDetail?.host_user_id) {
        connection
          ?.invoke("EndMatch", roomId, profile?.user.id, numOfCorrect)
          .catch((err) => console.error("Error ending match:", err));
      }
      setNumOfCorrect(0);
      setShowResult(true);
    }
  }, [
    connection,
    currentQuestion,
    numOfCorrect,
    profile?.user.id,
    questions.length,
    roomDetail?.host_user_id,
    roomDetail?.time_per_question,
    roomId,
  ]);

  useEffect(() => {
    if (roomDetail?.is_host_answer && roomDetail?.is_opponent_answer) {
      handleNextQuestion();
    }
  }, [
    connection,
    currentQuestion,
    handleNextQuestion,
    questions.length,
    roomDetail?.is_host_answer,
    roomDetail?.is_opponent_answer,
    roomId,
  ]);

  // Timer effect (giữ nguyên, nhưng sẽ tách hiển thị trong component con)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return roomDetail?.time_per_question || 15;
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

  useEffect(() => {
    if (!connection || !roomId || initial.current) return;
    connection
      .invoke("StartMatch", roomId)
      .catch((err) => console.error("Error start match:", err));
    initial.current = true;
  }, [connection, roomId]);

  const handleLeaveRoom = useCallback(async () => {
    if (!connection || !roomId || !profile?.user.id) return;

    try {
      const isGameStarted = roomDetail?.status === "PLAYING";

      if (isGameStarted && roomDetail?.status !== "FINISHED" && !showResult) {
        await connection.invoke("EndMatch", roomId);
      }

      await connection.invoke("OutRoom", roomId, profile.user.id);
      console.log("Out_room");
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  }, [connection, roomId, profile?.user.id, roomDetail, showResult]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      handleLeaveRoom();

      if (roomDetail?.status === "PLAYING" && !showResult) {
        event.preventDefault();
        event.returnValue = "Bạn có chắc chắn muốn thoát? Game đang diễn ra.";
        return event.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleLeaveRoom, roomDetail?.status, showResult]);

  return {
    roomDetail,
    questions,
    currentQuestion,
    timeLeft, // Vẫn trả về để component con dùng
    selectedAnswer,
    showResult,
    isAnswering,
    userScore,
    opponentScore,
    isHost,
    loading: isLoadingRoom || isLoadingQuestion,
    getOptions,
    handleAnswerSelect,
  };
};
