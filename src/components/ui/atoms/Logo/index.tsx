// src/components/common/Logo/index.tsx
import React from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import logoImage from "@assets/images/f-study_official_logo.png";
import { PATH } from "@constants/path";

const Logo: React.FC = () => {
  return (
    <Box
      component={Link}
      to={PATH.LANDING}
      sx={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
        margin: "5px 0px 5px 5px",
      }}
    >
      <Box
        component="img"
        src={logoImage}
        alt="F-Study Logo"
        sx={{
          height: 50,
          width: 100,
        }}
      />
    </Box>
  );
};

export default Logo;
