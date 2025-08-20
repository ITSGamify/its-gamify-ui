// src/pages/ErrorPages/ServerError500/index.tsx
import React from "react";
import ErrorLayout from "@components/layout/ErrorLayout";
import { Box, useTheme } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import { PATH } from "@constants/path";

const ServerError500: React.FC = () => {
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
      <ErrorOutlineIcon
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
      code="500"
      title="Lỗi máy chủ"
      description="Xin lỗi, đã xảy ra lỗi từ phía máy chủ. Chúng tôi đang khắc phục sự cố này. Vui lòng thử lại sau."
      illustration={illustration}
      onClick={handleBackToHome}
      onBack={handleBack}
    />
  );
};

export default ServerError500;
