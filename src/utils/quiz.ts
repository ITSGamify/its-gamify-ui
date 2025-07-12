import { Answer } from "@interfaces/api/quiz";

// src/utils/quiz.utils.ts
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export const calculateCompletionPercentage = (
  answers: Answer[],
  totalQuestions: number
): number => {
  return Math.round(
    (answers.filter((a) => a.answer !== null).length / totalQuestions) * 100
  );
};

export const getAnswerLabel = (option: string): string => {
  const labels: Record<string, string> = {
    answer_a: "A",
    answer_b: "B",
    answer_c: "C",
    answer_d: "D",
  };
  return labels[option] || option;
};
