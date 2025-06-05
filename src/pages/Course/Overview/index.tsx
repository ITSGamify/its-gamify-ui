// src/pages/CourseDetailPage.tsx
import React, { useState } from "react";
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
  Divider,
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
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { TextField, InputAdornment, Paper, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ReplyIcon from "@mui/icons-material/Reply";

// Import các component đã tạo
import LearningProgress from "@components/ui/atoms/LearningProgress";
import {
  ModuleType,
  LessonType,
  InstructorType,
} from "@interfaces/shared/home";

// Styled components
const PageHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4, 0),
  marginBottom: theme.spacing(4),
}));

const CourseImage = styled(CardMedia)(({ theme }) => ({
  height: 240,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[8],
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

// Main Course Detail component
const CourseOverviewPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState<number>(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Dữ liệu mẫu
  interface CourseType {
    id: number;
    title: string;
    image: string;
    category: string;
    rating: number;
    reviews: number;
    students: number;
    duration: string;
    language: string;
    lastUpdate: string;
    progress: number;
    description: string;
    instructor: InstructorType;
    modules: ModuleType[];
  }

  const course: CourseType = {
    id: 1,
    title: "Thiết kế UI/UX với Figma",
    image:
      "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
    category: "Design",
    rating: 4.8,
    reviews: 245,
    students: 1240,
    duration: "12 giờ",
    language: "Tiếng Việt",
    lastUpdate: "05/2025",
    progress: 65,
    description: `Khóa học này sẽ giúp bạn nắm vững các kỹ năng thiết kế giao diện người dùng chuyên nghiệp với Figma. Từ các nguyên tắc cơ bản của UI/UX đến các kỹ thuật thiết kế nâng cao, bạn sẽ học cách tạo ra các giao diện đẹp mắt, thân thiện với người dùng và đáp ứng các tiêu chuẩn hiện đại.

    Nội dung khóa học bao gồm các nguyên tắc thiết kế, làm việc với màu sắc và typography, tạo prototype tương tác, thiết kế responsive, và nhiều chủ đề khác. Bạn sẽ hoàn thành một dự án thực tế từ đầu đến cuối, từ wireframing đến thiết kế chi tiết và prototype hoạt động đầy đủ.`,
    instructor: {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/avatars/instructor1.jpg",
      role: "Senior UI/UX Designer",
      bio: "Nguyễn Văn A là một nhà thiết kế UI/UX với hơn 8 năm kinh nghiệm làm việc với các công ty công nghệ hàng đầu. Anh đã tham gia thiết kế cho nhiều sản phẩm được hàng triệu người sử dụng và có niềm đam mê chia sẻ kiến thức với cộng đồng.",
      courses: 12,
      students: 5400,
      rating: 4.9,
    },
    modules: [
      {
        id: 1,
        title: "Giới thiệu về UI/UX và Figma",
        lessons: [
          {
            id: 1,
            title: "Giới thiệu về khóa học",
            duration: "10 phút",
            completed: true,
            hasAttachment: true,
          },
          {
            id: 2,
            title: "Nguyên tắc cơ bản của UI/UX",
            duration: "25 phút",
            completed: true,
            hasAttachment: true,
          },
          {
            id: 3,
            title: "Làm quen với Figma",
            duration: "30 phút",
            completed: true,
            hasAttachment: true,
          },
        ],
      },
      {
        id: 2,
        title: "Các công cụ cơ bản trong Figma",
        lessons: [
          {
            id: 4,
            title: "Làm việc với Frames và Layers",
            duration: "20 phút",
            completed: true,
            hasAttachment: true,
          },
          {
            id: 5,
            title: "Sử dụng Shapes và Tools",
            duration: "25 phút",
            completed: true,
            hasAttachment: false,
          },
          {
            id: 6,
            title: "Làm việc với Text và Typography",
            duration: "15 phút",
            completed: false,
            current: true,
            hasAttachment: true,
          },
          {
            id: 7,
            title: "Màu sắc và Styles",
            duration: "20 phút",
            completed: false,
            hasAttachment: false,
          },
        ],
      },
      {
        id: 3,
        title: "Thiết kế Prototype",
        lessons: [
          {
            id: 8,
            title: "Tạo Wireframes",
            duration: "30 phút",
            completed: false,
            locked: false,
            hasAttachment: false,
          },
          {
            id: 9,
            title: "Thiết kế UI chi tiết",
            duration: "45 phút",
            completed: false,
            locked: true,
            hasAttachment: false,
          },
          {
            id: 10,
            title: "Tạo Prototype tương tác",
            duration: "35 phút",
            completed: false,
            locked: true,
            hasAttachment: false,
          },
        ],
      },
      {
        id: 4,
        title: "Components và Design Systems",
        lessons: [
          {
            id: 11,
            title: "Tạo và sử dụng Components",
            duration: "25 phút",
            completed: false,
            locked: true,
            hasAttachment: false,
          },
          {
            id: 12,
            title: "Xây dựng Design System",
            duration: "40 phút",
            completed: false,
            locked: true,
            hasAttachment: false,
          },
          {
            id: 13,
            title: "Auto Layout và Constraints",
            duration: "35 phút",
            completed: false,
            locked: true,
            hasAttachment: false,
          },
        ],
      },
    ],
  };

  return (
    <Box>
      {/* Header */}
      <PageHeader sx={{ pt: 0, pb: 0 }}>
        <Container maxWidth="xl" sx={{ py: 0 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2, fontSize: "1.1rem" }}
          >
            Quay lại danh sách khóa học
          </Button>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {course.title}
              </Typography>

              <Box display="flex" alignItems="center" flexWrap="wrap" mb={2}>
                <Chip
                  label={course.category}
                  color="primary"
                  size="small"
                  sx={{ mr: 2, mb: 1 }}
                />

                <Box display="flex" alignItems="center" mr={3} mb={1}>
                  <Rating
                    value={course.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    ({course.rating}) • {course.reviews} đánh giá
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mr={3} mb={1}>
                  <PeopleIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {course.students} học viên
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mr={3} mb={1}>
                  <AccessTimeIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {course.duration}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <LanguageIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {course.language}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center">
                <Avatar
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2">
                  Giảng viên: <strong>{course.instructor.name}</strong>
                </Typography>
              </Box>
            </Grid>

            {/* <Grid
              size={{ xs: 12, md: 4 }}
              display="flex"
              alignItems="center"
              // justifyContent="flex-end"
              justifyContent="flex-end"
            >
              <Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary" mr={1}>
                    Tiến độ hoàn thành:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="primary.main"
                  >
                    {course.progress}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={course.progress}
                  sx={{ height: 8, borderRadius: 4, mb: 2, width: 200 }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayCircleOutlineIcon />}
                  fullWidth
                >
                  Tiếp tục học
                </Button>
              </Box>
            </Grid> */}
          </Grid>
        </Container>
      </PageHeader>

      {/* Main Content */}
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 8 }}>
            <CourseImage image={course.image} title={course.title} />

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
              <Box sx={{ py: 2 }}>
                {tabValue === 0 && (
                  <Box>
                    <SectionTitle variant="h6">Mô tả khóa học</SectionTitle>
                    <Typography variant="body1" paragraph>
                      {course.description}
                    </Typography>

                    <Divider sx={{ my: 4 }} />

                    <SectionTitle variant="h6">
                      Thông tin giảng viên
                    </SectionTitle>
                    <Box display="flex" mb={3}>
                      <Avatar
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {course.instructor.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {course.instructor.role}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box display="flex" alignItems="center">
                            <Rating
                              value={course.instructor.rating}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              ml={0.5}
                            >
                              ({course.instructor.rating})
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {course.instructor.courses} khóa học
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {course.instructor.students} học viên
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2" paragraph>
                      {course.instructor.bio}
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
                        {course.modules.reduce(
                          (acc, module) => acc + module.lessons.length,
                          0
                        )}{" "}
                        bài học • {course.duration}
                      </Typography>
                    </Box>

                    <Box>
                      {course.modules.map((module, index) => (
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
                                  const [min] = lesson.duration.split(" ");
                                  return acc + parseInt(min);
                                }, 0)}{" "}
                                phút
                              </Typography>
                            </Box>

                            <List>
                              {module.lessons.map((lesson) => (
                                <LessonItem
                                  key={lesson.id}
                                  //   button
                                  completed={lesson.completed}
                                  current={lesson.current}
                                  //   disabled={lesson.locked}
                                  sx={{ px: 2 }}
                                >
                                  <ListItemIcon>
                                    {lesson.completed ? (
                                      <CheckCircleIcon color="success" />
                                    ) : lesson.locked ? (
                                      <LockIcon color="action" />
                                    ) : (
                                      <PlayCircleOutlineIcon
                                        color={
                                          lesson.current ? "primary" : "action"
                                        }
                                      />
                                    )}
                                  </ListItemIcon>

                                  <ListItemText
                                    primary={lesson.title}
                                    secondary={lesson.duration}
                                    primaryTypographyProps={{
                                      variant: "body2",
                                      fontWeight: lesson.current ? 600 : 400,
                                      color: lesson.locked
                                        ? "text.disabled"
                                        : "text.primary",
                                    }}
                                    secondaryTypographyProps={{
                                      variant: "caption",
                                      color: lesson.locked
                                        ? "text.disabled"
                                        : "text.secondary",
                                    }}
                                  />

                                  <ListItemSecondaryAction>
                                    {lesson.hasAttachment && (
                                      <IconButton
                                        edge="end"
                                        size="small"
                                        disabled={lesson.locked}
                                      >
                                        <DownloadIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                  </ListItemSecondaryAction>
                                </LessonItem>
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
                      <ListItem
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
                          primary="Tài liệu hướng dẫn Figma.pdf"
                          secondary="PDF • 2.5 MB • Cập nhật 05/2025"
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <DownloadIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>

                      <ListItem
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
                          primary="UI Components Library.fig"
                          secondary="Figma File • 15 MB • Cập nhật 05/2025"
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <DownloadIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>

                      <ListItem
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
                          primary="Checklist thiết kế UI/UX.xlsx"
                          secondary="Excel • 1.2 MB • Cập nhật 04/2025"
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <DownloadIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
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
                          {course.reviews} đánh giá • Xếp hạng trung bình{" "}
                          {course.rating}/5
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
                              {course.rating}
                            </Typography>
                            <Rating
                              value={course.rating}
                              precision={0.1}
                              readOnly
                              size="large"
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mt={1}
                            >
                              {course.reviews} đánh giá
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
                      {course.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Bài học đã hoàn thành
                    </Typography>
                    <Typography variant="h6">
                      {course.modules.reduce(
                        (acc, module) =>
                          acc +
                          module.lessons.filter((lesson) => lesson.completed)
                            .length,
                        0
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tổng số bài học
                    </Typography>
                    <Typography variant="h6">
                      {course.modules.reduce(
                        (acc, module) => acc + module.lessons.length,
                        0
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Thời gian còn lại
                    </Typography>
                    <Typography variant="h6">4.5h</Typography>
                  </Box>
                </Box>

                {/* <Button variant="contained" color="primary" fullWidth>
                  Tiếp tục học
                </Button> */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayCircleOutlineIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Tiếp tục học
                </Button>

                <Box display="flex" justifyContent="space-between">
                  <Button
                    startIcon={<BookmarkIcon />}
                    variant="outlined"
                    sx={{ width: "calc(50% - 8px)" }}
                  >
                    Lưu
                  </Button>
                  <Button
                    startIcon={<ShareIcon />}
                    variant="outlined"
                    sx={{ width: "calc(50% - 8px)" }}
                  >
                    Chia sẻ
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Current Lesson */}
            <Card sx={{ borderRadius: "10px", mb: 4 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Bài học hiện tại
                </Typography>

                {course.modules
                  .map((module) =>
                    module.lessons.find((lesson) => lesson.current)
                  )
                  .filter(Boolean)
                  .map((currentLesson) => (
                    <Box key={currentLesson?.id}>
                      <Typography variant="subtitle1" gutterBottom>
                        {currentLesson?.title}
                      </Typography>

                      <Box display="flex" alignItems="center" mb={2}>
                        <AccessTimeIcon
                          fontSize="small"
                          color="action"
                          sx={{ mr: 0.5 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {currentLesson?.duration}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayCircleOutlineIcon />}
                        fullWidth
                      >
                        Tiếp tục bài học
                      </Button>
                    </Box>
                  ))}
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
                      secondary={course.duration}
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
                      secondary={course.modules.reduce(
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
                      secondary={course.language}
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
                      secondary={course.students}
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
                      secondary={course.lastUpdate}
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
