import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Typography,
  Box,
} from "@mui/material";

interface Course {
  name: string;
  progress: number;
  deadline: string;
  status: string;
  remaining: string;
}

interface CourseTableProps {
  courses: Course[];
}

const CourseTable: React.FC<CourseTableProps> = ({ courses }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "#16a34a";
      case "Đang học":
        return "#d97706";
      case "Quá hạn":
        return "#dc2626";
      case "Chưa bắt đầu":
        return "#6b7280";
      default:
        return "grey";
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, overflowX: "auto" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {["KHÓA HỌC", "TIẾN ĐỘ", "DEADLINE", "TRẠNG THÁI", "CÒN LẠI"].map(
              (header) => (
                <TableCell
                  key={header}
                  sx={{ fontWeight: 700, bgcolor: "#f1f5f9" }}
                >
                  {header}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course, index) => (
            <TableRow key={index}>
              <TableCell>{course.name}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress}
                    sx={{
                      width: 100,
                      height: 6,
                      borderRadius: 1,
                      bgcolor: "#f1f5f9",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getStatusColor(course.status),
                      },
                    }}
                  />
                  <Typography>{course.progress}%</Typography>
                </Box>
              </TableCell>
              <TableCell>{course.deadline}</TableCell>
              <TableCell
                sx={{ color: getStatusColor(course.status), fontWeight: 600 }}
              >
                {course.status}
              </TableCell>
              <TableCell>{course.remaining}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CourseTable;
