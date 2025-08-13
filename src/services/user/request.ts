import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";
import { Metric } from "@interfaces/api/metric";
import { GetHistoriesParams, GetStatisticParam } from ".";
import { PaginatedResponse } from "@interfaces/dom/query";
import { History } from "@interfaces/api/challenge";
import { User } from "@interfaces/api/user";
import { EmployeeStat } from "@interfaces/api/statistic";

export const getUserMetric = async (userId: string): Promise<Metric> => {
  return request({
    url: getRoute(END_POINTS.ACCOUNTS.USER_METRIC, { userId }),
    method: HTTP_METHODS.GET,
  });
};

export const getUserDetail = async (userId: string): Promise<User> => {
  return request({
    url: getRoute(END_POINTS.ACCOUNTS.DETAIL, { userId }),
    method: HTTP_METHODS.GET,
  });
};

export const getHistories = async (
  params?: GetHistoriesParams
): Promise<PaginatedResponse<History>> => {
  return request({
    url: getRoute(END_POINTS.ACCOUNTS.CHALLENGE_HISTORIES, {
      userId: params?.userId,
    }),
    method: HTTP_METHODS.GET,
    params,
  });
};
export const getUserStatistic = async (
  params?: GetStatisticParam
): Promise<EmployeeStat> => {
  return request({
    url: getRoute(END_POINTS.ACCOUNTS.STATISTIC, {
      userId: params?.userId,
    }),
    method: HTTP_METHODS.GET,
    params,
  });
};
