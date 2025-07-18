// src/pages/CertificatesPage.tsx
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Paper,
  CircularProgress,
  Stack,
  Chip,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Search, FilterList, Clear } from "@mui/icons-material";
import CertificateListItem from "@components/ui/atoms/CertificateListItem";
import { useCourseResultPage } from "@hooks/data/useCourseResultPage";
import { simulateEnterKeyDown } from "@utils/common";

const CertificatesPage: React.FC = () => {
  const {
    course_results,
    page_index,
    total_page_count,
    page_size,
    handlePageChange,
    isLoading,
    handleSearch,
    handleSearchResults,
    total_item_count,
    searchInput,
    handleViewCertificate,
    resetSearch,
  } = useCourseResultPage();

  return (
    <Container maxWidth="lg">
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Danh sách Chứng chỉ
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Quản lý và xem tất cả chứng chỉ đã cấp
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={3}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên khóa học..."
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
                Hiển thị {total_item_count} / {page_size} chứng chỉ
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
                value={""}
                label="Sắp xếp theo"
                // onChange={handleSortChange}
              >
                <MenuItem value="date">Ngày hoàn thành</MenuItem>
                <MenuItem value="name">Tên khóa học</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Paper>

      {/* Content */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : course_results.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {searchInput
              ? "Không tìm thấy chứng chỉ nào"
              : "Chưa có chứng chỉ nào"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchInput
              ? "Thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc"
              : "Tạo chứng chỉ đầu tiên để bắt đầu"}
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Certificates List */}
          <Box>
            {course_results &&
              course_results.map((certificate) => (
                <CertificateListItem
                  key={certificate.id}
                  certificate={certificate}
                  onView={handleViewCertificate}
                />
              ))}
          </Box>

          {/* Pagination */}
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
        </>
      )}
    </Container>
  );
};

export default CertificatesPage;
