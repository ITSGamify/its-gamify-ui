// src/pages/course/components/CourseContentSidebar.tsx
import React, { useState } from "react";
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
} from "@mui/material";
import {
  PlayCircleOutline as PlayCircleOutlineIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

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

interface Chapter {
  id: string;
  title: string;
  progress: number;
  lessons: {
    id: string;
    title: string;
    duration: string;
    isCompleted: boolean;
    isQuiz?: boolean;
    questionCount?: number;
  }[];
}

interface CourseContentSidebarProps {
  courseData: {
    totalChapters: number;
    totalLessons: number;
    totalDuration: string;
    chapters: Chapter[];
  };
}

const CourseContentSidebar: React.FC<CourseContentSidebarProps> = ({
  courseData,
}) => {
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >({
    "chapter-1": true,
    "chapter-2": false,
  });

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  return (
    <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ p: 2, bgcolor: "background.paper" }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Training Content
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {courseData.totalChapters} Chapters • {courseData.totalLessons}{" "}
          Lessons • Total duration: {courseData.totalDuration}
        </Typography>
      </Box>

      <Divider />

      {/* Chapters and lessons */}
      <Box sx={{ maxHeight: "600px", overflow: "auto" }}>
        {courseData.chapters.map((chapter) => (
          <React.Fragment key={chapter.id}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 2,
                cursor: "pointer",
                bgcolor: expandedChapters[chapter.id]
                  ? "action.hover"
                  : "background.paper",
              }}
              onClick={() => toggleChapter(chapter.id)}
            >
              <Grid>
                <Box display="flex" alignItems="center">
                  <ProgressIndicator value={chapter.progress} sx={{ mr: 2 }}>
                    <Typography
                      variant="caption"
                      color="primary.main"
                      sx={{ zIndex: 1, fontWeight: "bold" }}
                    >
                      {chapter.progress}%
                    </Typography>
                  </ProgressIndicator>
                  <Typography variant="subtitle1" fontWeight="600">
                    {chapter.title}
                  </Typography>
                </Box>
              </Grid>
              <Grid>
                <IconButton size="small">
                  <ExpandMoreIcon
                    sx={{
                      transform: expandedChapters[chapter.id]
                        ? "rotate(180deg)"
                        : "rotate(0)",
                      transition: "0.3s",
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>

            {expandedChapters[chapter.id] && (
              <List disablePadding>
                {chapter.lessons.map((lesson) => (
                  <ListItem
                    key={lesson.id}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderLeft:
                        lesson.id === "lesson-1-2" ? "4px solid" : "none",
                      borderLeftColor: "primary.main",
                      bgcolor:
                        lesson.id === "lesson-1-2"
                          ? "action.hover"
                          : "background.paper",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {lesson.isCompleted ? (
                        <CheckCircleIcon color="primary" />
                      ) : lesson.isQuiz ? (
                        <QuestionAnswerIcon color="action" />
                      ) : (
                        <PlayCircleOutlineIcon color="action" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={lesson.title}
                      secondary={lesson.duration}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: lesson.id === "lesson-1-2" ? 600 : 400,
                      }}
                      secondaryTypographyProps={{
                        variant: "caption",
                      }}
                    />
                    {lesson.isQuiz && (
                      <Typography variant="caption" color="text.secondary">
                        {lesson.questionCount} questions
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
