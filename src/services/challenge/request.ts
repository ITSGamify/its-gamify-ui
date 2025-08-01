import { PaginatedResponse } from "@interfaces/dom/query";
import { GetChallengeParams } from ".";
import { Challenge, Room } from "@interfaces/api/challenge";
import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";

export const getChallenges = async (
  params?: GetChallengeParams
): Promise<PaginatedResponse<Challenge>> => {
  return request({
    url: getRoute(END_POINTS.CHALLENGE.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};

export const getChallengeDetail = async (
  challengeId: string
): Promise<Challenge> => {
  return request({
    url: getRoute(END_POINTS.CHALLENGE.DETAIL, { challengeId }),
    method: HTTP_METHODS.GET,
  });
};

export const getRooms = async (
  challengeId: string
): Promise<PaginatedResponse<Room>> => {
  return request({
    url: getRoute(END_POINTS.CHALLENGE.ROOMS, { challengeId }),
    method: HTTP_METHODS.GET,
  });
};
