// src/pages/CourseDetailPage.tsx
import React, { Fragment, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Tab,
  Tabs,
  styled,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Rating,
  IconButton,
  useTheme,
  LinearProgress,
  Collapse,
} from "@mui/material";
import {
  PlayCircleOutline as PlayCircleOutlineIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Download as DownloadIcon,
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Language as LanguageIcon,
  Bookmark as BookmarkIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

import { useCourseOverview } from "@hooks/data/useCourseOverview";
import { formatToMB } from "@utils/file";
import { formatDateToVietnamese } from "@utils/date";
import { useNavigate } from "react-router-dom";
import { Lesson } from "@interfaces/api/lesson";
import { VideoPlayer } from "@components/ui/atoms/Video";
import { CourseReviews } from "@components/ui/atoms/CourseReviews";

//#region  Styled components
const PageHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4, 0),
  marginBottom: theme.spacing(4),
}));

const CourseImage = styled(CardMedia)(({ theme }) => ({
  height: 300,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

interface LessonItemProps {
  completed?: boolean;
  current?: boolean;
}

const LessonItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "completed" && prop !== "current",
})<LessonItemProps>(({ theme, completed, current }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  ...(completed && {
    backgroundColor: "rgba(44, 120, 101, 0.08)",
  }),
  ...(current && {
    backgroundColor: "rgba(4, 71, 14, 0.2)",
    border: `1px solid ${theme.palette.primary.light}`,
  }),
}));

// **Thêm styled component cho module header**
const ModuleHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

//#endregion

