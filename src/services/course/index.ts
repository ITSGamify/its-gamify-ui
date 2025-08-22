import { QUERY_KEYS } from "@constants/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCourseDetail,
  getCourseModules,
  getCourseParticipations,
  getCourses,
  joinCourse,
  upsertCourseCollection,
  getCourseReviews,
} from "./request";
import { PaginationParams } from "@interfaces/dom/query";

export interface GetCourseParams extends PaginationParams {
  categories?: string;
  classify?: string;
}
export interface GetReviewParams extends PaginationParams {
  courseId: string;
}

export interface RequestJoinCourseParams {
  courseId: string;
}

export const useGetCourses = (params?: GetCourseParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE.BASE, params],
    queryFn: () => getCourses(params),
    enabled: !!params,
  });
};

export const useGetCourseDetail = (courseId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE.DETAIL, courseId],
    queryFn: () => getCourseDetail(courseId),
    enabled: !!courseId,
  });
};

export const useGetCourseParticipations = (courseId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE.COURSE_PARTICIPATIONS, courseId],
    queryFn: () => getCourseParticipations(courseId),
    enabled: !!courseId,
  });
};

export const useJoinCourse = () => {
  return useMutation({
    mutationFn: (data: RequestJoinCourseParams) => joinCourse(data),
  });
};

export const useGetCourseModules = (courseId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE.COURSE_SECTIONS, courseId],
    queryFn: () => getCourseModules(courseId),
    enabled: !!courseId,
  });
};

export const useUpsertCourseCollection = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (courseId: string) => upsertCourseCollection(courseId),
    onSuccess,
  });
};

export const useGetCourseReviews = (params: GetReviewParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE.COURSE_REVIEWS, params.courseId, params],
    queryFn: () => getCourseReviews(params),
    enabled: !!params && !!params.courseId,
  });
};
