import React from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Avatar,
  Chip,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  EmojiEvents, // Sử dụng icon trophy làm mặc định cho badge, có thể thay đổi theo type nếu cần
  Person,
  CalendarToday,
} from "@mui/icons-material";

import { Badge } from "@interfaces/api/badge"; // Giả sử đường dẫn đúng cho interface
import { formatDateToVietnamese } from "@utils/date";

interface BadgeListItemProps {
  badge: Badge;
  details: { title: string; description: string; image: string };
}

export const BadgeListItem: React.FC<BadgeListItemProps> = ({
  badge,
  details,
}) => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        p: 3,
        mb: 2,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
          transform: "translateX(4px)",
          boxShadow: theme.shadows[4],
        },
      }}
      // Có thể thêm onClick nếu cần xem chi tiết badge
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
        <Avatar
          src={details.image} // Sử dụng hình ảnh SVG làm avatar
          sx={{
            width: 80,
            height: 80,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        >
          {/* Fallback icon nếu hình ảnh không load */}
          <EmojiEvents sx={{ fontSize: 40 }} />
        </Avatar>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.3,
                  mb: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                {badge.title}
              </Typography>
              {/* <Typography variant="body2" color="textSecondary">
                its - gamify
              </Typography> */}
            </Box>
          </Box>

          {/* Main Details */}
          <Stack
            direction="row"
            spacing={4}
            sx={{ mb: 2, flexWrap: "wrap", gap: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person
                sx={{ fontSize: 18, color: theme.palette.text.secondary }}
              />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Người nhận
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {badge.user?.full_name || "Bạn"}{" "}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday
                sx={{ fontSize: 18, color: theme.palette.text.secondary }}
              />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Ngày nhận
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatDateToVietnamese(badge.created_date)}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Additional Info */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}
          >
            <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
              Mô tả:
            </Typography>
            <Chip
              label={badge.description}
              size="small"
              variant="outlined"
              color="primary"
            />
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};
