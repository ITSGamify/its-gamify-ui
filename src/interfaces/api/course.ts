// src/interfaces/dom/course.ts
export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isQuiz?: boolean;
  questionCount?: number;
}

export interface CourseChapter {
  id: string;
  title: string;
  progress: number;
  lessons: CourseLesson[];
}

export interface CourseDetail {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  description: string;
  chapters: CourseChapter[];
  totalChapters: number;
  totalLessons: number;
  totalDuration: string;
  coverImage: string;
}
