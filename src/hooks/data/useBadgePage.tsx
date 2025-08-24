import { DEFAULT_TABLE_PAGE_NUMBER } from "@constants/table";
import { OrderDirection } from "@interfaces/dom/query";
import { TableColumns } from "@interfaces/dom/table";
import { useGetBadges } from "@services/badge";
import { createParamSetter, getInitialSorted } from "@utils/url";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const defaultSort = [
  {
    column: "CreatedDate",
    direction: "ASC" as OrderDirection,
  },
];

export const useBadgePage = () => {
  const [activePage, setActivePage] = useState<number>(
    DEFAULT_TABLE_PAGE_NUMBER
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const activeSearchInput = searchParams.get("q");

  const getbadgesReq = {
    page: activePage,
    limit: 12,
    q: activeSearchInput || "",
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

  const handlePageChange = (page: number) => {
    setActivePage(page - 1);
  };

  const handleSearchResults = () => {
    setParam("q", searchInput);
    setSearchParams(searchParams);
  };
  const resetSearch = () => {
    searchParams.delete("q");
    setSearchParams(searchParams);
    setSearchInput("");
  };

  const { data: dadgeResponse, isPending: isLoadingBadge } =
    useGetBadges(getbadgesReq);

  const badges = dadgeResponse?.data || [];
  const pagination = dadgeResponse?.pagination;
  const page_index = pagination?.page_index ?? 0;
  const total_page_count = pagination?.total_pages_count ?? 0;
  const total_item_count = pagination?.total_items_count ?? 0;
  const page_size = pagination?.page_size ?? 0;

  const [filter, setFilter] = useState<string>("COMPLETEDDATE");

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  return {
    badges,
    page_index,
    total_page_count,
    page_size,
    handlePageChange,
    isLoading: isLoadingBadge,
    handleSearch,
    handleSearchResults,
    searchInput,
    resetSearch,
    handleFilterChange,
    filter,
    total_item_count,
  };
};
