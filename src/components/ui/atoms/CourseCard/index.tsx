// src/components/CourseCard.tsx
import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  styled,
  useTheme,
  IconButton,
  alpha,
  Rating,
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

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { CourseCardProps } from "@interfaces/shared/home";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  flexDirection: "column",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[16],
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  borderRadius: "16px",
  fontWeight: 600,
  fontSize: "0.75rem",
  height: "24px",
}));

const LevelChip = styled(Chip)(({ theme }) => ({
  borderRadius: "16px",
  fontWeight: 600,
  fontSize: "0.75rem",
  height: "24px",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
}));

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  image,
  title,
  category,
  description,
  duration,
  instructor,
  progress,
  level,
  rating,
  reviews,
  lessons,
}) => {
  const theme = useTheme();
  const [bookmarked, setBookmarked] = useState<number[]>([2, 5]);
  const toggleBookmark = (courseId: number) => {
    if (bookmarked.includes(courseId)) {
      setBookmarked(bookmarked.filter((id) => id !== courseId));
    } else {
      setBookmarked([...bookmarked, courseId]);
    }
  };

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(PATH.COURSES_OVERVIEW);
  };
  return (
    <StyledCard onClick={handleCardClick} sx={{ cursor: "pointer" }}>
      <Box sx={{ position: "relative" }}>
        <CardMedia component="img" height="200" image={image} alt={title} />
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <CategoryChip
            label={category}
            size="small"
            // color="primary"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: "24px",
              borderRadius: "16px",
            }}
          />
          {progress !== undefined && (
            <Chip
              label="Đã tham gia"
              size="small"
              sx={{
                backgroundColor: theme.palette.warning.main,
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: "24px",
                borderRadius: "16px",
                width: "fit-content",
              }}
            />
          )}
        </Box>
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
          onClick={() => toggleBookmark(id)}
        >
          {bookmarked.includes(id) ? (
            <BookmarkIcon color="primary" />
          ) : (
            <BookmarkBorderIcon />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 1, paddingBottom: "10px !important" }}>
        <Box sx={{ mb: 1 }}>
          <LevelChip label={level || "Cơ bản"} size="small" />
        </Box>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </Typography>

        {/*Auhtor */}
        <Box display="flex" alignItems="center" mb={1} mt="auto">
          <Avatar
            src={instructor.avatar}
            alt={instructor.name}
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          <Typography variant="subtitle2">{instructor.name}</Typography>
        </Box>

        {/* Rating*/}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Rating
            value={rating || 3}
            precision={0.1}
            readOnly
            size="small"
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            ({rating || 3}) • {reviews || 145} đánh giá
          </Typography>
        </Box>

        {/* Duration and Students */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {duration} • {lessons} bài học
            </Typography>
          </Box>
          <Button
            variant="text"
            sx={{ width: "fit-content" }}
            color="primary"
            fullWidth
          >
            {progress === undefined ? "Tiếp tục học" : "Xem chi tiết"}
          </Button>
        </Box>

        {progress !== undefined && (
          <Button
            sx={{ marginBottom: "10px" }}
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCardClick}
          >
            Tiếp tục học ({progress}%)
          </Button>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default CourseCard;
