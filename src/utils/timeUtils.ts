/**
 * Xác định thời điểm trong ngày dựa trên giờ hiện tại
 * @returns Chuỗi thể hiện thời điểm trong ngày: "buổi sáng", "buổi trưa", "buổi chiều", hoặc "buổi tối"
 */
export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "buổi sáng";
  } else if (hour >= 12 && hour < 14) {
    return "buổi trưa";
  } else if (hour >= 14 && hour < 18) {
    return "buổi chiều";
  } else {
    return "buổi tối";
  }
};