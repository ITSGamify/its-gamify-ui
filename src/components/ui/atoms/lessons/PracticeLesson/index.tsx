// src/pages/PracticePage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
  LinearProgress,
} from "@mui/material";
import {
  VolumeUp as SpeakIcon,
  Shuffle as ShuffleIcon,
} from "@mui/icons-material";
import {
  LessonContentProps,
  NavButton,
  NavigationContainer,
} from "@components/ui/molecules/course-detail/CourseDetailMainContent";
import { Practice } from "@interfaces/api/lesson";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ProgressRequestParams } from "@services/progress";
import { toast } from "react-toastify";
import ToastContent from "../../Toast";

// Styled components
const PracticeContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(0, 0),
  },
}));

const FlashCard = styled(Card)<{ flipped: boolean }>(({ theme, flipped }) => ({
  height: "320px", // Thêm 'px' rõ ràng để ổn định
  width: "100%",
  position: "relative",
  transition: "transform 0.6s ease-in-out",
  transformStyle: "preserve-3d",
  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
  cursor: "pointer",
  boxShadow: theme.shadows[3],
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
  overflow: "visible", // Thêm để tránh clip nội dung
}));

const CardFace = styled(CardContent)<{ isBack?: boolean }>(
  ({ theme, isBack }) => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(4),
    transform: isBack ? "rotateY(180deg)" : "rotateY(0deg)",
  })
);

enum PracticeMode {
  FLASHCARDS = "flashcards",
  LEARN = "learn",
  MATCH = "match",
  TEST = "test",
}

