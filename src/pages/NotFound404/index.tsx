// src/pages/ErrorPages/NotFound404/index.tsx
import React from "react";
import ErrorLayout from "@components/layout/ErrorLayout";
import { Box, useTheme } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";

const NotFound404: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate(PATH.HOME);
  };

  const handleBack = () => {
    navigate(-1);
  };
  const illustration = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SearchOffIcon
        sx={{
          fontSize: 180,
          color: theme.palette.secondary.main,
          opacity: 0.8,
        }}
      />
    </Box>
  );

  return (
    <ErrorLayout
      code="404"
      title="Trang không tìm thấy"
      description="Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
      illustration={illustration}
      onClick={handleBackToHome}
      onBack={handleBack}
    />
  );
};

export default NotFound404;
