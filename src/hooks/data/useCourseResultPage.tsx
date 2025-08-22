import { PATH } from "@constants/path";
import {
  DEFAULT_TABLE_LIMIT,
  DEFAULT_TABLE_PAGE_NUMBER,
} from "@constants/table";
import { OrderDirection } from "@interfaces/dom/query";
import { TableColumns } from "@interfaces/dom/table";
import { useGetCourseResults } from "@services/courseResult";
import { getRoute } from "@utils/route";
import { createParamSetter, getInitialSorted } from "@utils/url";
import userSession from "@utils/user-session";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const defaultSort = [
  {
    column: "created_date",
    direction: "asc" as OrderDirection,
  },
];

export const useCourseResultPage = () => {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState<number>(
    DEFAULT_TABLE_PAGE_NUMBER
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );

  const [filter, setFilter] = useState<string>("COMPLETEDDATE");

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const activeSearchInput = searchParams.get("q");
  const profile = userSession.getUserProfile();

  const getCourseResultsReq = {
    page: activePage,
    limit: DEFAULT_TABLE_LIMIT,
    q: activeSearchInput || "",
    userId: profile?.user.id || "",
    filterString: filter,
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };
  const setParam = createParamSetter(searchParams);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setActivePage(DEFAULT_TABLE_PAGE_NUMBER);
    setSearchInput(value);
    if (value.length === 0) {
      resetSearch();
    }
  };

  const resetSearch = () => {
    searchParams.delete("q");
    setSearchParams(searchParams);
    setSearchInput("");
  };

  const handlePageChange = (page: number) => {
    setActivePage(page - 1);
  };

  const handleSearchResults = () => {
    setParam("q", searchInput);
    setSearchParams(searchParams);
  };

  const { data, isFetching } = useGetCourseResults(getCourseResultsReq);

  const course_results = data?.data || [];
  const pagination = data?.pagination;
  const page_index = pagination?.page_index ?? 0;
  const total_page_count = pagination?.total_pages_count ?? 0;
  const total_item_count = pagination?.total_items_count ?? 0;
  const page_size = pagination?.page_size ?? 0;

  const handleViewCertificate = (id: string) => {
    const route = getRoute(PATH.CERTIFICATE_DETAIL, { certificateId: id });
    navigate(route);
  };

  return {
    course_results,
    page_index,
    total_page_count,
    total_item_count,
    page_size,
    handlePageChange,
    isLoading: isFetching,
    handleSearch,
    handleSearchResults,
    searchInput,
    handleViewCertificate,
    resetSearch,
    handleFilterChange,
    filter,
  };
};
