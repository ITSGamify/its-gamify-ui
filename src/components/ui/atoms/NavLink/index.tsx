import React from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface NavLinkProps {
  path: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ path, label }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Box
      component="a"
      onClick={() => navigate(path)}
      sx={{
        mx: 2,
        cursor: "pointer",
        fontWeight: 500,
        fontSize: "1rem",
        padding: "0px 18px",
        textDecoration: "none",
        color: isActive ? "#119B78" : "text.primary",
        display: "flex",
        alignItems: "center",
        height: "100%",
        position: "relative",
        "&:hover": { color: "primary.main" },
      }}
    >
      {label}
      {isActive && (
        <Box
          component={motion.div}
          layoutId="activeNavIndicator"
          sx={{
            position: "absolute",
            bottom: -18,
            left: 0,
            width: "100%",
            height: "3px",
            backgroundColor: "#119B78",
            borderRadius: "1px 1px 0 0",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Box>
  );
};

export default NavLink;
