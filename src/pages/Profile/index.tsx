import React, { useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  tabClasses,
} from "@mui/material";
import {
  Email as EmailIcon,
  Work as RoleIcon,
  Business as DepartmentIcon,
} from "@mui/icons-material";
import userSession from "@utils/user-session";
import { useGetUserDetail } from "@services/user";
import { formatDateToVietnamese } from "@utils/date";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const UserProfilePage = () => {
  const profile = userSession.getUserProfile()?.user;
  const { data: detail, isFetching } = useGetUserDetail(profile?.id || "");

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Xử lý loading
  if (isFetching) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Đang tải thông tin hồ sơ...
        </Typography>
      </Box>
    );
  }

  // Nếu không có data sau khi fetch
  if (!detail) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Không tìm thấy thông tin người dùng.
        </Typography>
      </Box>
    );
  }

  // Sắp xếp metrics theo start_date descending (mới nhất trước)
  const sortedMetrics =
    detail && detail.metrics
      ? [...detail.metrics].sort(
          (a, b) =>
            new Date(b.quarter.start_date).getTime() -
            new Date(a.quarter.start_date).getTime()
        )
      : [];
  return (
    <>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          height: "100%",
        }}
      >
        <Grid container spacing={3}>
          {/* <Grid size={{ xs: 12 }}>
            <SectionTitle variant="h6" fontWeight={600}>
              Hồ Sơ Người Dùng
            </SectionTitle>
          </Grid> */}

          <Grid size={{ xs: 12, md: 12 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                {/* Phần Avatar và Tên */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    src={detail.avatar_url}
                    alt={detail.full_name}
                    sx={{ width: 100, height: 100, mr: 3 }}
                  />
                  <Box>
                    <Typography variant="h5" component="div" gutterBottom>
                      {detail.full_name || "Tên người dùng"}
                    </Typography>
                    <Chip
                      label={detail.role || "Vai trò"}
                      icon={<RoleIcon />}
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Thông tin Cá Nhân */}
                <Typography variant="h6" gutterBottom>
                  Thông tin Cá Nhân
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <EmailIcon sx={{ mr: 1 }} /> Email
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {detail.email || "Không có"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <DepartmentIcon sx={{ mr: 1 }} /> Phòng Ban
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {detail.department?.name ||
                        detail.dept_name ||
                        "Không có"}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Thống Kê (Metrics) theo Quarter */}
                <Typography variant="h6" gutterBottom>
                  Thống Kê
                </Typography>
                {sortedMetrics.length > 0 ? (
                  <>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="Thống kê theo quý"
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        [`& .${tabClasses.root}`]: {
                          textTransform: "none",
                        },
                      }}
                    >
                      {sortedMetrics.map((metric, index) => (
                        <Tab
                          key={metric.id}
                          label={`${metric.quarter.name} ${metric.quarter.year}`}
                          id={`tab-${index}`}
                          aria-controls={`tabpanel-${index}`}
                        />
                      ))}
                    </Tabs>
                    {sortedMetrics.map((metric, index) => (
                      <TabPanel key={metric.id} value={tabValue} index={index}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Khóa học tham gia
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {metric.course_participated_num || 0}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Khóa học hoàn thành
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {metric.course_completed_num || 0}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Thử thách tham gia
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {metric.challenge_participate_num || 0}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Thử thách thắng giải
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {metric.challenge_award_num || 0}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Điểm trong quý
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {metric.point_in_quarter || 0}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Số trận thắng
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {metric.win_num || 0}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Số trận thua
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {metric.lose_num || 0}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Chuỗi thắng hiện tại
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {metric.win_streak || 0}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Chuỗi thắng cao nhất
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {metric.highest_win_streak || 0}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" color="text.secondary">
                              Thời gian:{" "}
                              {formatDateToVietnamese(
                                metric.quarter.start_date
                              )}{" "}
                              -{" "}
                              {formatDateToVietnamese(metric.quarter.end_date)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TabPanel>
                    ))}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có thống kê cho người dùng này.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default UserProfilePage;
