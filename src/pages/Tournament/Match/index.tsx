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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";
import { useMatchPage } from "@hooks/data/useMatchPage";
import { Room, RoomUser } from "@interfaces/api/challenge";
import { LoginResponse } from "@interfaces/api/auth";
import { deepOrange, grey, amber } from "@mui/material/colors";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

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

// Component mới để hiển thị list người chơi trong phần chơi
const PlayerList: React.FC<{
  activePlayers: RoomUser[];
  currentUserId: string;
}> = React.memo(({ activePlayers, currentUserId }) => {
  // Lọc ra chỉ hiển thị current user
  const currentPlayer = activePlayers.find(
    (player) => player.user_id === currentUserId
  );

  if (!currentPlayer) return null;
  const metric = currentPlayer.user?.user_metrics?.[0];
  return (
    <List sx={{ display: "flex", justifyContent: "center" }}>
      <ListItem
        key={currentPlayer.id}
        sx={{
          width: "auto",
          // bgcolor: "primary.light",
          borderRadius: 1,
          m: 1,
          px: 1,
        }}
      >
        <ListItemAvatar>
          <Avatar
            src={currentPlayer.user.avatar_url}
            sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
          >
            {currentPlayer.user.full_name[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="subtitle1" fontWeight="bold">
              {currentPlayer.user.full_name}
            </Typography>
          }
          secondary={
            metric && (
              <Typography
                variant="body1"
                fontWeight="bold"
                color="primary.main"
              >
                {`${metric.win_num || 0} T - ${metric?.lose_num || 0} B`}
              </Typography>
            )
          }
        />
        {currentPlayer.is_current_question_answered && (
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
        )}
      </ListItem>
    </List>
  );
});

const MatchResult: React.FC<{
  profile: LoginResponse;
  roomDetail: Room;
  navigate: NavigateFunction;
  handlePlayAgain: () => void;
}> = React.memo(({ profile, roomDetail, navigate, handlePlayAgain }) => {
  // Lấy và sắp xếp RoomUser active theo current_score descending
  const sortedPlayers = (roomDetail?.room_users || [])
    .filter((user: RoomUser) => !user.is_out_room)
    .sort((a: RoomUser, b: RoomUser) => b.current_score - a.current_score);

  return (
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: "md", mx: "auto" }}>
        <Card sx={{ boxShadow: 3, p: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              fontWeight="bold"
              color="success.main"
              gutterBottom
            >
              Kết quả trận đấu
            </Typography>
          </Box>

          <List>
            {sortedPlayers.map((player: RoomUser, index: number) => {
              const isCurrentUser = player.user_id === profile?.user.id;
              // Highlight top 1,2,3 với màu nền khác nhau
              let bgcolor = "inherit";
              if (index === 0) bgcolor = amber[100]; // Vàng nhạt cho top 1
              else if (index === 1) bgcolor = grey[200]; // Xám nhạt cho top 2
              else if (index === 2) bgcolor = deepOrange[100]; // Cam nhạt cho top 3

              // Nếu là người dùng hiện tại, thêm highlight border
              const sxProps = {
                bgcolor,
                borderRadius: 1,
                mb: 1,
                ...(isCurrentUser && {
                  border: 2,
                  borderColor: "primary.main",
                }),
              };

              return (
                <ListItem key={player.id} sx={sxProps}>
                  <ListItemAvatar>
                    <EmojiEventsIcon
                      sx={{
                        color:
                          index === 0
                            ? "#FFD700" // Vàng cho top 1
                            : index === 1
                            ? "#C0C0C0" // Bạc cho top 2
                            : index === 2
                            ? "#CD7F32" // Đồng cho top 3
                            : "transparent", // Không icon cho các vị trí khác
                        mr: 1,
                        visibility: index < 3 ? "visible" : "hidden",
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {`${index + 1}. ${player.user.full_name}`}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                          Điểm: {player.current_score}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Đúng: {player.correct_answers}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              );
            })}
          </List>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handlePlayAgain();
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
});

const MatchPage: React.FC = () => {
  const {
    roomDetail,
    questions,
    currentQuestion,
    timeLeft,
    selectedAnswer,
    showResult,
    isAnswering,
    loading,
    getOptions,
    handleAnswerSelect,
    roomResult,
    profile,
    handlePlayAgain,
    activePlayers,
  } = useMatchPage();

  const navigate = useNavigate();

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

  if (showResult && roomResult) {
    return (
      <MatchResult
        profile={profile as LoginResponse}
        roomDetail={roomResult}
        navigate={navigate}
        handlePlayAgain={handlePlayAgain}
      />
    );
  }
  const currentQ = questions[currentQuestion];
  const options = getOptions(currentQ);
  return (
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: "md", mx: "auto", py: 2 }}>
        <Card sx={{ boxShadow: 3, px: 2, mb: 3 }}>
          {/* List người chơi */}
          <PlayerList
            activePlayers={activePlayers}
            currentUserId={profile?.user.id || ""}
          />
          {/* Timer ở giữa */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <TimerDisplay timeLeft={timeLeft} />
          </Box>
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
