import React from "react";
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
import { useNavigate } from "react-router-dom";
import XIcon from "@mui/icons-material/X";
import { PATH } from "@constants/path";
import { useMatchPage } from "@hooks/data/useMatchPage";
import { getRoute } from "@utils/route";

// Component con chỉ để hiển thị timer (re-render riêng, không ảnh hưởng toàn bộ page)
const TimerDisplay: React.FC<{ timeLeft: number }> = React.memo(
  ({ timeLeft }) => {
    return (
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
    );
  }
);

const MatchPage: React.FC = () => {
  const {
    roomDetail,
    questions,
    currentQuestion,
    timeLeft,
    selectedAnswer,
    showResult,
    isAnswering,
    userScore,
    opponentScore,
    isHost,
    loading,
    getOptions,
    handleAnswerSelect,
  } = useMatchPage();

  const navigate = useNavigate();

  const hostUser = roomDetail?.host_user;
  const opponentUser = roomDetail?.opponent_user;

  if (loading || !roomDetail || questions.length === 0) {
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
                  src={isHost ? hostUser?.avatar_url : opponentUser?.avatar_url}
                  sx={{
                    bgcolor: "primary.main",
                    width: 80,
                    height: 80,
                    mb: 2,
                    fontSize: "2rem",
                    mx: "auto",
                  }}
                >
                  {isHost ? hostUser?.avatar_url : opponentUser?.avatar_url}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {isHost ? hostUser?.full_name : opponentUser?.full_name}
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
                  src={isHost ? opponentUser?.avatar_url : hostUser?.avatar_url}
                  sx={{
                    bgcolor: "info.main",
                    width: 80,
                    height: 80,
                    mb: 2,
                    fontSize: "2rem",
                    mx: "auto",
                  }}
                >
                  {isHost ? opponentUser?.avatar_url : hostUser?.avatar_url}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {isHost ? opponentUser?.full_name : hostUser?.full_name}
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
                onClick={() => {
                  const route = getRoute(PATH.TOURNAMENT_WAITING_ROOM, {
                    roomId: roomDetail.id,
                  });
                  navigate(route);
                }}
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

  const currentQ = questions[currentQuestion];
  const options = getOptions(currentQ);

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
              <Avatar
                src={hostUser?.avatar_url}
                sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
              >
                {hostUser?.avatar_url}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {hostUser?.full_name}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  {roomDetail.host_score} điểm
                </Typography>
              </Box>
            </Stack>

            {/* Tách timer vào component con để hạn chế re-render */}
            <TimerDisplay timeLeft={timeLeft} />

            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {opponentUser?.full_name}
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="info.main">
                  {roomDetail.opponent_score} điểm
                </Typography>
              </Box>
              <Avatar
                src={opponentUser?.avatar_url}
                sx={{ bgcolor: "info.main", width: 48, height: 48 }}
              >
                {opponentUser?.avatar_url}
              </Avatar>
            </Stack>
          </Stack>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Câu hỏi {currentQuestion + 1} trên {roomDetail.question_count}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={((currentQuestion + 1) / roomDetail.question_count) * 100}
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
              {currentQ.content}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentQ.correct_answer; // Check từng option có phải correct không

              let borderColor = "grey.200";
              let bgcolor = "grey.50";
              let color = "text.primary";

              if (selectedAnswer !== null) {
                // Sau khi answer, highlight correct xanh, selected đỏ nếu sai
                if (isCorrectOption) {
                  borderColor = "success.main";
                  bgcolor = "success.light";
                  color = "success.dark";
                } else if (isSelected) {
                  borderColor = "error.main";
                  bgcolor = "error.light";
                  color = "error.dark";
                }
              }

              return (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswering || selectedAnswer !== null} // Disable sau khi answer
                    sx={{
                      p: 2,
                      py: 4,
                      textAlign: "left",
                      justifyContent: "flex-start",
                      border: 2,
                      borderColor,
                      bgcolor,
                      color,
                      "&:hover": {
                        borderColor: selectedAnswer
                          ? "inherit"
                          : "primary.main",
                        bgcolor: selectedAnswer ? "inherit" : "primary.light",
                      },
                      opacity:
                        isAnswering || selectedAnswer !== null ? 0.75 : 1,
                      cursor:
                        isAnswering || selectedAnswer !== null
                          ? "not-allowed"
                          : "pointer",
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
                        {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                      </Avatar>
                      <Typography variant="body1" fontWeight="medium">
                        {option}
                      </Typography>
                    </Stack>
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Card>
      </Box>
    </Container>
  );
};

export default MatchPage;
