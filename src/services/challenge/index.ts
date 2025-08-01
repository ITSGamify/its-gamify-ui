import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useQuery } from "@tanstack/react-query";
import { getChallengeDetail, getChallenges, getRooms } from "./request";

export interface GetChallengeParams extends PaginationParams {
  title?: string;
}

export const useGetChallenges = (params?: GetChallengeParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHALLENGE.BASE, params],
    queryFn: () => getChallenges(params),
    enabled: !!params,
  });
};

export const useGetChallengeDetail = (challengeId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHALLENGE.DETAIL, challengeId],
    queryFn: () => getChallengeDetail(challengeId),
    enabled: !!challengeId,
  });
};

export const useGetRooms = (challengeId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHALLENGE.ROOMS, challengeId],
    queryFn: () => getRooms(challengeId),
    enabled: !!challengeId,
  });
};
