import { QUERY_KEYS } from "@constants/query";
import { useQuery } from "@tanstack/react-query";
import {
  getUserMetric,
  getHistories,
  getUserDetail,
  getUserStatistic,
} from "./request";
import { PaginationParams } from "@interfaces/dom/query";

export const useGetUserMetric = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT, userId],
    queryFn: () => getUserMetric(userId),
    enabled: !!userId,
  });
};

export interface GetStatisticParam {
  userId?: string;
  quaterId: string;
}

export const useGetUserStatistic = (params: GetStatisticParam) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT.STATISTIC, params],
    queryFn: () => getUserStatistic(params),
    enabled: !!params.quaterId && !!params.userId,
  });
};

export const useGetUserDetail = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT.DETAIL, userId],
    queryFn: () => getUserDetail(userId),
    enabled: !!userId,
  });
};

export interface GetHistoriesParams extends PaginationParams {
  userId?: string;
}

export const useGetHistories = (params?: GetHistoriesParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT.CHALLENGE_HISTORIES, params],
    queryFn: () => getHistories(params),
    enabled: !!params && !!params.userId,
  });
};
