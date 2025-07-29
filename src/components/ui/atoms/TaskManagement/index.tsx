// src/components/TaskManagement.tsx
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  styled,
  Tabs,
  Tab,
  Divider,
  Fade,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { alpha, useTheme } from "@mui/material/styles";
import { TaskStatusType } from "@interfaces/shared/home";
import { LearningProgress } from "@interfaces/api/learningProgress";
import { ALL, COMPLETED, ENROLLED } from "@constants/course";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  height: "100%",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
}));

interface StatusChipProps {
  status: TaskStatusType;
}

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})<StatusChipProps>(({ theme, status }) => {
  let backgroundColor = alpha(theme.palette.primary.main, 0.16);
  let color = theme.palette.primary.main;

  if (status === "COMPLETED") {
    backgroundColor = alpha(theme.palette.success.main, 0.16);
    color = theme.palette.success.main;
  } else if (status === "IN_PROGRESS") {
    backgroundColor = alpha(theme.palette.warning.main, 0.16);
    color = theme.palette.warning.main;
  }

  return {
    backgroundColor,
    color,
    fontWeight: 600,
    "& .MuiChip-label": {
      padding: "0 8px",
    },
  };
});

interface TaskManagementProps {
  tasks: LearningProgress[];
  progressClassify?: string;
  handleClassifyProgress: (type: string) => void;
}

// Component chính
const TaskManagement = ({
  tasks,
  progressClassify,
  handleClassifyProgress,
}: TaskManagementProps) => {
  const theme = useTheme();

  return (
    <StyledCard>
      <CardHeader
        title="Quản lý công việc"
        titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
        sx={{ pb: 0 }}
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={progressClassify}
          onChange={(_, newValue) => handleClassifyProgress(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value={ALL} label="Tất cả" />
          <Tab value={ENROLLED} label="Đang thực hiện" />
          <Tab value={COMPLETED} label="Hoàn thành" />
        </Tabs>
      </Box>

      <CardContent>
        {tasks.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={200}
            flexDirection="column"
            textAlign="center"
          >
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Không có công việc nào
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hãy bắt đầu một khóa học mới để thêm công việc!
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {tasks.map((task) => (
              <Fade in key={task.lesson_id} timeout={500}>
                <Card
                  sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {task.lesson.title}
                    </Typography>
                    <StatusChip
                      label={
                        task.status === "COMPLETED"
                          ? "Hoàn thành"
                          : "Đang tiến hành"
                      }
                      status={task.status as TaskStatusType}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {task.lesson.content || "Không có mô tả"}
                  </Typography>

                  <Divider sx={{ mb: 1 }} />

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                  >
                    <Box display="flex" gap={3}>
                      <Box display="flex" alignItems="center">
                        <CalendarTodayIcon
                          fontSize="small"
                          color="action"
                          sx={{ mr: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(task.last_accessed), {
                            addSuffix: true,
                            locale: vi,
                          }) || "Chưa truy cập"}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center">
                        <AttachmentIcon
                          fontSize="small"
                          color="action"
                          sx={{ mr: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          0 tệp đính kèm{" "}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Thêm progress nếu là video */}
                    {task.video_time_position > 0 && (
                      <Typography variant="caption" color="primary">
                        Tiến độ video: {task.video_time_position} giây
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Fade>
            ))}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default TaskManagement;
