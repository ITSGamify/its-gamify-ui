import { LearningProgress } from "@interfaces/api/learningProgress";
import { ProgressRequestParams } from ".";
import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";

export const upsertProgress = async (
  payload: ProgressRequestParams
): Promise<LearningProgress> => {
  return request({
    url: getRoute(END_POINTS.PROGRESS.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};
