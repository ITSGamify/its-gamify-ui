export function getClassifyInVietnamese(classify: string): string {
  switch (classify) {
    case "LEADERONLY":
      return "Trưởng phòng";
    case "DEPARTMENTONLY":
      return "Phòng ban";
    default:
      return "Tất cả";
  }
}
