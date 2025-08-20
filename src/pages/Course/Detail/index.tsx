import React from "react";
import {
  Box,
  Typography,
  Container,
  IconButton,
  Grid,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CourseMainContent from "@components/ui/molecules/course-detail/CourseDetailMainContent";
import CourseContentSidebar from "@components/ui/molecules/course-detail/CourseDetailSidebar";
import { useCourseDetail } from "@hooks/data/useCourseDetail";
import { getRoute } from "@utils/route";
import { PATH } from "@constants/path";

const CourseDetailPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    modules,
    current_lesson_id,
    course,
    isLoadingCourse,
    learningProgresses,
    participation,
    completedLearningProgresses,
    isMoving,
    handleMoveToNext,
    handleBack,
  } = useCourseDetail();
  const handleBackToOverview = () => {
    const route = getRoute(PATH.COURSES_OVERVIEW, { courseId: course?.id });
    navigate(route);
  };
  return (
    <Box sx={{ bgcolor: "background.default", px: 3 }}>
      <Container maxWidth="xl" sx={{ py: 0 }}>
        {isLoadingCourse ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Header */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Grid>
                <Box display="flex" alignItems="center">
                  <IconButton onClick={handleBackToOverview} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h3" fontWeight="600">
                    {course?.title}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Main content */}
            <Grid container spacing={3}>
              {/* Left side - Course video/image and details */}
              <Grid size={{ xs: 12, md: 8 }}>
                <CourseMainContent
                  lessonId={current_lesson_id as string}
                  participation={participation}
                  isMoving={isMoving}
                  handleMoveToNext={handleMoveToNext}
                  learningProgresses={learningProgresses}
                  handleBack={handleBack}
                />
              </Grid>

              {/* Right side - Course content */}
              <Grid size={{ xs: 12, md: 4 }}>
                <CourseContentSidebar
                  current_lesson_id={current_lesson_id as string}
                  modules={modules}
                  learningProgresses={learningProgresses}
                  completedLearningProgresses={completedLearningProgresses}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CourseDetailPage;
