import { useGetCourseResultDetail } from "@services/courseResult";
import { useParams } from "react-router-dom";

export const useCourseResultDetailPage = () => {
  const { certificateId } = useParams();

  const { data: courseDetail } = useGetCourseResultDetail(certificateId || "");

  return {
    courseDetail,
  };
};
