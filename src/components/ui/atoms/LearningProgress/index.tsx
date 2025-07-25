// src/components/LearningProgress.tsx
import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  styled,
  Divider,
  Fade,
  Skeleton,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { alpha, useTheme } from "@mui/material/styles";
import {
  useGetCourseDetail,
  useGetCourseParticipations,
  useGetCourses,
} from "@services/course";
import { Course } from "@interfaces/api/course";

const LearningProgress: React.FC = () => {
  const theme = useTheme();

  const getCoursesReq = {
    page: 0,
    limit: 1,
    classify: "ENROLLED",
  };

  const { data: courses, isFetching: isLoadingCourse } =
    useGetCourses(getCoursesReq);

  const course = courses?.data[0] as Course | undefined;
  const { data: courseDetail, isFetching: isLoadingCourseDetail } =
    useGetCourseDetail(course?.id || "");

  const { data: courseParticipationData, isFetching: isLoadingParticipation } =
    useGetCourseParticipations(course?.id || "");

  const courseParticipations = useMemo(
    () => courseParticipationData?.data || [],
    [courseParticipationData?.data]
  );

  const participation = useMemo(
    () => courseParticipations[0],
    [courseParticipations]
  );

  const learningProgresses = useMemo(
    () => participation?.learning_progresses || [],
    [participation]
  );

  // Flatten và sort modules/lessons (dựa trên code mới)
  const modules = useMemo(() => {
    return (
      courseDetail?.modules
        ?.sort((a, b) => a.ordered_number - b.ordered_number)
        .map((module) => ({
          ...module,
          lessons: module.lessons?.sort((a, b) => a.index - b.index),
        })) || []
    );
  }, [courseDetail?.modules]);

  const allLessons = useMemo(() => {
    return modules.flatMap((module) => module.lessons || []).filter(Boolean);
  }, [modules]);

  const completedLearningProgresses = useMemo(
    () =>
      learningProgresses.filter((progress) => progress.status === "COMPLETED"),
    [learningProgresses]
  );

  const completedLessonIds = useMemo(
    () => completedLearningProgresses.map((progress) => progress.lesson_id),
    [completedLearningProgresses]
  );

  const courseProgress = useMemo(() => {
    if (allLessons.length === 0) {
      return { progress: 0, lessons: [] };
    }

    const firstIncompleteIndex = allLessons.findIndex(
      (lesson) => !completedLessonIds.includes(lesson.id)
    );

    const lessonsWithProgress = allLessons.map((lesson, index) => {
      const completed = completedLessonIds.includes(lesson.id);
      const current =
        firstIncompleteIndex !== -1 && index === firstIncompleteIndex;
      const locked =
        firstIncompleteIndex !== -1 && index > firstIncompleteIndex;

      return {
        id: lesson.id,
        title: lesson.title,
        duration: `${lesson.duration} phút`,
        completed,
        current,
        locked,
      };
    });

    const completedCount = completedLearningProgresses.length;
    const progress =
      Math.round((completedCount / allLessons.length) * 100) || 0;

    return { progress, lessons: lessonsWithProgress };
  }, [allLessons, completedLessonIds, completedLearningProgresses.length]);

  const isLoading =
    isLoadingCourse || isLoadingParticipation || isLoadingCourseDetail;

  return (
    <StyledCard>
      <CardHeader
        sx={{ py: "1.2rem" }}
        title="Tiến độ học tập"
        titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
      />

      <CardContent sx={{ py: 0 }}>
        {isLoading ? (
          <Box>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={8}
              sx={{ my: 2 }}
            />
            <Skeleton variant="text" width="80%" height={20} />
            <Divider sx={{ my: 2 }} />
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={48}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        ) : !course ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={200}
            flexDirection="column"
            textAlign="center"
          >
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Không có khóa học đang tham gia
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hãy đăng ký một khóa học mới để bắt đầu!
            </Typography>
          </Box>
        ) : (
          <>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                {course.title || "Khóa học của bạn"}
              </Typography>

              <Box display="flex" alignItems="center" mb={1}>
                <Box flexGrow={1} mr={2}>
                  <LinearProgress
                    variant="determinate"
                    value={courseProgress.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(theme.palette.grey[500], 0.2),
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          courseProgress.progress >= 80
                            ? theme.palette.success.main
                            : courseProgress.progress >= 50
                            ? theme.palette.primary.main
                            : theme.palette.warning.main,
                      },
                    }}
                  />
                </Box>
                <ProgressLabel variant="body2" value={courseProgress.progress}>
                  {courseProgress.progress}%
                </ProgressLabel>
              </Box>

              <Typography variant="body2" color="text.secondary">
                {completedLearningProgresses.length}/{allLessons.length} bài học
                hoàn thành
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Danh sách bài học
            </Typography>

            <List disablePadding>
              {courseProgress.lessons.map((lesson, index) => (
                <Fade in key={lesson.id} timeout={300 + index * 100}>
                  <LessonItem
                    completed={lesson.completed}
                    current={lesson.current}
                    locked={lesson.locked}
                  >
                    <ListItemIcon>
                      {lesson.completed ? (
                        <CheckCircleIcon color="success" />
                      ) : lesson.locked ? (
                        <LockIcon color="action" />
                      ) : (
                        <PlayCircleOutlineIcon
                          color={lesson.current ? "primary" : "action"}
                        />
                      )}
                    </ListItemIcon>

                    <ListItemText
                      primary={lesson.title}
                      secondary={lesson.duration}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: lesson.current ? 600 : 400,
                        color: lesson.locked ? "text.disabled" : "text.primary",
                      }}
                      secondaryTypographyProps={{
                        variant: "caption",
                        color: lesson.locked
                          ? "text.disabled"
                          : "text.secondary",
                      }}
                    />
                  </LessonItem>
                </Fade>
              ))}
            </List>

            <Box mt={3} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayCircleOutlineIcon />}
                sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
              >
                Tiếp tục học
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </StyledCard>
  );
};

// Styled components (giữ nguyên từ trước)
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  height: "100%",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
}));

interface ProgressLabelProps {
  value: number;
}

const ProgressLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "value",
})<ProgressLabelProps>(({ theme, value }) => {
  const getColor = (): string => {
    if (value >= 80) return theme.palette.success.main;
    if (value >= 50) return theme.palette.primary.main;
    return theme.palette.warning.main;
  };

  return {
    color: getColor(),
    fontWeight: 600,
  };
});

interface LessonItemProps {
  completed?: boolean;
  current?: boolean;
  locked?: boolean;
}

const LessonItem = styled(ListItem, {
  shouldForwardProp: (prop) =>
    prop !== "completed" && prop !== "current" && prop !== "locked",
})<LessonItemProps>(({ theme, completed, current, locked }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  transition: "background-color 0.2s ease-in-out, transform 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: "translateY(-2px)",
  },
  ...(completed && {
    backgroundColor: alpha(theme.palette.success.main, 0.08),
  }),
  ...(current && {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  }),
  ...(locked && {
    opacity: 0.6,
    cursor: "not-allowed",
  }),
}));

export default LearningProgress;
