// src/pages/Tournament/History/index.tsx
import React from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  CircularProgress,
} from "@mui/material";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useHistoryPage } from "@hooks/data/useHistoryPage";
import { formatDateToVietnamese } from "@utils/date";

const MatchHistoryPage: React.FC = () => {
  const {
    histories,
    page_index,
    total_page_count,
    handlePageChange,
    isLoading,
    handleSearch,
    handleSearchResults,
    searchInput,
    selectedFilter,
    handleFilterChange,
  } = useHistoryPage();

  // Calculate stats based on histories data
  const stats = {
    totalMatches: histories?.length || 0,
    wins: histories?.filter((match) => match.status === "WIN").length || 0,
    losses: histories?.filter((match) => match.status === "LOSE").length || 0,
    winRate: histories?.length
      ? Math.round(
          (histories.filter((match) => match.status === "WIN").length /
            histories.length) *
            100
        )
      : 0,
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: "xl", mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            Lịch Sử Trận Đấu
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi hiệu suất và tiến bộ của bạn theo thời gian
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tổng Trận Đấu
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="text.primary"
                  >
                    {stats.totalMatches}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgb(219 234 254 / var(--tw-bg-opacity, 1))",
                    width: 48,
                    height: 48,
                  }}
                >
                  <SportsEsportsOutlinedIcon />
                </Avatar>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Thắng
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {stats.wins}
                  </Typography>
                </Box>
                <Avatar
                  sx={{ bgcolor: "success.light", width: 48, height: 48 }}
                >
                  <EmojiEventsOutlinedIcon />
                </Avatar>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Thua
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    {stats.losses}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "error.light", width: 48, height: 48 }}>
                  <HighlightOffOutlinedIcon />
                </Avatar>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ boxShadow: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tỷ Lệ Thắng
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="secondary.main"
                  >
                    {stats.winRate}%
                  </Typography>
                </Box>
                <Avatar
                  sx={{ bgcolor: "secondary.light", width: 48, height: 48 }}
                >
                  <PercentOutlinedIcon />
                </Avatar>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ boxShadow: 3, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Trận Đấu Gần Đây
            </Typography>

            <TextField
              size="small"
              placeholder="Tìm kiếm..."
              value={searchInput}
              onChange={handleSearch}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearchResults();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchResults}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: "100%", sm: "300px" } }}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { value: "ALL", label: "Tất Cả" },
                { value: "WIN", label: "Thắng" },
                { value: "LOSE", label: "Thua" },
              ].map((filter) => (
                <Button
                  key={filter.value}
                  variant={
                    selectedFilter === filter.value ? "contained" : "outlined"
                  }
                  color="primary"
                  onClick={() => handleFilterChange(filter.value)}
                  sx={{ borderRadius: 50, textTransform: "none" }}
                >
                  {filter.label}
                </Button>
              ))}
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày</TableCell>
                      <TableCell>NGười chiến thắng</TableCell>
                      <TableCell>Xếp hạng</TableCell>
                      <TableCell>Giải Đấu</TableCell>
                      <TableCell>Kết Quả</TableCell>
                      <TableCell>Điểm cược</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {histories.length > 0 ? (
                      histories.map((match) => (
                        <TableRow key={match.id} hover>
                          <TableCell>
                            <Typography variant="body1" fontWeight="medium">
                              {formatDateToVietnamese(match.created_date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Typography variant="body1" fontWeight="medium">
                                {match.winner.full_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" color="text.primary">
                              {match.rank}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" color="text.primary">
                              {match.challenge.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                match.status === "WIN"
                                  ? "Chiến Thắng"
                                  : "Thất Bại"
                              }
                              color={
                                match.status === "WIN" ? "success" : "error"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              color={
                                match.status === "WIN"
                                  ? "success.main"
                                  : "error.main"
                              }
                            >
                              {`${match.status === "WIN" ? "" : "- "} ${
                                match.points
                              }`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            py={3}
                          >
                            Không tìm thấy dữ liệu
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {total_page_count > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={total_page_count}
                    page={page_index}
                    onChange={(_, page) => handlePageChange(page)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default MatchHistoryPage;
