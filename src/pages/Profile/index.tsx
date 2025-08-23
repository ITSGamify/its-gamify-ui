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
  IconButton,
  Tooltip,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";
import {
  Email as EmailIcon,
  Work as RoleIcon,
  Business as DepartmentIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  CheckCircle as CheckIcon,
  SportsEsports as ChallengeIcon,
  Star as PointIcon,
  ThumbUp as WinIcon,
  ThumbDown as LoseIcon,
  Timeline as StreakIcon,
} from "@mui/icons-material";
import userSession from "@utils/user-session";
import { useGetUserDetail, useGetUserStatistic } from "@services/user";
import { formatDateToVietnamese } from "@utils/date";
import AccountModalForm from "@components/ui/molecules/AccountModalForm";
import CourseTable from "@components/ui/atoms/leader-board/CourseTable";
import { Metric } from "@interfaces/api/metric";

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
      {value === index && <Box sx={{ px: 3 }}>{children}</Box>}
    </div>
  );
}

function SubTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`subtabpanel-${index}`}
      aria-labelledby={`subtab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
    </div>
  );
}

const UserProfilePage = () => {
  const theme = useTheme();
  const profile = userSession.getUserProfile()?.user;

  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const { data: statistic, isPending: isLoadingStatistic } =
    useGetUserStatistic({
      userId: selectedMetric?.user_id,
      quaterId: selectedMetric?.quarter_id,
    });

  const {
    data: detail,
    isFetching,
    refetch,
  } = useGetUserDetail(profile?.id || "");

  const [tabValue, setTabValue] = useState(0);
  const [subTabValue, setSubTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSubTabValue(0);
  };

  const handleSubTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSubTabValue(newValue);
  };

  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const onSuccess = () => {
    refetch();
    handleCloseModal();
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
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress
          size={60}
          sx={{ mb: 2, color: theme.palette.primary.main }}
        />
        <Typography variant="h6" color="text.secondary">
          Đang tải thông tin hồ sơ...
        </Typography>
      </Box>
    );
  }

  // Nếu không có data sau khi fetch
  if (!detail) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          backgroundColor: theme.palette.background.paper,
        }}
      >
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
  const handleSelectTab = (metric: Metric) => {
    setSelectedMetric(metric);
  };
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          px: { xs: 2, md: 4 },
          mb: 4,
          backgroundColor: "white",
          boxShadow: "none",
        }}
      >
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Card
              elevation={0}
              sx={{
                backgroundColor: "transparent",
              }}
            >
              <CardContent>
                {/* Phần Header với Avatar, Tên */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Tooltip title="Chỉnh sửa hồ sơ">
                      <Box
                        sx={{
                          position: "relative",
                          cursor: "pointer",
                          "&:hover": {
                            opacity: 0.9,
                          },
                        }}
                        onClick={handleOpenModal}
                      >
                        <Avatar
                          src={detail.avatar_url}
                          alt={detail.full_name}
                          sx={{
                            width: 80,
                            height: 80,
                            border: `2px solid ${theme.palette.primary.main}`,
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                          onClick={handleOpenModal}
                        >
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Box>
                    </Tooltip>
                    <Box sx={{ ml: 3 }}>
                      <Typography
                        variant="h4"
                        component="div"
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                      >
                        {detail.full_name || "Tên người dùng"}
                      </Typography>
                      <Chip
                        label={detail.role || "Vai trò"}
                        icon={<RoleIcon />}
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: "1rem", py: 2.5 }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

                {/* Thông tin Cá Nhân */}
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  Thông tin Cá Nhân
                </Typography>
                <Grid container spacing={3} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EmailIcon
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={500}>
                      {detail.email || "Không có"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <DepartmentIcon
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography variant="subtitle2" color="text.secondary">
                        Phòng Ban
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={500}>
                      {detail.department?.name ||
                        detail.dept_name ||
                        "Không có"}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

                {/* Thống Kê (Metrics) theo Quarter */}
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 2 }}
                >
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
                        mb: 2,
                        [`& .${tabClasses.root}`]: {
                          textTransform: "none",
                          fontWeight: 600,
                          minWidth: 120,
                          "&.Mui-selected": {
                            color: theme.palette.primary.main,
                          },
                        },
                      }}
                    >
                      {sortedMetrics.map((metric, index) => (
                        <Tab
                          key={metric.id}
                          label={`${metric.quarter.name}, ${metric.quarter.year}`}
                          id={`tab-${index}`}
                          aria-controls={`tabpanel-${index}`}
                        />
                      ))}
                    </Tabs>
                    {sortedMetrics.map((metric, index) => (
                      <TabPanel key={metric.id} value={tabValue} index={index}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                            p: 2,
                            bgcolor: "action.hover",
                            borderRadius: theme.shape.borderRadius,
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={600}>
                            Thời gian:{" "}
                            {formatDateToVietnamese(metric.quarter.start_date)}{" "}
                            - {formatDateToVietnamese(metric.quarter.end_date)}
                          </Typography>
                        </Box>
                        <Tabs
                          value={subTabValue}
                          onChange={handleSubTabChange}
                          aria-label="Sub tabs cho quý"
                          centered
                          variant="fullWidth"
                          sx={{
                            mb: 2,
                            borderBottom: 1,
                            borderColor: "divider",
                            [`& .${tabClasses.root}`]: {
                              textTransform: "none",
                              fontWeight: 600,
                              fontSize: "1rem",
                              "&.Mui-selected": {
                                color: theme.palette.primary.main,
                                borderBottom: `2px solid ${theme.palette.primary.main}`,
                              },
                            },
                          }}
                        >
                          <Tab label="Thống kê" />
                          <Tab
                            label="Khóa học"
                            onClick={() => {
                              handleSelectTab(metric);
                            }}
                          />
                        </Tabs>
                        <SubTabPanel value={subTabValue} index={0}>
                          <Paper
                            elevation={2}
                            sx={{
                              overflow: "hidden",
                            }}
                          >
                            <List disablePadding>
                              {[
                                {
                                  label: "Khóa học tham gia",
                                  value: metric.course_participated_num || 0,
                                  icon: (
                                    <SchoolIcon
                                      sx={{ color: theme.palette.info.main }}
                                    />
                                  ),
                                  color: "info.main",
                                },
                                {
                                  label: "Điểm trong quý",
                                  value: metric.point_in_quarter || 0,
                                  icon: (
                                    <PointIcon
                                      sx={{
                                        color: theme.palette.secondary.main,
                                      }}
                                    />
                                  ),
                                  color: "secondary.main",
                                },
                                {
                                  label: "Khóa học hoàn thành",
                                  value: metric.course_completed_num || 0,
                                  icon: (
                                    <CheckIcon
                                      sx={{ color: theme.palette.success.main }}
                                    />
                                  ),
                                  color: "success.main",
                                },
                                {
                                  label: "Thử thách tham gia",
                                  value: metric.challenge_participate_num || 0,
                                  icon: (
                                    <ChallengeIcon
                                      sx={{ color: theme.palette.primary.main }}
                                    />
                                  ),
                                  color: "primary.main",
                                },

                                {
                                  label: "Số trận thắng",
                                  value: metric.win_num || 0,
                                  icon: (
                                    <WinIcon
                                      sx={{ color: theme.palette.success.main }}
                                    />
                                  ),
                                  color: "success.main",
                                },
                                {
                                  label: "Số trận thua",
                                  value: metric.lose_num || 0,
                                  icon: (
                                    <LoseIcon
                                      sx={{ color: theme.palette.error.main }}
                                    />
                                  ),
                                  color: "error.main",
                                },
                                {
                                  label: "Chuỗi thắng hiện tại",
                                  value: metric.win_streak || 0,
                                  icon: (
                                    <StreakIcon
                                      sx={{ color: theme.palette.primary.main }}
                                    />
                                  ),
                                  color: "primary.main",
                                },
                                {
                                  label: "Chuỗi thắng cao nhất",
                                  value: metric.highest_win_streak || 0,
                                  icon: (
                                    <StreakIcon
                                      sx={{
                                        color: theme.palette.secondary.main,
                                      }}
                                    />
                                  ),
                                  color: "secondary.main",
                                },
                              ].map((item, idx) => (
                                <ListItem
                                  key={idx}
                                  divider={idx < 8}
                                  sx={{
                                    py: 2,
                                    px: 3,
                                    transition: "background-color 0.2s",
                                    "&:hover": {
                                      backgroundColor:
                                        theme.palette.action.hover,
                                    },
                                  }}
                                >
                                  <ListItemIcon>{item.icon}</ListItemIcon>
                                  <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                      variant: "subtitle1",
                                      fontWeight: 600,
                                    }}
                                  />
                                  <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{ color: item.color }}
                                  >
                                    {item.value}
                                  </Typography>
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        </SubTabPanel>
                        <SubTabPanel value={subTabValue} index={1}>
                          {isLoadingStatistic ? (
                            <Skeleton variant="rectangular" height={300} />
                          ) : (
                            <CourseTable courses={statistic?.courses || []} />
                          )}
                        </SubTabPanel>
                      </TabPanel>
                    ))}
                  </>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Chưa có thống kê cho người dùng này.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <AccountModalForm
        open={isOpenModal}
        data={detail}
        onClose={handleCloseModal}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default UserProfilePage;
