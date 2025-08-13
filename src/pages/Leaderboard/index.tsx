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
  CircularProgress,
  Skeleton,
} from "@mui/material";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
// import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
// import StraightOutlinedIcon from "@mui/icons-material/StraightOutlined";
// import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import { useLeaderBoardPage } from "@hooks/data/useLeaderBoardPage";
import { Quarter } from "@interfaces/api/course";
import { formatDateShort } from "@utils/date";

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overall");

  // const achievements = [
  //   {
  //     name: "Nguyễn Văn Hùng",
  //     achievement: "Chuỗi Thắng Dài Nhất",
  //     value: "15 trận thắng",
  //     icon: <WhatshotOutlinedIcon color="error" />,
  //     color: "text-red-500",
  //   },
  //   {
  //     name: "Trần Thị Lan",
  //     achievement: "Trả Lời Nhanh Nhất",
  //     value: "0.8s trung bình",
  //     icon: <BoltOutlinedIcon sx={{ color: "#effa19" }} />,
  //     color: "text-yellow-500",
  //   },
  //   {
  //     name: "Lê Minh Tuấn",
  //     achievement: "Chính Xác Nhất",
  //     value: "94% độ chính xác",
  //     icon: <PercentOutlinedIcon sx={{ color: "#2f9104" }} />,
  //     color: "text-green-500",
  //   },
  //   {
  //     name: "Phạm Thị Hồng",
  //     achievement: "Cải Thiện Nhiều Nhất",
  //     value: "+580 điểm",
  //     icon: <StraightOutlinedIcon sx={{ color: "#1b75e3" }} />,
  //     color: "text-blue-500",
  //   },
  // ];

  const {
    generalMetric,
    isLoading,
    top10Metrics,
    selectedQuarterId,
    setSelectedQuarterId,
    sortedQuarters,
    isLoadingQuarters,
  } = useLeaderBoardPage();

  const calculateWinRate = (wins: number, losses: number) => {
    const totalGames = wins + losses;
    if (totalGames === 0) return 0;
    return Math.round((wins / totalGames) * 100);
  };
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

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
                <Avatar
                  src={generalMetric?.top_metric.user.avatar_url}
                  sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
                >
                  H
                </Avatar>
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color="text.primary"
                  >
                    {generalMetric?.top_metric.user.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {generalMetric?.top_metric.point_in_quarter.toLocaleString()}
                    điểm
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
                  {generalMetric?.num_of_player
                    ? generalMetric?.num_of_player - 3
                    : 0}
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
                  {generalMetric?.match_in_day}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hoạt động trong ngày
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
                  {generalMetric?.average_correct}%
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
              <FormControl size="small" sx={{ minWidth: 400 }}>
                <InputLabel>Thời Gian</InputLabel>
                <Select
                  value={selectedQuarterId}
                  onChange={(e) =>
                    setSelectedQuarterId(e.target.value as string)
                  }
                  label="Chọn quý"
                >
                  {isLoadingQuarters ? (
                    <MenuItem disabled>
                      <Skeleton width={200} />
                    </MenuItem>
                  ) : (
                    sortedQuarters.map((q: Quarter) => (
                      <MenuItem key={q.id} value={q.id}>
                        {q.name}, ({formatDateShort(q.start_date)} -{" "}
                        {formatDateShort(q.end_date)})
                      </MenuItem>
                    ))
                  )}
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
                  <TableCell align="center">Điểm</TableCell>
                  <TableCell align="center">Khóa học (Hoàn thành)</TableCell>
                  <TableCell align="center">Thắng/Thua</TableCell>
                  <TableCell align="center">Tỷ Lệ Thắng</TableCell>
                  <TableCell>Chuỗi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {top10Metrics.map((player, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {index === 1 && (
                          <i className="ri-trophy-fill text-yellow-500" />
                        )}
                        {index === 2 && (
                          <i className="ri-medal-line text-grey-400" />
                        )}
                        {index === 3 && (
                          <i className="ri-medal-line text-orange-400" />
                        )}
                        <Typography variant="body1" fontWeight="medium">
                          #{index + 1}
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
                          {player.user.avatar_url}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            color="text.primary"
                          >
                            {player.user.full_name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight="medium">
                        {player.point_in_quarter.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight="medium">
                        {player.course_completed_num}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        component="span"
                        color="success.main"
                        fontWeight="medium"
                      >
                        {player.win_num}
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
                        {player.lose_num}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight="medium">
                        {calculateWinRate(player.win_num, player.lose_num)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {player.win_streak > 0 && (
                          <i className="ri-fire-line text-red-500 text-sm" />
                        )}
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          color={
                            player.win_streak > 0
                              ? "error.main"
                              : "text.secondary"
                          }
                        >
                          {player.win_streak}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* <Card sx={{ boxShadow: 3 }}>
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
        </Card> */}
      </Box>
    </Container>
  );
};

export default LeaderboardPage;
