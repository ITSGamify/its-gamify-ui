import { Lesson } from "./lesson";

export type ProgressStatus = "IN_PROGRESS" | "COMPLETED";

export interface LearningProgress {
  lesson_id: string;
  lesson: Lesson;
  status: ProgressStatus;
  last_accessed: Date;
  course_participation_id: string;
  video_time_position: number;
}
