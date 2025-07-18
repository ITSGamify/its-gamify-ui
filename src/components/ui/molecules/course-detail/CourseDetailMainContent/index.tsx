// src/pages/course/components/CourseMainContent.tsx
import React, { JSX } from "react";
import QuizLesson from "@components/ui/atoms/lessons/QuizLesson";
import VideoLesson from "@components/ui/atoms/lessons/VideoLesson";
import ArticleLesson from "@components/ui/atoms/lessons/ArticleLesson";
import { useGetLesson } from "@services/lesson";
import { Lesson } from "@interfaces/api/lesson";
import { Box, Button, styled } from "@mui/material";
import { Participation } from "@interfaces/api/course";
import { LearningProgress } from "@interfaces/api/learningProgress";
import { ARTICLE, PRACTICE, QUIZ, VIDEO } from "@constants/lesson";
import { ProgressRequestParams } from "@services/progress";
import PracticeLesson from "@components/ui/atoms/lessons/PracticeLesson";
export const NavigationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginTop: theme.spacing(4),
}));
export const NavButton = styled(Button)(() => ({
  textTransform: "none",
}));

export interface LessonContentProps {
  lesson: Lesson;
  isMoving: boolean;
  handleMoveToNext: (
    param: ProgressRequestParams,
    shouldNavigate?: boolean
  ) => void;
  participation: Participation;
  learning_progress: LearningProgress | null;
}

interface CourseMainContentProps {
  lessonId: string;
  participation: Participation | undefined;
  learningProgresses: LearningProgress[];
  isMoving: boolean;
  handleMoveToNext: (
    param: ProgressRequestParams,
    shouldNavigate?: boolean
  ) => void;
}

const CourseMainContent = ({
  lessonId,
  participation,
  learningProgresses,
  isMoving,
  handleMoveToNext,
}: CourseMainContentProps) => {
  const { data: lesson } = useGetLesson(lessonId);

  const learning_progress =
    learningProgresses.find((x) => x.lesson_id == lessonId) || null;

  const stepForms: Record<string, (props: LessonContentProps) => JSX.Element> =
    {
      [ARTICLE]: ArticleLesson,
      [VIDEO]: VideoLesson,
      [QUIZ]: QuizLesson,
      [PRACTICE]: PracticeLesson,
    };

  const ActiveLessonStepForm = stepForms[lesson?.type as string];

  return (
    <>
      {lesson && participation && (
        <ActiveLessonStepForm
          isMoving={isMoving}
          handleMoveToNext={handleMoveToNext}
          lesson={lesson}
          participation={participation}
          learning_progress={learning_progress}
        />
      )}
    </>
  );
};

export default CourseMainContent;
