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
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
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
  Check as CheckIcon,
  Close as CloseIcon,
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
const MatchCard = styled(Paper)<{ selected?: boolean; matched?: boolean }>(
  ({ theme, selected, matched }) => ({
    padding: theme.spacing(2),
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: theme.transitions.create(
      ["background-color", "transform", "box-shadow"],
      {
        duration: 200,
      }
    ),
    backgroundColor: matched
      ? theme.palette.success.light
      : selected
      ? theme.palette.primary.light
      : theme.palette.background.paper,
    transform: selected ? "scale(1.05)" : "scale(1)",
    boxShadow: selected ? theme.shadows[4] : theme.shadows[1],
    "&:hover": {
      boxShadow: theme.shadows[4],
      transform: "scale(1.05)",
    },
  })
);

// Types
interface FlashcardItem {
  id: number;
  term: string;
  definition: string;
  starred: boolean;
}

// Sửa lỗi: Thêm thuộc tính isDefinition vào interface MatchItem
interface MatchItem extends FlashcardItem {
  matched: boolean;
  selected: boolean;
  isDefinition: boolean; // Thêm thuộc tính này
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
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [matchCards, setMatchCards] = useState<MatchItem[]>([]);
  const [selectedMatchCard, setSelectedMatchCard] = useState<number | null>(
    null
  );
  const [completedMatches, setCompletedMatches] = useState(0);

