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
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  question_count: number;
  time_per_question: number;
  bet_points: number;
  challenge_id: string;
  challenge: Challenge;
  host_user_id: string;
  host_user: User;
  status: RoomStatus;
  room_code: string;
  created_date: string;
  current_question_index: number;
  current_question_id: string;
  room_users: RoomUser[];
  max_players: number;
}

export interface RoomUser {
  id: string;
  user_id: string;
  user: User;
  is_out_room: boolean;
  current_score: number;
  correct_answers: number;
  is_current_question_answered: boolean;
}

export type HistoryStatus = "WIN" | "LOSE" | "DRAW";
export interface History {
  id: string;
  your_score: number;
  winner_score: number;
  user_id: string;
  user: User;
  winner_id: string;
  winner: User;
  rank: number;
  points: number;
  challenge_id: string;
  challenge: Challenge;
  status: HistoryStatus;
  created_date: string;
}
