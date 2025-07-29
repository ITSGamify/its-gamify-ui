import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useQuery } from "@tanstack/react-query";
import { getQuarters } from "./request";

export interface GetQuartersParams extends PaginationParams {
  name?: string;
}

export const useGetQuarters = (params?: GetQuartersParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.QUARTERS.BASE, params],
    queryFn: () => getQuarters(params),
    enabled: !!params,
  });
};
