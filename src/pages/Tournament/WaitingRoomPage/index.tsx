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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { RoomModalForm } from "@components/ui/molecules/RoomModalForm";
import { useWaitingRoomPage } from "@hooks/data/useWaitingRoomPage";
import { RoomUser } from "@interfaces/api/challenge";
import DefaultAvatar from "@assets/images/default-profile.jpg";

const WaitingRoomPage: React.FC = () => {
  const {
    userMetric,
    roomDetail,
    openModal,
    handleOpenModal,
    handleCloseModal,
    countdown,
    handleStart,
    isLoading,
    isHost,
    handleOutRoom,
    num_of_question,
    isStarting,
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

  // Lấy list players active (giả sử roomDetail.room_users là array RoomUser)
  const activePlayers =
    roomDetail?.room_users?.filter((user: RoomUser) => !user.is_out_room) || [];

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
            Chuẩn bị cho trận đấu của bạn!
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

              {/* Thêm tên phòng */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {`Phòng: ${roomDetail.name} - Điểm cược: ${roomDetail.bet_points}`}
                </Typography>
              </Box>

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Người chơi ({activePlayers.length}/{roomDetail.max_players})
              </Typography>
              {isHost && (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  Mã phòng: {roomDetail.room_code}
                </Typography>
              )}
              <List>
                {activePlayers.map((player: RoomUser) => {
                  const metric =
                    player.user &&
                    player.user.user_metrics &&
                    player.user.user_metrics?.length > 0
                      ? player.user.user_metrics[0]
                      : null;

                  return (
                    <ListItem key={player.user_id}>
                      <ListItemAvatar>
                        <Badge
                          badgeContent={
                            player.user_id === roomDetail.host_user_id
                              ? "Host"
                              : 0
                          }
                          color="primary"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                        >
                          <Avatar
                            src={
                              player.user && player.user.avatar_url
                                ? player.user.avatar_url
                                : DefaultAvatar
                            }
                            alt={
                              player.user && player.user.full_name
                                ? player.user.full_name
                                : ""
                            }
                            sx={{
                              bgcolor: "primary.main",
                              width: 48,
                              height: 48,
                            }}
                          >
                            {player.user && player.user.full_name
                              ? player.user.full_name[0].toUpperCase()
                              : ""}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText primary={player.user.full_name} />
                      <Box sx={{ ml: "auto" }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          color="warning.main"
                        >
                          {/* <HourglassEmptyIcon fontSize="small" /> */}
                          {metric && (
                            <Typography
                              variant="body1"
                              color="textPrimary"
                              fontWeight="medium"
                            >
                              {`${metric.win_num || 0} T - ${
                                metric?.lose_num || 0
                              } B`}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>

              {roomDetail.status === "PLAYING" ? (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Trận đấu bắt đầu trong...
                  </Typography>
                  <Typography
                    variant="h1"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                  >
                    {countdown}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {isHost
                      ? "Nhấn 'Bắt Đầu' để khởi động trận đấu"
                      : "Chờ chủ phòng bắt đầu trận đấu"}
                  </Typography>
                  {isHost && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleStart}
                      disabled={isStarting}
                    >
                      {isStarting ? "Đang bắt đầu..." : "Bắt Đầu"}
                    </Button>
                  )}
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
        num_of_question={num_of_question}
      />
    </Container>
  );
};

export default WaitingRoomPage;
