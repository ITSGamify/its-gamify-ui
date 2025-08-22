import ToastContent from "@components/ui/atoms/Toast";
import { PATH } from "@constants/path";
import { LearningProgress } from "@interfaces/api/learningProgress";
import {
  useGetCourseDetail,
  useGetCourseParticipations,
} from "@services/course";
import { ProgressRequestParams, useUpsertProgress } from "@services/progress";
import { useMemo, useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export const useCourseDetail = () => {
  const navigate = useNavigate();
  const { courseId = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [learningProgresses, setLearningProgresses] = useState<
    LearningProgress[]
  >([]);

  const { data: course, isFetching: isLoadingCourse } =
    useGetCourseDetail(courseId);

  const { data: courseParticipationData, isFetching: isLoadingParticipation } =
    useGetCourseParticipations(courseId);

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
    if (
      participation &&
      participation.status === "COMPLETED" &&
      !participation?.course_review
    ) {
      setIsOpenModal(true);
    }
  }, [course, participation]);

  const addLearningProgress = useCallback((progress: LearningProgress) => {
    setLearningProgresses((prevProgresses) => {
      const updatedProgresses = [...prevProgresses];
      const existingIndex = updatedProgresses.findIndex(
        (p) => p.lesson_id === progress.lesson_id
      );
      if (existingIndex !== -1) {
        // Update existing progress
        updatedProgresses[existingIndex] = progress;
      } else {
        // Add new progress
        updatedProgresses.push(progress);
      }
      return updatedProgresses;
    });
  }, []);

  const isJoinedCourse =
    courseParticipationData && courseParticipations.length > 0;

  useEffect(() => {
    if (!isLoadingParticipation && !isJoinedCourse) {
      navigate(PATH.COURSES);
    }
  }, [
    isLoadingParticipation,
    courseParticipationData,
    courseParticipations,
    isJoinedCourse,
    navigate,
  ]);

  const modules = useMemo(() => {
    return (
      course?.modules
        ?.sort((a, b) => a.ordered_number - b.ordered_number)
        .map((module) => ({
          ...module,
          lessons: module.lessons?.sort((a, b) => a.index - b.index),
        })) || []
    );
  }, [course?.modules]);

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

  const lesson_id = searchParams.get("lessonId");

  const current_lesson_id = useMemo(() => {
    if (lesson_id) return lesson_id;

    const firstUncompletedLesson = inCompleteLessons[0];
    return firstUncompletedLesson
      ? firstUncompletedLesson.id
      : allLessons[0]?.id;
  }, [lesson_id, inCompleteLessons, allLessons]);

  const { mutateAsync: upsertProgress, isPending: isMoving } =
    useUpsertProgress();

  const isCourseCompleted =
    allLessons.length === completedLearningProgresses.length;

  const handleBack = useCallback(() => {
    const currentIndex = allLessons.findIndex(
      (lesson) => lesson.id === current_lesson_id
    );

    if (currentIndex == 0) return;

    if (currentIndex > 0) {
      const previousLesson = allLessons[currentIndex - 1];
      setSearchParams({ lessonId: previousLesson.id });
    }
  }, [allLessons, current_lesson_id, setSearchParams]);

  const handleMoveToNext = useCallback(
    async (param: ProgressRequestParams, shouldNavigate: boolean = true) => {
      await upsertProgress(param, {
        onSuccess: (progress) => {
          addLearningProgress(progress);

          const currentIndex = allLessons.findIndex(
            (lesson) => lesson.id === current_lesson_id
          );
          const nextIndex = currentIndex + 1;
          const next_lesson_id =
            nextIndex < allLessons.length
              ? allLessons[nextIndex].id
              : progress.lesson_id;

          const existingProgress = learningProgresses.some(
            (p) => p.lesson_id === progress.lesson_id
          );

          let completed = learningProgresses.filter(
            (progress) => progress.status === "COMPLETED"
          ).length;

          if (progress.status === "COMPLETED" && !existingProgress) {
            completed = completed + 1;
          }
          const last_index = allLessons.length - 1;
          const isLastLesson = currentIndex === last_index;

          // Kiểm tra xem có nên navigate không
          if (!isLastLesson) {
            if (shouldNavigate) {
              setSearchParams({ lessonId: next_lesson_id });
            }
          }

          if (isLastLesson && allLessons.length === completed) {
            // Hiển thị toast khi hoàn thành khóa học
            toast.success(ToastContent, {
              data: {
                message: !isCourseCompleted
                  ? "Chúc mừng bạn đã hoàn thành khóa học!"
                  : "Bạn đã hoàn thành khóa học",
              },
            });

            navigate(PATH.CERTIFICATE);
          }
        },
      });
    },
    [
      addLearningProgress,
      allLessons,
      current_lesson_id,
      isCourseCompleted,
      learningProgresses,
      navigate,
      setSearchParams,
      upsertProgress,
    ]
  );
  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  return {
    modules,
    current_lesson_id,
    course,
    isLoadingCourse,
    learningProgresses,
    addLearningProgress,
    participation,
    completedLearningProgresses,
    isMoving,
    handleMoveToNext,
    handleBack,
    inCompleteLessons,
    allLessons,
    isOpenModal,
    handleCloseModal,
    courseId,
    participationId: participation?.id || "",
  };
};
