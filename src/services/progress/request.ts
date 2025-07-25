import { LearningProgress } from "@interfaces/api/learningProgress";
import { GetProgressParams, ProgressRequestParams } from ".";
import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";
import { PaginatedResponse } from "@interfaces/dom/query";

export const upsertProgress = async (
  payload: ProgressRequestParams
): Promise<LearningProgress> => {
  return request({
    url: getRoute(END_POINTS.PROGRESS.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};

export const getProgresses = async (
  params?: GetProgressParams
): Promise<PaginatedResponse<LearningProgress>> => {
  return request({
    url: getRoute(END_POINTS.PROGRESS.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};
