import { request } from "@config/axios";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { PaginatedResponse } from "@interfaces/dom/query";
import { getRoute } from "@utils/route";
import { GetBadgesParams } from ".";
import { Badge } from "@interfaces/api/badge";

export const getBadges = async (
  params?: GetBadgesParams
): Promise<PaginatedResponse<Badge>> => {
  return request({
    url: getRoute(END_POINTS.BADGES.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};
