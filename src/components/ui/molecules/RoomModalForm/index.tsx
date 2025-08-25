// src/pages/TournamentRoomPage.tsx
import { useRoomModalForm } from "@hooks/data/useRoomModalForm";
import { Room } from "@interfaces/api/challenge";
import { Metric } from "@interfaces/api/metric";
import {
  Box,
  Button,
  Card,
  Typography,
  Modal,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Controller } from "react-hook-form";
interface RoomModalFormProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
  challengeId: string | null;
  userMetric: Metric | null;
  num_of_question?: number;
}

export const RoomModalForm = ({
  open,
  onClose,
  room,
  challengeId,
  userMetric,
  num_of_question,
}: RoomModalFormProps) => {
  const { isSubmitting, bet_points, handleSubmit, control } = useRoomModalForm({
    room,
    challengeId,
    onClose,
    numOfQuestion: num_of_question,
  });

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="create-room-modal">
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            width: "100%",
            maxWidth: 500,
            maxHeight: "100vh",
            overflowY: "auto",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            marginBottom={2}
          >
            {room ? "Cập nhật phòng chơi" : "Tạo Phòng Mới"}
          </Typography>

          <Stack spacing={2}>
            <Box>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label="Tên phòng"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{ min: 1, max: num_of_question || 20 }}
                    sx={{ "& .MuiOutlinedInput-input": { py: 1.2 } }}
                    required
                    InputLabelProps={{
                      shrink: true,
                      sx: { fontSize: "0.875rem" },
                      margin: "dense",
                    }}
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="question_count"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label="Số Lượng Câu Hỏi"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{ min: 1, max: num_of_question || 20 }}
                    sx={{ "& .MuiOutlinedInput-input": { py: 1.2 } }}
                    required
                    InputLabelProps={{
                      shrink: true,
                      sx: { fontSize: "0.875rem" },
                      margin: "dense",
                    }}
                    placeholder="Nhập số lượng câu hỏi"
                  />
                )}
              />
            </Box>

            <Box>
              <Controller
                name="time_per_question"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label="Thời Gian Mỗi Câu Hỏi (giây)"
                    type="number"
                    fullWidth
                    name="time_per_question"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{ min: 10, max: 60 }}
                    placeholder="Nhập thời gian mỗi câu hỏi"
                    sx={{ "& .MuiOutlinedInput-input": { py: 1.2 } }}
                    required
                    InputLabelProps={{
                      shrink: true,
                      sx: { fontSize: "0.875rem" },
                      margin: "dense",
                    }}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                name="bet_points"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label=" Số Tiền Cược (Điểm)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{ min: 50, max: 5000 }}
                    placeholder="Nhập số điểm cược"
                    sx={{ "& .MuiOutlinedInput-input": { py: 1.2 } }}
                    required
                    InputLabelProps={{
                      shrink: true,
                      sx: { fontSize: "0.875rem" },
                      margin: "dense",
                    }}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                name="max_players"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label="Số người chơi tối đa"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={error?.message}
                    inputProps={{ min: 2, max: 10 }}
                    placeholder="Nhập số lượng người chơi"
                    size="small"
                    sx={{ "& .MuiOutlinedInput-input": { py: 1.2 } }}
                    required
                    InputLabelProps={{
                      shrink: true,
                      sx: { fontSize: "0.875rem" },
                      margin: "dense",
                    }}
                  />
                )}
              />
            </Box>
            {userMetric && (
              <Card variant="outlined" sx={{ p: 1.5, bgcolor: "grey.50" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0, // Giảm margin bottom
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Điểm hiện tại của bạn:
                  </Typography>
                  <Typography fontWeight="bold">
                    {userMetric?.point_in_quarter}
                  </Typography>
                </Box>
                {userMetric?.point_in_quarter && (
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Sau khi cược:
                    </Typography>
                    <Typography fontWeight="bold">
                      {userMetric?.point_in_quarter - bet_points}
                    </Typography>
                  </Box>
                )}
              </Card>
            )}
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              disabled={isSubmitting}
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={
                isSubmitting || (userMetric?.point_in_quarter || 0) < bet_points
              }
            >
              {isSubmitting ? (
                <>
                  <Box component="span" sx={{ display: "inline-block", mr: 1 }}>
                    <CircularProgress size={16} color="inherit" />
                  </Box>
                  Đang tạo...
                </>
              ) : room ? (
                "Cập nhật"
              ) : (
                "Tạo phòng"
              )}
            </Button>
          </Stack>
        </Box>
      </form>
    </Modal>
  );
};
