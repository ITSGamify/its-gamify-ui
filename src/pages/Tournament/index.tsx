// src/pages/CourseListingPage.tsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  styled,
  CircularProgress,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { simulateEnterKeyDown } from "@utils/common";
import TournamentCard from "@components/ui/atoms/TournamentCard";
import { useChallengePage } from "@hooks/data/useChallengePage";

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(4),
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 40,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const TournamentPage: React.FC = () => {
  const {
    challenges,
    total_page_count,
    handlePageChange,
    isLoading,
    categories,
    handleSearch,
    handleSearchResults,
    searchInput,
    handleCategorySearch,
    searchCategories,
  } = useChallengePage();

  return (
    <Container maxWidth="xl">
      {/* Page Header */}
      <Box mb={3}>
        <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
          Đấu Trường Tri Thức
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tìm và tham gia các cuộc thi kiến thức để thử thách bản thân và cạnh
          tranh cùng đồng nghiệp
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box mb={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm cuộc thi..."
              variant="outlined"
              value={searchInput}
              onChange={handleSearch}
              onKeyDown={simulateEnterKeyDown(handleSearchResults)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Categories Section */}
      <Box mb={3}>
        <SectionTitle variant="h5" fontWeight={700}>
          Danh mục
        </SectionTitle>
        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid key={index}>
              <Button
                onClick={() => handleCategorySearch(category.id)}
                variant={
                  searchCategories.includes(category.id)
                    ? "contained"
                    : "outlined"
                }
                color="primary"
                sx={{
                  borderRadius: "20px",
                  px: 2,
                }}
              >
                {category.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Course Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : challenges && challenges.length > 0 ? (
          challenges.map((challenge) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={challenge.id}>
              <TournamentCard challenge={challenge} />
            </Grid>
          ))
        ) : (
          <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Không tìm thấy thử thách nào phù hợp
            </Typography>
          </Box>
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={total_page_count}
          color="primary"
          size="large"
          onChange={(event, page) => {
            handlePageChange(page);
          }}
        />
      </Box>
    </Container>
  );
};

export default TournamentPage;
