import { DEFAULT_TABLE_PAGE_NUMBER } from "@constants/table";
import { OrderDirection } from "@interfaces/dom/query";
import { TableColumns } from "@interfaces/dom/table";
import { useGetHistories } from "@services/user";
import { createParamSetter, getInitialSorted } from "@utils/url";
import userSession from "@utils/user-session";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const defaultSort = [
  {
    column: "created_date",
    direction: "asc" as OrderDirection,
  },
];

export const useHistoryPage = () => {
  const [activePage, setActivePage] = useState<number>(
    DEFAULT_TABLE_PAGE_NUMBER
  );
  const profile = userSession.getUserProfile();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );
  const setParam = createParamSetter(searchParams);
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const activeSearchInput = searchParams.get("q");

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setActivePage(DEFAULT_TABLE_PAGE_NUMBER);
    searchParams.delete("q");
    setSearchParams(searchParams);
  };

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
  };

  const handlePageChange = (page: number) => {
    setActivePage(page - 1);
  };

  const handleSearchResults = () => {
    setParam("q", searchInput);
    setSearchParams(searchParams);
  };

  const getHistoriesReq = {
    userId: profile?.user.id,
    page: activePage,
    limit: 10,
    filterString: selectedFilter,
    q: activeSearchInput || "",
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };

  const { data, isFetching: isLoadingHistories } =
    useGetHistories(getHistoriesReq);

  const histories = data?.data || [];
  const pagination = data?.pagination;
  const page_index = pagination?.page_index ?? 0;
  const total_page_count = pagination?.total_pages_count ?? 0;
  const page_size = pagination?.page_size ?? 0;

  return {
    histories,
    page_index,
    total_page_count,
    page_size,
    handlePageChange,
    isLoading: isLoadingHistories,
    handleSearch,
    handleSearchResults,
    searchInput,
    selectedFilter,
    handleFilterChange,
  };
};
