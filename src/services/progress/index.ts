import { useMutation } from "@tanstack/react-query";
import { upsertProgress } from "./request";
import { ProgressStatus } from "@interfaces/api/learningProgress";

export interface ProgressRequestParams {
  lesson_id: string;
  type?: string;
  status?: ProgressStatus;
  video_time_position?: number;
  course_participation_id: string;
}

export const useUpsertProgress = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: ProgressRequestParams) => upsertProgress(payload),
    onSuccess,
  });
};
