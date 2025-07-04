import { OrderDirection } from "@interfaces/dom/query";
import { TableColumns } from "@interfaces/dom/table";
import { useGetParticipations } from "@services/participation";
import { getInitialSorted } from "@utils/url";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const defaultSort = [
  {
    column: "created_date",
    direction: "asc" as OrderDirection,
  },
];

export const useHomePage = () => {
  const [searchParams] = useSearchParams();

  const [sortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );

  const getAccountsReq = {
    // page: activePage,
    // limit: DEFAULT_TABLE_LIMIT,
    // q: activeSearchInput || "",
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };

  const { data: courseParticipations, isFetching: isLoadingParticipation } =
    useGetParticipations(getAccountsReq);

  return {
    participations: courseParticipations?.data || [],
    isLoadingParticipation,
  };
};
