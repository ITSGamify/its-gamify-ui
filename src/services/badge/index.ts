import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useQuery } from "@tanstack/react-query";
import { getBadges } from "./request";

export interface GetBadgesParams extends PaginationParams {
  name?: string;
}

export const useGetBadges = (params?: GetBadgesParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BADGES.BASE, params],
    queryFn: () => getBadges(params),
    enabled: !!params,
  });
};
