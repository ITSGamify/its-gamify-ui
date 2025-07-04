import { QUERY_KEYS } from "@constants/query";
import { useQuery } from "@tanstack/react-query";
import { getParticipations } from "./request";
import { PaginationParams } from "@interfaces/dom/query";

export interface GetParticipationParams extends PaginationParams {
  department?: string;
}

export const useGetParticipations = (params?: GetParticipationParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PARTICIPATIONS, params],
    queryFn: () => getParticipations(params),
    enabled: !!params,
  });
};
