// src/pages/LeaderMetricsPage.tsx
import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import { User } from "@interfaces/api/user";
import { Quarter } from "@interfaces/api/course";
import { Metric } from "@interfaces/api/metric";
import { useGetQuarters } from "@services/quarter";
import { useGetMetrics } from "@services/metric";
import userSession from "@utils/user-session";

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
                        <TableRow key={metric.id}>
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
    </Box>
  );
};

export default MetricsPage;
