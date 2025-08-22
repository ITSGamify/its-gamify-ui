import { request } from "@config/axios";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { getRoute } from "@utils/route";
import { ReviewRequest } from ".";
import { CourseReview } from "@interfaces/api/review";

export const createReview = async (
  payload: ReviewRequest
): Promise<CourseReview> => {
  return request({
    url: getRoute(END_POINTS.REVIEW.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.REVIEW.DETAIL, { reviewId }),
    method: HTTP_METHODS.DELETE,
  });
};
