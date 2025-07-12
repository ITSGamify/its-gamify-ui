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
}: LessonContentProps) => {
  const navigate = useNavigate();

  const quizInfo = {
    questionCount: 7,
    timeLimit: "30 minutes",
  };

  const params: ProgressRequestParams = {
    lesson_id: lesson.id,
    type: lesson.type,
    status: "COMPLETED",
    course_participation_id: participation.id,
  };

  const handleStartQuiz = useCallback(() => {
    localStorage.setItem("courseId", participation.course_id);
    const path = getRoute(PATH.QUIZ, { quizId: lesson.quiz_id || "" });
    navigate(
      path +
        `?type=LESSON&typeId=${lesson.id}&participationId=${participation.id}`
    );
  }, [
    lesson.quiz_id,
    lesson.id,
    navigate,
    participation.id,
    participation.course_id,
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
            Ready For Quiz
          </Typography>

          {/* Quiz Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 450 }}
          >
            Test yourself on the skills in this training and earn mastery points
            for what you already know!
          </Typography>

          {/* Quiz Info */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {quizInfo.questionCount} Questions • Total duration:{" "}
            {quizInfo.timeLimit}
          </Typography>

          {/* Start Button */}
          <StartButton
            variant="contained"
            disableElevation
            onClick={handleStartQuiz}
          >
            Let's Start The Quiz
          </StartButton>
        </QuizContainer>
      </Box>
      <NavigationContainer>
        <NavButton
          variant="outlined"
          color="inherit"
          sx={{ borderColor: "divider", color: "text.secondary" }}
          disabled={isMoving}
        >
          Previous
        </NavButton>

        <NavButton
          variant="contained"
          color="primary"
          disabled={isMoving}
          onClick={() => handleMoveToNext(params)}
        >
          Next Chapter
        </NavButton>
      </NavigationContainer>
    </>
  );
};

export default QuizLesson;
