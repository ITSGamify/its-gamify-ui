import React from "react";
import { Box, Typography, Avatar, LinearProgress } from "@mui/material";

interface EmployeeHeaderProps {
  name: string;
  role: string;
  totalProgress: number;
  avatarInitials: string;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({
  name,
  role,
  totalProgress,
  avatarInitials,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <Avatar
        sx={{
          bgcolor: "linear-gradient(135deg, #667eea, #764ba2)",
          width: 48,
          height: 48,
        }}
      >
        {avatarInitials}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          {name} - {role === "LEADER" ? "Trưởng phòng" : "Nhân viên"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tổng tiến độ: {totalProgress}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={totalProgress}
          sx={{
            mt: 1,
            height: 6,
            borderRadius: 1,
            bgcolor: "#f1f5f9",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #10b981, #34d399)",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default EmployeeHeader;
