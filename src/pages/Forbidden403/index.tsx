// src/pages/ErrorPages/Forbidden403/index.tsx
import React from "react";
import ErrorLayout from "@components/layout/ErrorLayout";
import { Box, useTheme } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";

const Forbidden403: React.FC = () => {
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
      <BlockIcon
        sx={{
          fontSize: 180,
          color: theme.palette.error.main,
          opacity: 0.8,
        }}
      />
    </Box>
  );

  return (
    <ErrorLayout
      code="403"
      title="Truy cập bị từ chối"
      description="Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi."
      illustration={illustration}
      onClick={handleBackToHome}
      onBack={handleBack}
    />
  );
};

export default Forbidden403;
