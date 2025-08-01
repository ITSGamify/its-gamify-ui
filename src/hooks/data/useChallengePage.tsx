import { ALL } from "@constants/course";
import { DEFAULT_TABLE_PAGE_NUMBER } from "@constants/table";
import { OrderDirection } from "@interfaces/dom/query";
import { TableColumns } from "@interfaces/dom/table";
import { useGetCategories } from "@services/categories";
import { useGetChallenges } from "@services/challenge";
import { createParamSetter, getInitialSorted } from "@utils/url";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const defaultSort = [
  {
    column: "created_date",
    direction: "asc" as OrderDirection,
  },
];

export const useChallengePage = () => {
  const [activePage, setActivePage] = useState<number>(
    DEFAULT_TABLE_PAGE_NUMBER
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );
  const [searchCategories, setSearchCategories] = useState<string[]>([]);
  const [classify, setClassify] = useState<string>(ALL);

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const activeSearchInput = searchParams.get("q");

  const cateSearch =
    searchCategories.length > 0 ? JSON.stringify(searchCategories) : "";

  const getChallengeReq = {
    page: activePage,
    limit: 12,
    q: activeSearchInput || "",
    categories: cateSearch,
    classify: classify,
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };

  const setParam = createParamSetter(searchParams);

  const handleCategorySearch = (id: string) => {
    setActivePage(DEFAULT_TABLE_PAGE_NUMBER);
    setSearchCategories((prev) => {
      const isExist = prev.includes(id);
      if (isExist) {
        return prev.filter((categoryId) => categoryId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleClassify = (type: string) => {
    setActivePage(DEFAULT_TABLE_PAGE_NUMBER);
    setClassify(type);
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

  const { data, isFetching } = useGetChallenges(getChallengeReq);

  const challenges = data?.data || [];
  const pagination = data?.pagination;
  const page_index = pagination?.page_index ?? 0;
  const total_page_count = pagination?.total_pages_count ?? 0;
  const page_size = pagination?.page_size ?? 0;

  const { data: cateData, isFetching: isLoadingCate } = useGetCategories({
    page: 0,
    limit: 1000,
  });

  return {
    challenges,
    page_index,
    total_page_count,
    page_size,
    handlePageChange,
    isLoading: isFetching || isLoadingCate,
    categories: cateData?.data || [],
    handleSearch,
    handleSearchResults,
    searchInput,
    handleCategorySearch,
    searchCategories,
    handleClassify,
    classify,
  };
};
