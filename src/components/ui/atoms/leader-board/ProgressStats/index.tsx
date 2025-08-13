import React from "react";
import { Box, Button, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

interface ProgressStatsProps {
  completed: number;
  overdue: number;
  onViewAll: () => void;
  onRemind: () => void;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  completed,
  overdue,
  onViewAll,
  onRemind,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <Badge
          sx={{ bgcolor: "#dcfce7", color: "#16a34a", p: 1, borderRadius: 1 }}
        >
          {completed} hoàn thành
        </Badge>
        <Badge
          sx={{ bgcolor: "#fee2e2", color: "#dc2626", p: 1, borderRadius: 1 }}
        >
          {overdue} quá hạn
        </Badge>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<NotificationsIcon />}
          onClick={onRemind}
          sx={{ textTransform: "none" }}
        >
          Nhắc nhở
        </Button>
        <Button
          variant="text"
          onClick={onViewAll}
          sx={{ textTransform: "none" }}
        >
          Xem tất cả
        </Button>
      </Box>
    </Box>
  );
};

export default ProgressStats;
