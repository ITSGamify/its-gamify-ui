import ToastContent from "@components/ui/atoms/Toast";
import { PATH } from "@constants/path";
import { LearningProgress } from "@interfaces/api/learningProgress";
import {
  useGetCourseDetail,
  useGetCourseParticipations,
  useJoinCourse,
} from "@services/course";
import { getRoute } from "@utils/route";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const useCourseOverview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [learningProgresses, setLearningProgresses] = useState<
    LearningProgress[]
  >([]);

  const { data: courseDetail } = useGetCourseDetail(courseId || "");

  const { data: courseParticipationData } = useGetCourseParticipations(
    courseId || ""
  );

  const isJoinedCourse =
    courseParticipationData?.data && courseParticipationData?.data.length > 0;

  const courseParticipations = useMemo(
    () => courseParticipationData?.data || [],
    [courseParticipationData?.data]
  );

  const participation = useMemo(
    () => courseParticipations[0],
    [courseParticipations]
  );

  useEffect(() => {
    if (participation?.learning_progresses) {
      setLearningProgresses(participation.learning_progresses);
    }
  }, [participation]);

  const modules = useMemo(() => {
    return (
      courseDetail?.modules
        ?.sort((a, b) => a.ordered_number - b.ordered_number)
        .map((module) => ({
          ...module,
          lessons: module.lessons?.sort((a, b) => a.index - b.index),
        })) || []
    );
  }, [courseDetail?.modules]);

  const allLessons = useMemo(() => {
    return modules.flatMap((module) => module.lessons || []).filter(Boolean);
  }, [modules]);

  const completedLearningProgresses = useMemo(
    () =>
      learningProgresses.filter((progress) => progress.status === "COMPLETED"),
    [learningProgresses]
  );

  const inCompleteLessons = useMemo(() => {
    const completedLessonIds = completedLearningProgresses.map(
      (progress) => progress.lesson_id
    );
    return allLessons.filter(
      (lesson) => !completedLessonIds.includes(lesson.id)
    );
  }, [allLessons, completedLearningProgresses]);

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
            const route = getRoute(PATH.COURSES_DETAIL, { courseId: courseId });
            navigate(route);
          },
        }
      );
    } else {
      const route = getRoute(PATH.COURSES_DETAIL, { courseId: courseId });
      navigate(route);
    }
  }, [courseId, joinCourse, navigate, isJoinedCourse]);

  return {
    course: courseDetail,
    participations: courseParticipations,
    isJoinedCourse,
    handleJoinCourse,
    inCompleteLessons,
    completedLearningProgresses,
    allLessons,
  };
};
