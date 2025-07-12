// src/components/quiz/QuizProgress.tsx
import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { calculateCompletionPercentage } from "@utils/quiz";
import { Answer } from "@interfaces/api/quiz";

interface QuizProgressProps {
  answers: Answer[];
  totalQuestions: number;
  title?: string;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  answers,
  totalQuestions,
  title = "Tiến độ làm bài",
}) => {
  const completionPercentage = calculateCompletionPercentage(
    answers,
    totalQuestions
  );
  const answeredCount = answers.filter((a) => a.answer !== null).length;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ position: "relative", display: "inline-flex", mr: 2 }}>
          <CircularProgress
            variant="determinate"
            value={completionPercentage}
            size={60}
            color="success"
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >
              {`${completionPercentage}%`}
            </Typography>
          </Box>
        </Box>
        <Typography>
          {answeredCount}/{totalQuestions} câu
        </Typography>
      </Box>
    </Box>
  );
};
