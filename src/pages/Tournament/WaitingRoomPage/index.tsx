// src/pages/WaitingRoomPage.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Grid,
  Avatar,
  Stack,
  CircularProgress,
  Container,
} from "@mui/material";
import { useSearchParams } from "react-router-dom"; // Giả sử dự án sử dụng React Router
import { Link, useNavigate } from "react-router-dom"; // Để link và navigate
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import XIcon from "@mui/icons-material/X";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";

const WaitingRoomPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const opponentId = searchParams.get("opponent");
  const tournamentId = searchParams.get("tournament");

  const [countdown, setCountdown] = useState(5);
  const [isReady, setIsReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [loading, setLoading] = useState(true); // Thay Suspense bằng state loading đơn giản

  const opponent = {
    id: opponentId || "1",
    name: "Nguyen Van A",
    avatar: "A",
    level: 15,
    wins: 23,
    losses: 8,
  };

  const currentUser = {
    name: "Người Chơi Hiện Tại",
    avatar: "U",
    level: 12,
    wins: 18,
    losses: 10,
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Simulate opponent getting ready
    const readyTimer = setTimeout(() => {
      setOpponentReady(true);
    }, 2000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(readyTimer);
    };
  }, []);

  useEffect(() => {
    if (isReady && opponentReady) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate(
              `/match?opponent=${opponentId}&tournament=${tournamentId}`
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isReady, opponentReady, opponentId, tournamentId, navigate]);

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
            Phòng Chờ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chuẩn bị cho trận đấu quiz của bạn!
          </Typography>
        </Box>

        <Card sx={{ boxShadow: 3, p: 4, mb: 4 }}>
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
              <Typography variant="body2" color="text.secondary">
                Cấp {currentUser.level}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser.wins}T - {currentUser.losses}B
              </Typography>
              <Box sx={{ mt: 2 }}>
                {isReady ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    color="success.main"
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Sẵn Sàng!
                    </Typography>
                  </Stack>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsReady(true)}
                    fullWidth
                  >
                    Sẵn Sàng
                  </Button>
                )}
              </Box>
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
              <Typography variant="body2" color="text.secondary">
                Cấp {opponent.level}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {opponent.wins}T - {opponent.losses}B
              </Typography>
              <Box sx={{ mt: 2 }}>
                {opponentReady ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    color="success.main"
                    sx={{ py: 1 }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Sẵn Sàng!
                    </Typography>
                  </Stack>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    color="warning.main"
                    sx={{ py: 1 }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      Đang Chờ...
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Box>
          </Stack>

          {isReady && opponentReady && (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h1"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                {countdown}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Trận đấu bắt đầu trong...
              </Typography>
            </Box>
          )}

          {!isReady && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Nhấn "Sẵn Sàng" khi bạn đã chuẩn bị bắt đầu quiz
              </Typography>
            </Box>
          )}
        </Card>

        <Card sx={{ boxShadow: 3, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quy Tắc Trận Đấu
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "rgb(219 234 254 / var(--tw-bg-opacity, 1))",
                    width: 32,
                    height: 32,
                  }}
                >
                  <HelpOutlineIcon sx={{ fontSize: 15, color: "green" }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    10 Câu Hỏi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Câu hỏi ngẫu nhiên từ bộ sưu tập
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "rgb(209 250 229 / var(--tw-bg-opacity, 1))",
                    width: 32,
                    height: 32,
                  }}
                >
                  <ScheduleIcon sx={{ fontSize: 15, color: "blue" }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    15 Giây
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Giới hạn thời gian mỗi câu hỏi
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "rgb(254 249 195 / var(--tw-bg-opacity, 1))",
                    width: 32,
                    height: 32,
                  }}
                >
                  <EmojiEventsOutlinedIcon
                    sx={{ fontSize: 15, color: "yellow" }}
                  />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Thưởng Tốc Độ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Điểm thưởng cho câu trả lời nhanh
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "error.light", width: 32, height: 32 }}>
                  <PercentOutlinedIcon sx={{ fontSize: 15, color: "white" }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Độ Chính Xác Quan Trọng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Câu trả lời đúng ghi điểm
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Link to={`/tournament/${tournamentId}`}>
            <Button variant="outlined" color="inherit">
              Hủy Trận Đấu
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default WaitingRoomPage;
