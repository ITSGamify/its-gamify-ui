import { QUERY_KEYS } from "@constants/query";
import { useQuery } from "@tanstack/react-query";
import { getUserMetric } from "./request";

export const useGetUserMetric = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT, userId],
    queryFn: () => getUserMetric(userId),
    enabled: !!userId,
  });
};
