// src/components/quiz/QuizTimer.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { AccessTime as TimeIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { formatTime } from "@utils/quiz";

const TimerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

interface QuizTimerProps {
  timeLeft: number;
  isActive?: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  timeLeft,
  isActive = true,
}) => {
  return (
    <TimerBox sx={{ mb: 0 }}>
      <TimeIcon color="primary" sx={{ mr: 1 }} />
      <Typography
        variant="h5"
        color={isActive ? "primary" : "text.secondary"}
        sx={{ fontWeight: 700 }}
      >
        {formatTime(timeLeft)}
      </Typography>
    </TimerBox>
  );
};
