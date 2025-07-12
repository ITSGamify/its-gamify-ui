import { QUERY_KEYS } from "@constants/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createQuizResult, getQuizDetail } from "./request";
import { Answer } from "@interfaces/api/quiz";

export interface QuizSubmissionRequest {
  quiz_id: string;
  type_id: string;
  participation_id: string;
  type: string;
  answers: Answer[] | null;
}

export const useGetQuizDetail = (quizId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.QUIZZES.BASE, quizId],
    queryFn: () => getQuizDetail(quizId),
    enabled: !!quizId,
  });
};

export const useCreateQuizResult = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: QuizSubmissionRequest) => createQuizResult(payload),
    onSuccess,
  });
};
