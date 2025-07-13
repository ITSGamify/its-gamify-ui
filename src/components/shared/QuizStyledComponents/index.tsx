// src/components/quiz/shared/StyledComponents.tsx
import { styled } from "@mui/material/styles";
import { Card, Container } from "@mui/material";

export const QuizContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    // padding: theme.spacing(6, 0),
  },
}));

export const QuizCard = styled(Card)(() => ({
  height: "auto",
  minHeight: 500,
  display: "flex",
  flexDirection: "column",
}));
