// src/pages/MatchHistoryPage.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
} from "@mui/material";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";

const MatchHistoryPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const matchHistory = [
    {
      id: "1",
      date: "2024-01-15",
      time: "14:30",
      opponent: "Nguyen Van A",
      opponentAvatar: "A",
      tournament: "JavaScript Fundamentals",
      result: "win",
      userScore: 850,
      opponentScore: 720,
      duration: "3m 45s",
    },
    {
      id: "2",
      date: "2024-01-15",
      time: "11:20",
      opponent: "Tran Thi B",
      opponentAvatar: "B",
      tournament: "React Development",
      result: "loss",
      userScore: 640,
      opponentScore: 780,
      duration: "4m 12s",
    },
    {
      id: "3",
      date: "2024-01-14",
      time: "16:45",
      opponent: "Le Van C",
      opponentAvatar: "C",
      tournament: "Digital Marketing",
      result: "win",
      userScore: 920,
      opponentScore: 650,
      duration: "2m 58s",
    },
    {
      id: "4",
      date: "2024-01-14",
      time: "09:15",
      opponent: "Pham Thi D",
      opponentAvatar: "D",
      tournament: "Python Basics",
      result: "win",
      userScore: 750,
      opponentScore: 690,
      duration: "3m 22s",
    },
    {
      id: "5",
      date: "2024-01-13",
      time: "15:30",
      opponent: "Hoang Van E",
      opponentAvatar: "E",
      tournament: "UI/UX Design",
      result: "loss",
      userScore: 580,
      opponentScore: 820,
      duration: "4m 05s",
    },
    {
      id: "6",
      date: "2024-01-13",
      time: "10:45",
      opponent: "Vu Thi F",
      opponentAvatar: "F",
      tournament: "Data Analytics",
      result: "win",
      userScore: 880,
      opponentScore: 760,
      duration: "3m 18s",
    },
  ];

  const filteredMatches = matchHistory.filter((match) => {
    if (selectedFilter === "all") return true;
    return match.result === selectedFilter;
  });

  const stats = {
    totalMatches: matchHistory.length,
    wins: matchHistory.filter((m) => m.result === "win").length,
    losses: matchHistory.filter((m) => m.result === "loss").length,
    winRate: Math.round(
      (matchHistory.filter((m) => m.result === "win").length /
        matchHistory.length) *
        100
    ),
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: "xl", mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            Lịch Sử Trận Đấu
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi hiệu suất và tiến bộ của bạn theo thời gian
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tổng Trận Đấu
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    {stats.totalMatches}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgb(219 234 254 / var(--tw-bg-opacity, 1))",
                    width: 48,
                    height: 48,
                  }}
                >
                  <SportsEsportsOutlinedIcon />
                </Avatar>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Thắng
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {stats.wins}
                  </Typography>
                </Box>
                <Avatar
                  sx={{ bgcolor: "success.light", width: 48, height: 48 }}
                >
                  <EmojiEventsOutlinedIcon />
                </Avatar>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Thua
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    {stats.losses}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "error.light", width: 48, height: 48 }}>
                  <HighlightOffOutlinedIcon />
                </Avatar>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tỷ Lệ Thắng
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="secondary.main"
                  >
                    {stats.winRate}%
                  </Typography>
                </Box>
                <Avatar
                  sx={{ bgcolor: "secondary.light", width: 48, height: 48 }}
                >
                  <PercentOutlinedIcon />
                </Avatar>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ boxShadow: 3, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Trận Đấu Gần Đây
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { value: "all", label: "Tất Cả" },
                { value: "win", label: "Thắng" },
                { value: "loss", label: "Thua" },
              ].map((filter) => (
                <Button
                  key={filter.value}
                  variant={
                    selectedFilter === filter.value ? "contained" : "outlined"
                  }
                  color="primary"
                  onClick={() => setSelectedFilter(filter.value)}
                  sx={{ borderRadius: 50, textTransform: "none" }}
                >
                  {filter.label}
                </Button>
              ))}
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Đối Thủ</TableCell>
                  <TableCell>Giải Đấu</TableCell>
                  <TableCell>Kết Quả</TableCell>
                  <TableCell>Điểm Số</TableCell>
                  <TableCell>Thời Gian</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMatches.map((match) => (
                  <TableRow key={match.id} hover>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {match.date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {match.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Typography variant="body1" fontWeight="medium">
                          {match.opponent}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" color="text.primary">
                        {match.tournament}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          match.result === "win" ? "Chiến Thắng" : "Thất Bại"
                        }
                        color={match.result === "win" ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        color={
                          match.result === "win" ? "success.main" : "error.main"
                        }
                      >
                        {match.userScore}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {match.opponentScore}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" color="text.primary">
                        {match.duration}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Container>
  );
};

export default MatchHistoryPage;
