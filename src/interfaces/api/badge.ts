import { User } from "./user";

export type BadgeType =
  | "KNOWLEDGE_SEEKER"
  | "QUIZ_MASTER"
  | "SKILL_BUILDER"
  | "OUTSTANDING_ACHIEVEMENT"
  | "EXPLORER"
  | "CERTIFICATE_HUNTER"
  | "FIRST_VICTORY"
  | "COMBO_MASTER"
  | "INVINCIBLE"
  | "TOP_CHALLENGER";

export interface Badge {
  id: string;
  title: string;
  type: BadgeType;
  description: string;
  user_id: string;
  created_date: string;
  user: User;
}
