// src/components/layout/Sidebar/index.tsx
import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  // Toolbar,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Book as BookIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  MenuBook as MenuBookIcon,
  Category as CategoryIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";

interface SidebarProps {
  onClose: () => void;
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [openCourses, setOpenCourses] = React.useState(false);

  const handleCoursesClick = () => {
    setOpenCourses(!openCourses);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      text: "Tổng quan",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Khóa học",
      icon: <BookIcon />,
      children: [
        {
          text: "Danh sách khóa học",
          icon: <MenuBookIcon />,
          path: "/courses",
        },
        {
          text: "Danh mục",
          icon: <CategoryIcon />,
          path: "/categories",
        },
      ],
    },
    {
      text: "Học viên",
      icon: <PeopleIcon />,
      path: "/students",
    },
    {
      text: "Giảng viên",
      icon: <SchoolIcon />,
      path: "/teachers",
    },
    {
      text: "Bài tập",
      icon: <AssignmentIcon />,
      path: "/assignments",
    },
    {
      text: "Cài đặt",
      icon: <SettingsIcon />,
      path: "/settings",
    },
  ];

  return (
    <>
      <DrawerHeader>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box sx={{ overflow: "auto", height: "100%" }}>
        <List>
          {menuItems.map((item) => {
            if (item.children) {
              return (
                <React.Fragment key={item.text}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleCoursesClick}>
                      <ListItemIcon
                        sx={{
                          color: openCourses
                            ? theme.palette.primary.main
                            : "inherit",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: openCourses ? 600 : 400,
                          color: openCourses
                            ? theme.palette.primary.main
                            : "inherit",
                        }}
                      />
                      {openCourses ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={openCourses} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItemButton
                          key={child.text}
                          sx={{ pl: 4 }}
                          selected={isActive(child.path)}
                          onClick={() => navigate(child.path)}
                        >
                          <ListItemIcon
                            sx={{
                              color: isActive(child.path)
                                ? theme.palette.primary.main
                                : "inherit",
                              minWidth: 36,
                            }}
                          >
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={child.text}
                            primaryTypographyProps={{
                              fontWeight: isActive(child.path) ? 600 : 400,
                              color: isActive(child.path)
                                ? theme.palette.primary.main
                                : "inherit",
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }

            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path)
                        ? theme.palette.primary.main
                        : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                      color: isActive(item.path)
                        ? theme.palette.primary.main
                        : "inherit",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box sx={{ p: 2, mt: "auto" }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center" }}
        >
          © 2025 FCP IT company
        </Typography>
      </Box>
    </>
  );
};

export default Sidebar;
