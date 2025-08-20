// src/pages/course/components/lessons/ArticleLesson.tsx
import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
// import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  LessonContentProps,
  NavButton,
  NavigationContainer,
} from "@components/ui/molecules/course-detail/CourseDetailMainContent";
import { ProgressRequestParams } from "@services/progress";
import HeroImage from "@assets/images/hero-image.png";

//#region  Styled components
const SliderContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: 400,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  marginBottom: theme.spacing(3),
}));

const SlideImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

// const SlideNavButton = styled(IconButton)(() => ({
//   position: "absolute",
//   top: "50%",
//   transform: "translateY(-50%)",
//   backgroundColor: "rgba(255, 255, 255, 0.5)",
//   "&:hover": {
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//   },
//   zIndex: 1,
// }));

// const SlideIndicators = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   bottom: theme.spacing(2),
//   left: "50%",
//   transform: "translateX(-50%)",
//   display: "flex",
//   gap: theme.spacing(1),
// }));

// const SlideIndicator = styled(Box)<{ active?: boolean }>(
//   ({ theme, active }) => ({
//     width: 8,
//     height: 8,
//     borderRadius: "50%",
//     backgroundColor: active
//       ? theme.palette.primary.main
//       : "rgba(255, 255, 255, 0.5)",
//     cursor: "pointer",
//   })
// );

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.9rem",
  minWidth: "auto",
  padding: theme.spacing(1.5, 2),
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
}));

//#endregion
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <TabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`lesson-tabpanel-${index}`}
      aria-labelledby={`lesson-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </TabPanel>
  );
};

const ArticleLesson = ({
  lesson,
  isMoving,
  handleMoveToNext,
  participation,
  handleBack,
}: LessonContentProps) => {
  const [activeSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const slides = lesson.image_files || [];

  // const handleSlideChange = (index: number) => {
  //   setActiveSlide(index);
  // };

  // const handlePrevSlide = () => {
  //   setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  // };

  // const handleNextSlide = () => {
  //   setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  // };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const params: ProgressRequestParams = {
    lesson_id: lesson.id,
    type: lesson.type,
    status: "COMPLETED",
    course_participation_id: participation.id,
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        {/* Image Slider */}
        {lesson.image_files && (
          <SliderContainer>
            <SlideImage
              src={slides[activeSlide]?.url || HeroImage}
              alt={slides[activeSlide]?.file_name || "Lesson image"}
            />

            {/* Navigation Buttons */}
            {/* <SlideNavButton onClick={handlePrevSlide} sx={{ left: 16 }}>
              <ChevronLeft />
            </SlideNavButton>

            <SlideNavButton onClick={handleNextSlide} sx={{ right: 16 }}>
              <ChevronRight />
            </SlideNavButton> */}

            {/* Slide Indicators */}
            {/* <SlideIndicators>
              {slides.map((slide, index) => (
                <SlideIndicator
                  key={slide.id}
                  active={index === activeSlide}
                  onClick={() => handleSlideChange(index)}
                />
              ))}
            </SlideIndicators> */}
          </SliderContainer>
        )}

        <Typography variant="h5" fontWeight="600" gutterBottom>
          {lesson.title || "02 - Project Planning and scope management"}
        </Typography>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#10b981",
              },
            }}
          >
            <StyledTab label="Mô tả" />
            <StyledTab label="Đánh giá" />
            {/* <StyledTab label="Thảo luận" />
            <StyledTab label="Tài nguyên" /> */}
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <CustomTabPanel value={activeTab} index={0}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.7 }}
          >
            {lesson.content ||
              "This training session offers a comprehensive introduction to the principles and methodologies of project management. Participants will gain an understanding of project management fundamentals, including project initiation, planning, execution, monitoring, and closure. Through interactive discussions and activities, attendees will explore key concepts such as project life cycles, project stakeholders, and the importance of effective project management in achieving organizational goals."}
          </Typography>
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={1}>
          <Typography variant="body1" color="text.secondary">
            No reviews yet. Be the first to review this lesson!
          </Typography>
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={2}>
          <Typography variant="body1" color="text.secondary">
            Join the discussion about this lesson.
          </Typography>
        </CustomTabPanel>

        <CustomTabPanel value={activeTab} index={3}>
          <Typography variant="body1" color="text.secondary">
            Additional resources for this lesson:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            <Typography component="li" variant="body1" color="text.secondary">
              Project planning templates
            </Typography>
            <Typography component="li" variant="body1" color="text.secondary">
              Scope management checklist
            </Typography>
            <Typography component="li" variant="body1" color="text.secondary">
              Recommended readings
            </Typography>
          </Box>
        </CustomTabPanel>
      </Box>
      <NavigationContainer>
        <NavButton
          variant="outlined"
          color="inherit"
          sx={{ borderColor: "divider", color: "text.secondary" }}
          disabled={isMoving}
          onClick={handleBack}
        >
          Trước
        </NavButton>

        <NavButton
          variant="contained"
          color="primary"
          disabled={isMoving}
          onClick={() => handleMoveToNext(params)}
        >
          Tiếp Theo
        </NavButton>
      </NavigationContainer>
    </>
  );
};

export default ArticleLesson;
