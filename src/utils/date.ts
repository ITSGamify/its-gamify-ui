/**
 * Format ISO date string to Vietnamese date format
 * @param isoDateString ISO date string (e.g. "2025-07-04T14:33:08.299513+07:00")
 * @returns Formatted date string in Vietnamese format
 */
export function formatDateToVietnamese(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);

    // Format options for Vietnamese locale
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Format the date using Vietnamese locale
    return date.toLocaleDateString("vi-VN", options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}
