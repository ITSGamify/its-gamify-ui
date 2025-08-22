import { Quarter } from "@interfaces/api/course";
import { OrderDirection } from "@interfaces/dom/query";
import { TableColumns } from "@interfaces/dom/table";
import { useGetDeparments } from "@services/department";
import { useGetGeneralMetric, useGetTop10Metrics } from "@services/metric";
import { useGetQuarters } from "@services/quarter";
import { getInitialSorted } from "@utils/url";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const defaultSort = [
  {
    column: "PointInQuarter",
    direction: "asc" as OrderDirection,
  },
];

export const useLeaderBoardPage = () => {
  const [searchParams] = useSearchParams();

  const [sortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );

  const { data: quarters, isLoading: isLoadingQuarters } = useGetQuarters({
    page: 0,
    limit: 100,
  });

  const { data: depData, isFetching: isLoadingDapartment } = useGetDeparments({
    page: 0,
    limit: 1000,
  });

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const handleSelectDepartment = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
  };

  const [selectedQuarterId, setSelectedQuarterId] = useState<string>("");
  const sortedQuarters = useMemo(() => {
    return (quarters?.data || []).sort(
      (a: Quarter, b: Quarter) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
  }, [quarters]);

  useMemo(() => {
    if (!selectedQuarterId && sortedQuarters.length > 0) {
      setSelectedQuarterId(sortedQuarters[0].id);
    }
  }, [sortedQuarters, selectedQuarterId]);
  const { data: generalMetric, isFetching: isLoadingGeneral } =
    useGetGeneralMetric();

  const { data: top10Metrics, isLoading: isLoadingTop10Metrics } =
    useGetTop10Metrics({
      quarterId: selectedQuarterId,
      departmentId: selectedDepartmentId,
      page: 0,
      limit: 10,
      q: "",
      order_by: sortedColumns.map((sort) => ({
        order_column: sort.column ?? undefined,
        order_dir: sort.direction ?? undefined,
      })),
    });

  return {
    generalMetric,
    isLoading: isLoadingGeneral || isLoadingTop10Metrics,
    top10Metrics: top10Metrics?.data || [],
    selectedQuarterId,
    setSelectedQuarterId,
    sortedQuarters,
    isLoadingQuarters,
    departments: depData?.data || [],
    isLoadingDapartment,
    handleSelectDepartment,
  };
};
