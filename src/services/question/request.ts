import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { GetQuestionParams } from ".";
import { Question } from "@interfaces/api/quiz";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { PaginatedResponse } from "@interfaces/dom/query";

export const getChallengeQuestions = async (
  params?: GetQuestionParams
): Promise<PaginatedResponse<Question>> => {
  return request({
    url: getRoute(END_POINTS.QUESTION.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};
