export type LessonType = "video" | "article" | "quiz";
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
