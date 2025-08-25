import React, { useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";
import { useCreateReview } from "@services/reviews";
import { Controller } from "react-hook-form";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";

interface CourseCompletionModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  participantId: string;
}
export interface ReviewRequestForm {
  rating: number;
  comment: string;
  course_participation_id: string;
  course_id: string;
}

const CourseCompletionModal: React.FC<CourseCompletionModalProps> = ({
  open,
  onClose,
  courseId,
  participantId,
}) => {
  const navigate = useNavigate();

  const reviewModalFormSchema = useMemo(() => {
    return yup.object().shape({
      rating: yup
        .number()
        .typeError("Đánh giá phải là số")
        .min(1, "Vui lòng đánh giá ít nhất 1 sao")
        .max(5, "Đánh giá tối đa là 5 sao")
        .required("Vui lòng đánh giá khóa học"),
      comment: yup.string().required("Vui lòng nhập nhận xét của bạn"),
      course_id: yup.string().required("Course ID là bắt buộc"),
      course_participation_id: yup
        .string()
        .required("Participant Id là bắt buộc"),
    });
  }, []);

  const { control, handleSubmit, reset } = useForm<ReviewRequestForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      rating: 0,
      comment: "",
      course_id: courseId,
      course_participation_id: participantId,
    },
    resolver: yupResolver(reviewModalFormSchema) as Resolver<ReviewRequestForm>,
  });

  const { mutateAsync: createReview, isPending: isCreateLoading } =
    useCreateReview();

  const handleSubmitReview = useCallback(
    async (formData: ReviewRequestForm) => {
      await createReview(
        { ...formData },
        {
          onSuccess: () => {
            toast.success(ToastContent, {
              data: { message: "Đánh giá đã được gửi!" },
            });
            reset();
            onClose();
          },
        }
      );
    },
    [createReview, reset, onClose]
  );

  const handleViewCertificate = () => {
    onClose();
    navigate(PATH.CERTIFICATE);
  };

  const handleGoHome = () => {
    onClose();
    navigate(PATH.HOME);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          height: "auto",
          overflow: "hidden",
          borderRadius: 2,
        },
      }}
    >
      <DialogContent
        sx={{
          textAlign: "center",
          overflow: "hidden",
          py: 3,
          px: 3,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <CelebrationIcon
            sx={{ fontSize: 48, color: "success.main", mb: 1 }}
          />
          <Typography
            variant="h5"
            fontWeight="bold"
            color="success.main"
            sx={{ mb: 1 }}
          >
            Chúc mừng!
          </Typography>
          <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
            Bạn đã hoàn thành khóa học.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Cảm ơn bạn đã nỗ lực và kiên trì. Hãy tiếp tục học hỏi!
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(handleSubmitReview)}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Đánh giá khóa học
            </Typography>
            <Stack spacing={0} alignItems="center">
              <Controller
                name="rating"
                control={control}
                render={({ field, fieldState }) => (
                  <Box sx={{ textAlign: "center" }}>
                    <Rating
                      name={field.name}
                      value={field.value}
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                      }}
                      precision={0.5}
                      size="large"
                    />
                    {fieldState.error && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
              <Controller
                name="comment"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={3}
                    fullWidth
                    label="Viết review của bạn"
                    variant="outlined"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{
                      "& .MuiInputBase-root": {
                        overflow: "hidden",
                      },
                    }}
                  />
                )}
              />
            </Stack>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isCreateLoading}
              sx={{ minWidth: 140, marginTop: "20px" }}
            >
              {isCreateLoading ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </Box>
        </form>

        <DialogActions
          sx={{
            justifyContent: "center",
            px: 3,
            padding: "0px",
            gap: 1,
            overflow: "hidden",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CelebrationIcon />}
            onClick={handleViewCertificate}
            sx={{ minWidth: 140 }}
          >
            Xem chứng chỉ
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGoHome}
            sx={{ minWidth: 120 }}
          >
            Về trang chủ
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCompletionModal;
