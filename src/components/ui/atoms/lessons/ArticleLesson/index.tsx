// src/pages/course/components/lessons/ArticleLesson.tsx
import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Avatar, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { LessonProps } from "@components/ui/molecules/course-detail/CourseDetailMainContent";

// Styled components
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

const SlideNavButton = styled(IconButton)(() => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.5)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  zIndex: 1,
}));

const SlideIndicators = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(2),
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: theme.spacing(1),
}));

const SlideIndicator = styled(Box)<{ active?: boolean }>(
  ({ theme, active }) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: active
      ? theme.palette.primary.main
      : "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
  })
);

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Slides {
  id: number;
  imageUrl: string;
  alt: string;
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

// Mock data for slides
const mockSlides: Slides[] = [
  {
    id: 1,
    imageUrl:
      "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
    alt: "Project planning session",
  },
  {
    id: 2,
    imageUrl:
      "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
    alt: "Team meeting",
  },
  {
    id: 3,
    imageUrl:
      "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
    alt: "Planning with sticky notes",
  },
  {
    id: 4,
    imageUrl:
      "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
    alt: "Project presentation",
  },
];

const ArticleLesson: React.FC<LessonProps> = ({ lesson }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const slides = mockSlides;

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Image Slider */}
      <SliderContainer>
        <SlideImage
          src={slides[activeSlide].imageUrl}
          alt={slides[activeSlide].alt}
        />

        {/* Navigation Buttons */}
        <SlideNavButton onClick={handlePrevSlide} sx={{ left: 16 }}>
          <ChevronLeft />
        </SlideNavButton>

        <SlideNavButton onClick={handleNextSlide} sx={{ right: 16 }}>
          <ChevronRight />
        </SlideNavButton>

        {/* Slide Indicators */}
        <SlideIndicators>
          {slides.map((slide, index) => (
            <SlideIndicator
              key={slide.id}
              active={index === activeSlide}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </SlideIndicators>
      </SliderContainer>

      {/* Lesson Title */}
      <Typography variant="h5" fontWeight="600" gutterBottom>
        {lesson.title || "02 - Project Planning and scope management"}
      </Typography>

      {/* Instructor Info */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Typography variant="body2" color="text.secondary">
          By
        </Typography>
        <Typography variant="body2" color="primary" fontWeight="600">
          {"Simon Shaw"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          , {"Product Owner"}
        </Typography>
      </Box>

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
          <StyledTab label="Description" />
          <StyledTab label="Reviews" />
          <StyledTab label="Discussion" />
          <StyledTab label="Resources" />
          <StyledTab label="Instructor" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <CustomTabPanel value={activeTab} index={0}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          {lesson.description ||
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

      <CustomTabPanel value={activeTab} index={4}>
        <Box display="flex" gap={2} alignItems="flex-start">
          <Avatar
            src={"https://source.unsplash.com/random/100x100/?portrait"}
            alt={"Simon Shaw"}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h6" fontWeight="600">
              {"Simon Shaw"}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {"Product Owner"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {
                "Simon is an experienced Product Owner with over 10 years of experience in project management. He has led numerous successful projects across various industries, specializing in agile methodologies and scope management."
              }
            </Typography>
          </Box>
        </Box>
      </CustomTabPanel>
    </Box>
  );
};

export default ArticleLesson;
