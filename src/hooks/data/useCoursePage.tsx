import {
  DEFAULT_TABLE_LIMIT,
  DEFAULT_TABLE_PAGE_NUMBER,
} from "@constants/table";
import { OrderDirection } from "@interfaces/dom/query";
import { TableColumns } from "@interfaces/dom/table";
import { useGetCourses } from "@services/course";
import { getInitialSorted } from "@utils/url";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const defaultSort = [
  {
    column: "created_date",
    direction: "asc" as OrderDirection,
  },
];

export const useCoursePage = () => {
  const [activePage, setActivePage] = useState<number>(
    DEFAULT_TABLE_PAGE_NUMBER
  );
  const [searchParams] = useSearchParams();

  const [sortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );

  const getAccountsReq = {
    page: activePage,
    limit: DEFAULT_TABLE_LIMIT,
    // q: activeSearchInput || "",
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };

  const handlePageChange = (page: number) => {
    setActivePage(page - 1);
  };

  const { data, isFetching } = useGetCourses(getAccountsReq);

  const courses = data?.data || [];
  const pagination = data?.pagination;
  const page_index = pagination?.page_index ?? 0;
  const total_page_count = pagination?.total_pages_count ?? 0;
  const page_size = pagination?.page_size ?? 0;

  return {
    courses,
    page_index,
    total_page_count,
    page_size,
    handlePageChange,
    isLoading: isFetching,
  };
};
