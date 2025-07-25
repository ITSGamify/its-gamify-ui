import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";
import { Metric } from "@interfaces/api/metric";

export const getUserMetric = async (userId: string): Promise<Metric> => {
  return request({
    url: getRoute(END_POINTS.ACCOUNTS.USER_METRIC, { userId }),
    method: HTTP_METHODS.GET,
  });
};
