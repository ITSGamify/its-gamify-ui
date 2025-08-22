import { useMutation } from "@tanstack/react-query";
import { createReview, deleteReview } from "./request";

export interface ReviewRequest {
  rating: number;
  comment: string;
  course_participation_id: string;
  course_id: string;
}

export const useCreateReview = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: ReviewRequest) => createReview(payload),
    onSuccess,
  });
};

export const useDeleteReview = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteReview,
    onSuccess,
  });
};
