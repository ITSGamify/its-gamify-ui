// src/pages/QuizPage.tsx
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  ArrowBack as PrevIcon,
  ArrowForward as NextIcon,
  Send as SubmitIcon,
} from "@mui/icons-material";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// Styled components
const QuizContainer = styled(Container)(({ theme }) => ({
  // padding: theme.spacing(4, 0),
  [theme.breakpoints.up("md")]: {
    // padding: theme.spacing(6, 0),
  },
}));

const QuizCard = styled(Card)(() => ({
  height: "100%",
  minHeight: 500,
  display: "flex",
  flexDirection: "column",
}));

const QuestionButton = styled(Button)<{ answered: boolean }>(
  ({ theme, answered }) => ({
    minWidth: 40,
    width: 40,
    height: 40,
    margin: theme.spacing(0.5),
    backgroundColor: answered
      ? theme.palette.success.main
      : theme.palette.error.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: answered
        ? theme.palette.success.dark
        : theme.palette.error.dark,
    },
  })
);

const TimerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

// Types
interface Answer {
  questionId: number;
  selectedOption: string | null;
}

// interface Question {
//   id: number;
//   text: string;
//   options: {
//     id: string;
//     text: string;
//   }[];
// }

// Sample quiz data
const sampleQuiz = {
  title: "Bài kiểm tra kiến thức",
  description: "Hãy trả lời các câu hỏi dưới đây để hoàn thành bài kiểm tra.",
  timeLimit: 30 * 60, // 30 minutes in seconds
  questions: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    text: `Câu hỏi ${i + 1}: Đây là nội dung của câu hỏi thứ ${
      i + 1
    } trong bài kiểm tra?`,
    options: [
      { id: "A", text: `Đáp án A cho câu hỏi ${i + 1}` },
      { id: "B", text: `Đáp án B cho câu hỏi ${i + 1}` },
      { id: "C", text: `Đáp án C cho câu hỏi ${i + 1}` },
      { id: "D", text: `Đáp án D cho câu hỏi ${i + 1}` },
    ],
  })),
};

// Format time function
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const QuizPage: React.FC = () => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(sampleQuiz.timeLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionsPerPage = 2;
  const totalPages = Math.ceil(sampleQuiz.questions.length / questionsPerPage);

  // Calculate questions for current page
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(
    startIndex + questionsPerPage,
    sampleQuiz.questions.length
  );
  const currentQuestions = sampleQuiz.questions.slice(startIndex, endIndex);

  // Initialize answers
  useEffect(() => {
    const initialAnswers = sampleQuiz.questions.map((question) => ({
      questionId: question.id,
      selectedOption: null,
    }));
    setAnswers(initialAnswers);
  }, []);

  // Check if a question has been answered
  const isQuestionAnswered = (questionId: number): boolean => {
    const answer = answers.find((a) => a.questionId === questionId);
    return answer?.selectedOption !== null;
  };

  // Handle answer selection
  const handleAnswerChange = (questionId: number, option: string) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, selectedOption: option }
          : answer
      )
    );
  };

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle direct navigation to a specific question
  const handleQuestionNavigation = (questionId: number) => {
    const page = Math.ceil(questionId / questionsPerPage);
    setCurrentPage(page);
  };

  // Handle quiz submission
  const handleSubmit = React.useCallback(() => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Calculate result
      const answeredQuestions = answers.filter(
        (a) => a.selectedOption !== null
      ).length;
      const totalQuestions = sampleQuiz.questions.length;

      alert(
        `Bạn đã hoàn thành ${answeredQuestions}/${totalQuestions} câu hỏi.`
      );
      setIsSubmitting(false);

      // Redirect to result page or show result modal
      // history.push('/quiz-result');
    }, 1500);
  }, [answers]);
  // Calculate progress percentage
  const completionPercentage = Math.round(
    (answers.filter((a) => a.selectedOption !== null).length /
      sampleQuiz.questions.length) *
      100
  );
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
    <QuizContainer maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        <IconButton onClick={() => {}} sx={{ mr: 1 }}>
          <ArrowBackIosIcon />
        </IconButton>
        {sampleQuiz.title}
        <Typography variant="subtitle1" paragraph>
          {sampleQuiz.description}
        </Typography>
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Quiz Questions */}
        <Grid size={{ xs: 12, md: 8 }}>
          <QuizCard>
            <CardContent sx={{ flexGrow: 1 }}>
              {currentQuestions.map((question) => (
                <Box key={question.id} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    {question.text}
                  </Typography>
                  <FormControl component="fieldset" sx={{ width: "100%" }}>
                    <RadioGroup
                      value={
                        answers.find((a) => a.questionId === question.id)
                          ?.selectedOption || ""
                      }
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                    >
                      {question.options.map((option) => (
                        <FormControlLabel
                          key={option.id}
                          value={option.id}
                          control={<Radio />}
                          label={`${option.id}. ${option.text}`}
                          sx={{
                            mb: 1,
                            p: 1,
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}
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
            <TimerBox sx={{ mb: 0 }}>
              <TimeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                {formatTime(timeLeft)}
              </Typography>
            </TimerBox>

            <Box sx={{ mb: 0 }}>
              <Typography variant="h6" gutterBottom>
                Tiến độ làm bài
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{ position: "relative", display: "inline-flex", mr: 2 }}
                >
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
                  {answers.filter((a) => a.selectedOption !== null).length}/
                  {sampleQuiz.questions.length} câu
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>
              Danh sách câu hỏi
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", mb: 3 }}>
              {sampleQuiz.questions.map((question) => (
                <QuestionButton
                  key={question.id}
                  variant="contained"
                  answered={isQuestionAnswered(question.id)}
                  onClick={() => handleQuestionNavigation(question.id)}
                >
                  {question.id}
                </QuestionButton>
              ))}
            </Box>

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
    </QuizContainer>
  );
};

export default QuizPage;
