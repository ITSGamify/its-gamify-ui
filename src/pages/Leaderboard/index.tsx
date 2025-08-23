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
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { amber, grey, deepOrange } from "@mui/material/colors";
import { useLeaderBoardPage } from "@hooks/data/useLeaderBoardPage";
import { Quarter } from "@interfaces/api/course";
import { formatDateShort } from "@utils/date";
import userSession from "@utils/user-session";
import { alpha } from "@mui/material/styles";

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overall");

  const {
    generalMetric,
    isLoading,
    top10Metrics,
    selectedQuarterId,
    setSelectedQuarterId,
    sortedQuarters,
    isLoadingQuarters,
    departments,
    isLoadingDapartment,
    handleSelectDepartment,
  } = useLeaderBoardPage();

  const profile = userSession.getUserProfile();

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
                  {generalMetric?.average_correct.toFixed(2)}%
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
                onClick={() => {
                  setActiveTab("overall");
                  handleSelectDepartment("");
                }}
                sx={{ borderRadius: 50, textTransform: "none" }}
              >
                Tổng Thể
              </Button>
              {isLoadingDapartment ? (
                <Button
                  disabled
                  sx={{ borderRadius: 50, textTransform: "none" }}
                >
                  <Skeleton width={80} />
                </Button>
              ) : (
                departments.map((department) => (
                  <Button
                    key={department.id}
                    variant={activeTab === department.id ? "contained" : "text"}
                    onClick={() => {
                      setActiveTab(department.id);
                      handleSelectDepartment(department.id);
                    }}
                    sx={{ borderRadius: 50, textTransform: "none" }}
                  >
                    {department.name}
                  </Button>
                ))
              )}
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
                {top10Metrics.map((player, index) => {
                  return (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        backgroundColor:
                          player.user_id === profile?.user.id
                            ? (theme) => theme.palette.action.disabledBackground
                            : "inherit",
                        borderLeft:
                          player.user_id === profile?.user.id
                            ? (theme) =>
                                `4px solid ${theme.palette.primary.main}` // Sử dụng callback function để truy cập theme
                            : "none",
                        "&:hover": {
                          backgroundColor:
                            player.user_id === profile?.user.id
                              ? (theme) =>
                                  alpha(theme.palette.primary.main, 0.1) // Sử dụng alpha để giảm độ đậm
                              : (theme) => theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {index === 0 && (
                            <EmojiEventsIcon sx={{ color: amber[500] }} /> // Vàng cho top 1
                          )}
                          {index === 1 && (
                            <EmojiEventsIcon sx={{ color: grey[400] }} /> // Xám cho top 2
                          )}
                          {index === 2 && (
                            <EmojiEventsIcon sx={{ color: deepOrange[400] }} /> // Cam cho top 3
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
                            src={player.user.avatar_url}
                            sx={{
                              bgcolor: "primary.main",
                              width: 40,
                              height: 40,
                            }}
                          >
                            {player.user.full_name[0].toUpperCase() || ""}
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
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Container>
  );
};

export default LeaderboardPage;
