// src/pages/LeaderboardPage.tsx
import React, { useState } from "react";
import {
  Box,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Container,
} from "@mui/material";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import StraightOutlinedIcon from "@mui/icons-material/StraightOutlined";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overall");
  const [timeFilter, setTimeFilter] = useState("all");

  const leaderboardData = {
    overall: [
      {
        rank: 1,
        name: "Nguyễn Văn Hùng",
        avatar: "H",
        level: 15,
        points: 2450,
        wins: 87,
        losses: 23,
        winRate: 79.1,
        streak: 8,
      },
      {
        rank: 2,
        name: "Trần Thị Lan",
        avatar: "L",
        level: 14,
        points: 2380,
        wins: 82,
        losses: 28,
        winRate: 74.5,
        streak: 5,
      },
      {
        rank: 3,
        name: "Lê Minh Tuấn",
        avatar: "T",
        level: 13,
        points: 2290,
        wins: 78,
        losses: 32,
        winRate: 70.9,
        streak: 3,
      },
      {
        rank: 4,
        name: "Phạm Thị Hồng",
        avatar: "H",
        level: 12,
        points: 2180,
        wins: 75,
        losses: 35,
        winRate: 68.2,
        streak: 12,
      },
      {
        rank: 5,
        name: "Hoàng Văn Đức",
        avatar: "D",
        level: 12,
        points: 2150,
        wins: 73,
        losses: 37,
        winRate: 66.4,
        streak: 2,
      },
      {
        rank: 6,
        name: "Võ Thị Mai",
        avatar: "M",
        level: 11,
        points: 2080,
        wins: 69,
        losses: 41,
        winRate: 62.7,
        streak: 1,
      },
      {
        rank: 7,
        name: "Đặng Minh Khôi",
        avatar: "K",
        level: 11,
        points: 2020,
        wins: 66,
        losses: 44,
        winRate: 60.0,
        streak: 4,
      },
      {
        rank: 8,
        name: "Bùi Thị Thảo",
        avatar: "T",
        level: 10,
        points: 1950,
        wins: 63,
        losses: 47,
        winRate: 57.3,
        streak: 0,
      },
      {
        rank: 9,
        name: "Ngô Văn Sơn",
        avatar: "S",
        level: 10,
        points: 1890,
        wins: 60,
        losses: 50,
        winRate: 54.5,
        streak: 6,
      },
      {
        rank: 10,
        name: "Đinh Thị Linh",
        avatar: "L",
        level: 9,
        points: 1820,
        wins: 57,
        losses: 53,
        winRate: 51.8,
        streak: 2,
      },
    ],
    software: [
      {
        rank: 1,
        name: "Lê Minh Tuấn",
        avatar: "T",
        level: 13,
        points: 1890,
        wins: 45,
        losses: 12,
        winRate: 78.9,
        streak: 7,
      },
      {
        rank: 2,
        name: "Nguyễn Văn Hùng",
        avatar: "H",
        level: 15,
        points: 1780,
        wins: 42,
        losses: 15,
        winRate: 73.7,
        streak: 4,
      },
      {
        rank: 3,
        name: "Đặng Minh Khôi",
        avatar: "K",
        level: 11,
        points: 1650,
        wins: 38,
        losses: 19,
        winRate: 66.7,
        streak: 2,
      },
      {
        rank: 4,
        name: "Hoàng Văn Đức",
        avatar: "D",
        level: 12,
        points: 1580,
        wins: 35,
        losses: 22,
        winRate: 61.4,
        streak: 1,
      },
      {
        rank: 5,
        name: "Ngô Văn Sơn",
        avatar: "S",
        level: 10,
        points: 1450,
        wins: 32,
        losses: 25,
        winRate: 56.1,
        streak: 3,
      },
    ],
    marketing: [
      {
        rank: 1,
        name: "Trần Thị Lan",
        avatar: "L",
        level: 14,
        points: 1920,
        wins: 48,
        losses: 9,
        winRate: 84.2,
        streak: 9,
      },
      {
        rank: 2,
        name: "Phạm Thị Hồng",
        avatar: "H",
        level: 12,
        points: 1750,
        wins: 43,
        losses: 14,
        winRate: 75.4,
        streak: 6,
      },
      {
        rank: 3,
        name: "Võ Thị Mai",
        avatar: "M",
        level: 11,
        points: 1680,
        wins: 40,
        losses: 17,
        winRate: 70.2,
        streak: 2,
      },
      {
        rank: 4,
        name: "Bùi Thị Thảo",
        avatar: "T",
        level: 10,
        points: 1590,
        wins: 37,
        losses: 20,
        winRate: 64.9,
        streak: 1,
      },
      {
        rank: 5,
        name: "Đinh Thị Linh",
        avatar: "L",
        level: 9,
        points: 1420,
        wins: 33,
        losses: 24,
        winRate: 57.9,
        streak: 0,
      },
    ],
  };

  const achievements = [
    {
      name: "Nguyễn Văn Hùng",
      achievement: "Chuỗi Thắng Dài Nhất",
      value: "15 trận thắng",
      icon: <WhatshotOutlinedIcon color="error" />,
      color: "text-red-500",
    },
    {
      name: "Trần Thị Lan",
      achievement: "Trả Lời Nhanh Nhất",
      value: "0.8s trung bình",
      icon: <BoltOutlinedIcon sx={{ color: "#effa19" }} />,
      color: "text-yellow-500",
    },
    {
      name: "Lê Minh Tuấn",
      achievement: "Chính Xác Nhất",
      value: "94% độ chính xác",
      icon: <PercentOutlinedIcon sx={{ color: "#2f9104" }} />,
      color: "text-green-500",
    },
    {
      name: "Phạm Thị Hồng",
      achievement: "Cải Thiện Nhiều Nhất",
      value: "+580 điểm",
      icon: <StraightOutlinedIcon sx={{ color: "#1b75e3" }} />,
      color: "text-blue-500",
    },
  ];

  const currentData =
    leaderboardData[activeTab as keyof typeof leaderboardData];

  return (
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: "7xl", mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            Bảng Xếp Hạng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi những người biểu diễn hàng đầu và thành tựu trong hệ thống
            đào tạo
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Người Chơi Hàng Đầu
                </Typography>
                <Avatar sx={{ bgcolor: "transparent" }}>
                  <EmojiEventsOutlinedIcon
                    color="secondary"
                    fontSize="medium"
                  />
                </Avatar>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                  H
                </Avatar>
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color="text.primary"
                  >
                    Nguyễn Văn Hùng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    2,450 điểm
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Tổng Người Chơi
                </Typography>
                <Avatar sx={{ bgcolor: "transparent" }}>
                  <PeopleOutlineOutlinedIcon color="info" fontSize="medium" />
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  247
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hoạt động tháng này
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Trận Đấu Hôm Nay
                </Typography>
                <Avatar sx={{ bgcolor: "transparent" }}>
                  <SportsEsportsOutlinedIcon
                    color="primary"
                    fontSize="medium"
                  />
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  1,234
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +15% so với hôm qua
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Độ Chính Xác Trung Bình
                </Typography>
                <Avatar sx={{ bgcolor: "transparent" }}>
                  <PercentOutlinedIcon color="error" fontSize="medium" />
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  78.5%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trung bình công ty
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ boxShadow: 3, mb: 4 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                Xếp Hạng
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Thời Gian</InputLabel>
                <Select
                  value={timeFilter}
                  label="Thời Gian"
                  onChange={(e) => setTimeFilter(e.target.value as string)}
                >
                  <MenuItem value="all">Toàn Thời Gian</MenuItem>
                  <MenuItem value="month">Tháng Này</MenuItem>
                  <MenuItem value="week">Tuần Này</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                bgcolor: "grey.100",
                borderRadius: 50,
                p: 0.5,
                gap: 0.5,
              }}
            >
              <Button
                variant={activeTab === "overall" ? "contained" : "text"}
                onClick={() => setActiveTab("overall")}
                sx={{ borderRadius: 50, textTransform: "none" }}
              >
                Tổng Thể
              </Button>
              <Button
                variant={activeTab === "software" ? "contained" : "text"}
                onClick={() => setActiveTab("software")}
                sx={{ borderRadius: 50, textTransform: "none" }}
              >
                Phần Mềm
              </Button>
              <Button
                variant={activeTab === "marketing" ? "contained" : "text"}
                onClick={() => setActiveTab("marketing")}
                sx={{ borderRadius: 50, textTransform: "none" }}
              >
                Marketing
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hạng</TableCell>
                  <TableCell>Người Chơi</TableCell>
                  <TableCell>Cấp Độ</TableCell>
                  <TableCell>Điểm</TableCell>
                  <TableCell>Thắng/Thua</TableCell>
                  <TableCell>Tỷ Lệ Thắng</TableCell>
                  <TableCell>Chuỗi</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((player, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {player.rank === 1 && (
                          <i className="ri-trophy-fill text-yellow-500" />
                        )}
                        {player.rank === 2 && (
                          <i className="ri-medal-line text-grey-400" />
                        )}
                        {player.rank === 3 && (
                          <i className="ri-medal-line text-orange-400" />
                        )}
                        <Typography variant="body1" fontWeight="medium">
                          #{player.rank}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {player.avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            color="text.primary"
                          >
                            {player.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cấp độ {player.level}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            bgcolor: "primary.main",
                            borderRadius: "50%",
                          }}
                        />
                        <Typography variant="body1" fontWeight="medium">
                          {player.level}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {player.points.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        component="span"
                        color="success.main"
                        fontWeight="medium"
                      >
                        {player.wins}
                      </Typography>
                      <Typography
                        component="span"
                        color="text.secondary"
                        sx={{ mx: 0.5 }}
                      >
                        /
                      </Typography>
                      <Typography
                        component="span"
                        color="error.main"
                        fontWeight="medium"
                      >
                        {player.losses}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {player.winRate}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {player.streak > 0 && (
                          <i className="ri-fire-line text-red-500 text-sm" />
                        )}
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color={
                            player.streak > 0 ? "error.main" : "text.secondary"
                          }
                        >
                          {player.streak}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button color="primary" sx={{ textTransform: "none" }}>
                        Thách Đấu
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Card sx={{ boxShadow: 3 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Thành Tựu Đặc Biệt
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {achievements.map((achievement, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      bgcolor: "grey.100",
                      borderRadius: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "white",
                        color: achievement.color.replace("text-", ""),
                      }}
                    >
                      {achievement.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        color="text.primary"
                      >
                        {achievement.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.achievement}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      sx={{ textAlign: "right" }}
                    >
                      {achievement.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default LeaderboardPage;
