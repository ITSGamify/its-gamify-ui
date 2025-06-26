// src/pages/course/components/CourseMainContent.tsx
import React from "react";
import QuizLesson from "@components/ui/atoms/lessons/QuizLesson";
import VideoLesson from "@components/ui/atoms/lessons/VideoLesson";
import ArticleLesson from "@components/ui/atoms/lessons/ArticleLesson";

export interface LessonProps {
  lesson: {
    title: string;
    description: string;
    duration?: string;
    videoUrl?: string;
    quizInfo?: {
      questionCount: number;
      timeLimit: string;
      passingScore: number;
    };
  };
}

interface CourseMainContentProps {
  courseData: {
    instructor: string;
    instructorRole: string;
    currentLesson: {
      title: string;
      description: string;
      type?: "video" | "article" | "quiz";
      videoUrl?: string;
      duration?: string;
      quizInfo?: {
        questionCount: number;
        timeLimit: string;
        passingScore: number;
      };
    };
    coverImage: string;
  };
}

const CourseMainContent: React.FC<CourseMainContentProps> = ({
  courseData,
}) => {
  // Mặc định là video nếu không có type
  const lessonType = courseData.currentLesson.type || "video";

  // Render lesson content based on type
  const renderLessonContent = () => {
    const lesson = courseData.currentLesson;

    switch (lessonType) {
      case "video":
        return <VideoLesson lesson={lesson} />;
      case "article":
        return <ArticleLesson lesson={lesson} />;
      case "quiz":
        return <QuizLesson lesson={lesson} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Render nội dung bài học dựa trên loại */}
      {renderLessonContent()}
    </>
  );
};

export default CourseMainContent;
