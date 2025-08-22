import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";

const CourseCompletionPage: React.FC = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(0);
  const [review, setReview] = useState<string>("");

  const handleSubmitReview = () => {
    // Xử lý submit đánh giá và review (có thể gọi API ở đây)
    console.log("Đánh giá:", rating, "Review:", review);
    // Sau khi submit, có thể reset hoặc hiển thị thông báo
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card sx={{ p: 4, textAlign: "center", boxShadow: 3 }}>
        <Box sx={{ mb: 4 }}>
          <CelebrationIcon sx={{ fontSize: 80, color: "success.main" }} />
          <Typography
            variant="h3"
            fontWeight="bold"
            color="success.main"
            gutterBottom
          >
            Chúc mừng!
          </Typography>
          <Typography variant="h5" color="text.primary" gutterBottom>
            Bạn đã hoàn thành khóa học thành công.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cảm ơn bạn đã nỗ lực và kiên trì. Hãy tiếp tục học hỏi!
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Đánh giá khóa học
          </Typography>
          <Stack spacing={2} alignItems="center">
            <Rating
              name="course-rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={0.5}
              size="large"
            />
            <TextField
              multiline
              rows={4}
              fullWidth
              label="Viết review của bạn"
              variant="outlined"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitReview}
            >
              Gửi đánh giá
            </Button>
          </Stack>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CelebrationIcon />}
            onClick={() => navigate(PATH.CERTIFICATE)}
          >
            Xem chứng chỉ
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(PATH.HOME)}
          >
            Về trang chủ
          </Button>
        </Stack>
      </Card>
    </Container>
  );
};

export default CourseCompletionPage;
