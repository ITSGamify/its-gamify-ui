import { User } from "@interfaces/shared/user";
import { Department } from "./department";
import { StorageFile } from "./file";
import { LearningProgress } from "./learningProgress";
import { Module } from "./lesson";

export type ParticipationStatus = "IN_PROGRESS" | "COMPLETED";

export interface Category {
  name: string;
  id: string;
}

export interface Course {
  id: string;
  title: string;
  sessions: number;
  department_id: string;
  deparment?: Department;
  reviews: number;
  category_id?: string;
  category?: Category;
  level?: string;
  thumbnail_image_id?: string;
  thumbnail_image?: string;
  introduction_video_id?: string;
  short_description?: string;
  description?: string;
  tags?: string[];
  modules?: Module[];
  file_ids: string[];
  requirement: string;
  targets: string[];
  duration_in_hours: number;
  classify: string;
  status: string;
  introduction_video?: string;
  learning_materials?: Material[];
  course_participations?: Participation[];
  created_date: Date;
  is_optional:boolean;
  quarter_id:string;
  quarter?: Quater;
  image_files: StorageFile[] | null;
}

export interface Quater {
  id: string;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
}

export interface Material {
  id: string;
  url: string;
  name: string;
  file_id: string;
  type: string;
  size: number;
  course_id: string;
  created_date: string;
}

export interface Participation {
  id: string;
  enrolled_Date: Date;
  user_id: string;
  course_id: string;
  status: ParticipationStatus;
  course: Course;
  created_date: Date;
  learning_progresses: LearningProgress[];
}

export interface CourseResult {
  course_id: string;
  course: Course;
  user_id: string;
  user: User;
  course_participation_id: string;
  course_participation: Participation;
  id: string;
  scrore: number;
  is_passed: boolean;
  completed_date: string;
}
