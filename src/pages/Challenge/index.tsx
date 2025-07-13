// src/pages/PracticePage.tsx
import React, { useState, useEffect } from "react";
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
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ArrowBack as PrevIcon,
  ArrowForward as NextIcon,
  Shuffle as ShuffleIcon,
} from "@mui/icons-material";

// Styled components
const PracticeContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4, 0),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6, 0),
  },
}));

const FlashCard = styled(Card)<{ flipped: boolean }>(({ theme, flipped }) => ({
  height: 320,
  width: "100%",
  position: "relative",
  transition: "transform 0.6s",
  transformStyle: "preserve-3d",
  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
  cursor: "pointer",
  boxShadow: theme.shadows[3],
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
    // Sửa lại phần này để tránh hiệu ứng lật kép
    transform: isBack ? "rotateY(180deg)" : "",
  })
);

interface FlashcardItem {
  id: number;
  term: string;
  definition: string;
  starred: boolean;
}

// Sample flashcard data
const sampleFlashcards: FlashcardItem[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: i + 1,
    term: `Thuật ngữ ${i + 1}`,
    definition: `Đây là định nghĩa cho thuật ngữ số ${
      i + 1
    }. Mô tả chi tiết về ý nghĩa và cách sử dụng.`,
    starred: false,
  })
);

// Practice modes enum
enum PracticeMode {
  FLASHCARDS = "flashcards",
  LEARN = "learn",
  MATCH = "match",
  TEST = "test",
}

const ChallengePage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const [activeMode, setActiveMode] = useState<PracticeMode>(
    PracticeMode.FLASHCARDS
  );
  const [flashcards, setFlashcards] =
    useState<FlashcardItem[]>(sampleFlashcards);
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
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
      setUserAnswer("");
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
      setUserAnswer("");
    }
  };

  // Toggle star status
  const toggleStar = (id: number) => {
    setFlashcards(
      flashcards.map((card) =>
        card.id === id ? { ...card, starred: !card.starred } : card
      )
    );
  };

  // Shuffle cards
  const shuffleCards = () => {
    setFlashcards(shuffleArray([...flashcards]));
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

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

  // Generate quiz questions for test mode
  const generateQuizQuestions = () => {
    const currentCard = flashcards[currentCardIndex];
    const otherCards = flashcards.filter((card) => card.id !== currentCard.id);
    const shuffledOthers = shuffleArray(otherCards).slice(0, 3);
    const options = shuffleArray([...shuffledOthers, currentCard]);

    return options;
  };

  // Render functions for different modes
  const renderFlashcards = () => (
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

      <FlashCard flipped={isFlipped} onClick={() => setIsFlipped(!isFlipped)}>
        <CardFace>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ transform: isFlipped ? "rotateY(180deg)" : "none" }}
          >
            {flashcards[currentCardIndex].term}
          </Typography>
          <Box
            sx={{ position: "absolute", top: 16, right: 16, display: "flex" }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                speakText(flashcards[currentCardIndex].term);
              }}
            >
              <SpeakIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleStar(flashcards[currentCardIndex].id);
              }}
            >
              {flashcards[currentCardIndex].starred ? (
                <StarIcon color="warning" />
              ) : (
                <StarBorderIcon />
              )}
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            gutterBottom
            sx={{ transform: isFlipped ? "rotateY(180deg)" : "none" }}
          >
            Nhấp để xem định nghĩa
          </Typography>
        </CardFace>

        <CardFace isBack>
          <Typography variant="h5" align="center" gutterBottom>
            {flashcards[currentCardIndex].definition}
          </Typography>
          <Box
            sx={{ position: "absolute", top: 16, right: 16, display: "flex" }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                speakText(flashcards[currentCardIndex].definition);
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

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<PrevIcon />}
          onClick={handlePrevCard}
          disabled={currentCardIndex === 0}
        >
          Trước
        </Button>
        <Button
          variant="outlined"
          endIcon={<NextIcon />}
          onClick={handleNextCard}
          disabled={currentCardIndex === flashcards.length - 1}
        >
          Tiếp
        </Button>
      </Box>
    </Box>
  );

  const renderTestMode = () => {
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
            {flashcards[currentCardIndex].term}
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
                  option.id === parseInt(userAnswer) &&
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
              <Typography>{option.definition}</Typography>
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
                    // End of test
                    alert("Bạn đã hoàn thành bài kiểm tra!");
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
  };

  return (
    <PracticeContainer maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Luyện tập từ vựng
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
  );
};

export default ChallengePage;
