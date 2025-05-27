import { END_POINTS } from "@constants/endpoint";
import { request } from "@config/axios";
import { HTTP_METHODS } from "@constants/request";
import { getRoute } from "@utils/route";
import { LoginRequest } from "@interfaces/api/auth";

export const login = async (loginData: LoginRequest) => {
  return request({
    url: getRoute(END_POINTS.LOGIN),
    method: HTTP_METHODS.POST,
    data: loginData,
  });
};
