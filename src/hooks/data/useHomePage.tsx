import { OrderDirection } from "@interfaces/dom/query";
import { TableColumns } from "@interfaces/dom/table";
import { useGetUserMetric } from "@services/user";
import { getInitialSorted } from "@utils/url";
import userSession from "@utils/user-session";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Verified as VerifiedIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { DashboardCardProps } from "@interfaces/shared/home";
import { ENROLLED } from "@constants/course";
import { useGetCourses } from "@services/course";
import { useGetProgresses } from "@services/progress";
import { PATH } from "@constants/path";
const defaultSort = [
  {
    column: "created_date",
    direction: "asc" as OrderDirection,
  },
];

export const useHomePage = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [sortedColumns] = useState<TableColumns>(
    getInitialSorted(searchParams, defaultSort)
  );

  const [classify, setClassify] = useState<string>(ENROLLED);
  const handleClassify = (type: string) => {
    setClassify(type);
  };

  const [progressClassify, setProgressClassify] = useState<string>(ENROLLED);
  const handleClassifyProgress = (type: string) => {
    setProgressClassify(type);
  };

  const profile = userSession.getUserProfile();

  const getCoursesReq = {
    page: 0,
    limit: 3,
    classify: classify,
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };

  const { data: courses, isFetching: isLoadingCourses } =
    useGetCourses(getCoursesReq);

  const { data: userMetric, isFetching: isLoadingUserMetric } =
    useGetUserMetric(profile?.user.id || "");

  const getStats = useMemo((): DashboardCardProps[] => {
    if (!userMetric) {
      return [];
    }

    return [
      {
        title: "Khóa học đang học",
        value: userMetric?.course_participated_num || 0,
        icon: <SchoolIcon />,
        color: "primary",
      },
      {
        title: "Khóa học đã hoàn thành",
        value: userMetric?.course_completed_num || 0,
        icon: <CheckCircleIcon />,
        color: "warning",
      },
      {
        title: "Số thử thách đã tham gia",
        value: userMetric?.challenge_participate_num || 0,
        icon: <AssignmentIcon />,
        color: "info",
      },
      {
        title: "Sô điểm đã đạt được trong quý",
        value: userMetric?.point_in_quarter || 0,
        icon: <VerifiedIcon />,
        color: "success",
      },
    ];
  }, [userMetric]);

  const handleViewAllCourses = () => {
    navigate(PATH.COURSES);
  };

  const getProgressesReq = {
    page: 0,
    limit: 3,
    classify: classify,
    order_by: sortedColumns.map((sort) => ({
      order_column: sort.column ?? undefined,
      order_dir: sort.direction ?? undefined,
    })),
  };

  const { data: progresses, isFetching: isLoadingProgresses } =
    useGetProgresses(getProgressesReq);

  return {
    courses: courses?.data || [],
    isLoadingCourses,
    userMetric,
    isLoadingUserMetric,
    profile,
    getStats,
    handleClassify,
    classify,
    progresses: progresses?.data || [],
    isLoadingProgresses,
    progressClassify,
    handleClassifyProgress,
    handleViewAllCourses,
  };
};
