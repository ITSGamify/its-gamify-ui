// src/components/quiz/QuestionDisplay.tsx
import React from "react";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  useTheme,
  Chip,
} from "@mui/material";
import { Question, Answer, QuizAnswer, QuizMode } from "@interfaces/api/quiz";
import { alpha } from "@mui/material/styles"; // Thêm import alpha để tạo màu nhạt hơn

interface QuestionDisplayProps {
  questions: Question[];
  answers: Answer[];
  onAnswerChange?: (questionId: string, option: string) => void;
  mode: QuizMode;
  quizAnswers?: QuizAnswer[]; // For review mode
  startIndex?: number;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  questions,
  answers,
  onAnswerChange,
  mode,
  quizAnswers = [],
  startIndex = 0,
}) => {
  const theme = useTheme();

  const getSelectedAnswer = (questionId: string): string => {
    if (mode === QuizMode.REVIEW) {
      const quizAnswer = quizAnswers.find(
        (qa) => qa.question_id === questionId
      );
      return quizAnswer?.answer || "";
    }
    return answers.find((a) => a.question_id === questionId)?.answer || "";
  };

  const getOptionStyle = (
    question: Question,
    optionKey: string,
    optionValue: string
  ) => {
    if (mode === QuizMode.TAKING) {
      return {
        mb: 1,
        p: 1,
        borderRadius: 1,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      };
    }

    // Review mode styling
    const quizAnswer = quizAnswers.find((qa) => qa.question_id === question.id);
    const isSelected = quizAnswer?.answer === optionValue;
    const isCorrect = question.correct_answer === optionValue;
    const selectedAnswer = quizAnswer?.answer;
    const correctAnswer = question.correct_answer;

    let backgroundColor = "transparent";
    let border = "none";

    if (isCorrect) {
      backgroundColor = alpha(theme.palette.success.light, 0.3); // Làm nhạt hơn bằng alpha
      border = `1px solid ${alpha(theme.palette.success.main, 0.5)}`; // Border mỏng và nhạt hơn
    } else if (isSelected && selectedAnswer !== correctAnswer) {
      backgroundColor = alpha(theme.palette.error.light, 0.2); // Làm nhạt hơn bằng alpha
      border = `1px solid ${alpha(theme.palette.error.main, 0.5)}`; // Border mỏng và nhạt hơn
    }

    return {
      mb: 1,
      p: 1,
      borderRadius: 1,
      backgroundColor,
      border,
    };
  };

  const renderOptionLabel = (
    question: Question,
    optionKey: string,
    optionValue: string,
    label: string
  ) => {
    if (mode === QuizMode.TAKING) {
      return label;
    }

    // Review mode - show correct/incorrect indicators
    const isCorrect = question.correct_answer === optionValue;
    const quizAnswer = quizAnswers.find((qa) => qa.question_id === question.id);
    const isSelected = quizAnswer?.answer === optionValue;

    return (
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Typography
          sx={{
            flexGrow: 1,
            fontWeight: isCorrect ? "bold" : "normal", // Làm chữ đậm hơn nếu là đáp án đúng
            color: isCorrect ? "#242020" : "#8f1a1a", // Màu đen cho đáp án đúng
          }}
        >
          {label}
        </Typography>
        {isCorrect && (
          <Chip label="Đúng" color="success" size="small" sx={{ ml: 1 }} />
        )}
        {isSelected && !isCorrect && (
          <Chip label="Sai" color="error" size="small" sx={{ ml: 1 }} />
        )}
      </Box>
    );
  };

  return (
    <Box>
      {questions.map((question, index) => (
        <Box key={question.id} sx={{ mb: 0 }}>
          <Typography variant="h6" gutterBottom>
            {`Câu hỏi ${startIndex + index + 1}: ${question.content}`}
          </Typography>

          {mode === QuizMode.REVIEW && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {question.description}
            </Typography>
          )}

          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <RadioGroup
              value={getSelectedAnswer(question.id)}
              onChange={(e) => onAnswerChange?.(question.id, e.target.value)}
            >
              <FormControlLabel
                value={question.answer_a}
                control={<Radio disabled={mode === QuizMode.REVIEW} />}
                label={renderOptionLabel(
                  question,
                  "answer_a",
                  question.answer_a,
                  `A. ${question.answer_a}`
                )}
                sx={getOptionStyle(question, "answer_a", question.answer_a)}
              />
              <FormControlLabel
                value={question.answer_b}
                control={<Radio disabled={mode === QuizMode.REVIEW} />}
                label={renderOptionLabel(
                  question,
                  "answer_b",
                  question.answer_b,
                  `B. ${question.answer_b}`
                )}
                sx={getOptionStyle(question, "answer_b", question.answer_b)}
              />
              <FormControlLabel
                value={question.answer_c}
                control={<Radio disabled={mode === QuizMode.REVIEW} />}
                label={renderOptionLabel(
                  question,
                  "answer_c",
                  question.answer_c,
                  `C. ${question.answer_c}`
                )}
                sx={getOptionStyle(question, "answer_c", question.answer_c)}
              />
              <FormControlLabel
                value={question.answer_d}
                control={<Radio disabled={mode === QuizMode.REVIEW} />}
                label={renderOptionLabel(
                  question,
                  "answer_d",
                  question.answer_d,
                  `D. ${question.answer_d}`
                )}
                sx={getOptionStyle(question, "answer_d", question.answer_d)}
              />
            </RadioGroup>
          </FormControl>
          <Divider sx={{ my: 2 }} />
        </Box>
      ))}
    </Box>
  );
};
