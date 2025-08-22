import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useQuery } from "@tanstack/react-query";
import { getCourseResultDetail, getCourseResults } from "./request";

export interface GetCourseResultParams extends PaginationParams {
  userId: string;
  filterString: string;
}

export const useGetCourseResults = (params: GetCourseResultParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT.BASE, params],
    queryFn: () => getCourseResults(params),
    enabled: !!params,
  });
};

export const useGetCourseResultDetail = (resultId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE_RESULT.DETAIL, resultId],
    queryFn: () => getCourseResultDetail(resultId),
    enabled: !!resultId,
  });
};
