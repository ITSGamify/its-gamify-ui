// src/pages/DashboardPage.tsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Tab,
  Tabs,
  // Avatar,
  styled,
  Divider,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  // Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  // People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

// Import các component đã tạo
import DashboardCard from "@components/ui/atoms/DashboardCard";
import CourseCard from "@components/ui/atoms/CourseCard";
import TaskManagement from "@components/ui/atoms/TaskManagement";
import LearningProgress from "@components/ui/atoms/LearningProgress";
import { DashboardCardProps } from "@interfaces/shared/home";
import { useHomePage } from "@hooks/data/useHomePage";

// Styled components
const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
}));

const WelcomeCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundImage: "linear-gradient(to right, #2C7865, #3a9d85)",
  color: theme.palette.common.white,
  overflow: "hidden",
  position: "relative",
  "&::after": {
    // src/pages/DashboardPage.tsx (tiếp tục)
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "40%",
    height: "100%",
    backgroundImage: "url(/images/welcome-pattern.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.2,
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
  },
}));

// Main Dashboard component
const HomePage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState<number>(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Dữ liệu mẫu
  const stats: DashboardCardProps[] = [
    {
      title: "Khóa học đang học",
      value: "5",
      icon: <SchoolIcon />,
      color: "primary",
      progress: 68,
      subtitle: "+2 khóa mới trong tuần",
    },
    {
      title: "Công việc đang thực hiện",
      value: "12",
      icon: <AssignmentIcon />,
      color: "warning",
      progress: 45,
      subtitle: "4 công việc sắp đến hạn",
    },
    {
      title: "Thời gian học tập",
      value: "24h",
      icon: <AccessTimeIcon />,
      color: "info",
      progress: 75,
      subtitle: "+5h so với tuần trước",
    },
    {
      title: "Chứng chỉ đạt được",
      value: "3",
      icon: <CheckCircleIcon />,
      color: "success",
      subtitle: "1 chứng chỉ mới trong tháng",
    },
  ];

  interface UpcomingDeadline {
    id: number;
    title: string;
    course: string;
    dueDate: string;
    status: "urgent" | "normal";
  }

  const upcomingDeadlines: UpcomingDeadline[] = [
    {
      id: 1,
      title: "Nộp bài tập UI Design",
      course: "Thiết kế UI/UX với Figma",
      dueDate: "10/06/2025",
      status: "urgent",
    },
    {
      id: 2,
      title: "Hoàn thành project cuối khóa",
      course: "React JS - Từ cơ bản đến thành thạo",
      dueDate: "15/06/2025",
      status: "normal",
    },
    {
      id: 3,
      title: "Bài kiểm tra giữa kỳ",
      course: "Quản lý dự án chuyên nghiệp",
      dueDate: "18/06/2025",
      status: "normal",
    },
  ];

  const { participations, isLoadingParticipation } = useHomePage();
  return (
    <Container maxWidth="xl" sx={{ pt: 0, pb: 3, px: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <PageTitle variant="h2">Khóa học của tôi</PageTitle>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SchoolIcon />}
            sx={{ mr: 2 }}
          >
            Khám phá khóa học
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AssignmentIcon />}
          >
            Tạo công việc mới
          </Button>
        </Box>
      </Box>

      {/* Welcome Card */}
      <WelcomeCard sx={{ mb: 4 }}>
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Chào buổi sáng, AbcXyz!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                Bạn đã hoàn thành 65% mục tiêu học tập trong tuần này. Tiếp tục
                cố gắng nhé!
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: theme.palette.grey[100],
                  },
                }}
              >
                Tiếp tục học tập
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </WelcomeCard>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <DashboardCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              progress={stat.progress}
              subtitle={stat.subtitle}
            />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box mb={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h4" fontWeight={600}>
                Khóa học của bạn
              </Typography>
              <Button sx={{ fontSize: "1.1rem" }} color="primary">
                Xem tất cả
              </Button>
            </Box>
            <StyledTabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Đang học" />
              <Tab label="Hoàn thành" />
              <Tab label="Đã lưu" />
            </StyledTabs>

            <Grid container spacing={3}>
              {isLoadingParticipation ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    py: 4,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : participations && participations.length > 0 ? (
                participations.map((participation) => (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 4 }}
                    key={participation.course.id}
                  >
                    <CourseCard
                      course={participation.course}
                      isShowBtn={true}
                      isJoined={true}
                    />
                  </Grid>
                ))
              ) : (
                <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Bạn chưa tham gia khóa học nào
                  </Typography>
                </Box>
              )}
            </Grid>
          </Box>

          {/* Task Management */}
          <Box>
            <TaskManagement />
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Learning Progress */}
          <Box mb={4}>
            <LearningProgress />
          </Box>

          {/* Upcoming Deadlines */}
          <Card sx={{ borderRadius: "15px", mb: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Sắp đến hạn
              </Typography>

              <Box>
                {upcomingDeadlines.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <Box
                      sx={{
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor:
                            item.status === "urgent"
                              ? theme.palette.error.light
                              : theme.palette.warning.light,
                          color:
                            item.status === "urgent"
                              ? theme.palette.error.main
                              : theme.palette.warning.main,
                          mr: 2,
                        }}
                      >
                        {item.status === "urgent" ? (
                          <WarningIcon />
                        ) : (
                          <AccessTimeIcon />
                        )}
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2">
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.course}
                        </Typography>
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color:
                            item.status === "urgent"
                              ? theme.palette.error.main
                              : theme.palette.text.secondary,
                        }}
                      >
                        {item.dueDate}
                      </Typography>
                    </Box>
                    {index < upcomingDeadlines.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>

              <Button
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
              >
                Xem tất cả
              </Button>
            </CardContent>
          </Card>

          {/* Learning Statistics */}
          <Card sx={{ borderRadius: "15px" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Thống kê học tập
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 6 }}>
                  <Card
                    sx={{
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Giờ học tập
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <AccessTimeIcon sx={{ mr: 1 }} />
                        <Typography variant="h5">24h</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Card
                    sx={{
                      bgcolor: theme.palette.success.light,
                      color: theme.palette.success.contrastText,
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Hoàn thành
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <CheckCircleIcon sx={{ mr: 1 }} />
                        <Typography variant="h5">12</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Card sx={{ bgcolor: theme.palette.background.paper, mb: 2 }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tiến độ tuần này
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUpIcon
                      sx={{ mr: 1, color: theme.palette.success.main }}
                    />
                    <Typography variant="h5" color="success.main">
                      +15%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Button fullWidth variant="text" color="primary">
                Xem báo cáo chi tiết
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
