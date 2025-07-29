// src/pages/QuizMatchPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Grid,
  Avatar,
  Stack,
  CircularProgress,
  LinearProgress,
  Container,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import XIcon from "@mui/icons-material/X";
import { PATH } from "@constants/path";

const MatchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const opponentId = searchParams.get("opponent");
  // const tournamentId = searchParams.get("tournament");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [loading, setLoading] = useState(true); // Thay Suspense bằng state loading

  const questions = [
    {
      id: 1,
      question: "What is the correct way to declare a variable in JavaScript?",
      options: [
        "var myVar = 'hello';",
        "variable myVar = 'hello';",
        "v myVar = 'hello';",
        "declare myVar = 'hello';",
      ],
      correct: 0,
    },
    {
      id: 2,
      question:
        "Which method is used to add an element to the end of an array?",
      options: ["append()", "push()", "add()", "insert()"],
      correct: 1,
    },
    {
      id: 3,
      question: "What does DOM stand for?",
      options: [
        "Document Object Model",
        "Data Object Management",
        "Dynamic Object Method",
        "Document Oriented Model",
      ],
      correct: 0,
    },
    {
      id: 4,
      question: "Which operator is used for strict equality in JavaScript?",
      options: ["==", "===", "=", "!="],
      correct: 1,
    },
    {
      id: 5,
      question: "What is the result of typeof null in JavaScript?",
      options: ["null", "undefined", "object", "boolean"],
      correct: 2,
    },
  ];

  const opponent = {
    id: opponentId || "1",
    name: "Nguyen Van A",
    avatar: "A",
  };

  const currentUser = {
    name: "Người Chơi Hiện Tại",
    avatar: "U",
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(loadTimer);
  }, []);

  const handleNextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setIsAnswering(false);
    setTimeLeft(15);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  }, [currentQuestion, questions.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, handleNextQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswering) return;

    setSelectedAnswer(answerIndex.toString());
    setIsAnswering(true);

    // Check if answer is correct
    if (answerIndex === questions[currentQuestion].correct) {
      const speedBonus = Math.floor(timeLeft / 3);
      setUserScore((prev) => prev + 100 + speedBonus);
    }

    // Simulate opponent answer
    setTimeout(() => {
      const opponentCorrect = Math.random() > 0.3; // 70% chance opponent is correct
      if (opponentCorrect) {
        const opponentSpeedBonus = Math.floor(Math.random() * 5);
        setOpponentScore((prev) => prev + 100 + opponentSpeedBonus);
      }

      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    }, 500);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.50",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (showResult) {
    const userWon = userScore > opponentScore;
    return (
      <Container maxWidth="xl">
        <Box sx={{ maxWidth: "md", mx: "auto" }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="text.primary"
              gutterBottom
            >
              Kết Quả Trận Đấu
            </Typography>
          </Box>

          <Card sx={{ boxShadow: 3, p: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                fontWeight="bold"
                color={userWon ? "success.main" : "error.main"}
                gutterBottom
              >
                {userWon ? "Chiến Thắng!" : "Thất Bại!"}
              </Typography>
              <Box sx={{ width: 64, height: 64, mx: "auto" }}>
                <i
                  className={`${
                    userWon
                      ? "ri-trophy-fill text-yellow-500"
                      : "ri-emotion-sad-line text-gray-500"
                  } text-4xl`}
                />
              </Box>
            </Box>

            <Stack
              direction="row"
              spacing={4}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Box sx={{ textAlign: "center", width: 160 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 80,
                    height: 80,
                    mb: 2,
                    fontSize: "2rem",
                    mx: "auto",
                  }}
                >
                  {currentUser.avatar}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {currentUser.name}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {userScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  điểm
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Avatar sx={{ bgcolor: "grey.200", width: 48, height: 48 }}>
                  <XIcon color="disabled" />
                </Avatar>
              </Box>

              <Box sx={{ textAlign: "center", width: 160 }}>
                <Avatar
                  sx={{
                    bgcolor: "info.main",
                    width: 80,
                    height: 80,
                    mb: 2,
                    fontSize: "2rem",
                    mx: "auto",
                  }}
                >
                  {opponent.avatar}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {opponent.name}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="info.main">
                  {opponentScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  điểm
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(PATH.TOURNAMENT_WAITING_ROOM + "/1")}
              >
                Chơi Lại
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate(PATH.TOURNAMENT_MATCH_HISTORY)}
              >
                Xem Lịch Sử
              </Button>
            </Stack>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: "md", mx: "auto", py: 4 }}>
        <Card sx={{ boxShadow: 3, p: 3, mb: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                {currentUser.avatar}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {currentUser.name}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  {userScore} điểm
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="text.primary"
                gutterBottom
              >
                {timeLeft}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                giây còn lại
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {opponent.name}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="info.main">
                  {opponentScore} điểm
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "info.main", width: 48, height: 48 }}>
                {opponent.avatar}
              </Avatar>
            </Stack>
          </Stack>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Câu hỏi {currentQuestion + 1} trên {questions.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={((currentQuestion + 1) / questions.length) * 100}
              sx={{
                height: 8,
                borderRadius: 5,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": { bgcolor: "primary.main" },
              }}
            />
          </Box>
        </Card>

        <Card sx={{ boxShadow: 3, p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="text.primary"
              gutterBottom
            >
              {questions[currentQuestion].question}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {questions[currentQuestion].options.map((option, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswering}
                  sx={{
                    p: 2,
                    py: 4,
                    textAlign: "left",
                    justifyContent: "flex-start",
                    border: 2,
                    borderColor:
                      selectedAnswer === index.toString()
                        ? index === questions[currentQuestion].correct
                          ? "success.main"
                          : "error.main"
                        : "grey.200",
                    bgcolor:
                      selectedAnswer === index.toString()
                        ? index === questions[currentQuestion].correct
                          ? "success.light"
                          : "error.light"
                        : "grey.50",
                    color:
                      selectedAnswer === index.toString()
                        ? index === questions[currentQuestion].correct
                          ? "success.dark"
                          : "error.dark"
                        : "text.primary",
                    "&:hover": {
                      borderColor: selectedAnswer ? "inherit" : "primary.main",
                      bgcolor: selectedAnswer ? "inherit" : "primary.light",
                    },
                    opacity: isAnswering ? 0.75 : 1,
                    cursor: isAnswering ? "not-allowed" : "pointer",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "white",
                        color: "text.secondary",
                        border: 2,
                        borderColor: "grey.300",
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </Avatar>
                    <Typography variant="body1" fontWeight="medium">
                      {option}
                    </Typography>
                  </Stack>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Box>
    </Container>
  );
};

export default MatchPage;
