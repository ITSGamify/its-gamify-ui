import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useQuery } from "@tanstack/react-query";

import { getDepartments } from "./request";

export interface GetDepartmentParams extends PaginationParams {
  name?: string;
}

export const useGetDeparments = (params?: GetDepartmentParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DEPARTMENT.BASE, params],
    queryFn: () => getDepartments(params),
    enabled: !!params,
  });
};
