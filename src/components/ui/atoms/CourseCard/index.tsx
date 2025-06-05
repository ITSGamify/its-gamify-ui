// src/components/CourseCard.tsx
import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  styled,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { CourseCardProps } from "@interfaces/shared/home";
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[16],
  },
}));

const CategoryChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>(({ theme, color = "primary" }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  fontSize: 12,
}));

const CourseCard: React.FC<CourseCardProps> = ({
  image,
  title,
  category,
  categoryColor = "primary",
  description,
  duration,
  students,
  instructor,
  price,
  progress,
}) => {
  return (
    <StyledCard>
      <Box sx={{ position: "relative" }}>
        <CardMedia component="img" height="200" image={image} alt={title} />
        <CategoryChip
          label={category}
          size="small"
          color={categoryColor as any}
        />
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" ml={0.5}>
              {duration}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <PeopleAltIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" ml={0.5}>
              {students} học viên
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={2} mt="auto">
          <Avatar
            src={instructor.avatar}
            alt={instructor.name}
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          <Typography variant="subtitle2">{instructor.name}</Typography>
        </Box>

        {progress !== undefined ? (
          <Button variant="contained" color="primary" fullWidth>
            Tiếp tục học ({progress}%)
          </Button>
        ) : (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" color="primary.main">
              {price}
            </Typography>
            <Button variant="contained" color="primary">
              Đăng ký
            </Button>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default CourseCard;
