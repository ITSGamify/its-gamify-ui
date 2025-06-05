// src/types/index.ts

// Common types
export type ColorType =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | "default";

// Dashboard Card types
export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: ColorType;
  progress?: number;
  subtitle?: string;
}

// Course types
export interface InstructorType {
  id?: number;
  name: string;
  avatar: string;
  role?: string;
  bio?: string;
  courses?: number;
  students?: number;
  rating?: number;
}

export interface CourseCardProps {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  instructor: InstructorType;
  progress?: number;
  level?: string;
  rating?: number;
  reviews?: number;
  lessons?: number;
  students?: number;
  lastUpdated?: string;
}

// Task types
export type TaskPriorityType = "high" | "medium" | "low";
export type TaskStatusType =
  | "completed"
  | "in progress"
  | "pending"
  | "delayed";

export interface AssigneeType {
  id: number;
  name: string;
  avatar: string;
}

export interface TaskType {
  id: number;
  title: string;
  description: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  dueDate: string;
  progress: number;
  assignees: AssigneeType[];
  attachments: number;
  comments: number;
}

// Learning Progress types
export interface LessonType {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  current?: boolean;
  hasAttachment?: boolean;
  locked?: boolean;
}

export interface ModuleType {
  id: number;
  title: string;
  lessons: LessonType[];
}

export interface CourseProgressType {
  title: string;
  progress: number;
  lessons: LessonType[];
}
