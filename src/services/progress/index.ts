import { useMutation, useQuery } from "@tanstack/react-query";
import { upsertProgress,getProgresses } from "./request";
import { ProgressStatus } from "@interfaces/api/learningProgress";
import { PaginationParams } from "@interfaces/dom/query";
import { QUERY_KEYS } from "@constants/query";

export interface ProgressRequestParams {
  lesson_id: string;
  type?: string;
  status?: ProgressStatus;
  video_time_position?: number;
  course_participation_id: string;
}



export interface GetProgressParams extends PaginationParams {
  categories?: string;
  classify?: string;
}

export const useUpsertProgress = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: ProgressRequestParams) => upsertProgress(payload),
    onSuccess,
  });
};


export const useGetProgresses = (params?: GetProgressParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROGRESS.BASE, params],
    queryFn: () => getProgresses(params),
    enabled: !!params,
  });
};