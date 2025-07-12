// src/components/quiz/QuizTaking.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  CardContent,
  Grid,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as PrevIcon,
  ArrowForward as NextIcon,
  Send as SubmitIcon,
} from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { Quiz, Answer, QuizMode } from "@interfaces/api/quiz";
import { QuestionDisplay } from "@components/ui/atoms/QuestionDisplay";
import { QuizProgress } from "@components/ui/atoms/QuizProgress";
import { QuizTimer } from "@components/ui/atoms/QuizTimer";
import { QuestionNavigation } from "@components/ui/atoms/QuestionNavigation";
import { QuizCard } from "@components/shared/QuizStyledComponents";

interface QuizTakingProps {
  quiz: Quiz;
  onSubmit: (answers: Answer[]) => void;
  onBack?: () => void;
  initialTimeLeft?: number;
}

export const QuizTaking: React.FC<QuizTakingProps> = ({
  quiz,
  onSubmit,
  onBack,
  initialTimeLeft,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(
    initialTimeLeft || quiz.duration * 60
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionsPerPage = 2;

  // Calculate questions for current page
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(
    startIndex + questionsPerPage,
    quiz.questions.length
  );
  const currentQuestions = useMemo(
    () => quiz.questions.slice(startIndex, endIndex),
    [quiz.questions, startIndex, endIndex]
  );

  const totalPages = Math.ceil(quiz.questions.length / questionsPerPage);

  // Initialize answers
  useEffect(() => {
    const initialAnswers = quiz.questions.map((question) => ({
      question_id: question.id,
      answer: null,
    }));
    setAnswers(initialAnswers);
  }, [quiz.questions]);

  // Handle answer selection
  const handleAnswerChange = useCallback(
    (questionId: string, option: string) => {
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.question_id === questionId
            ? { ...answer, answer: option }
            : answer
        )
      );
    },
    []
  );

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle direct navigation to a specific question
  const handleQuestionNavigation = (index: number) => {
    const page = Math.ceil((index + 1) / questionsPerPage);
    setCurrentPage(page);
  };

  // Handle submit
  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    onSubmit(answers);
  }, [answers, onSubmit]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit, timeLeft]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        {onBack && (
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIosIcon />
          </IconButton>
        )}
        Bài kiểm tra kiến thức
        <Typography variant="subtitle1" paragraph>
          Hãy trả lời các câu hỏi dưới đây để hoàn thành bài kiểm tra.
        </Typography>
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Quiz Questions */}
        <Grid size={{ xs: 12, md: 8 }}>
          <QuizCard>
            <CardContent sx={{ flexGrow: 1 }}>
              <QuestionDisplay
                questions={currentQuestions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                mode={QuizMode.TAKING}
                startIndex={startIndex}
              />
            </CardContent>

            <Box
              sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="outlined"
                startIcon={<PrevIcon />}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Câu hỏi trước
              </Button>
              <Typography>
                Trang {currentPage}/{totalPages}
              </Typography>
              <Button
                variant="outlined"
                endIcon={<NextIcon />}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Câu hỏi tiếp
              </Button>
            </Box>
          </QuizCard>
        </Grid>

        {/* Right Column - Question Navigation and Timer */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, py: 0, mb: 3 }}>
            <QuizTimer timeLeft={timeLeft} />

            <QuizProgress
              answers={answers}
              totalQuestions={quiz.questions.length}
            />

            <QuestionNavigation
              questions={currentQuestions}
              answers={answers}
              onQuestionClick={handleQuestionNavigation}
              currentPage={currentPage}
              questionsPerPage={questionsPerPage}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<SubmitIcon />}
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{ py: 1.5, mb: 3 }}
            >
              {isSubmitting ? "Đang nộp bài..." : "Nộp bài"}
            </Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hướng dẫn làm bài
            </Typography>
            <Typography variant="body2" paragraph>
              • Chọn một đáp án cho mỗi câu hỏi
            </Typography>
            <Typography variant="body2" paragraph>
              • Câu hỏi màu xanh: đã trả lời
            </Typography>
            <Typography variant="body2" paragraph>
              • Câu hỏi màu đỏ: chưa trả lời
            </Typography>
            <Typography variant="body2" paragraph>
              • Bạn có thể quay lại câu hỏi trước đó để thay đổi đáp án
            </Typography>
            <Typography variant="body2">
              • Hết thời gian, bài thi sẽ tự động nộp
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
