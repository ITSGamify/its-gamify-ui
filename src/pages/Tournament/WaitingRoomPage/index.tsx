import {
  Box,
  Button,
  Card,
  Typography,
  Grid,
  Avatar,
  Stack,
  CircularProgress,
  Container,
  IconButton,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import XIcon from "@mui/icons-material/X";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { RoomModalForm } from "@components/ui/molecules/RoomModalForm";
import { useWaitingRoomPage } from "@hooks/data/useWaitingRoomPage";

const WaitingRoomPage: React.FC = () => {
  const {
    userMetric,
    roomDetail,
    openModal,
    handleOpenModal,
    handleCloseModal,
    countdown,
    handleReady,
    isLoading,
    isHost,
    handleOutRoom,
  } = useWaitingRoomPage();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.50",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: "md", mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            Phòng Chờ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chuẩn bị cho trận đấu quiz của bạn!
          </Typography>
        </Box>

        {roomDetail && (
          <>
            <Card sx={{ boxShadow: 3, p: 4, mb: 4, position: "relative" }}>
              {isHost && (
                <IconButton
                  onClick={handleOpenModal}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "primary.main",
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
              <Stack
                direction="row"
                spacing={4}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 4 }}
              >
                {roomDetail.host_user && (
                  <Box sx={{ textAlign: "center", width: 160 }}>
                    <Avatar
                      src={roomDetail.host_user.avatar_url}
                      sx={{
                        bgcolor: "primary.main",
                        width: 80,
                        height: 80,
                        mb: 2,
                        fontSize: "2rem",
                        mx: "auto",
                      }}
                    >
                      {roomDetail.host_user.avatar_url}
                    </Avatar>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {roomDetail.host_user.full_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      10 T - 2 B
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {roomDetail.is_host_ready ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                          color="success.main"
                        >
                          <Typography variant="body2" fontWeight="medium">
                            Sẵn Sàng!
                          </Typography>
                        </Stack>
                      ) : // Chỉ hiển thị button nếu user là host
                      isHost ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleReady(
                              isHost
                                ? roomDetail?.host_user_id
                                : roomDetail?.opponent_user_id || ""
                            )
                          }
                          fullWidth
                        >
                          Sẵn Sàng
                        </Button>
                      ) : (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                          color="warning.main"
                          sx={{ py: 1 }}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            Đang Chờ...
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  </Box>
                )}

                {roomDetail.opponent_user ? (
                  <>
                    <Box sx={{ textAlign: "center" }}>
                      <Avatar
                        sx={{ bgcolor: "grey.200", width: 48, height: 48 }}
                      >
                        <XIcon color="disabled" />
                      </Avatar>
                    </Box>
                    <Box sx={{ textAlign: "center", width: 160 }}>
                      <Avatar
                        src={roomDetail.opponent_user.avatar_url}
                        sx={{
                          bgcolor: "info.main",
                          width: 80,
                          height: 80,
                          mb: 2,
                          fontSize: "2rem",
                          mx: "auto",
                        }}
                      >
                        {roomDetail.opponent_user.avatar_url}
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {roomDetail.opponent_user.full_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        10 T - 2 B
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {roomDetail.is_opponent_ready ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="center"
                            color="success.main"
                            sx={{ py: 1 }}
                          >
                            <Typography variant="body2" fontWeight="medium">
                              Sẵn Sàng!
                            </Typography>
                          </Stack>
                        ) : // Chỉ hiển thị button nếu user là opponent (!isHost)
                        !isHost ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleReady(
                                isHost
                                  ? roomDetail?.host_user_id
                                  : roomDetail?.opponent_user_id || ""
                              )
                            }
                            fullWidth
                          >
                            Sẵn Sàng
                          </Button>
                        ) : (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="center"
                            color="warning.main"
                            sx={{ py: 1 }}
                          >
                            <Typography variant="body2" fontWeight="medium">
                              Đang Chờ...
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                    </Box>
                  </>
                ) : (
                  // Nếu chưa có opponent, hiển thị placeholder (tùy chỉnh nếu cần)
                  <Box sx={{ textAlign: "center", width: 160 }}>
                    <Avatar
                      sx={{
                        bgcolor: "grey.300",
                        width: 80,
                        height: 80,
                        mb: 2,
                        mx: "auto",
                      }}
                    >
                      {/* Placeholder cho opponent chưa join */}
                    </Avatar>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Chờ Đối Thủ
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      color="warning.main"
                      sx={{ py: 1, mt: 2 }}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        Đang Chờ...
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Stack>
              {roomDetail.is_host_ready && roomDetail.is_opponent_ready && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h1"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                  >
                    {countdown}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Trận đấu bắt đầu trong...
                  </Typography>
                </Box>
              )}
              {(!roomDetail.is_host_ready || !roomDetail.is_opponent_ready) && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Nhấn "Sẵn Sàng" khi bạn đã chuẩn bị bắt đầu quiz
                  </Typography>
                </Box>
              )}
            </Card>

            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quy Tắc Trận Đấu
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "rgb(219 234 254 / var(--tw-bg-opacity, 1))",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <HelpOutlineIcon sx={{ fontSize: 15, color: "green" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {`${roomDetail.question_count} Câu Hỏi`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Câu hỏi ngẫu nhiên từ bộ sưu tập
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "rgb(209 250 229 / var(--tw-bg-opacity, 1))",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <ScheduleIcon sx={{ fontSize: 15, color: "blue" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {`${roomDetail.time_per_question} Giây`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Giới hạn thời gian mỗi câu hỏi
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "rgb(254 249 195 / var(--tw-bg-opacity, 1))",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <EmojiEventsOutlinedIcon
                        sx={{ fontSize: 15, color: "yellow" }}
                      />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        Thưởng Tốc Độ
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Điểm thưởng cho câu trả lời nhanh
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{ bgcolor: "error.light", width: 32, height: 32 }}
                    >
                      <PercentOutlinedIcon
                        sx={{ fontSize: 15, color: "white" }}
                      />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        Độ Chính Xác Quan Trọng
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Câu trả lời đúng ghi điểm
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </>
        )}

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="outlined" color="inherit" onClick={handleOutRoom}>
            Hủy Trận Đấu
          </Button>
        </Box>
      </Box>

      <RoomModalForm
        open={openModal}
        onClose={handleCloseModal}
        room={roomDetail || null}
        challengeId={null}
        userMetric={userMetric || null}
      />
    </Container>
  );
};

export default WaitingRoomPage;
