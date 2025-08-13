import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import EmployeeHeader from "@components/ui/atoms/leader-board/EmployeeHeader";
import ProgressStats from "@components/ui/atoms/leader-board/ProgressStats";
import CourseTable from "@components/ui/atoms/leader-board/CourseTable";
import EmployeeList from "@components/ui/atoms/leader-board/EmployeeList";

// Dữ liệu static từ OCR (đã sửa lỗi chính tả)
const employeesData = [
  {
    name: "Nguyễn Văn Minh",
    role: "Senior Developer",
    totalProgress: 75,
    avatarInitials: "NM",
    completed: 2,
    overdue: 1,
    courses: [
      {
        name: "An toàn thông tin cơ bản",
        progress: 100,
        deadline: "2024-01-15",
        status: "Hoàn thành",
        remaining: "Hôm nay",
      },
      {
        name: "Kỹ năng lập trình Java",
        progress: 100,
        deadline: "2024-01-20",
        status: "Hoàn thành",
        remaining: "Hôm nay",
      },
      {
        name: "Quản lý dự án Agile",
        progress: 75,
        deadline: "2024-02-10",
        status: "Đang học",
        remaining: "15 ngày",
      },
      {
        name: "Thiết kế hệ thống",
        progress: 45,
        deadline: "2024-02-15",
        status: "Đang học",
        remaining: "20 ngày",
      },
      {
        name: "DevOps và CI/CD",
        progress: 0,
        deadline: "2024-02-20",
        status: "Chưa bắt đầu",
        remaining: "25 ngày",
      },
      {
        name: "Microservices Architecture",
        progress: 0,
        deadline: "2024-02-25",
        status: "Chưa bắt đầu",
        remaining: "30 ngày",
      },
    ],
  },
];

const additionalEmployees = [
  { name: "Phạm Thị Lan", role: "QA Engineer", avatarInitials: "PT" },
  { name: "Hoàng Văn Đức", role: "Junior Developer", avatarInitials: "HV" },
  // Thêm từ OCR
];

const EmployeeLearningProgressPage = () => {
  return (
    <Box sx={{ p: 4, bgcolor: "#f7f9fc" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Danh sách nhân viên khác
      </Typography>
      <EmployeeList employees={additionalEmployees} />
      <Typography variant="h5" fontWeight={700} sx={{ mb: 4 }}>
        Tiến độ học tập nhân viên
      </Typography>
      <Grid container spacing={3}>
        {employeesData.map((emp, index) => (
          <Grid size={{ xs: 12, md: 12 }} key={index}>
            <Card sx={{ borderRadius: 4, boxShadow: 1 }}>
              <CardContent>
                <EmployeeHeader
                  name={emp.name}
                  role={emp.role}
                  totalProgress={emp.totalProgress}
                  avatarInitials={emp.avatarInitials}
                />
                <ProgressStats
                  completed={emp.completed}
                  overdue={emp.overdue}
                  onViewAll={() => console.log("View all")}
                  onRemind={() => console.log("Remind")}
                />
                <CourseTable courses={emp.courses} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Danh sách nhân viên thêm */}
    </Box>
  );
};

export default EmployeeLearningProgressPage;
