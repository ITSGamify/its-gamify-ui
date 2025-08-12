import { request } from "@config/axios";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { PaginatedResponse } from "@interfaces/dom/query";
import { getRoute } from "@utils/route";
import { GetMetricsParams } from ".";
import { Metric } from "@interfaces/api/metric";

export const getMetrics = async (
  params?: GetMetricsParams
): Promise<PaginatedResponse<Metric>> => {
  return request({
    url: getRoute(END_POINTS.METRICS.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};
