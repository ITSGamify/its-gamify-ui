import { END_POINTS } from "@constants/endpoint";
import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { PaginatedResponse } from "@interfaces/dom/query";
import { Role } from "@interfaces/api/user";

export const getRoles = async (): Promise<PaginatedResponse<Role>> => {
  return request({
    url: getRoute(END_POINTS.ROLES),
    method: HTTP_METHODS.GET,
  });
};
