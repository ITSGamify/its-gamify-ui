// src/pages/TournamentRoomPage.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Avatar,
  Chip,
  Modal,
  TextField,
  Stack,
  Container,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom"; // Giả sử dự án sử dụng React Router; nếu không, thay bằng <a> hoặc điều chỉnh
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import AddIcon from "@mui/icons-material/Add";
import { PATH } from "@constants/path";
import { getRoute } from "@utils/route";

interface Room {
  id: string;
  creator: {
    name: string;
    avatar: string;
    level: number;
    wins: number;
    losses: number;
  };
  bet: number;
  status: "waiting" | "full" | "in-progress";
  participants: number;
  maxParticipants: number;
  createdAt: string;
}

const RoomsPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomBet, setNewRoomBet] = useState(100);
  const navigate = useNavigate();
  const tournament = {
    id: 1,
    title: "JavaScript Fundamentals Challenge",
    description:
      "Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation",
    category: "Software",
    difficulty: "Beginner",
    participants: 42,
    maxParticipants: 100,
    rating: 4.2,
    image:
      "https://readdy.ai/api/search-image?query=Modern%20JavaScript%20programming%20code%20editor%20with%20colorful%20syntax%20highlighting%20on%20a%20clean%20white%20background%2C%20professional%20software%20development%20workspace%20with%20minimal%20design%20elements%2C%20bright%20and%20clean%20aesthetic&width=800&height=400&seq=js-tournament-room&orientation=landscape",
  };

  const rooms: Room[] = [
    {
      id: "1",
      creator: {
        name: "Nguyen Van A",
        avatar: "A",
        level: 15,
        wins: 23,
        losses: 8,
      },
      bet: 500,
      status: "waiting",
      participants: 1,
      maxParticipants: 2,
      createdAt: "2 phút trước",
    },
    {
      id: "2",
      creator: {
        name: "Tran Thi B",
        avatar: "B",
        level: 12,
        wins: 18,
        losses: 12,
      },
      bet: 250,
      status: "waiting",
      participants: 1,
      maxParticipants: 2,
      createdAt: "5 phút trước",
    },
    {
      id: "3",
      creator: {
        name: "Le Van C",
        avatar: "C",
        level: 20,
        wins: 45,
        losses: 15,
      },
      bet: 1000,
      status: "waiting",
      participants: 1,
      maxParticipants: 2,
      createdAt: "8 phút trước",
    },
    {
      id: "4",
      creator: {
        name: "Pham Thi D",
        avatar: "D",
        level: 8,
        wins: 12,
        losses: 7,
      },
      bet: 150,
      status: "in-progress",
      participants: 2,
      maxParticipants: 2,
      createdAt: "12 phút trước",
    },
    {
      id: "5",
      creator: {
        name: "Hoang Van E",
        avatar: "E",
        level: 18,
        wins: 32,
        losses: 18,
      },
      bet: 750,
      status: "waiting",
      participants: 1,
      maxParticipants: 2,
      createdAt: "15 phút trước",
    },
  ];

  const handleCreateRoom = () => {
    // Handle room creation logic
    setShowCreateRoom(false);
  };

  const handleJoinRoom = (roomId: string) => {
    const route = getRoute(PATH.TOURNAMENT_WAITING_ROOM, { roomId: roomId });
    navigate(route);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "warning";
      case "in-progress":
        return "info";
      case "full":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "Đang chờ đối thủ";
      case "in-progress":
        return "Trận đấu đang diễn ra";
      case "full":
        return "Phòng đầy";
      default:
        return status;
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: "lg", mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Grid>
              <Box display="flex" alignItems="center">
                <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h3" fontWeight="600">
                  Tìm thử thách khác
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Card sx={{ boxShadow: 3, overflow: "hidden" }}>
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                height="192"
                image={tournament.image}
                alt={tournament.title}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0, 0, 0, 0.4)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  color: "white",
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {tournament.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {tournament.description}
                </Typography>
              </Box>
            </Box>

            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Stack direction="row" spacing={3}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography color="text.secondary" sx={{ mr: 1 }}>
                      {tournament.participants}/{tournament.maxParticipants}{" "}
                      người chơi
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography color="text.secondary" sx={{ mr: 1 }}>
                      Cấp độ: {tournament.difficulty}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography color="text.secondary" sx={{ mr: 1 }}>
                      Đánh giá: {tournament.rating}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowCreateRoom(true)}
                  startIcon={<AddIcon />}
                >
                  Tạo Phòng
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Phòng Có Sẵn
              </Typography>
              <Stack spacing={2}>
                {rooms.map((room) => (
                  <Card
                    key={room.id}
                    sx={{
                      p: 3,
                      boxShadow: 1,
                      "&:hover": { bgcolor: "grey.50" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            mr: 2,
                            width: 48,
                            height: 48,
                          }}
                        >
                          {room.creator.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {room.creator.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "text.secondary",
                            }}
                          >
                            <Typography variant="body2" sx={{ mr: 2 }}>
                              Cấp {room.creator.level}
                            </Typography>
                            <Typography variant="body2">
                              {room.creator.wins}T - {room.creator.losses}B
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" color="text.secondary">
                          Tạo {room.createdAt}
                        </Typography>
                        <Chip
                          label={getStatusText(room.status)}
                          color={getStatusColor(room.status)}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <EmojiEventsOutlinedIcon
                            sx={{ color: "#fcba03", fontSize: 20 }}
                          />
                          <Typography variant="subtitle1" fontWeight="bold">
                            {room.bet.toLocaleString()} điểm
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PeopleOutlineOutlinedIcon />
                          <Typography color="text.secondary">
                            {room.participants}/{room.maxParticipants} người
                            chơi
                          </Typography>
                        </Box>
                      </Stack>

                      {room.status === "waiting" && (
                        <Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleJoinRoom(room.id)}
                          >
                            Tham gia Phòng
                          </Button>
                        </Box>
                      )}

                      {room.status === "in-progress" && (
                        <Button variant="contained" disabled>
                          Đang Diễn Ra
                        </Button>
                      )}
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>
              <Card sx={{ boxShadow: 3, p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quy Tắc Giải Đấu
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Trận đấu quiz 1v1 thời gian thực
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    10 câu hỏi mỗi trận
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    15 giây mỗi câu hỏi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Người thắng lấy hết điểm cược
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cược tối thiểu: 50 điểm
                  </Typography>
                </Stack>
              </Card>

              <Card sx={{ boxShadow: 3, p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Thống Kê Của Bạn
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="text.secondary">
                      Điểm Hiện Tại
                    </Typography>
                    <Typography fontWeight="bold">2.450</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="text.secondary">
                      Tổng Trận Đấu
                    </Typography>
                    <Typography fontWeight="bold">28</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="text.secondary">Tỷ Lệ Thắng</Typography>
                    <Typography color="success.main" fontWeight="bold">
                      67%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="text.secondary">
                      Chuỗi Thắng Hiện Tại
                    </Typography>
                    <Typography color="warning.main" fontWeight="bold">
                      🔥 3
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Create Room Modal */}
      <Modal
        open={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        aria-labelledby="create-room-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: "100%",
            maxWidth: 400,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Tạo Phòng Mới
          </Typography>

          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Số Tiền Cược (Điểm)
              </Typography>
              <TextField
                type="number"
                fullWidth
                variant="outlined"
                value={newRoomBet}
                onChange={(e) => setNewRoomBet(Number(e.target.value))}
                inputProps={{ min: 50, max: 5000 }}
                placeholder="Nhập số tiền cược"
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Tối thiểu: 50 điểm | Tối đa: 5.000 điểm
              </Typography>
            </Box>

            <Card variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Điểm hiện tại của bạn:
                </Typography>
                <Typography fontWeight="bold">2.450</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Sau khi cược:
                </Typography>
                <Typography fontWeight="bold">{2450 - newRoomBet}</Typography>
              </Box>
            </Card>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowCreateRoom(false)}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCreateRoom}
              disabled={newRoomBet < 50 || newRoomBet > 2450}
            >
              Tạo Phòng
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
};

export default RoomsPage;
