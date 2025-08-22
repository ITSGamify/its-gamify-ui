// src/components/course/CourseReviews.tsx
import React from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Rating,
  LinearProgress,
  Avatar,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGetCourseReviews } from "@services/course";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { CourseReview } from "@interfaces/api/review";

export interface CourseReviewsProps {
  courseId: string;
}

export const CourseReviews = ({ courseId }: CourseReviewsProps) => {
  const theme = useTheme();
  const { data: courseReview } = useGetCourseReviews({
    page: 0,
    limit: 12,
    q: "",
    courseId: courseId || "",
    order_by: [
      {
        order_column: "created_date",
        order_dir: "desc",
      },
    ],
  });

  const reviews: CourseReview[] = courseReview?.data || [];
  const totalReviews = courseReview?.pagination.total_items_count || 0;
  const page = courseReview?.pagination.page_index || 0;
  const total_pages_count = courseReview?.pagination.total_pages_count || 0;
  const hasNext = total_pages_count - 1 > page || false;

  // Tính trung bình rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0";

  // Tính phân bố rating (sử dụng Math.round để nhóm fractional ratings)
  const ratingCounts: { [key: number]: number } = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  reviews.forEach((r) => {
    const rounded = Math.round(r.rating);
    if (rounded >= 1 && rounded <= 5) {
      ratingCounts[rounded] = (ratingCounts[rounded] || 0) + 1;
    }
  });

  const getPercentage = (count: number) =>
    totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Đánh giá từ học viên
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalReviews} đánh giá • Xếp hạng trung bình {averageRating}/5
          </Typography>
        </Box>
      </Box>
      {/* Rating distribution */}
      <Card
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "15px",
          boxShadow: theme.shadows[1],
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center">
              <Typography variant="h2" color="primary.main" fontWeight={700}>
                {averageRating}
              </Typography>
              <Rating
                value={parseFloat(averageRating)}
                precision={0.1}
                readOnly
                size="large"
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                {totalReviews} đánh giá
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Box key={rating} display="flex" alignItems="center" mb={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ width: 15 }}
                >
                  {rating}
                </Typography>
                <Box sx={{ mx: 1 }}>
                  <Rating value={rating} readOnly size="small" />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getPercentage(ratingCounts[rating])}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    width: "100%",
                    backgroundColor: theme.palette.background.default,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        rating >= 4
                          ? theme.palette.success.main
                          : rating >= 3
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1, width: 30 }}
                >
                  {getPercentage(ratingCounts[rating])}%
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Card>
      {/* Comment input - Có thể thêm form submit review ở đây */}

      {/* Reviews section */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Đánh giá gần đây
        </Typography>

        {reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Chưa có đánh giá nào.
          </Typography>
        ) : (
          reviews.map((review, index) => (
            <Box
              key={review.id}
              sx={{
                mb: 3,
                pb: 3,
                borderBottom:
                  index < reviews.length - 1
                    ? `1px solid ${theme.palette.divider}`
                    : "none",
              }}
            >
              <Box display="flex" mb={1}>
                <Avatar
                  src={review.course_participation.user.avatar || ""}
                  alt={review.course_participation.user.full_name}
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle2">
                    {review.course_participation.user.full_name}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Rating
                      value={review.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary" ml={1}>
                      {formatDistanceToNow(new Date(review.reviewd_date), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="body2" paragraph>
                {review.comment}
              </Typography>
            </Box>
          ))
        )}

        {hasNext && (
          <Button variant="outlined" color="primary" fullWidth>
            Xem thêm bình luận
          </Button>
        )}
      </Box>
    </Box>
  );
};
