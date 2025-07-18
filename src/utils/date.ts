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

/**
 * Formats an ISO date string to English format
 * @param isoDateString - The ISO date string to format
 * @returns Formatted date string in English (e.g., "Monday, January 1, 2023")
 */
export function formatDateToEnglish(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);

    // Format options for English locale
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Format the date using English (US) locale
    return date.toLocaleDateString("en-US", options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const isDateInRange = (
  date: string,
  from?: string,
  to?: string
): boolean => {
  const checkDate = new Date(date);

  if (from && checkDate < new Date(from)) return false;
  if (to && checkDate > new Date(to)) return false;

  return true;
};
