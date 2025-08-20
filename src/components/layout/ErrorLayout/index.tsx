// src/components/layout/ErrorLayout/index.tsx
import React from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";

interface ErrorLayoutProps {
  code: string;
  title: string;
  description: string;
  illustration?: React.ReactNode;
  onClick?: () => void;
  onBack?: () => void;
}

const ErrorLayout: React.FC<ErrorLayoutProps> = ({
  code,
  title,
  description,
  illustration,
  onBack,
  onClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            p: 4,
            borderRadius: 2,
            bgcolor: "#D9EDBF",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
              mb: { xs: 3, md: 0 },
              mr: { md: 4 },
            }}
          >
            <Typography
              variant="h1"
              color="primary"
              sx={{
                fontSize: { xs: "4rem", md: "6rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
              {code}
            </Typography>
            <Typography
              variant="h4"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ mb: 4 }}
            >
              {description}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={onClick}
              >
                Về trang chủ
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={onBack}
              >
                Quay lại
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {illustration}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ErrorLayout;
