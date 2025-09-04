export interface CourseStat {
  name: string; // Tên khóa học, e.g., "An toàn thông tin cơ bản"
  progress: number; // Tiến độ (0-100), e.g., 100
  deadline: string; // Deadline dạng chuỗi, e.g., "2024-01-15"
  status: string; // Trạng thái, e.g., "Hoàn thành", "Đang học", "Chưa bắt đầu"
  remaining: string; // Thời gian còn lại, e.g., "Hôm nay", "15 ngày"
}

export interface EmployeeStat {
  name: string; // Tên nhân viên, e.g., "Nguyễn Văn Minh"
  role: string; // Chức vụ, e.g., "Senior Developer"
  total_progress: number; // Tổng tiến độ (0-100), e.g., 75
  avatar_initials: string; // Chữ cái viết tắt cho avatar, e.g., "NM"
  completed: number; // Số khóa học hoàn thành, e.g., 2
  overdue: number; // Số khóa học quá hạn, e.g., 1
  courses: CourseStat[]; // Mảng các khóa học
}
