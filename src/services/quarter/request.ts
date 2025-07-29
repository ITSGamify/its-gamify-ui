import { request } from "@config/axios";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { PaginatedResponse } from "@interfaces/dom/query";
import { getRoute } from "@utils/route";
import { GetQuartersParams } from ".";
import { Quarter } from "@interfaces/api/course";

export const getQuarters = async (
  params?: GetQuartersParams
): Promise<PaginatedResponse<Quarter>> => {
  return request({
    url: getRoute(END_POINTS.QUARTERS.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};