const PracticeLesson = ({
  lesson,
  isMoving,
  handleMoveToNext,
  participation,
}: LessonContentProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();

  const [activeMode, setActiveMode] = useState<PracticeMode>(
    PracticeMode.FLASHCARDS
  );

  const [flashcards, setFlashcards] = useState<Practice[]>(
    lesson.practices || []
  );
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState(0);

  // Update progress when current card changes
  useEffect(() => {
    setProgress(((currentCardIndex + 1) / flashcards.length) * 100);
  }, [currentCardIndex, flashcards.length]);

  // Handle tab change
  const handleModeChange = (
    _event: React.SyntheticEvent,
    newMode: PracticeMode
  ) => {
    setActiveMode(newMode);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setUserAnswer("");
  };

  // Flashcard navigation
  const handlePrevCard = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
      setUserAnswer("");
    }
  }, [currentCardIndex]);

  const handleNextCard = useCallback(() => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
      setUserAnswer("");
    }
  }, [currentCardIndex, flashcards.length]);

  // Shuffle cards
  const shuffleCards = useCallback(() => {
    setFlashcards(shuffleArray([...flashcards]));
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  // Utility function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN"; // Vietnamese language
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateQuizQuestions = useCallback(() => {
    const currentCard = flashcards[currentCardIndex];
    const otherCards = flashcards.filter((card) => card.id !== currentCard.id);
    const shuffledOthers = shuffleArray(otherCards).slice(0, 3);
    const options = shuffleArray([...shuffledOthers, currentCard]);

    return options;
  }, [currentCardIndex, flashcards]);

  const renderFlashcards = useCallback(
    () => (
      <Box>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6">
              Thẻ ghi nhớ {currentCardIndex + 1}/{flashcards.length}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
          </Box>
          <Box>
            <Button
              startIcon={<ShuffleIcon />}
              onClick={shuffleCards}
              sx={{ mr: 1 }}
            >
              Xáo trộn
            </Button>
          </Box>
        </Box>

        {/* Wrapper với perspective để fix hiệu ứng lật 3D */}
        <Box sx={{ perspective: "1000px" }}>
          <FlashCard
            flipped={isFlipped}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Mặt trước: Question (thuật ngữ) */}
            <CardFace>
              <Typography variant="h4" align="center" gutterBottom>
                {flashcards[currentCardIndex].question}
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  display: "flex",
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(flashcards[currentCardIndex].question);
                  }}
                >
                  <SpeakIcon />
                </IconButton>
              </Box>
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                gutterBottom
              >
                Nhấp để xem định nghĩa
              </Typography>
            </CardFace>

            {/* Mặt sau: Answer (định nghĩa) */}
            <CardFace isBack>
              <Typography variant="h5" align="center" gutterBottom>
                {flashcards[currentCardIndex].answer}
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  display: "flex",
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(flashcards[currentCardIndex].answer);
                  }}
                >
                  <SpeakIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="textSecondary" align="center">
                Nhấp để xem thuật ngữ
              </Typography>
            </CardFace>
          </FlashCard>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0}
            sx={{
              color: currentCardIndex === 0 ? "text.disabled" : "primary.main",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={handleNextCard}
            disabled={currentCardIndex === flashcards.length - 1}
            sx={{
              color:
                currentCardIndex === flashcards.length - 1
                  ? "text.disabled"
                  : "primary.main",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    ),
    [
      currentCardIndex,
      flashcards,
      handleNextCard,
      handlePrevCard,
      isFlipped,
      progress,
      shuffleCards,
    ]
  );

  const renderTestMode = useCallback(() => {
    const quizOptions = generateQuizQuestions();

    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">
            Kiểm tra {currentCardIndex + 1}/{flashcards.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 1, height: 8, borderRadius: 4 }}
          />
        </Box>

        <Card sx={{ mb: 4, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {flashcards[currentCardIndex].question}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" gutterBottom>
            Chọn định nghĩa đúng:
          </Typography>

          {quizOptions.map((option) => (
            <Button
              key={option.id}
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
                justifyContent: "flex-start",
                textAlign: "left",
                py: 1.5,
                ...(showAnswer &&
                  option.id === flashcards[currentCardIndex].id && {
                    bgcolor: "success.light",
                    borderColor: "success.main",
                  }),
                ...(showAnswer &&
                  option.id === userAnswer &&
                  option.id !== flashcards[currentCardIndex].id && {
                    bgcolor: "error.light",
                    borderColor: "error.main",
                  }),
              }}
              onClick={() => {
                if (!showAnswer) {
                  setUserAnswer(option.id.toString());
                  setShowAnswer(true);
                }
              }}
              disabled={showAnswer}
            >
              <Typography>{option.answer}</Typography>
            </Button>
          ))}

          {showAnswer && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  if (currentCardIndex < flashcards.length - 1) {
                    handleNextCard();
                  } else {
                    toast.success(ToastContent, {
                      data: {
                        message: "Chúc mừng bạn đã trả lời hết câu hỏi!",
                      },
                    });
                  }
                }}
              >
                {currentCardIndex < flashcards.length - 1
                  ? "Câu tiếp theo"
                  : "Kết thúc"}
              </Button>
            </Box>
          )}
        </Card>
      </Box>
    );
  }, [
    currentCardIndex,
    flashcards,
    generateQuizQuestions,
    handleNextCard,
    progress,
    showAnswer,
    userAnswer,
  ]);

  const params: ProgressRequestParams = {
    lesson_id: lesson.id,
    type: lesson.type,
    status: "COMPLETED",
    course_participation_id: participation.id,
  };

  return (
    <>
      <PracticeContainer maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Luyện tập
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Sử dụng các phương pháp học tập khác nhau để ghi nhớ hiệu quả.
        </Typography>

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeMode}
            onChange={handleModeChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Thẻ ghi nhớ" value={PracticeMode.FLASHCARDS} />
            <Tab label="Kiểm tra" value={PracticeMode.TEST} />
          </Tabs>
        </Paper>

        {activeMode === PracticeMode.FLASHCARDS && renderFlashcards()}
        {activeMode === PracticeMode.TEST && renderTestMode()}
      </PracticeContainer>
      <NavigationContainer>
        <NavButton
          variant="outlined"
          color="inherit"
          sx={{ borderColor: "divider", color: "text.secondary" }}
          disabled={isMoving}
        >
          Trước
        </NavButton>

        <NavButton
          variant="contained"
          color="primary"
          disabled={isMoving}
          onClick={() => handleMoveToNext(params)}
        >
          Tiếp Theo
        </NavButton>
      </NavigationContainer>
    </>
  );
};

export default PracticeLesson;
