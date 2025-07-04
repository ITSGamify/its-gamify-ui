import { request } from "@config/axios";
import { GetParticipationParams } from ".";
import { PaginatedResponse } from "@interfaces/dom/query";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";
import { Participation } from "@interfaces/api/course";

export const getParticipations = async (
  params?: GetParticipationParams
): Promise<PaginatedResponse<Participation>> => {
  return request({
    url: getRoute(END_POINTS.PARTICIPATIONS.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};
