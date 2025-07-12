// src/components/quiz/QuizReview.tsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  CardContent,
  Grid,
  Paper,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import {
  ArrowBack as PrevIcon,
  ArrowForward as NextIcon,
  CheckCircle as PassIcon,
  Cancel as FailIcon,
} from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { Quiz, QuizResult, Answer, QuizMode } from "@interfaces/api/quiz";
import { QuizCard } from "@components/shared/QuizStyledComponents";
import { QuestionDisplay } from "@components/ui/atoms/QuestionDisplay";
import { QuizProgress } from "@components/ui/atoms/QuizProgress";
import { QuestionNavigation } from "@components/ui/atoms/QuestionNavigation";

interface QuizReviewProps {
  quiz: Quiz;
  quizResult: QuizResult;
  onBack?: () => void;
}

export const QuizReview: React.FC<QuizReviewProps> = ({
  quiz,
  quizResult,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
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

  // Convert quiz answers to Answer format for compatibility
  const answers: Answer[] = useMemo(() => {
    return quizResult.quiz_answers.map((qa) => ({
      question_id: qa.question_id,
      answer: qa.answer,
    }));
  }, [quizResult.quiz_answers]);

  // Calculate statistics
  const correctAnswers = quizResult.quiz_answers.filter(
    (qa) => qa.is_correct
  ).length;
  const totalQuestions = quiz.questions.length;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        {onBack && (
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIosIcon />
          </IconButton>
        )}
        Kết quả bài kiểm tra
        <Typography variant="subtitle1" paragraph>
          Xem lại đáp án và kết quả của bạn.
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
                mode={QuizMode.REVIEW}
                quizAnswers={quizResult.quiz_answers}
                startIndex={startIndex}
              />
            </CardContent>

            <Box
              sx={{
                p: 2,
                pt: 0,
                display: "flex",
                justifyContent: "space-between",
              }}
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

        {/* Right Column - Results and Navigation */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* Result Summary */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              {quizResult.is_passed ? (
                <PassIcon sx={{ fontSize: 60, color: "success.main", mb: 1 }} />
              ) : (
                <FailIcon sx={{ fontSize: 60, color: "error.main", mb: 1 }} />
              )}

              <Typography variant="h5" gutterBottom>
                {quizResult.is_passed ? "Đã đậu" : "Chưa đậu"}
              </Typography>

              <Chip
                label={`${quizResult.score}/${quiz.total_mark} điểm`}
                color={quizResult.is_passed ? "success" : "error"}
                sx={{ mb: 2, fontSize: "1.1rem", py: 2 }}
              />

              <Typography variant="body1" color="text.secondary">
                Độ chính xác: {accuracy}% ({correctAnswers}/{totalQuestions} câu
                đúng)
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Hoàn thành lúc:{" "}
                {new Date(quizResult.completed_date).toLocaleString("vi-VN")}
              </Typography>
            </Box>

            <QuizProgress
              answers={answers}
              totalQuestions={quiz.questions.length}
              title="Kết quả chi tiết"
            />

            <QuestionNavigation
              questions={currentQuestions}
              answers={answers}
              onQuestionClick={handleQuestionNavigation}
              quizResult={quizResult}
              currentPage={currentPage}
              questionsPerPage={questionsPerPage}
            />
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Chú thích màu sắc
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: "success.main",
                    borderRadius: 1,
                  }}
                />
                <Typography variant="body2">Câu trả lời đúng</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: "error.main",
                    borderRadius: 1,
                  }}
                />
                <Typography variant="body2">Câu trả lời sai</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: "success.light",
                    border: "2px solid",
                    borderColor: "success.main",
                    borderRadius: 1,
                  }}
                />
                <Typography variant="body2">Đáp án đúng</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: "error.light",
                    border: "2px solid",
                    borderColor: "error.main",
                    borderRadius: 1,
                  }}
                />
                <Typography variant="body2">Đáp án bạn chọn (sai)</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
