// src/pages/course/components/lessons/VideoLesson.tsx
import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton, Slider, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  SettingsOutlined,
  FullscreenOutlined,
  PictureInPictureAlt,
  Replay10,
  Forward10,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { LessonProps } from "@components/ui/molecules/course-detail/CourseDetailMainContent";

const VideoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.common.black,
  // maxHeight: "400px",
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1, 2),
  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const ControlsRow = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
}));

const TimeDisplay = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontSize: "0.75rem",
  minWidth: 40,
}));

const VideoLesson: React.FC<LessonProps> = ({ lesson }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(10); // Đặt giá trị mặc định là 10
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Cập nhật âm lượng khi giá trị volume thay đổi
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    // Set default time to 10 seconds when video is loaded
    if (videoRef.current) {
      videoRef.current.currentTime = 10;
    }
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        // Đặt thời gian hiện tại là 10 giây trước khi phát
        videoRef.current.currentTime = 10;
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleProgressChange = (event: Event, newValue: number | number[]) => {
    const newProgress = newValue as number;
    setProgress(newProgress);

    if (videoRef.current && duration) {
      const newTime = (duration * newProgress) / 100;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const videoDuration = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / videoDuration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.currentTime = 10; // Đặt thời gian hiện tại là 10 giây
    }
  };

  const handleReplay10 = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
    }
  };

  const handleForward10 = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handlePictureInPicture = () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        videoRef.current.requestPictureInPicture();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <VideoContainer>
        {/* Video player */}
        <Box
          component="video"
          ref={videoRef}
          src={
            "https://firebasestorage.googleapis.com/v0/b/digital-dynamo-cb555.appspot.com/o/assets%2FScreen%20Recording%202025-06-18%20223519.mp4?alt=media&token=ec743ae7-d904-488c-85e4-34ba75eece90"
          }
          // poster={"https://source.unsplash.com/random/1280x720/?presentation"}
          controls={false}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={handlePlayPause}
          sx={{
            width: "100%",
            height: "auto",
            display: "block",
            cursor: "pointer",
          }}
        />

        {/* Video controls overlay */}
        <VideoControls>
          <ControlsRow>
            <Slider
              size="small"
              value={progress}
              onChange={handleProgressChange}
              aria-label="Video progress"
              sx={{
                color: "#4ecca3",
                height: 4,
                "& .MuiSlider-thumb": {
                  width: 8,
                  height: 8,
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "none",
                  },
                },
                "& .MuiSlider-rail": {
                  opacity: 0.3,
                },
              }}
            />
          </ControlsRow>

          <ControlsRow>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                size="small"
                onClick={handlePlayPause}
                sx={{ color: "white" }}
              >
                {playing ? <Pause /> : <PlayArrow />}
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white" }}
                onClick={handleReplay10}
              >
                <Replay10 />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white" }}
                onClick={handleForward10}
              >
                <Forward10 />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", width: 100 }}>
                <IconButton size="small" sx={{ color: "white" }}>
                  <VolumeUp fontSize="small" />
                </IconButton>
                <Slider
                  size="small"
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume"
                  sx={{
                    color: "white",
                    height: 2,
                    width: 60,
                    "& .MuiSlider-thumb": {
                      width: 6,
                      height: 6,
                    },
                  }}
                />
              </Box>
              <TimeDisplay>
                {formatTime(currentTime)} / {formatTime(duration)}
              </TimeDisplay>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton size="small" sx={{ color: "white" }}>
                <SettingsOutlined fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white" }}
                onClick={handlePictureInPicture}
              >
                <PictureInPictureAlt fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "white" }}
                onClick={handleFullscreen}
              >
                <FullscreenOutlined fontSize="small" />
              </IconButton>
            </Box>
          </ControlsRow>
        </VideoControls>
      </VideoContainer>

      {/* Lesson information */}
      <Typography variant="h5" fontWeight="600" gutterBottom>
        {lesson.title || "01 - Introduction to Project Management"}
      </Typography>

      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Typography variant="body2" color="text.secondary">
          By
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="primary" fontWeight="600">
            {"Kristin Watson"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            , {"Product Owner"}
          </Typography>
        </Box>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          typography: "body1",
          color: "text.secondary",
          lineHeight: 1.7,
        }}
      >
        <Typography variant="body1" component="div">
          {lesson.description ||
            "This training session offers a comprehensive introduction to the principles and methodologies of project management. Participants will gain an understanding of project management fundamentals, including project initiation, planning, execution, monitoring, and closure. Through interactive discussions and activities, attendees will explore key concepts such as project life cycles, project stakeholders, and the importance of effective project management in achieving organizational goals."}
        </Typography>
      </Paper>

      {/* Navigation buttons */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="outlined" size="medium" sx={{ textTransform: "none" }}>
          Previous Lesson
        </Button>
        <Button
          variant="contained"
          size="medium"
          sx={{ textTransform: "none", bgcolor: "#4ecca3" }}
        >
          Next Lesson
        </Button>
      </Box>
    </Box>
  );
};
export default VideoLesson;