// Main Course Detail component
const CourseOverviewPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState<number>(0);

  // **Thêm state để quản lý expanded modules**
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // **Thêm function để toggle expand/collapse module**
  const toggleModuleExpanded = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const navigate = useNavigate();

  const {
    course,
    isJoinedCourse,
    handleJoinCourse,
    inCompleteLessons,
    completedLearningProgresses,
    allLessons,
    bookmarked,
    toggleBookmark,
  } = useCourseOverview();

  const handleBack = () => {
    navigate(-1);
  };

  const getLessonItem = (lesson: Lesson) => {
    const isCompleted = completedLearningProgresses.some(
      (progress) => progress.lesson_id === lesson.id
    );

    return (
      <LessonItem
        key={lesson.id}
        completed={isCompleted}
        current={false}
        sx={{ px: 2 }}
      >
        <ListItemIcon>
          {isCompleted ? (
            <CheckCircleIcon color="success" />
          ) : isJoinedCourse ? (
            <LockIcon color="action" />
          ) : (
            <PlayCircleOutlineIcon
              color={isJoinedCourse ? "primary" : "action"}
            />
          )}
        </ListItemIcon>

        <ListItemText
          primary={lesson.title}
          secondary={`${lesson.duration} phút`}
          primaryTypographyProps={{
            variant: "body2",
            fontWeight: 600,
            color: isJoinedCourse ? "text.disabled" : "text.primary",
          }}
          secondaryTypographyProps={{
            variant: "caption",
            color: isJoinedCourse ? "text.disabled" : "text.secondary",
          }}
        />
      </LessonItem>
    );
  };

  return (
    <Box sx={{ px: 3 }}>
      {/* Header */}
      <PageHeader sx={{ pt: 0, pb: 0 }}>
        <Container maxWidth="xl" sx={{ py: 0 }}>
          <Button
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2, fontSize: "1.1rem" }}
          >
            Quay lại danh sách khóa học
          </Button>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {course?.title}
              </Typography>

              <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
                <Chip
                  label={course?.category?.name}
                  color="primary"
                  size="small"
                  sx={{ mr: 2, mb: 1 }}
                />

                <Box display="flex" alignItems="center" mr={3} mb={1}>
                  <Rating value={5} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    ({5}) • {20} đánh giá
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mr={3} mb={1}>
                  <AccessTimeIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {course?.duration_in_hours} phút
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </PageHeader>

      {/* Main Content */}
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 8 }}>
            <CourseImage
              image={course?.thumbnail_image}
              title={course?.title}
              sx={{ objectFit: "contain", backgroundSize: "contain" }}
            />

            <Box mt={4}>
              <StyledTabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Tổng quan" />
                <Tab label="Giới thiệu" />
                <Tab label="Nội dung" />
                <Tab label="Tài liệu" />
                <Tab label="Đánh giá" />
              </StyledTabs>

              {/* Tab Content */}
              <Box sx={{ py: 0 }}>
                {tabValue === 0 && (
                  <Box>
                    <SectionTitle variant="h6">Mô tả khóa học</SectionTitle>
                    <Typography variant="body1" paragraph>
                      {course?.description}
                    </Typography>
                  </Box>
                )}
                {tabValue === 1 && (
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <VideoPlayer
                        videoUrl={course?.introduction_video || ""}
                        title={course?.title || ""}
                      />
                    </Box>
                  </Box>
                )}
                {tabValue === 2 && (
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        Nội dung khóa học
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course?.modules?.reduce(
                          (acc, module) => acc + module.lessons.length,
                          0
                        )}{" "}
                        bài học • {course?.duration_in_hours} phút
                      </Typography>
                    </Box>
                    <Box>
                      {course?.modules?.map((module, index) => {
                        const isExpanded = expandedModules[module.id] || false;

                        return (
                          <Card
                            key={module.id}
                            sx={{
                              mb: 2,
                              borderRadius: "15px",
                              boxShadow: theme.shadows[1],
                            }}
                          >
                            <CardContent sx={{ p: 0 }}>
                              {/* **Module Header với click để expand/collapse** */}
                              <ModuleHeader
                                onClick={() => toggleModuleExpanded(module.id)}
                              >
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                  >
                                    Module {index + 1}: {module.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {module.lessons.length} bài học •{" "}
                                    {module.lessons.reduce((acc, lesson) => {
                                      const min = lesson.duration;
                                      return acc + min;
                                    }, 0)}{" "}
                                    phút
                                  </Typography>
                                </Box>

                                {/* **Icon để hiển thị trạng thái expand/collapse** */}
                                <IconButton size="small">
                                  {isExpanded ? (
                                    <ExpandLessIcon />
                                  ) : (
                                    <ExpandMoreIcon />
                                  )}
                                </IconButton>
                              </ModuleHeader>

                              {/* **Wrap lessons trong Collapse component** */}
                              <Collapse
                                in={isExpanded}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List>
                                  {module.lessons.map((lesson) => (
                                    <Fragment key={lesson.id}>
                                      {getLessonItem(lesson)}
                                    </Fragment>
                                  ))}
                                </List>
                              </Collapse>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Box>
                  </Box>
                )}
                {tabValue === 3 && (
                  <Box>
                    <SectionTitle variant="h6">Tài liệu khóa học</SectionTitle>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Các tài liệu bổ sung cho khóa học
                    </Typography>

                    <List>
                      {course?.learning_materials &&
                        course.learning_materials.map((material, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: theme.shape.borderRadius,
                              mb: 2,
                            }}
                          >
                            <ListItemIcon>
                              <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={material.name}
                              secondary={`${material.type.toUpperCase()} • ${formatToMB(
                                material.size
                              )} • Cập nhật ${formatDateToVietnamese(
                                material.created_date
                              )}`}
                            />

                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() =>
                                  window.open(material.url, "_blank")
                                }
                              >
                                <DownloadIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                    </List>
                  </Box>
                )}
                {tabValue === 4 && (
                  <CourseReviews courseId={course?.id || ""} />
                )}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            {/* Course Progress */}
            <Card sx={{ borderRadius: "10px", mb: 4 }}>
              <CardContent sx={{ py: 1 }}>
                {isJoinedCourse && (
                  <>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                      Tiến độ của bạn
                    </Typography>

                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Hoàn thành</Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {allLessons.length > 0
                            ? Math.round(
                                (completedLearningProgresses.length /
                                  allLessons.length) *
                                  100
                              )
                            : 0}
                          %
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={
                          allLessons.length > 0
                            ? Math.round(
                                (completedLearningProgresses.length /
                                  allLessons.length) *
                                  100
                              )
                            : 0
                        }
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Bài học đã hoàn thành
                        </Typography>
                        <Typography variant="h6">
                          {completedLearningProgresses.length}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Tổng số bài học
                        </Typography>
                        <Typography variant="h6">
                          {allLessons.length}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Thời gian còn lại
                        </Typography>
                        <Typography variant="h6">
                          {inCompleteLessons && inCompleteLessons.length > 0
                            ? `${inCompleteLessons.reduce(
                                (acc, lesson) => acc + lesson.duration,
                                0
                              )} phút`
                            : "0 phút"}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    isJoinedCourse ? <PlayCircleOutlineIcon /> : <PeopleIcon />
                  }
                  onClick={handleJoinCourse}
                  fullWidth
                  sx={{ mb: 2, mt: isJoinedCourse ? 0 : 2 }}
                >
                  {!inCompleteLessons.length
                    ? "Đã hoàn thành"
                    : isJoinedCourse
                    ? "Tiếp tục học"
                    : "Tham gia khóa học"}
                </Button>

                {course && (
                  <Box display="flex" justifyContent="space-between">
                    <Button
                      startIcon={<BookmarkIcon />}
                      variant="outlined"
                      sx={{ width: "100%" }}
                      onClick={() => toggleBookmark(course.id)}
                    >
                      {bookmarked.includes(course.id) ? "Đã lưu" : "Lưu"}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card sx={{ borderRadius: "10px" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Thông tin khóa học
                </Typography>

                <List disablePadding>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AccessTimeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Thời lượng"
                      secondary={`${course?.duration_in_hours} phút`}
                      primaryTypographyProps={{ variant: "body2" }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                      }}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AssignmentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Số bài học"
                      secondary={course?.modules?.reduce(
                        (acc, module) => acc + module.lessons.length,
                        0
                      )}
                      primaryTypographyProps={{ variant: "body2" }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                      }}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LanguageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Ngôn ngữ"
                      secondary="Tiếng Việt"
                      primaryTypographyProps={{ variant: "body2" }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseOverviewPage;
