// src/components/CourseCard.tsx
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
  alpha,
} from "@mui/material";
import { PeopleOutlineOutlined as PeopleOutlineOutlinedIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";
import { getRoute } from "@utils/route";
import { Challenge } from "@interfaces/api/challenge";
import { toast } from "react-toastify";
import ToastContent from "../Toast";
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
  challenge: Challenge;
}

const TournamentCard = ({ challenge }: TournamentCardProps) => {
  const theme = useTheme();

  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!challenge.course.course_results.length) {
      toast.warning(ToastContent, {
        data: { message: "Bạn chưa hoàn thành khóa học" },
      });
      return;
    }
    const route = getRoute(PATH.TOURNAMENT_ROOM, {
      tournamentId: challenge.id,
    });
    navigate(route);
  };

  const isCompleted = challenge.course.course_results.length > 0;

  return (
    <StyledCard onClick={handleCardClick} sx={{ cursor: "pointer" }}>
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={challenge.thumbnail_image}
          alt={challenge.title}
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
            label={challenge.category?.name}
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
        {isCompleted && (
          <Chip
            label="Đã hoàn thành khóa học"
            size="small"
            sx={{
              backgroundColor: "orange",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: "24px",
              borderRadius: "16px",
              width: "fit-content",
              position: "absolute",
              top: 8,
              right: 8,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 1, paddingBottom: "10px !important" }}>
        <Box sx={{ mb: 1 }}>
          <LevelChip label={"Cơ bản"} size="small" />
        </Box>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {challenge.title}
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
            height: "40px", // Cố định chiều cao
            minHeight: "40px", // Đảm bảo chiều cao tối thiểu
            lineHeight: "20px", // Đảm bảo mỗi dòng cao 20px
          }}
        >
          {challenge.description}
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
              {challenge.num_of_room}/{challenge.num_of_room} người
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
