// Base interface cho các entity có audit fields
export interface BaseEntity {
  id: string;
  created_date: string;
  updated_date: string;
  is_deleted: boolean;
  created_by: string;
  updated_by: string;
}

// Interface cho Question
export interface Question extends BaseEntity {
  content: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  correct_answer: string;
  description: string;
  question_bank_id: string;
  quiz_id: string;
}

// Interface chính cho Quiz
export interface Quiz extends BaseEntity {
  total_mark: number;
  passed_mark: number;
  total_questions: number;
  duration: number;
  questions: Question[];
}

export interface QuizAnswer extends BaseEntity {
  answer: string | null;
  is_correct: boolean;
  question_id: string;
  question: Question;
  quiz_result_id: string;
}

export interface QuizResult extends BaseEntity {
  score: number;
  completed_date: string; // ISO string format
  is_passed: boolean;
  quiz_answers: QuizAnswer[];
}

export interface Answer {
  question_id: string;
  answer: string | null;
}

export enum QuizMode {
  TAKING = "taking",
  REVIEW = "review",
}
