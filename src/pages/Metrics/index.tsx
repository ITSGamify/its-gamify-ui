import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Avatar,
  Divider,
  useTheme,
  TextField,
  Pagination,
  Grid,
  Drawer, // Thêm import Drawer
  IconButton,
  CircularProgress, // Thêm cho nút close
} from "@mui/material";
import { User } from "@interfaces/api/user";
import { Quarter } from "@interfaces/api/course";
import { Metric } from "@interfaces/api/metric";
import { useGetQuarters } from "@services/quarter";
import { useGetMetrics } from "@services/metric";
import userSession from "@utils/user-session";

// Import thêm icon (nếu chưa có)
import CloseIcon from "@mui/icons-material/Close";
import EmployeeHeader from "@components/ui/atoms/leader-board/EmployeeHeader";
import ProgressStats from "@components/ui/atoms/leader-board/ProgressStats";
import CourseTable from "@components/ui/atoms/leader-board/CourseTable";
import { useGetUserStatistic } from "@services/user";
import { useCreateNotification } from "@services/notification";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";
const MetricsPage: React.FC = () => {
  const theme = useTheme();

  const profile = userSession.getUserProfile();

  const { data: quarters, isLoading: isLoadingQuarters } = useGetQuarters({
    page: 0,
    limit: 100,
  });

  const [selectedQuarterId, setSelectedQuarterId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 10;
  const { data: metrics, isLoading: isLoadingMetrics } = useGetMetrics({
    quarterId: selectedQuarterId,
    departmentId: profile?.user.department_id || "",
    page: currentPage,
    limit: pageSize,
    q: searchTerm,
  });

  // State mới cho Drawer
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  const sortedQuarters = useMemo(() => {
    return (quarters?.data || []).sort(
      (a: Quarter, b: Quarter) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
  }, [quarters]);

  useMemo(() => {
    if (!selectedQuarterId && sortedQuarters.length > 0) {
      setSelectedQuarterId(sortedQuarters[0].id);
    }
  }, [sortedQuarters, selectedQuarterId]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  // Hàm xử lý click row: Mở drawer và set selected
  const handleRowClick = (metric: Metric) => {
    setSelectedMetric(metric);
    setDrawerOpen(true);
  };

  // Hàm đóng drawer
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedMetric(null);
  };

  const { data: statistic, isPending: isLoadingStatistic } =
    useGetUserStatistic({
      userId: selectedMetric?.user_id,
      quaterId: selectedQuarterId,
    });

  const { mutateAsync: createNotification } = useCreateNotification();

  const handleRemind = useCallback(
    async (userId: string) => {
      await createNotification(
        {
          user_id: userId,
          type: "REMIND_COURSE",
        },
        {
          onSuccess: () => {
            toast.success(ToastContent, {
              data: { message: "Đã gửi thông báo nhắc nhở thành công!" },
            });
          },
        }
      );
    },
    [createNotification]
  );

  return (
    <Box sx={{ p: 3, pt: 0, maxWidth: "100%", overflowX: "auto" }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Thống kê nhân viên theo quý
      </Typography>

      <Card sx={{ mb: 3, boxShadow: theme.shadows[3] }}>
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 8, sm: 9 }}>
              <TextField
                fullWidth
                label="Tìm kiếm theo tên hoặc email"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Chọn quý</InputLabel>
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
                        {q.name} ({q.year})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {isLoadingMetrics || isLoadingQuarters ? (
            <Box>
              <Skeleton variant="rectangular" height={300} />
            </Box>
          ) : (metrics?.data.length ?? 0) === 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Không có dữ liệu thống kê cho quý này
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Người dùng</TableCell>
                      <TableCell align="center">Phòng ban</TableCell>
                      <TableCell align="center">Khóa học tham gia</TableCell>
                      <TableCell align="center">Khóa học hoàn thành</TableCell>
                      <TableCell align="center">Thử thách tham gia</TableCell>
                      <TableCell align="center">Thử thách đạt giải</TableCell>
                      <TableCell align="center">Điểm trong quý</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics?.data.map((metric: Metric) => {
                      const user: User = metric.user;
                      return (
                        <TableRow
                          key={metric.id}
                          onClick={() => handleRowClick(metric)} // Thêm onClick để mở drawer
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }} // Thêm hover effect
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                src={user.avatar_url || user.avatar}
                                sx={{ mr: 2 }}
                              >
                                {user.full_name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {user.full_name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {user.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {user.dept_name ||
                              user.department?.name ||
                              "Không xác định"}
                          </TableCell>
                          <TableCell align="center">
                            {metric.course_participated_num}
                          </TableCell>
                          <TableCell align="center">
                            {metric.course_completed_num}
                          </TableCell>
                          <TableCell align="center">
                            {metric.challenge_participate_num}
                          </TableCell>
                          <TableCell align="center">
                            {metric.challenge_award_num}
                          </TableCell>
                          <TableCell align="center">
                            {metric.point_in_quarter}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {metrics?.pagination && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Pagination
                    count={metrics.pagination.total_pages}
                    page={currentPage + 1} // Giả sử page_index bắt đầu từ 0, Pagination MUI bắt đầu từ 1
                    onChange={(_, value) => setCurrentPage(value - 1)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Drawer panel bên phải */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 1000 }, // Responsive width
            boxSizing: "border-box",
            p: 3,
          },
        }}
      >
        {selectedMetric ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <IconButton onClick={handleDrawerClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="h3" fontWeight={600} sx={{ mb: 1 }}>
              Thống kê chi tiết
            </Typography>
            {isLoadingStatistic ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <CircularProgress size={60} color="primary" />
              </Box>
            ) : statistic ? (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Card sx={{ borderRadius: 4, boxShadow: 1 }}>
                    <CardContent>
                      <EmployeeHeader
                        name={statistic?.name}
                        role={statistic.role}
                        totalProgress={statistic.totalProgress}
                        avatarInitials={statistic.avatarInitials}
                      />
                      <ProgressStats
                        completed={statistic.completed}
                        overdue={statistic.overdue}
                        onViewAll={() => console.log("View all")}
                        onRemind={() => handleRemind(selectedMetric.user_id)}
                      />
                      <CourseTable courses={statistic.courses} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Typography>Không có dữ liệu thống kê</Typography>
            )}
          </Box>
        ) : (
          <Typography>Không có dữ liệu</Typography>
        )}
      </Drawer>
    </Box>
  );
};

export default MetricsPage;
