// src/pages/course/CourseDetailPage.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CourseMainContent from "@components/ui/molecules/course-detail/CourseDetailMainContent";
import CourseContentSidebar from "@components/ui/molecules/course-detail/CourseDetailSidebar";

// Giả lập dữ liệu khóa học
const courseData = {
  title: "Project Management Fundamentals",
  instructor: "Simon Shaw",
  instructorRole: "Product Owner",
  currentLesson: {
    title: "02 - Project Planning and scope management",
    description:
      "This training session offers a comprehensive introduction to the principles and methodologies of project management. Participants will gain an understanding of project management fundamentals, including project initiation, planning, execution, monitoring, and closure. Through interactive discussions and activities, attendees will explore key concepts",
    type: "video" as "video" | "article" | "quiz", // Có thể thay đổi thành 'video', 'article', hoặc 'quiz'
    duration: "30 minutes",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // URL video mẫu
    quizInfo: {
      questionCount: 10,
      timeLimit: "15 phút",
      passingScore: 80,
    },
  },
  chapters: [
    {
      id: "chapter-1",
      title: "Chapter 1",
      progress: 25,
      lessons: [
        {
          id: "lesson-1-1",
          title: "Introduction to Project Management",
          duration: "30 minutes",
          isCompleted: true,
          type: "video",
        },
        {
          id: "lesson-1-2",
          title: "Project Planning and Scope Management",
          duration: "30 minutes",
          isCompleted: true,
          type: "video",
        },
        {
          id: "lesson-1-3",
          title: "Time Management and Scheduling",
          duration: "30 minutes",
          isCompleted: false,
          type: "article",
        },
        {
          id: "lesson-1-4",
          title: "Practice exercise - Ba key Concepts",
          duration: "30 minutes",
          isCompleted: false,
          isQuiz: true,
          type: "quiz",
          questionCount: 7,
        },
      ],
    },
    {
      id: "chapter-2",
      title: "Chapter 2",
      progress: 15,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Introduction to Project Management",
          duration: "30 minutes",
          isCompleted: true,
          type: "video",
        },
        {
          id: "lesson-2-2",
          title: "Project Planning and Scope Management",
          duration: "30 minutes",
          isCompleted: false,
          type: "article",
        },
      ],
    },
  ],
  totalChapters: 5,
  totalLessons: 12,
  totalDuration: "43 h 24 min",
  coverImage:
    "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
};

const CourseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  // Thêm state để kiểm soát loại bài học hiện tại (để demo)
  const [currentLessonType, setCurrentLessonType] = useState<
    "video" | "article" | "quiz"
  >("video");

  // Hàm để thay đổi loại bài học (để demo)
  const changeLessonType = (type: "video" | "article" | "quiz") => {
    setCurrentLessonType(type);
    courseData.currentLesson.type = type;
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ bgcolor: "background.default", px: 3 }}>
      <Container maxWidth="xl" sx={{ py: 0 }}>
        {/* Header */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Grid>
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h3" fontWeight="600">
                {courseData.title}
              </Typography>
            </Box>
          </Grid>

          {/* Thêm nút để demo các loại bài học khác nhau */}
          <Grid>
            <Box display="flex" gap={1}>
              <Button
                variant={
                  currentLessonType === "video" ? "contained" : "outlined"
                }
                onClick={() => changeLessonType("video")}
                size="small"
              >
                Video
              </Button>
              <Button
                variant={
                  currentLessonType === "article" ? "contained" : "outlined"
                }
                onClick={() => changeLessonType("article")}
                size="small"
              >
                Article
              </Button>
              <Button
                variant={
                  currentLessonType === "quiz" ? "contained" : "outlined"
                }
                onClick={() => changeLessonType("quiz")}
                size="small"
              >
                Quiz
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Main content */}
        <Grid container spacing={3}>
          {/* Left side - Course video/image and details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <CourseMainContent courseData={courseData} />
          </Grid>

          {/* Right side - Course content */}
          <Grid size={{ xs: 12, md: 4 }}>
            <CourseContentSidebar courseData={courseData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseDetailPage;
