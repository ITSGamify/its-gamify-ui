import { Participation } from "./course";

export interface CourseReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  course_id: string;
  course_participationId: string;
  course_participation: Participation;
  reviewd_date: string;
}
