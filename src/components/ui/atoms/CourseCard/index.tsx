// src/components/CourseCard.tsx
import React, { useCallback, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  // Avatar,
  Button,
  styled,
  useTheme,
  IconButton,
  // alpha,
  Rating,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";
import { Course } from "@interfaces/api/course";
import { getRoute } from "@utils/route";
import { useUpsertCourseCollection } from "@services/course";
import { getClassifyInVietnamese } from "@utils/course";
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

const CategoryChip = styled(Chip)(() => ({
  borderRadius: "16px",
  fontWeight: 600,
  fontSize: "0.75rem",
  height: "24px",
}));

interface CourseCardProps {
  course: Course;
  isShowBtn?: boolean;
  isJoined?: boolean;
  isCompleted?: boolean;
}

const CourseCard = ({
  course,
  isShowBtn = false,
  isJoined = false,
  isCompleted = false,
}: CourseCardProps) => {
  const theme = useTheme();
  const [bookmarked, setBookmarked] = useState<string[]>([
    ...course.course_collections.map((collection) => collection.course_id),
  ]);

  const { mutateAsync: upsertCourseCollection } = useUpsertCourseCollection();

  const toggleBookmark = useCallback(
    async (courseId: string) => {
      await upsertCourseCollection(courseId, {
        onSuccess: () => {
          if (bookmarked.includes(courseId)) {
            setBookmarked(bookmarked.filter((id) => id !== courseId));
          } else {
            setBookmarked([...bookmarked, courseId]);
          }
        },
      });
    },
    [bookmarked, upsertCourseCollection]
  );
  const navigate = useNavigate();

  const handleCardClick = () => {
    const route = getRoute(PATH.COURSES_OVERVIEW, {
      courseId: course.id,
    });
    navigate(route);
  };

  return (
    <StyledCard onClick={handleCardClick} sx={{ cursor: "pointer" }}>
      <Box sx={{ position: "relative", marginBottom: "10px" }}>
        <CardMedia
          component="img"
          height="200"
          image={course.thumbnail_image}
          alt={course.title}
        />
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            <CategoryChip
              label={course.category?.name}
              size="small"
              // color="primary"
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: "24px",
                borderRadius: "16px",
              }}
            />

            <Chip
              label={getClassifyInVietnamese(course.classify)}
              size="small"
              sx={{
                backgroundColor: theme.palette.error.light,
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: "24px",
                borderRadius: "16px",
                width: "fit-content",
              }}
            />

            {course.is_optional && (
              <Chip
                label="Không bắt buộc"
                size="small"
                sx={{
                  backgroundColor: theme.palette.grey[600],
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
          >
            {isJoined && !isCompleted && (
              <Chip
                label="Đang tham gia"
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

            {isCompleted && (
              <Chip
                label="Đã hoàn thành"
                size="small"
                sx={{
                  backgroundColor: theme.palette.success.main,
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
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(course.id);
          }}
        >
          {bookmarked.includes(course.id) ? (
            <BookmarkIcon color="primary" />
          ) : (
            <BookmarkBorderIcon />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 1, paddingBottom: "10px !important" }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {course.title}
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
            height: "40px",
            minHeight: "40px",
            lineHeight: "20px",
          }}
        >
          {course.short_description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Rating
            value={course.course_metric.star_rating}
            precision={0.1}
            readOnly
            size="small"
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            ({course.course_metric.star_rating}) •{" "}
            {course.course_metric.review_count} đánh giá
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
              {course.duration_in_hours} phút • {course.modules?.length} bài học
            </Typography>
          </Box>
          {!isShowBtn && (
            <Button
              variant="text"
              sx={{ width: "fit-content" }}
              color="primary"
              fullWidth
            >
              {isJoined ? "Tiếp tục học" : "Xem chi tiết"}
            </Button>
          )}
        </Box>

        {isShowBtn && isJoined && (
          <Button
            sx={{ marginBottom: "10px", marginTop: "10px" }}
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCardClick}
          >
            {isCompleted ? "Xem chi tiết" : "Tiếp tục học"}
          </Button>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default CourseCard;
