import { Quarter } from "./course";
import { User } from "./user";

export interface Metric {
  id: string;
  course_participated_num: number;
  course_completed_num: number;
  challenge_participate_num: number;
  challenge_award_num: number;
  point_in_quarter: number;
  user_id: string;
  user: User;
  quarter_id: string;
  quarter: Quarter;
}
