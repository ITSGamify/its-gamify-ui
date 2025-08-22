export type NotificationType =
  | "COURSE_COMPLETED"
  | "POINTS_BONUS"
  | "REMIND_COURSE";

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_date: string;
  target_entity: string;
  is_read: boolean;
  user_id: string;
  type: NotificationType;
}
