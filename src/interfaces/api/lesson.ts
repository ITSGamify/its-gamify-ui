import { StorageFile } from "./file";

export type LessonType = "video" | "article" | "quiz" | "practice";
export interface QuizQuestion {
  // index: number;
  content: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  correct_answer: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
  content?: string;
  video_url?: string;
  quiz_id?: string | null;
  quiz?: Quizzes;
  index: number;
  module_id: string;
  image_files: StorageFile[] | null;
  practices?: Practice[] | null;
}

export interface Quizzes {
  total_questions: number;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  course_id: string;
  ordered_number: number;
  lessons: Lesson[];
}

export interface Practice {
  id: string;
  question: string;
  answer: string;
}
