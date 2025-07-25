// src/components/common/Logo/index.tsx
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";

const Logo: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <SchoolIcon
        sx={{
          color: theme.palette.primary.main,
          fontSize: 32,
          mr: 1,
        }}
      />
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          fontWeight: 600,
          color: theme.palette.primary.main,
        }}
      >
        Its-Gamify
      </Typography>
    </Box>
  );
};

export default Logo;
