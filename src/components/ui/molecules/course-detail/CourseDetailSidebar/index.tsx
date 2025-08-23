// src/pages/course/components/CourseContentSidebar.tsx
import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  PlayCircleOutline as PlayCircleOutlineIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ArticleOutlined,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Lesson, Module } from "@interfaces/api/lesson";
import { useSearchParams } from "react-router-dom";
import { LearningProgress } from "@interfaces/api/learningProgress";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
// Styled components
const ProgressIndicator = styled(Box)<{ value: number }>(
  ({ theme, value }) => ({
    position: "relative",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: theme.palette.grey[200],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&::before": {
      content: '""',
      position: "absolute",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: `conic-gradient(${theme.palette.primary.main} ${value}%, transparent 0)`,
    },
    "&::after": {
      content: '""',
      position: "absolute",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      backgroundColor: theme.palette.background.paper,
    },
  })
);

interface CourseContentSidebarProps {
  modules: Module[];
  learningProgresses: LearningProgress[] | undefined;
  current_lesson_id: string;
  completedLearningProgresses: LearningProgress[];
  allLessons: Lesson[];
  inCompleteLessons: Lesson[];
}

const CourseContentSidebar = ({
  modules,
  current_lesson_id,
  completedLearningProgresses,
  allLessons,
  inCompleteLessons,
}: CourseContentSidebarProps) => {
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >({});
  const [, setSearchParams] = useSearchParams();

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const totalChapters = modules.length;
  const totalLessons = modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  const totalDuration = modules.reduce((total, module) => {
    return (
      total +
      module.lessons.reduce((moduleTotal, lesson) => {
        return moduleTotal + lesson.duration;
      }, 0)
    );
  }, 0);

  const getProgress = (module: Module): number => {
    const totalLessons = module.lessons.length;
    if (totalLessons === 0) return 0;

    const completedLessonsInModule = completedLearningProgresses.filter(
      (progress) =>
        module.lessons.some((lesson) => lesson.id === progress.lesson_id) &&
        progress.status === "COMPLETED"
    ).length;

    return Math.round((completedLessonsInModule / totalLessons) * 100);
  };

  const shouldLockLesson = useCallback(
    (lessonId: string): boolean => {
      const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
      const last_index = allLessons.length - 1;
      const isLastLesson = currentIndex === last_index;

      if (
        isLastLesson &&
        (inCompleteLessons.length > 1 ||
          (inCompleteLessons.length === 1 &&
            inCompleteLessons[0].id !== lessonId))
      ) {
        return true;
      }

      return false;
    },
    [allLessons, inCompleteLessons]
  );
  const handleLessonClick = useCallback(
    (lessonId: string) => {
      if (shouldLockLesson(lessonId)) {
        return;
      }

      setSearchParams({ lessonId });
    },
    [setSearchParams, shouldLockLesson]
  );
  const getLessonIcon = useCallback(
    (lesson: Lesson) => {
      if (shouldLockLesson(lesson.id)) {
        return <LockOutlineIcon color="primary" />;
      }

      const isCompleted = completedLearningProgresses.some(
        (progress) =>
          progress.lesson_id === lesson.id && progress.status === "COMPLETED"
      );

      if (isCompleted) {
        return <CheckCircleIcon color="primary" />;
      }

      switch (lesson.type) {
        case "article":
          return <ArticleOutlined color="primary" />;
        case "quiz":
          return <QuestionAnswerIcon color="action" />;
        default:
          return <PlayCircleOutlineIcon color="action" />;
      }
    },
    [completedLearningProgresses, shouldLockLesson]
  );

  return (
    <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ p: 2, bgcolor: "background.paper" }}>
        <Typography variant="h3" fontWeight="600" gutterBottom>
          Nội dung khóa học
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${totalChapters} Chương • ${totalLessons} Bài học • Thời gian ${totalDuration} phút`}
        </Typography>
      </Box>

      <Divider />

      {/* Chapters and lessons */}
      <Box sx={{ maxHeight: "600px", overflow: "auto" }}>
        {modules.map((module) => (
          <React.Fragment key={module.id}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 2,
                cursor: "pointer",
                bgcolor: expandedChapters[module.id]
                  ? "action.hover"
                  : "background.paper",
              }}
              onClick={() => toggleChapter(module.id)}
            >
              <Grid size={{ xs: 10, sm: 11 }}>
                <Box display="flex" alignItems="center">
                  <ProgressIndicator value={getProgress(module)} sx={{ mr: 2 }}>
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{ zIndex: 1, fontWeight: "bold" }}
                    >
                      {getProgress(module)}%
                    </Typography>
                  </ProgressIndicator>
                  <Tooltip title={module.title} arrow>
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      noWrap
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {module.title}
                    </Typography>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid size={{ xs: 2, sm: 1 }} sx={{ textAlign: "right" }}>
                <IconButton size="small">
                  <ExpandMoreIcon
                    sx={{
                      transform: expandedChapters[module.id]
                        ? "rotate(180deg)"
                        : "rotate(0)",
                      transition: "0.3s",
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>

            {expandedChapters[module.id] && (
              <List disablePadding>
                {module.lessons.map((lesson) => (
                  <ListItem
                    onClick={() => handleLessonClick(lesson.id)}
                    key={lesson.id}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderLeft:
                        lesson.id === current_lesson_id ? "4px solid" : "none",
                      borderLeftColor: "primary.main",
                      bgcolor:
                        lesson.id === current_lesson_id
                          ? "action.hover"
                          : "background.paper",

                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                      "&:active": {
                        bgcolor: "action.selected",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getLessonIcon(lesson)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Tooltip title={lesson.title} arrow>
                          <Typography
                            variant="body2"
                            fontWeight={400}
                            noWrap
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {lesson.title}
                          </Typography>
                        </Tooltip>
                      }
                      secondary={`${lesson.duration} phút`}
                      secondaryTypographyProps={{
                        variant: "caption",
                      }}
                    />
                    {lesson.type === "quiz" && (
                      <Typography variant="caption" color="text.secondary">
                        {lesson.quiz?.total_questions} questions
                      </Typography>
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default CourseContentSidebar;
