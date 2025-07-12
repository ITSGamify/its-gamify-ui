// src/pages/QuizPage.tsx
import { CircularProgress, Container } from "@mui/material";
import { useQuizPage } from "@hooks/data/useQuizPage";
import { QuizTaking } from "@components/ui/molecules/QuizTaking";
import { QuizMode } from "@interfaces/api/quiz";
import { QuizReview } from "@components/ui/molecules/QuizReview";

const QuizPage: React.FC = () => {
  const { quizData, handleSubmitQuiz, mode, quizResult, handleBackToLesson } =
    useQuizPage();

  if (!quizData) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }
  return (
    <Container maxWidth="xl">
      {mode === QuizMode.TAKING ? (
        <QuizTaking
          quiz={quizData}
          onSubmit={handleSubmitQuiz}
          onBack={() => {
            /* Navigate back to course */
          }}
        />
      ) : (
        <QuizReview
          quiz={quizData}
          quizResult={quizResult!}
          onBack={handleBackToLesson}
        />
      )}
    </Container>
  );
};

export default QuizPage;
