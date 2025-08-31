// src/components/layout/Header/index.tsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  InputBase,
  useMediaQuery,
  useTheme,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  MilitaryTech as MilitaryTechIcon,
  WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Logo from "../Logo";
import NavLink from "../NavLink";
import { PATH } from "@constants/path";
import userSession from "@utils/user-session";
import BarChartIcon from "@mui/icons-material/BarChart";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { RoleEnum } from "@interfaces/api/user";
import {
  useInfiniteNotifications,
  useUpdateAllNotification,
  useUpdateNotification,
} from "@services/notification";
import { Notification } from "@interfaces/api/notification";
import { formatDate } from "@utils/date";
import { useSignalR } from "@providers/SignalRContext";
import { toast } from "react-toastify";
import ToastContent from "../Toast";
import { CheckCircle, Star, Notifications } from "@mui/icons-material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  color: theme.palette.text.primary,
  boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.05)",
  zIndex: theme.zIndex.drawer + 1,
}));

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: alpha(theme.palette.common.black, 0.4),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

// Navigation links data
const navigationLinks = [
  { path: PATH.HOME, label: "Tổng quan" },
  { path: PATH.COURSES, label: "Khóa học" },
  { path: PATH.TOURNAMENT, label: "Đấu trường" },
  { path: PATH.LEADER_BOARD, label: "Bảng xếp hạng" },
];
const MAX_TITLE_LENGTH = 50;
interface HeaderProps {
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleDrawer }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const profile = userSession.getUserProfile();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    // Xử lý đăng xuất
    handleMenuClose();
    userSession.clearUserProfile();
    navigate(PATH.LOGIN);
  };

  // Menu ID
  const menuId = "primary-account-menu";
  const notificationMenuId = "notification-menu";

  const { connection } = useSignalR();

  connection?.on("NotificationMessage", (notificationJson: string) => {
    const notification: Notification = JSON.parse(notificationJson);
    if (notification.user_id === profile?.user.id) {
      setNotification((prev) => {
        const notificationExists = prev.some((n) => n.id === notification.id);

        if (notificationExists) {
          return [...prev];
        } else {
          toast.success(ToastContent, {
            data: {
              message: notification.message,
            },
          });
          return [notification, ...prev];
        }
      });
    }
  });

  // Profile Menu
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 2,
        sx: {
          minWidth: 200,
          borderRadius: 2,
          mt: 1.5,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {profile?.user.full_name.toUpperCase() || "Người dùng"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {profile?.user.email || "Người dùng"}
        </Typography>
      </Box>
      <Divider />
      {profile?.user.role === RoleEnum.LEADER && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(PATH.METRIC);
          }}
        >
          <ListItemIcon>
            <BarChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Thống kê</ListItemText>
        </MenuItem>
      )}
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate(PATH.CERTIFICATE);
        }}
      >
        <ListItemIcon>
          <WorkspacePremiumIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Chứng chỉ</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate(PATH.BADGE);
        }}
      >
        <ListItemIcon>
          <MilitaryTechIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Thành tích</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate(PATH.TOURNAMENT_MATCH_HISTORY);
        }}
      >
        <ListItemIcon>
          <HistoryEduIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Lịch sử đấu</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate(PATH.PROFILE);
        }}
      >
        <ListItemIcon>
          <PersonOutlineIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Trang cá nhân</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Đăng xuất</ListItemText>
      </MenuItem>
    </Menu>
  );

  const { mutateAsync: updateNotification } = useUpdateNotification();
  const { mutateAsync: readAllNotifications } = useUpdateAllNotification();
  const [notifications, setNotification] = useState<Notification[]>([]);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isLoadingNotifications,
  } = useInfiniteNotifications(10);

  useEffect(() => {
    if (data) {
      const allNotifications = data.pages.flatMap((page) => page.data || []);
      setNotification(allNotifications);
    }
  }, [data]);

  const handleNotificationClick = async (notificationId: string) => {
    await updateNotification(
      { notificationId, is_read: true },
      {
        onSuccess: (notification) => {
          setNotification((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, is_read: true } : n
            )
          );
        },
      }
    );
  };

  const handleReadAllNotifications = async () => {
    await readAllNotifications(
      { is_read: true },
      {
        onSuccess: () => {
          setNotification((prev) => prev.map((n) => ({ ...n, is_read: true })));
        },
      }
    );
  };

  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      id={notificationMenuId}
      keepMounted
      open={isNotificationMenuOpen}
      onClose={handleNotificationMenuClose}
      PaperProps={{
        elevation: 2,
        sx: {
          minWidth: 320,
          maxWidth: 350,
          borderRadius: 2,
          mt: 1.5,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Thông báo
        </Typography>
        {notifications && notifications.length > 0 && (
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: 500 }}
            onClick={handleReadAllNotifications}
          >
            Đánh dấu tất cả đã đọc
          </Typography>
        )}
      </Box>
      <Divider />
      <Box sx={{ maxHeight: 320, overflow: "auto" }}>
        {isLoadingNotifications ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Đang tải...
            </Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Không có thông báo
            </Typography>
          </Box>
        ) : (
          <>
            {notifications.map((notification) => {
              // Xác định icon và color dựa trên type
              let IconComponent;
              let iconColor;

              switch (notification.type) {
                case "COURSE_COMPLETED":
                  IconComponent = CheckCircle;
                  iconColor = notification.is_read ? "action" : "primary";
                  break;
                case "POINTS_BONUS":
                  IconComponent = Star;
                  iconColor = notification.is_read ? "action" : "primary";
                  break;
                case "REMIND_COURSE":
                  IconComponent = WarningAmberIcon;
                  iconColor = notification.is_read ? "action" : "warning";
                  break;
                default:
                  IconComponent = Notifications;
                  iconColor = notification.is_read ? "action" : "primary";
              }

              // Cắt ngắn title nếu quá dài
              const displayTitle =
                notification.title &&
                notification.title.length > MAX_TITLE_LENGTH
                  ? `${notification.title.slice(0, MAX_TITLE_LENGTH)}...`
                  : notification.title || "Tiêu đề thông báo";

              return (
                <MenuItem
                  key={notification.id}
                  onClick={() => {
                    handleNotificationClick(notification.id);
                    handleNotificationMenuClose();
                  }}
                  sx={{
                    py: 1.5,
                    backgroundColor: notification.is_read
                      ? "inherit"
                      : "action.hover",
                  }}
                >
                  <ListItemIcon>
                    <IconComponent
                      fontSize="small"
                      color={
                        iconColor as
                          | "inherit"
                          | "action"
                          | "primary"
                          | "warning"
                          | "disabled"
                          | "secondary"
                          | "error"
                          | "info"
                          | "success"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: notification.is_read ? "normal" : "bold",
                      }}
                    >
                      {displayTitle}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {notification.created_date
                          ? formatDate(notification.created_date)
                          : "Thời gian không xác định"}
                      </Typography>
                      {notification.is_read && (
                        <Typography variant="caption" color="text.secondary">
                          Đã xem
                        </Typography>
                      )}
                    </Box>
                  </ListItemText>
                </MenuItem>
              );
            })}
            {hasNextPage && (
              <MenuItem
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                sx={{ justifyContent: "center" }}
              >
                <Typography color="primary" sx={{ fontWeight: 500 }}>
                  {isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
                </Typography>
              </MenuItem>
            )}
          </>
        )}
      </Box>
    </Menu>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={onToggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Logo />
          {!isMobile && (
            <Box sx={{ display: "flex", ml: 3, height: "100%" }}>
              {navigationLinks.map((link) => (
                <NavLink key={link.path} path={link.path} label={link.label} />
              ))}
            </Box>
          )}
          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {!isMobile && (
              <Tooltip title="Tìm kiếm">
                <Box sx={{ position: "relative" }}>
                  {!isSearchOpen ? (
                    <IconButton
                      color="inherit"
                      onClick={() => setIsSearchOpen(true)}
                    >
                      <SearchIcon />
                    </IconButton>
                  ) : (
                    <SearchWrapper onBlur={() => setIsSearchOpen(false)}>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Tìm kiếm..."
                        inputProps={{ "aria-label": "search" }}
                        autoFocus
                      />
                    </SearchWrapper>
                  )}
                </Box>
              </Tooltip>
            )}
            <Tooltip title="Thông báo">
              <IconButton
                size="large"
                color="inherit"
                aria-label="show notifications"
                aria-controls={notificationMenuId}
                aria-haspopup="true"
                onClick={handleNotificationMenuOpen}
              >
                <StyledBadge
                  badgeContent={notifications.filter((n) => !n.is_read).length}
                  color="error"
                >
                  <NotificationsIcon />
                </StyledBadge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Tài khoản">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar alt="User Avatar" sx={{ width: 32, height: 32 }}>
                  {profile?.user.full_name
                    ? profile.user.full_name.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </StyledAppBar>
      {renderMenu}
      {renderNotificationMenu}
    </>
  );
};

export default Header;
