// src/components/layout/MainLayout/index.tsx
import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Header from "../../ui/atoms/Header";
import { Outlet } from "react-router-dom"; // Thêm import này
import Sidebar from "@components/ui/atoms/Sidebar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const drawerWidth = 240;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header onToggleDrawer={handleToggleDrawer} isDrawerOpen={isDrawerOpen} />

      {isMobile && (
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          open={isDrawerOpen}
          onClose={handleToggleDrawer}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#FFFFFF",
              borderRight: "1px solid rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <Sidebar onClose={handleToggleDrawer} />
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 0,
          py: 3,
          // width: { sm: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)` },
          // ml: { sm: isDrawerOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default MainLayout;
