import { request } from "@config/axios";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { Quiz, QuizResult } from "@interfaces/api/quiz";
import { getRoute } from "@utils/route";
import { QuizSubmissionRequest } from ".";

export const getQuizDetail = async (quizId: string): Promise<Quiz> => {
  return request({
    url: getRoute(END_POINTS.QUIZZES.DETAIL, { quizId }),
    method: HTTP_METHODS.GET,
  });
};

export const createQuizResult = async (
  payload: QuizSubmissionRequest
): Promise<QuizResult> => {
  return request({
    url: getRoute(END_POINTS.QUIZ_RESULTS.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};
