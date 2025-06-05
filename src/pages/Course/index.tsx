// src/pages/CourseListingPage.tsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  Divider,
  styled,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Star as StarIcon,
  ArrowDropDown as ArrowDropDownIcon,
  RemoveRedEyeOutlined as RemoveRedEyeOutlinedIcon,
} from "@mui/icons-material";
import CourseCard from "@components/ui/atoms/CourseCard";
import { CourseCardProps } from "@interfaces/shared/home";

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
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [bookmarked, setBookmarked] = useState<number[]>([2, 5]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Sample course data
  const courses: CourseCardProps[] = [
    {
      id: 1,
      title: "Thiết kế UI/UX với Figma từ cơ bản đến nâng cao",
      instructor: {
        name: "Nguyễn Văn A",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      description:
        "Học cách thiết kế giao diện người dùng chuyên nghiệp với Figma từ cơ bản đến nâng cao",
      image:
        "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
      rating: 4.8,
      reviews: 245,
      students: 1200,
      duration: "15 giờ",
      level: "Trung cấp",
      category: "UI/UX Design",
      // categoryColor: "primary",
      lessons: 42,
      lastUpdated: "Tháng 5, 2025",
    },
    {
      id: 2,
      title: "Lập trình React.js cho người mới bắt đầu",
      instructor: {
        name: "Trần Thị B",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      description:
        "Học cách thiết kế giao diện người dùng chuyên nghiệp với Figma từ cơ bản đến nâng cao",
      image:
        "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
      rating: 4.7,
      reviews: 189,
      students: 980,
      duration: "18 giờ",
      level: "Cơ bản",
      category: "Frontend Development",
      // categoryColor: "primary",
      lessons: 56,
      lastUpdated: "Tháng 6, 2025",
    },
    {
      id: 3,
      title: "Xây dựng ứng dụng di động với Flutter",
      instructor: {
        name: "Lê Văn C",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      description:
        "Học cách thiết kế giao diện người dùng chuyên nghiệp với Figma từ cơ bản đến nâng cao",
      image:
        "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
      rating: 4.6,
      reviews: 132,
      students: 750,
      duration: "20 giờ",
      level: "Trung cấp",
      category: "Mobile Development",
      // categoryColor: "primary",
      lessons: 48,
      lastUpdated: "Tháng 4, 2025",
    },
    {
      id: 4,
      title: "Thiết kế đồ họa với Adobe Illustrator",
      instructor: {
        name: "Phạm Thị D",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      description:
        "Học cách thiết kế giao diện người dùng chuyên nghiệp với Figma từ cơ bản đến nâng cao",
      image:
        "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
      rating: 4.5,
      reviews: 98,
      students: 620,
      duration: "12 giờ",
      level: "Cơ bản",
      category: "Graphic Design",
      // categoryColor: "primary",
      lessons: 35,
      lastUpdated: "Tháng 3, 2025",
    },
    {
      id: 5,
      title: "Làm chủ Node.js và Express",
      instructor: {
        name: "Hoàng Văn E",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      description:
        "Học cách thiết kế giao diện người dùng chuyên nghiệp với Figma từ cơ bản đến nâng cao",
      image:
        "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
      rating: 4.9,
      reviews: 215,
      students: 1500,
      duration: "22 giờ",
      level: "Nâng cao",
      category: "Backend Development",
      lessons: 65,
      lastUpdated: "Tháng 6, 2025",
    },
    {
      id: 6,
      title: "Học Python từ cơ bản đến nâng cao",
      instructor: {
        name: "Đỗ Thị F",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      description:
        "Học cách thiết kế giao diện người dùng chuyên nghiệp với Figma từ cơ bản đến nâng cao",
      image:
        "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
      rating: 4.7,
      reviews: 178,
      students: 1100,
      duration: "25 giờ",
      level: "Tất cả",
      category: "Programming",
      lessons: 72,
      lastUpdated: "Tháng 5, 2025",
    },
    {
      id: 7,
      title: "Thiết kế web responsive với Bootstrap 5",
      instructor: {
        name: "Nguyễn Văn G",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      },
      description:
        "Học cách thiết kế giao diện người dùng chuyên nghiệp với Figma từ cơ bản đến nâng cao",
      image:
        "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
      rating: 4.6,
      reviews: 124,
      students: 830,
      duration: "10 giờ",
      level: "Cơ bản",
      category: "Frontend Development",
      lessons: 28,
      lastUpdated: "Tháng 4, 2025",
    },
    {
      id: 8,
      title: "Làm chủ Adobe Photoshop",
      instructor: {
        name: "Trần Văn H",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      },
      description:
        "Học cách thiết kế giao diện người dùng chuyên nghiệp với Figma từ cơ bản đến nâng cao.",
      image:
        "https://assets.entrepreneur.com/content/3x2/2000/20190326201928-GettyImages-633710081-edit.jpeg?format=pjeg&auto=webp&crop=4:3",
      rating: 4.8,
      reviews: 156,
      students: 950,
      duration: "16 giờ",
      level: "Trung cấp",
      category: "Graphic Design",
      lessons: 45,
      lastUpdated: "Tháng 6, 2025",
    },
  ];

  // Filter courses based on active tab
  const filteredCourses =
    tabValue === 0
      ? courses
      : tabValue === 1
      ? courses.filter((course) => bookmarked.includes(course.id))
      : courses;

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

        <Box sx={{ display: "flex", alignItems: "center" }}>
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
        </Box>
      </Box>

      {/* Course Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {filteredCourses.map((course) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={course.id}>
            <CourseCard {...course} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination count={5} color="primary" size="large" />
      </Box>
    </Container>
  );
};

export default CoursePage;
