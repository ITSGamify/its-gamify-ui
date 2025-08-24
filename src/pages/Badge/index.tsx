import React from "react";
import {
  Box,
  Typography,
  TextField,
  Pagination,
  CircularProgress,
  Container,
  Paper,
  Stack,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import KNOWLEDGE_SEEKER from "@assets/svgs/KNOWLEDGE_SEEKER.svg";
import QUIZ_MASTER from "@assets/svgs/QUIZ_MASTER.svg";
import SKILL_BUILDER from "@assets/svgs/SKILL_BUILDER.svg";
import OUTSTANDING_ACHIEVEMENT from "@assets/svgs/OUTSTANDING_ACHIEVEMENT.svg";
import EXPLORER from "@assets/svgs/EXPLORER.svg";
import CERTIFICATE_HUNTER from "@assets/svgs/CERTIFICATE_HUNTER.svg";
import FIRST_VICTORY from "@assets/svgs/FIRST_VICTORY.svg";
import COMBO_MASTER from "@assets/svgs/COMBO_MASTER.svg";
import INVINCIBLE from "@assets/svgs/INVINCIBLE.svg";
import TOP_CHALLENGER from "@assets/svgs/TOP_CHALLENGER.svg";

import { BadgeType } from "@interfaces/api/badge"; // Giả sử đường dẫn đúng cho interface
import { useBadgePage } from "@hooks/data/useBadgePage";
import { simulateEnterKeyDown } from "@utils/common";
import { Clear, FilterList, Search } from "@mui/icons-material";
import { BadgeListItem } from "@components/ui/molecules/BadgeListItem";

// Map chi tiết badge dựa trên type (dịch từ dictionary C# sang TS Record)
const badgeDetails: Record<
  BadgeType,
  { title: string; description: string; image: string }
> = {
  KNOWLEDGE_SEEKER: {
    title: "Kẻ Tìm Kiếm Tri Thức",
    description: "Hoàn thành 5 khóa học",
    image: KNOWLEDGE_SEEKER,
  },
  QUIZ_MASTER: {
    title: "Bậc Thầy Trắc Nghiệm",
    description: "Đạt điểm tuyệt đối trong một bài kiểm tra",
    image: QUIZ_MASTER,
  },
  SKILL_BUILDER: {
    title: "Người Xây Dựng Kỹ Năng",
    description: "Nhận 3 chứng chỉ",
    image: SKILL_BUILDER,
  },
  OUTSTANDING_ACHIEVEMENT: {
    title: "Thành Tích Vượt Trội",
    description: "Top 5 học viên của phòng ban trong một quý",
    image: OUTSTANDING_ACHIEVEMENT,
  },
  EXPLORER: {
    title: "Nhà Khám Phá",
    description: "Tham gia ít nhất 3 lĩnh vực khác nhau",
    image: EXPLORER,
  },
  CERTIFICATE_HUNTER: {
    title: "Thợ Săn Chứng Chỉ",
    description: "Nhận 10 chứng chỉ học tập",
    image: CERTIFICATE_HUNTER,
  },
  FIRST_VICTORY: {
    title: "Chiến Thắng Đầu Tiên",
    description: "Thắng trận đầu tiên",
    image: FIRST_VICTORY,
  },
  COMBO_MASTER: {
    title: "Cao Thủ Liên Hoàn",
    description: "Thắng 3 trận liên tiếp",
    image: COMBO_MASTER,
  },
  INVINCIBLE: {
    title: "Bất Khả Chiến Bại",
    description: "Thắng 5 trận liên tiếp",
    image: INVINCIBLE,
  },
  TOP_CHALLENGER: {
    title: "Thách Đấu Đỉnh Cao",
    description: "Top 5 người chơi toàn công ty trong một quý",
    image: TOP_CHALLENGER,
  },
};

const BadgePage = () => {
  const {
    badges,
    page_index,
    total_page_count,
    total_item_count,
    page_size,
    handlePageChange,
    isLoading: isLoadingBadge,
    handleSearch,
    handleSearchResults,
    searchInput,
    resetSearch,
    handleFilterChange,
    filter,
  } = useBadgePage();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Huy Hiệu Của Tôi
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Quản lý và xem tất cả huy hiệu đã đạt được
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={3}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Tìm kiếm huy hiệu..."
            value={searchInput}
            onChange={handleSearch}
            onKeyDown={simulateEnterKeyDown(handleSearchResults)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchInput && (
                <InputAdornment position="end">
                  <Clear
                    sx={{ cursor: "pointer" }}
                    onClick={() => resetSearch()}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Hiển thị {total_item_count} / {page_size} huy hiệu
              </Typography>

              {searchInput && (
                <Chip
                  icon={<FilterList />}
                  label={`Tìm kiếm: "${searchInput}"`}
                  // onDelete={handleClearSearch}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select
                value={filter}
                label="Sắp xếp theo"
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <MenuItem value="COMPLETEDDATE">Ngày hoàn thành</MenuItem>
                <MenuItem value="COURSENAME">Tên khóa học</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Paper>

      {isLoadingBadge ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : badges.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {searchInput
              ? "Không tìm thấy huy hiệu nào"
              : "Chưa có huy hiệu nào"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchInput
              ? "Thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc"
              : "Tham gia khóa học hoặc thử thách để kiếm huy hiệu đầu tiên"}
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {badges.map((badge) => {
            const details = badgeDetails[badge.type];
            return (
              <BadgeListItem key={badge.id} badge={badge} details={details} />
            );
          })}
        </Stack>
      )}

      {/* Phân trang */}
      {total_page_count > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={total_page_count}
            page={page_index}
            onChange={(e, page) => handlePageChange(page)}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default BadgePage;