  // Initialize match game
  useEffect(() => {
    if (activeMode === PracticeMode.MATCH) {
      const terms = flashcards.map((card) => ({
        ...card,
        matched: false,
        selected: false,
        isDefinition: false,
      }));

      const definitions = flashcards.map((card) => ({
        ...card,
        matched: false,
        selected: false,
        isDefinition: true,
      }));

      // Shuffle both arrays and combine
      const shuffledCards = [
        ...shuffleArray(terms),
        ...shuffleArray(definitions),
      ];
      setMatchCards(shuffledCards);
      setCompletedMatches(0);
    }
  }, [activeMode, flashcards]);

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
    setIsCorrect(null);
  };

  // Flashcard navigation
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
      setUserAnswer("");
      setIsCorrect(null);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
      setUserAnswer("");
      setIsCorrect(null);
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

  // Check answer in learn mode
  const checkAnswer = () => {
    const currentCard = flashcards[currentCardIndex];
    const isAnswerCorrect =
      userAnswer.toLowerCase().trim() ===
      currentCard.definition.toLowerCase().trim();

    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN"; // Vietnamese language
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle match card selection
  const handleMatchCardClick = (index: number) => {
    // If card is already matched, do nothing
    if (matchCards[index].matched) return;

    // If no card is selected, select this one
    if (selectedMatchCard === null) {
      setMatchCards(
        matchCards.map((card, i) =>
          i === index ? { ...card, selected: true } : card
        )
      );
      setSelectedMatchCard(index);
      return;
    }

    // If this card is already selected, deselect it
    if (selectedMatchCard === index) {
      setMatchCards(
        matchCards.map((card, i) =>
          i === index ? { ...card, selected: false } : card
        )
      );
      setSelectedMatchCard(null);
      return;
    }

    // Check if the two cards match
    const firstCard = matchCards[selectedMatchCard];
    const secondCard = matchCards[index];

    if (
      firstCard.id === secondCard.id &&
      ((firstCard.isDefinition && !secondCard.isDefinition) ||
        (!firstCard.isDefinition && secondCard.isDefinition))
    ) {
      // Cards match
      setMatchCards(
        matchCards.map((card, i) =>
          i === index || i === selectedMatchCard
            ? { ...card, matched: true, selected: false }
            : card
        )
      );
      setSelectedMatchCard(null);
      setCompletedMatches(completedMatches + 1);
    } else {
      // Cards don't match, briefly show both then hide
      setMatchCards(
        matchCards.map((card, i) =>
          i === index ? { ...card, selected: true } : card
        )
      );

      setTimeout(() => {
        setMatchCards(
          matchCards.map((card, i) =>
            (i === index || i === selectedMatchCard) && !card.matched
              ? { ...card, selected: false }
              : card
          )
        );
        setSelectedMatchCard(null);
      }, 1000);
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

  const renderLearnMode = () => (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">
          Luyện tập {currentCardIndex + 1}/{flashcards.length}
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
        <Box sx={{ display: "flex", mb: 2 }}>
          <IconButton
            onClick={() => speakText(flashcards[currentCardIndex].term)}
          >
            <SpeakIcon />
          </IconButton>
          <IconButton
            onClick={() => toggleStar(flashcards[currentCardIndex].id)}
          >
            {flashcards[currentCardIndex].starred ? (
              <StarIcon color="warning" />
            ) : (
              <StarBorderIcon />
            )}
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" gutterBottom>
          Nhập định nghĩa:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={showAnswer}
          sx={{ mb: 2 }}
        />

        {!showAnswer ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={checkAnswer}
            disabled={!userAnswer.trim()}
          >
            Kiểm tra
          </Button>
        ) : (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                p: 2,
                bgcolor: isCorrect ? "success.light" : "error.light",
                borderRadius: 1,
              }}
            >
              {isCorrect ? (
                <CheckIcon color="success" sx={{ mr: 1 }} />
              ) : (
                <CloseIcon color="error" sx={{ mr: 1 }} />
              )}
              <Typography>
                {isCorrect ? "Chính xác!" : "Chưa chính xác"}
              </Typography>
            </Box>

            <Typography variant="body1" gutterBottom>
              Đáp án đúng:
            </Typography>
            <Paper sx={{ p: 2, mb: 3, bgcolor: "background.default" }}>
              <Typography>{flashcards[currentCardIndex].definition}</Typography>
            </Paper>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleNextCard}
              disabled={currentCardIndex === flashcards.length - 1}
            >
              Tiếp tục
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );

  const renderMatchMode = () => {
    const allMatched = completedMatches === flashcards.length;

    return (
      <Box>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Ghép cặp thuật ngữ và định nghĩa</Typography>
          <Typography>
            {completedMatches}/{flashcards.length} cặp đã ghép
          </Typography>
        </Box>

        {allMatched ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Chúc mừng! Bạn đã hoàn thành bài tập ghép cặp.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const terms = flashcards.map((card) => ({
                  ...card,
                  matched: false,
                  selected: false,
                  isDefinition: false,
                }));

                const definitions = flashcards.map((card) => ({
                  ...card,
                  matched: false,
                  selected: false,
                  isDefinition: true,
                }));

                setMatchCards([
                  ...shuffleArray(terms),
                  ...shuffleArray(definitions),
                ]);
                setCompletedMatches(0);
              }}
              sx={{ mt: 2 }}
            >
              Chơi lại
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {matchCards.map((card, index) => (
              <Grid
                size={{ xs: 6, md: 3, sm: 4 }}
                key={`${card.id}-${card.isDefinition ? "def" : "term"}`}
              >
                <MatchCard
                  selected={card.selected}
                  matched={card.matched}
                  onClick={() => handleMatchCardClick(index)}
                >
                  <Typography align="center">
                    {card.matched
                      ? card.isDefinition
                        ? card.definition
                        : card.term
                      : card.selected
                      ? card.isDefinition
                        ? card.definition
                        : card.term
                      : card.matched || card.selected
                      ? card.isDefinition
                        ? card.definition
                        : card.term
                      : card.isDefinition
                      ? "Định nghĩa"
                      : "Thuật ngữ"}
                  </Typography>
                </MatchCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

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
                  setIsCorrect(option.id === flashcards[currentCardIndex].id);
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
          <Tab label="Luyện tập" value={PracticeMode.LEARN} />
          <Tab label="Ghép cặp" value={PracticeMode.MATCH} />
          <Tab label="Kiểm tra" value={PracticeMode.TEST} />
        </Tabs>
      </Paper>

      {activeMode === PracticeMode.FLASHCARDS && renderFlashcards()}
      {activeMode === PracticeMode.LEARN && renderLearnMode()}
      {activeMode === PracticeMode.MATCH && renderMatchMode()}
      {activeMode === PracticeMode.TEST && renderTestMode()}
    </PracticeContainer>
  );
};

export default ChallengePage;
