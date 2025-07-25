// src/pages/DashboardPage.tsx
import React from "react";
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
  styled,
  Divider,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

// Import các component đã tạo
import DashboardCard from "@components/ui/atoms/DashboardCard";
import CourseCard from "@components/ui/atoms/CourseCard";
import TaskManagement from "@components/ui/atoms/TaskManagement";
import LearningProgress from "@components/ui/atoms/LearningProgress";
import { useHomePage } from "@hooks/data/useHomePage";
import { getTimeOfDay } from "@utils/timeUtils";
import { COMPLETED, ENROLLED, SAVED } from "@constants/course";

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

  const {
    courses,
    isLoadingCourses,
    userMetric,
    profile,
    getStats,
    handleClassify,
    classify,
    progresses,
    progressClassify,
    handleClassifyProgress,
    handleViewAllCourses,
  } = useHomePage();
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
          >
            Khám phá khóa học
          </Button>
        </Box>
      </Box>

      {/* Welcome Card */}
      <WelcomeCard sx={{ mb: 4 }}>
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Chào {getTimeOfDay()}, {profile?.user.full_name}!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                Bạn đã hoàn thành{" "}
                {userMetric ? userMetric.course_completed_num : 0} khóa học
                trong quý này. Tiếp tục cố gắng nhé!
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
        {getStats.map((stat, index) => (
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
              <Button
                sx={{ fontSize: "1.1rem" }}
                color="primary"
                onClick={handleViewAllCourses}
              >
                Xem tất cả
              </Button>
            </Box>
            <StyledTabs
              value={classify}
              onChange={(e, value) => handleClassify(value)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value={ENROLLED} label="Đã tham gia" />
              <Tab value={COMPLETED} label="Đã hoàn thành" />
              <Tab value={SAVED} label="Đã lưu" />
            </StyledTabs>

            <Grid container spacing={3}>
              {isLoadingCourses ? (
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
              ) : courses && courses.length > 0 ? (
                courses.map((course) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                    <CourseCard
                      course={course}
                      isShowBtn={true}
                      isJoined={
                        course.course_participations &&
                        course.course_participations?.length > 0
                      }
                      isCompleted={
                        course.course_participations &&
                        course.course_participations?.length > 0 &&
                        course.course_participations[0].status === "COMPLETED"
                      }
                    />
                  </Grid>
                ))
              ) : (
                <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {classify === ENROLLED
                      ? "Bạn chưa tham gia khóa học nào."
                      : classify === COMPLETED
                      ? "Bạn chưa hoàn thành khóa học nào."
                      : "Bạn chưa lưu khóa học nào."}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Box>

          {/* Task Management */}
          <Box>
            <TaskManagement
              tasks={progresses}
              progressClassify={progressClassify}
              handleClassifyProgress={handleClassifyProgress}
            />
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
