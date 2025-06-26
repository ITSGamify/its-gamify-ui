// src/pages/course/components/lessons/QuizLesson.tsx
import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { LessonProps } from "@components/ui/molecules/course-detail/CourseDetailMainContent";
import QuizIcon from "@assets/images/quiz-icon.png";

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

const NavigationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginTop: theme.spacing(4),
}));

const NavButton = styled(Button)(() => ({
  textTransform: "none",
}));

const QuizLesson: React.FC<LessonProps> = ({ lesson }) => {
  const quizInfo = lesson.quizInfo || {
    questionCount: 7,
    timeLimit: "30 minutes",
  };

  return (
    <Box sx={{ py: 4 }}>
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
        <StartButton variant="contained" disableElevation>
          Let's Start The Quiz
        </StartButton>
      </QuizContainer>

      {/* Navigation Buttons */}
      <NavigationContainer>
        <NavButton
          variant="outlined"
          color="inherit"
          sx={{ borderColor: "divider", color: "text.secondary" }}
        >
          Previous
        </NavButton>

        <NavButton
          variant="contained"
          color="primary"
          sx={{ bgcolor: "#10b981" }}
        >
          Next Chapter
        </NavButton>
      </NavigationContainer>
    </Box>
  );
};

export default QuizLesson;
