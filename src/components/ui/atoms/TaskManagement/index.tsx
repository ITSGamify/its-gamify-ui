// src/components/TaskManagement.tsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  AvatarGroup,
  LinearProgress,
  styled,
  Tabs,
  Tab,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachmentIcon from "@mui/icons-material/Attachment";
import MessageIcon from "@mui/icons-material/Message";
import { alpha } from "@mui/material/styles";
import {
  TaskStatusType,
  TaskPriorityType,
  TaskType,
} from "@interfaces/shared/home";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  height: "100%",
}));

interface StatusChipProps {
  status: TaskStatusType;
}

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
})<StatusChipProps>(({ theme, status }) => {
  // const getStatusColor = (): string => {
  //   switch (status.toLowerCase()) {
  //     case "completed":
  //       return "success";
  //     case "in progress":
  //       return "primary";
  //     case "pending":
  //       return "warning";
  //     case "delayed":
  //       return "error";
  //     default:
  //       return "default";
  //   }
  // };

  // const color = getStatusColor();

  return {
    backgroundColor: alpha(theme.palette.primary.main, 0.16),
    color: theme.palette.primary.main,
    fontWeight: 600,
    "& .MuiChip-label": {
      padding: "0 8px",
    },
  };
});

interface PriorityDotProps {
  priority: TaskPriorityType;
}

const PriorityDot = styled("span", {
  shouldForwardProp: (prop) => prop !== "priority",
})<PriorityDotProps>(({ theme, priority }) => {
  const getPriorityColor = (): string => {
    switch (priority.toLowerCase()) {
      case "high":
        return theme.palette.error.main;
      case "medium":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: getPriorityColor(),
    display: "inline-block",
    marginRight: theme.spacing(1),
  };
});

// Component chính
const TaskManagement: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState<number>(0);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Dữ liệu mẫu
  const tasks: TaskType[] = [
    {
      id: 1,
      title: "Thiết kế UI cho trang Dashboard",
      description: "Tạo các component UI cho trang Dashboard theo Figma",
      status: "in progress",
      priority: "high",
      dueDate: "15/06/2025",
      progress: 65,
      assignees: [
        { id: 1, name: "Nguyễn Văn A", avatar: "/avatars/1.jpg" },
        { id: 2, name: "Trần Thị B", avatar: "/avatars/2.jpg" },
      ],
      attachments: 3,
      comments: 8,
    },
    {
      id: 2,
      title: "Phát triển API cho module học tập",
      description: "Xây dựng RESTful API cho quản lý khóa học và bài học",
      status: "pending",
      priority: "medium",
      dueDate: "20/06/2025",
      progress: 30,
      assignees: [{ id: 3, name: "Lê Văn C", avatar: "/avatars/3.jpg" }],
      attachments: 2,
      comments: 5,
    },
    {
      id: 3,
      title: "Tối ưu hiệu suất trang chủ",
      description: "Cải thiện thời gian tải trang và tối ưu hóa các component",
      status: "completed",
      priority: "low",
      dueDate: "10/06/2025",
      progress: 100,
      assignees: [
        { id: 4, name: "Phạm Thị D", avatar: "/avatars/4.jpg" },
        { id: 5, name: "Hoàng Văn E", avatar: "/avatars/5.jpg" },
        { id: 6, name: "Ngô Thị F", avatar: "/avatars/6.jpg" },
      ],
      attachments: 1,
      comments: 12,
    },
  ];

  // Lọc task theo tab
  const filteredTasks = (): TaskType[] => {
    switch (tabValue) {
      case 0: // All
        return tasks;
      case 1: // In Progress
        return tasks.filter(
          (task) => task.status.toLowerCase() === "in progress"
        );
      case 2: // Completed
        return tasks.filter(
          (task) => task.status.toLowerCase() === "completed"
        );
      case 3: // Pending
        return tasks.filter((task) => task.status.toLowerCase() === "pending");
      default:
        return tasks;
    }
  };

  return (
    <StyledCard>
      <CardHeader
        title="Quản lý công việc"
        action={
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        }
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Xem tất cả</MenuItem>
        <MenuItem onClick={handleMenuClose}>Thêm công việc mới</MenuItem>
        <MenuItem onClick={handleMenuClose}>Xuất báo cáo</MenuItem>
      </Menu>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tất cả" />
          <Tab label="Đang thực hiện" />
          <Tab label="Hoàn thành" />
          <Tab label="Chờ xử lý" />
        </Tabs>
      </Box>

      <CardContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {filteredTasks().map((task) => (
            <Card
              key={task.id}
              sx={{
                boxShadow: 1,
                borderRadius: 2,
                p: 2,
                "&:hover": { boxShadow: 3 },
                cursor: "pointer",
              }}
            >
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center">
                  <PriorityDot priority={task.priority} />
                  <Typography variant="subtitle1">{task.title}</Typography>
                </Box>
                <StatusChip
                  label={task.status}
                  status={task.status}
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {task.description}
              </Typography>

              <Box mb={1.5}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Tiến độ
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {task.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={task.progress}
                  color={
                    task.progress === 100
                      ? "success"
                      : task.progress > 50
                      ? "primary"
                      : "warning"
                  }
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center">
                  <AvatarGroup
                    max={3}
                    sx={{ "& .MuiAvatar-root": { width: 28, height: 28 } }}
                  >
                    {task.assignees.map((assignee) => (
                      <Avatar
                        key={assignee.id}
                        alt={assignee.name}
                        src={assignee.avatar}
                      />
                    ))}
                  </AvatarGroup>
                </Box>

                <Box display="flex" gap={2}>
                  <Box display="flex" alignItems="center">
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      ml={0.5}
                    >
                      {task.dueDate}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <AttachmentIcon fontSize="small" color="action" />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      ml={0.5}
                    >
                      {task.attachments}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <MessageIcon fontSize="small" color="action" />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      ml={0.5}
                    >
                      {task.comments}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default TaskManagement;
