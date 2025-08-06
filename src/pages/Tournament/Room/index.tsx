// src/pages/TournamentRoomPage.tsx
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Avatar,
  Chip,
  Stack,
  Container,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useRoomPage } from "@hooks/data/useRoomPage";
import { Room } from "@interfaces/api/challenge";
import { formatDateToVietnamese } from "@utils/date";
import { RoomModalForm } from "@components/ui/molecules/RoomModalForm";

const RoomsPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return "warning";
      case "PLAYING":
        return "info";
      case "FULL":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "WAITING":
        return "Đang chờ đối thủ";
      case "PLAYING":
        return "Trận đấu đang diễn ra";
      case "FULL":
        return "Phòng đầy";
      default:
        return status;
    }
  };

  const getParticipation = (room: Room) => {
    if (room.host_user && room.opponent_user) return "2/2";

    if (!room.host_user && room.opponent_user) return "1/2";

    if (room.host_user && !room.opponent_user) return "1/2";

    return "0/2";
  };

  const {
    isLoading,
    challengeDetail,
    handleCloseRoom,
    showCreateRoom,
    handleOpenRoom,
    rooms,
    handleBackToPrevious,
    handleJoinRoom,
    tournamentId,
    userMetric,
  } = useRoomPage();

  // Tính tổng số người chơi hiện tại và tổng capacity dựa trên trạng thái phòng (giả sử mỗi phòng max 2 người)
  const totalPlayers = rooms.reduce(
    (sum, room) =>
      sum + (room.host_user ? 1 : 0) + (room.opponent_user ? 1 : 0),
    0
  );
  const totalCapacity = rooms.length * 2;

  return (
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: "lg", mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Grid>
              <Box display="flex" alignItems="center">
                <IconButton onClick={handleBackToPrevious} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h3" fontWeight="600">
                  Tìm thử thách khác
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Card sx={{ boxShadow: 3, overflow: "hidden" }}>
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                height="192"
                image={challengeDetail?.thumbnail_image}
                alt={challengeDetail?.title}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0, 0, 0, 0.4)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  color: "white",
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {challengeDetail?.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {challengeDetail?.description}
                </Typography>
              </Box>
            </Box>

            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Stack direction="row" spacing={3}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography color="text.secondary" sx={{ mr: 1 }}>
                      {totalPlayers}/{totalCapacity} người chơi
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenRoom}
                  startIcon={<AddIcon />}
                >
                  Tạo Phòng
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Phòng Có Sẵn
              </Typography>
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : rooms.length === 0 ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Không có phòng nào có sẵn
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {rooms.map((room) => (
                    <Card
                      key={room.id}
                      sx={{
                        p: 3,
                        boxShadow: 1,
                        "&:hover": { bgcolor: "grey.50" },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={room.host_user.avatar_url || ""}
                            sx={{
                              bgcolor: "primary.main",
                              mr: 2,
                              width: 48,
                              height: 48,
                            }}
                          >
                            {room.host_user.avatar_url || ""}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {room.host_user.full_name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "text.secondary",
                              }}
                            >
                              <Typography variant="body2">
                                {`10 Thắng - 2 Thua`}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Box
                            sx={{
                              mt: 0.5,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Chip
                              label={getStatusText(room.status)}
                              color={getStatusColor(room.status)}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Tạo lúc: {formatDateToVietnamese(room.created_date)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <EmojiEventsOutlinedIcon
                              sx={{ color: "#fcba03", fontSize: 20 }}
                            />
                            <Typography variant="subtitle1" fontWeight="bold">
                              {room.bet_points.toLocaleString()} điểm
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <PeopleOutlineOutlinedIcon />
                            <Typography color="text.secondary">
                              {getParticipation(room)} người chơi
                            </Typography>
                          </Box>
                        </Stack>

                        {room.status === "WAITING" && (
                          <Box>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleJoinRoom(room.id)}
                            >
                              Tham gia Phòng
                            </Button>
                          </Box>
                        )}

                        {room.status === "PLAYING" && (
                          <Button variant="contained" disabled>
                            Đang Diễn Ra
                          </Button>
                        )}
                      </Box>
                    </Card>
                  ))}
                </Stack>
              )}
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>
              <Card sx={{ boxShadow: 3, p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quy Tắc Giải Đấu
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Trận đấu quiz 1v1 thời gian thực
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Người thắng lấy hết điểm cược
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cược tối thiểu: 50 điểm
                  </Typography>
                </Stack>
              </Card>

              <Card sx={{ boxShadow: 3, p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Thống Kê Của Bạn
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="text.secondary">
                      Điểm Hiện Tại
                    </Typography>
                    <Typography fontWeight="bold">
                      {userMetric?.point_in_quarter || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="text.secondary">
                      Tổng Trận Đấu
                    </Typography>
                    <Typography fontWeight="bold">
                      {userMetric?.challenge_participate_num || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="text.secondary">Tỷ Lệ Thắng</Typography>
                    <Typography color="success.main" fontWeight="bold">
                      67%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="text.secondary">
                      Chuỗi Thắng Hiện Tại
                    </Typography>
                    <Typography color="warning.main" fontWeight="bold">
                      🔥 3
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <RoomModalForm
        open={showCreateRoom}
        onClose={handleCloseRoom}
        room={null}
        challengeId={tournamentId || null}
        userMetric={userMetric || null}
      />
    </Container>
  );
};

export default RoomsPage;
