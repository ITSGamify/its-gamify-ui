import { Category, Course } from "./course";
import { User } from "./user";

export type RoomStatus = "WAITING" | "PLAYING" | "FINISHED" | "FULL";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  num_of_room: number;
  thumbnail_image: string;
  course_id: string;
  category_id: string;
  category: Category;
  thumbnail_image_id: string;
  course: Course;
}

export interface Room {
  id: string;
  question_count: number;
  time_per_question: number;
  bet_points: number;
  challenge_id: string;
  host_user_id: string;
  host_user: User;
  status: RoomStatus;
  opponent_user_id: string | null;
  opponent_user: User;
  is_host_ready: boolean;
  is_opponent_ready: boolean;
  is_abandoned: boolean;
  created_date: string;
}
