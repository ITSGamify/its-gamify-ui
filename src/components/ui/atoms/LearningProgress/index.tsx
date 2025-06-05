// src/components/LearningProgress.tsx
import React from "react";
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
  ListItemSecondaryAction,
  IconButton,
  Button,
  styled,
  Divider,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import { alpha } from "@mui/material/styles";
import { CourseProgressType } from "@interfaces/shared/home";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  height: "100%",
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
}

const LessonItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "completed" && prop !== "current",
})<LessonItemProps>(({ theme, completed, current }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  ...(completed && {
    backgroundColor: alpha(theme.palette.success.main, 0.08),
  }),
  ...(current && {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  }),
}));

const LearningProgress: React.FC = () => {
  // Dữ liệu mẫu
  const courseProgress: CourseProgressType = {
    title: "Thiết kế UI/UX với Figma",
    progress: 65,
    lessons: [
      {
        id: 1,
        title: "Giới thiệu về Figma",
        duration: "15 phút",
        completed: true,
        current: false,
        hasAttachment: true,
      },
      {
        id: 2,
        title: "Các công cụ cơ bản",
        duration: "25 phút",
        completed: true,
        current: false,
        hasAttachment: true,
      },
      {
        id: 3,
        title: "Thiết kế prototype",
        duration: "30 phút",
        completed: false,
        current: true,
        hasAttachment: true,
      },
      {
        id: 4,
        title: "Làm việc với components",
        duration: "20 phút",
        completed: false,
        current: false,
        hasAttachment: false,
        locked: false,
      },
      {
        id: 5,
        title: "Auto layout và Constraints",
        duration: "35 phút",
        completed: false,
        current: false,
        hasAttachment: false,
        locked: true,
      },
      {
        id: 6,
        title: "Thiết kế responsive",
        duration: "40 phút",
        completed: false,
        current: false,
        hasAttachment: false,
        locked: true,
      },
    ],
  };

  return (
    <StyledCard>
      <CardHeader
        sx={{ py: "1.2rem" }}
        title="Tiến độ học tập"
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
      />

      <CardContent sx={{ py: "0px" }}>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            {courseProgress.title}
          </Typography>

          <Box display="flex" alignItems="center" mb={1}>
            <Box flexGrow={1} mr={2}>
              <LinearProgress
                variant="determinate"
                value={courseProgress.progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <ProgressLabel variant="body2" value={courseProgress.progress}>
              {courseProgress.progress}%
            </ProgressLabel>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {Math.round(
              (courseProgress.lessons.filter((l) => l.completed).length /
                courseProgress.lessons.length) *
                100
            )}
            % hoàn thành (
            {courseProgress.lessons.filter((l) => l.completed).length}/
            {courseProgress.lessons.length} bài học)
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Danh sách bài học
        </Typography>

        <List disablePadding>
          {courseProgress.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              completed={lesson.completed}
              current={lesson.current}
              //   disabled={lesson.locked}
              //   button
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
                  color: lesson.locked ? "text.disabled" : "text.secondary",
                }}
              />

              <ListItemSecondaryAction>
                {lesson.hasAttachment && (
                  <IconButton edge="end" size="small" disabled={lesson.locked}>
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </LessonItem>
          ))}
        </List>

        <Box mt={3} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayCircleOutlineIcon />}
          >
            Tiếp tục học
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default LearningProgress;
