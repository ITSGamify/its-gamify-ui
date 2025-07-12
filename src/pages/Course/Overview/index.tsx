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
  Avatar,
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
} from "@mui/icons-material";
import { TextField, InputAdornment, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
// import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
// import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
// import ReplyIcon from "@mui/icons-material/Reply";

// // Import các component đã tạo
// import LearningProgress from "@components/ui/atoms/LearningProgress";

import { useCourseOverview } from "@hooks/data/useCourseOverview";
import { formatToMB } from "@utils/file";
import { formatDateToVietnamese } from "@utils/date";
import { useNavigate } from "react-router-dom";
import { Lesson } from "@interfaces/api/lesson";
// import { Lesson } from "@interfaces/api/lesson";

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

//#endregion

// Main Course Detail component
const CourseOverviewPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState<number>(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const navigate = useNavigate();

  const {
    course,
    isJoinedCourse,
    handleJoinCourse,
    inCompleteLessons,
    completedLearningProgresses,
    allLessons,
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
          secondary={lesson.duration}
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
                  <PeopleIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {50} học viên
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mr={3} mb={1}>
                  <AccessTimeIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {course?.duration_in_hours}
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
                      <Typography variant="subtitle1" fontWeight={600}>
                        Nội dung khóa học
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course?.modules?.reduce(
                          (acc, module) => acc + module.lessons.length,
                          0
                        )}{" "}
                        bài học • {course?.duration_in_hours}
                      </Typography>
                    </Box>

                    <Box>
                      {course?.modules?.map((module, index) => (
                        <Card
                          key={module.id}
                          sx={{
                            mb: 2,
                            borderRadius: "15px",
                            boxShadow: theme.shadows[1],
                          }}
                        >
                          <CardContent sx={{ p: 0 }}>
                            <Box
                              sx={{
                                p: 2,
                                backgroundColor:
                                  theme.palette.background.default,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight={600}>
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

                            <List>
                              {module.lessons.map((lesson) => (
                                <Fragment key={lesson.id}>
                                  {getLessonItem(lesson)}
                                </Fragment>
                              ))}
                            </List>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
                {tabValue === 2 && (
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
                            // button
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
                              // secondary="PDF • 2.5 MB • Cập nhật 05/2025"
                              secondary={`${material.type.toUpperCase()} • ${formatToMB(
                                material.size
                              )} • Cập nhật ${formatDateToVietnamese(
                                material.created_date
                              )}`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton edge="end">
                                <DownloadIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                    </List>
                  </Box>
                )}
                {tabValue === 3 && (
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Box>
                        <SectionTitle variant="h6">
                          Đánh giá từ học viên
                        </SectionTitle>
                        <Typography variant="body2" color="text.secondary">
                          {10} đánh giá • Xếp hạng trung bình {5}/5
                        </Typography>
                      </Box>

                      {/* <Button variant="outlined">Viết đánh giá</Button> */}
                    </Box>
                    {/* Rating distribution */}
                    <Card
                      sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: "15px",
                        boxShadow: theme.shadows[1],
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Box textAlign="center">
                            <Typography
                              variant="h2"
                              color="primary.main"
                              fontWeight={700}
                            >
                              {5}
                            </Typography>
                            <Rating
                              value={5}
                              precision={0.1}
                              readOnly
                              size="large"
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mt={1}
                            >
                              {10} đánh giá
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 8 }}>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <Box
                              key={rating}
                              display="flex"
                              alignItems="center"
                              mb={1}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ width: 15 }}
                              >
                                {rating}
                              </Typography>
                              <Box sx={{ mx: 1 }}>
                                <Rating value={rating} readOnly size="small" />
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  rating === 5
                                    ? 75
                                    : rating === 4
                                    ? 20
                                    : rating === 3
                                    ? 5
                                    : 0
                                }
                                sx={{
                                  height: 8,
                                  borderRadius: 1,
                                  width: "100%",
                                  backgroundColor:
                                    theme.palette.background.default,
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor:
                                      rating >= 4
                                        ? theme.palette.success.main
                                        : rating >= 3
                                        ? theme.palette.warning.main
                                        : theme.palette.error.main,
                                  },
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 1, width: 30 }}
                              >
                                {rating === 5
                                  ? "75%"
                                  : rating === 4
                                  ? "20%"
                                  : rating === 3
                                  ? "5%"
                                  : "0%"}
                              </Typography>
                            </Box>
                          ))}
                        </Grid>
                      </Grid>
                    </Card>
                    {/* Comment input */}
                    <Paper
                      sx={{
                        p: 2,
                        mb: 4,
                        borderRadius: "15px",
                        boxShadow: theme.shadows[1],
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        Đánh giá của bạn
                      </Typography>

                      {/* Thêm phần đánh giá số sao */}
                      <Box display="flex" alignItems="center" mb={2}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mr={2}
                        >
                          Xếp hạng:
                        </Typography>
                        <Rating defaultValue={5} precision={1} size="large" />
                      </Box>

                      <Box display="flex" alignItems="flex-start">
                        <Avatar
                          src="/avatars/avatar.jpg"
                          alt="Your Avatar"
                          sx={{ mr: 2 }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Viết bình luận của bạn..."
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton color="primary">
                                  <SendIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Paper>

                    {/* Sample reviews section (move this after comments) */}
                    <Box mt={4}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Đánh giá gần đây
                      </Typography>

                      {[1, 2, 3].map((review) => (
                        <Box
                          key={review}
                          sx={{
                            mb: 3,
                            pb: 3,
                            borderBottom:
                              review < 3
                                ? `1px solid ${theme.palette.divider}`
                                : "none",
                          }}
                        >
                          <Box display="flex" mb={1}>
                            <Avatar
                              src={`/avatars/student${review + 3}.jpg`}
                              alt={`Học viên ${review + 3}`}
                              sx={{ mr: 2 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">
                                Học viên {review + 3}
                              </Typography>
                              <Box display="flex" alignItems="center">
                                <Rating
                                  value={
                                    review === 1 ? 5 : review === 2 ? 4 : 5
                                  }
                                  readOnly
                                  size="small"
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  ml={1}
                                >
                                  {review === 1
                                    ? "2 tháng trước"
                                    : review === 2
                                    ? "3 tuần trước"
                                    : "1 tuần trước"}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Typography variant="body2" paragraph>
                            {review === 1
                              ? "Khóa học rất hay và chi tiết. Giảng viên giải thích dễ hiểu và có nhiều ví dụ thực tế. Tôi đã học được rất nhiều kỹ năng mới từ khóa học này và đã áp dụng vào công việc của mình. Rất đáng giá!"
                              : review === 2
                              ? "Nội dung khóa học khá tốt, tuy nhiên có một số phần hơi nhanh và khó theo dõi. Mong rằng sẽ có thêm bài tập thực hành để củng cố kiến thức."
                              : "Tuyệt vời! Đây là một trong những khóa học hay nhất về Figma mà tôi từng học. Cảm ơn giảng viên đã chia sẻ nhiều mẹo và thủ thuật hữu ích."}
                          </Typography>
                        </Box>
                      ))}

                      <Button variant="outlined" color="primary" fullWidth>
                        Xem thêm bình luận
                      </Button>
                    </Box>
                  </Box>
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
                              )}h`
                            : "0h"}
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
                  {isJoinedCourse ? "Tiếp tục học" : "Tham gia khóa học"}
                </Button>

                <Box display="flex" justifyContent="space-between">
                  <Button
                    startIcon={<BookmarkIcon />}
                    variant="outlined"
                    sx={{ width: "100%" }}
                  >
                    Lưu
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Current Lesson */}
            {inCompleteLessons && inCompleteLessons.length > 0 && (
              <Card sx={{ borderRadius: "10px", mb: 4 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Bài học hiện tại
                  </Typography>

                  <Box key={inCompleteLessons[0]?.id}>
                    <Typography variant="subtitle1" gutterBottom>
                      {inCompleteLessons[0]?.title}
                    </Typography>

                    <Box display="flex" alignItems="center" mb={2}>
                      <AccessTimeIcon
                        fontSize="small"
                        color="action"
                        sx={{ mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {inCompleteLessons[0]?.duration}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayCircleOutlineIcon />}
                      fullWidth
                      onClick={handleJoinCourse}
                    >
                      Tiếp tục bài học
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

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
                      secondary={course?.duration_in_hours}
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

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PeopleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Học viên"
                      secondary={10}
                      primaryTypographyProps={{ variant: "body2" }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                      }}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AccessTimeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cập nhật lần cuối"
                      secondary={"05/2025"}
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
