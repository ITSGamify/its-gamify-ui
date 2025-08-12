import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useQuery } from "@tanstack/react-query";
import { getMetrics, getGeneralMetric, getTop10Metrics } from "./request";

export interface GetMetricsParams extends PaginationParams {
  quarterId: string;
  departmentId: string;
}

export const useGetMetrics = (params?: GetMetricsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS.BASE, params],
    queryFn: () => getMetrics(params),
    enabled: !!params?.quarterId && !!params?.departmentId,
  });
};

export const useGetGeneralMetric = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS.GENERAL],
    queryFn: () => getGeneralMetric(),
  });
};

export const useGetTop10Metrics = (params?: GetMetricsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.METRICS.TOP10, params],
    queryFn: () => getTop10Metrics(params),
    enabled: !!params?.quarterId && !!params?.departmentId,
  });
};
