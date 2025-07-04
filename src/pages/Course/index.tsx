// src/pages/CourseListingPage.tsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  // Card,
  // CardContent,
  // CardMedia,
  Button,
  // Chip,
  // Rating,
  TextField,
  InputAdornment,
  // IconButton,
  Tabs,
  Tab,
  // MenuItem,
  // Select,
  // FormControl,
  // InputLabel,
  Pagination,
  // Stack,
  // Divider,
  styled,
  CircularProgress,
  // useTheme,
  // alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  // AccessTime as AccessTimeIcon,
  // Person as PersonIcon,
  // Bookmark as BookmarkIcon,
  // BookmarkBorder as BookmarkBorderIcon,
  // Star as StarIcon,
  ArrowDropDown as ArrowDropDownIcon,
  // RemoveRedEyeOutlined as RemoveRedEyeOutlinedIcon,
} from "@mui/icons-material";
import CourseCard from "@components/ui/atoms/CourseCard";
import { useCoursePage } from "@hooks/data/useCoursePage";

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(4),
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 40,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const CoursePage: React.FC = () => {
  // const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  // const [sortBy, setSortBy] = useState("popular");
  // const [bookmarked, setBookmarked] = useState<number[]>([2, 5]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const { courses, total_page_count, handlePageChange, isLoading } =
    useCoursePage();

  // Categories for filter
  const categories = [
    "UI/UX Design",
    "Frontend Development",
    "Backend Development",
    "Mobile Development",
    "Graphic Design",
    "Programming",
  ];

  return (
    <Container maxWidth="xl">
      {/* Page Header */}
      <Box mb={3}>
        <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
          Khám phá khóa học
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tìm kiếm và học các khóa học chất lượng cao để phát triển kỹ năng của
          bạn
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box mb={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 9 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm khóa học..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              endIcon={<ArrowDropDownIcon />}
              sx={{
                height: "100%",
                borderRadius: "8px",
                justifyContent: "space-between",
              }}
            >
              Lọc khóa học
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Categories Section */}
      <Box mb={3}>
        <SectionTitle variant="h5" fontWeight={700}>
          Danh mục
        </SectionTitle>
        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid key={index}>
              <Button
                variant={index === 0 ? "contained" : "outlined"}
                color="primary"
                sx={{
                  borderRadius: "20px",
                  px: 2,
                }}
              >
                {category}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tabs and Sort */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
            },
          }}
        >
          <Tab label="Tất cả" />
          <Tab label="Được yêu thích" />
          <Tab label="Đã tham gia" />
          <Tab label="Đã lưu" />
        </Tabs>

        {/* <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Sắp xếp theo:
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <Select
              value={sortBy}
              // onChange={handleSortChange}
              displayEmpty
              sx={{ borderRadius: theme.shape.borderRadius }}
            >
              <MenuItem value="popular">Phổ biến nhất</MenuItem>
              <MenuItem value="newest">Mới nhất</MenuItem>
              <MenuItem value="price_low">Giá: Thấp đến cao</MenuItem>
              <MenuItem value="price_high">Giá: Cao đến thấp</MenuItem>
              <MenuItem value="rating">Đánh giá cao nhất</MenuItem>
            </Select>
          </FormControl>
        </Box> */}
      </Box>

      {/* Course Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          courses.map((course) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={course.id}>
              <CourseCard
                course={course}
                isJoined={
                  course.course_participations &&
                  course.course_participations?.length > 0
                }
              />
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={total_page_count}
          color="primary"
          size="large"
          onChange={(event, page) => {
            handlePageChange(page);
          }}
        />
      </Box>
    </Container>
  );
};

export default CoursePage;
