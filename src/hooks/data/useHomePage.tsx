import { useGetParticipations } from "@services/participation";

export const useHomePage = () => {
  const getAccountsReq = {
    // page: activePage,
    // limit: DEFAULT_TABLE_LIMIT,
    // q: activeSearchInput || "",
    // order_by: sortedColumns.map((sort) => ({
    //   order_column: sort.column ?? undefined,
    //   order_dir: sort.direction ?? undefined,
    // })),
  };

  const { data: courseParticipations } = useGetParticipations(getAccountsReq);

  return {
    participations: courseParticipations?.data || [],
  };
};
