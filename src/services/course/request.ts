import { request } from "@config/axios";
import { GetCourseParams, RequestJoinCourseParams } from ".";
import { PaginatedResponse } from "@interfaces/dom/query";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";
import { Course, Participation } from "@interfaces/api/course";
import { Module } from "@interfaces/api/lesson";

export const getCourses = async (
  params?: GetCourseParams
): Promise<PaginatedResponse<Course>> => {
  return request({
    url: getRoute(END_POINTS.COURSE.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};

export const getCourseDetail = async (courseId: string): Promise<Course> => {
  return request({
    url: getRoute(END_POINTS.COURSE.DETAIL, { courseId }),
    method: HTTP_METHODS.GET,
  });
};

export const getCourseParticipations = async (
  courseId: string
): Promise<PaginatedResponse<Participation>> => {
  return request({
    url: getRoute(END_POINTS.COURSE.COURSE_PARTICIPATIONS, { courseId }),
    method: HTTP_METHODS.GET,
  });
};

export const joinCourse = async (
  payload: RequestJoinCourseParams
): Promise<Participation> => {
  const { courseId } = payload;
  return request({
    url: getRoute(END_POINTS.COURSE.COURSE_PARTICIPATIONS, { courseId }),
    method: HTTP_METHODS.POST,
    data: {},
  });
};

export const getCourseModules = async (
  courseId: string
): Promise<PaginatedResponse<Module>> => {
  return request({
    url: getRoute(END_POINTS.COURSE.COURSE_SECTIONS, { courseId }),
    method: HTTP_METHODS.GET,
  });
};
