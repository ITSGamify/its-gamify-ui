import { PaginatedResponse } from "@interfaces/dom/query";
import { GetCourseResultParams } from ".";
import { request } from "@config/axios";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { getRoute } from "@utils/route";
import { CourseResult } from "@interfaces/api/course";

export const getCourseResults = async (
  params: GetCourseResultParams
): Promise<PaginatedResponse<CourseResult>> => {
  const { userId, ...data } = params;
  console.log(data);
  return request({
    url: getRoute(END_POINTS.ACCOUNTS.COURSE_RESULT, { userId }),
    method: HTTP_METHODS.GET,
    params: data,
  });
};

export const getCourseResultDetail = async (
  resultId: string
): Promise<CourseResult> => {
  return request({
    url: getRoute(END_POINTS.COURSE_RESULT.DETAIL, { resultId }),
    method: HTTP_METHODS.GET,
  });
};
