// src/components/CourseCard.tsx
import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  styled,
  useTheme,
  IconButton,
  alpha,
} from "@mui/material";
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  PeopleOutlineOutlined as PeopleOutlineOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";
import { Course } from "@interfaces/api/course";
import { getRoute } from "@utils/route";
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  flexDirection: "column",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[16],
  },
}));

const CategoryChip = styled(Chip)(() => ({
  borderRadius: "16px",
  fontWeight: 600,
  fontSize: "0.75rem",
  height: "24px",
}));

const LevelChip = styled(Chip)(({ theme }) => ({
  borderRadius: "16px",
  fontWeight: 600,
  fontSize: "0.75rem",
  height: "24px",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
}));

interface TournamentCardProps {
  course: Course;
}

const TournamentCard = ({ course }: TournamentCardProps) => {
  const theme = useTheme();
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const toggleBookmark = (courseId: string) => {
    if (bookmarked.includes(courseId)) {
      setBookmarked(bookmarked.filter((id) => id !== courseId));
    } else {
      setBookmarked([...bookmarked, courseId]);
    }
  };
  const navigate = useNavigate();

  const handleCardClick = () => {
    const route = getRoute(PATH.TOURNAMENT_ROOM, {
      tournamentId: course.id,
    });
    navigate(route);
  };

  return (
    <StyledCard onClick={handleCardClick} sx={{ cursor: "pointer" }}>
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={course.thumbnail_image}
          alt={course.title}
        />
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <CategoryChip
            label={course.category?.name}
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: "24px",
              borderRadius: "16px",
            }}
          />
        </Box>
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
          onClick={() => toggleBookmark(course.id)}
        >
          {bookmarked.includes(course.id) ? (
            <BookmarkIcon color="primary" />
          ) : (
            <BookmarkBorderIcon />
          )}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 1, paddingBottom: "10px !important" }}>
        <Box sx={{ mb: 1 }}>
          <LevelChip label={"Cơ bản"} size="small" />
        </Box>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {course.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {course.short_description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <PeopleOutlineOutlinedIcon
              fontSize="small"
              color="action"
              sx={{ mr: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {course.duration_in_hours}/{course.modules?.length} người
            </Typography>
          </Box>

          <Button
            variant="text"
            sx={{ width: "fit-content" }}
            color="primary"
            fullWidth
          >
            Xem chi tiết
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default TournamentCard;
