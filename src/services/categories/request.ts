import { request } from "@config/axios";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { PaginatedResponse } from "@interfaces/dom/query";
import { getRoute } from "@utils/route";
import { GetCategoryParams } from ".";
import { Category } from "@interfaces/api/course";

export const getCategories = async (
  params?: GetCategoryParams
): Promise<PaginatedResponse<Category>> => {
  return request({
    url: getRoute(END_POINTS.CATEGORIES.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};
