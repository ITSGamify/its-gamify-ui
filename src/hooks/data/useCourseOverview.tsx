import ToastContent from "@components/ui/atoms/Toast";
import { PATH } from "@constants/path";
import {
  useGetCourseDetail,
  useGetCourseParticipations,
  useJoinCourse,
} from "@services/course";
import { getRoute } from "@utils/route";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const useCourseOverview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: courseDetail } = useGetCourseDetail(courseId || "");

  const { data: courseParticipations } = useGetCourseParticipations(
    courseId || ""
  );

  const isJoinedCourse =
    courseParticipations?.data && courseParticipations?.data.length > 0;

  const { mutateAsync: joinCourse } = useJoinCourse();
  const handleJoinCourse = useCallback(async () => {
    if (!isJoinedCourse) {
      await joinCourse(
        { courseId: courseId as string },
        {
          onSuccess: () => {
            toast.success(ToastContent, {
              data: {
                message: "Chào mừng bạn đến với khóa học!",
              },
            });
            const route = getRoute(PATH.COURSES_DETAIL, { id: courseId });
            navigate(route);
          },
        }
      );
    } else {
      const route = getRoute(PATH.COURSES_DETAIL, { id: courseId });
      navigate(route);
    }
  }, [courseId, joinCourse, navigate, isJoinedCourse]);

  return {
    course: courseDetail,
    participations: courseParticipations,
    isJoinedCourse,
    handleJoinCourse,
  };
};
