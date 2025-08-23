// src/pages/course/components/lessons/QuizLesson.tsx
import React, { useCallback } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import QuizIcon from "@assets/images/quiz-icon.png";
import {
  LessonContentProps,
  NavButton,
  NavigationContainer,
} from "@components/ui/molecules/course-detail/CourseDetailMainContent";

import { ProgressRequestParams } from "@services/progress";
import { useNavigate } from "react-router-dom";
import { getRoute } from "@utils/route";
import { PATH } from "@constants/path";
import { toast } from "react-toastify";
import ToastContent from "../../Toast";

const QuizContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "10px 0 20px 0",
  borderRadius: theme.shape.borderRadius,
  textAlign: "center",
  margin: "0 auto",
  marginBottom: theme.spacing(4),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
}));

const StartButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#10b981",
  color: theme.palette.common.white,
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "#0ea271",
  },
}));

const QuizLesson = ({
  lesson,
  isMoving,
  handleMoveToNext,
  participation,
  learning_progress,
  handleBack,
  inCompleteLessons,
  isLastLesson,
}: LessonContentProps) => {
  const navigate = useNavigate();

  const params: ProgressRequestParams = {
    lesson_id: lesson.id,
    type: lesson.type,
    status:
      learning_progress && learning_progress.status === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    course_participation_id: participation.id,
  };

  const handleStartQuiz = useCallback(() => {
    if (
      inCompleteLessons.length > 1 ||
      (inCompleteLessons.length === 1 && inCompleteLessons[0].id !== lesson.id)
    ) {
      toast.warning(ToastContent, {
        data: {
          message: "Bạn cần hoàn thành các bài học trước để làm bài kiểm tra.",
        },
      });
      return;
    }
    localStorage.setItem("courseId", participation.course_id);
    const path = getRoute(PATH.QUIZ, { quizId: lesson.quiz_id || "" });
    navigate(
      path +
        `?type=LESSON&typeId=${lesson.id}&participationId=${participation.id}`
    );
  }, [
    inCompleteLessons,
    lesson.id,
    lesson.quiz_id,
    participation.course_id,
    participation.id,
    navigate,
  ]);

  return (
    <>
      <Box>
        <QuizContainer>
          {/* Quiz Icon */}
          <Box
            component="img"
            src={QuizIcon}
            alt="Quiz"
            sx={{
              mb: 3,
              height: 200,
              objectFit: "contain",
            }}
          />

          {/* Quiz Title */}
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Sẵn sàng cho bài kiểm tra
          </Typography>

          {/* Quiz Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 450 }}
          >
            Kiểm tra kiến thức của bạn về các kỹ năng trong khóa học này và nhận
            điểm thành thạo cho những gì bạn đã biết!
          </Typography>

          {/* Quiz Info */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {lesson.quiz?.total_questions} Câu hỏi • Tổng thời gian:{" "}
            {lesson.duration} phút
          </Typography>

          {/* Start Button */}
          <StartButton
            variant="contained"
            disableElevation
            onClick={handleStartQuiz}
          >
            {learning_progress && learning_progress.status === "COMPLETED"
              ? "Làm lại bài kiểm tra"
              : "Bắt đầu làm bài"}
          </StartButton>
        </QuizContainer>
      </Box>
      <NavigationContainer>
        <NavButton
          variant="outlined"
          color="inherit"
          sx={{ borderColor: "divider", color: "text.secondary" }}
          disabled={isMoving}
          onClick={handleBack}
        >
          Trước
        </NavButton>
        {isLastLesson && (
          <NavButton
            variant="contained"
            color="primary"
            disabled={isMoving}
            onClick={() => handleMoveToNext(params)}
          >
            Tiếp theo
          </NavButton>
        )}
      </NavigationContainer>
    </>
  );
};

export default QuizLesson;
