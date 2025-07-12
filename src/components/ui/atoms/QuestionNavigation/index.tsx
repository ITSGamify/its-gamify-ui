// src/components/quiz/QuestionNavigation.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Question, Answer, QuizResult } from "@interfaces/api/quiz";

const QuestionButton = styled(Button, {
  shouldForwardProp: (prop) =>
    !["answered", "correct", "incorrect"].includes(prop as string),
})<{
  answered?: boolean;
  correct?: boolean;
  incorrect?: boolean;
}>(({ theme, answered, correct, incorrect }) => ({
  minWidth: 40,
  width: 40,
  height: 40,
  margin: theme.spacing(0.5),
  backgroundColor: correct
    ? theme.palette.success.main
    : incorrect
    ? theme.palette.error.main
    : answered
    ? theme.palette.info.main
    : theme.palette.grey[400],
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: correct
      ? theme.palette.success.dark
      : incorrect
      ? theme.palette.error.dark
      : answered
      ? theme.palette.info.dark
      : theme.palette.grey[600],
  },
}));

interface QuestionNavigationProps {
  questions: Question[];
  answers: Answer[];
  onQuestionClick: (index: number) => void;
  quizResult?: QuizResult; // For review mode
  currentPage?: number;
  questionsPerPage?: number;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  answers,
  onQuestionClick,
  quizResult,
  currentPage = 1,
  questionsPerPage = 2,
}) => {
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  const isQuestionAnswered = (questionId: string): boolean => {
    const answer = answers.find((a) => a.question_id === questionId);
    return answer?.answer !== null;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getQuestionStatus = (question: Question, globalIndex: number) => {
    if (!quizResult) {
      return { answered: isQuestionAnswered(question.id) };
    }

    const quizAnswer = quizResult.quiz_answers.find(
      (qa) => qa.question_id === question.id
    );

    return {
      answered: !!quizAnswer,
      correct: quizAnswer?.is_correct === true,
      incorrect: quizAnswer?.is_correct === false,
    };
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Danh sách câu hỏi
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", mb: 3 }}>
        {currentQuestions.map((question, index) => {
          const globalIndex = startIndex + index;
          const status = getQuestionStatus(question, globalIndex);

          return (
            <QuestionButton
              key={question.id}
              variant="contained"
              {...status}
              onClick={() => onQuestionClick(globalIndex)}
            >
              {globalIndex + 1}
            </QuestionButton>
          );
        })}
      </Box>
    </Box>
  );
};
