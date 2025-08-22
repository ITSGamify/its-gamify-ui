import { PaginatedResponse } from "@interfaces/dom/query";
import { GetDepartmentParams } from ".";
import { Department } from "@interfaces/api/department";
import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";

export const getDepartments = async (
  params?: GetDepartmentParams
): Promise<PaginatedResponse<Department>> => {
  return request({
    url: getRoute(END_POINTS.DEPARTMENT.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};
