import { PATH } from "@constants/path";
import { Answer, QuizMode, QuizResult } from "@interfaces/api/quiz";
import {
  QuizSubmissionRequest,
  useCreateQuizResult,
  useGetQuizDetail,
} from "@services/quiz";
import { getRoute } from "@utils/route";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export const useQuizPage = () => {
  const { quizId } = useParams();
  const [mode, setMode] = useState<QuizMode>(QuizMode.TAKING);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type_param = searchParams.get("type");
  const type_id_param = searchParams.get("typeId");
  const participation_id_param = searchParams.get("participationId");

  const { data: quizData } = useGetQuizDetail(quizId || "");

  const { mutateAsync: submitResult, isPending: isSubmitting } =
    useCreateQuizResult();

  const handleSubmitQuiz = async (answers: Answer[]) => {
    const params: QuizSubmissionRequest = {
      quiz_id: quizId || "",
      type: type_param || "",
      type_id: type_id_param || "",
      participation_id: participation_id_param || "",
      answers: answers,
    };

    // Mock result - replace with actual API call
    await submitResult(params, {
      onSuccess: (result) => {
        setQuizResult(result);
        setMode(QuizMode.REVIEW);
      },
    });
  };

  const handleBackToLesson = () => {
    const courseId = localStorage.getItem("courseId") || "";
    const route = getRoute(PATH.COURSES_DETAIL, { courseId });
    navigate(route + `?lessonId=${type_id_param}`);
  };

  return {
    quizId,
    quizData,
    handleSubmitQuiz,
    mode,
    quizResult,
    isSubmitting,
    handleBackToLesson,
  };
};
