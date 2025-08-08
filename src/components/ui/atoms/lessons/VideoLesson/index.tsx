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
} from "@mui/icons-material";
import {
  LessonContentProps,
  NavButton,
  NavigationContainer,
} from "@components/ui/molecules/course-detail/CourseDetailMainContent";
import { ProgressRequestParams } from "@services/progress";

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

const VideoLesson = ({
  lesson,
  isMoving,
  handleMoveToNext,
  participation,
  learning_progress,
}: LessonContentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(
    learning_progress &&
      videoRef.current?.duration &&
      learning_progress.video_time_position < videoRef.current?.duration - 10
      ? learning_progress.video_time_position
      : 0
  );
  const [duration, setDuration] = useState(0);
  const [maxAllowedTime, setMaxAllowedTime] = useState(0);

  // console.log(learning_progress);
  const params: ProgressRequestParams = React.useMemo(
    () => ({
      lesson_id: lesson.id,
      type: lesson.type,
      status:
        learning_progress?.status === "COMPLETED"
          ? "COMPLETED"
          : !videoRef.current?.duration ||
            !learning_progress?.video_time_position ||
            Math.floor(learning_progress.video_time_position) <
              Math.floor(videoRef.current.duration)
          ? "IN_PROGRESS"
          : "COMPLETED",
      course_participation_id: participation.id,
      video_time_position: currentTime,
    }),
    [lesson.id, lesson.type, learning_progress, participation.id, currentTime]
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime =
        learning_progress &&
        videoRef.current?.duration &&
        learning_progress.video_time_position < videoRef.current?.duration - 10
          ? learning_progress.video_time_position
          : 0;
    }
  }, [learning_progress]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleVideoEnded = () => {
        params.status = "COMPLETED";
        handleMoveToNext(params, false);
      };

      video.addEventListener("ended", handleVideoEnded);

      return () => {
        video.removeEventListener("ended", handleVideoEnded);
      };
    }
  }, [
    currentTime,
    handleMoveToNext,
    lesson.id,
    lesson.type,
    params,
    participation.id,
  ]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.currentTime = currentTime;
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const videoDuration = videoRef.current.duration;

      // Update max allowed time if current time is greater
      if (current > maxAllowedTime) {
        setMaxAllowedTime(current);
      }

      setCurrentTime(current);
      setProgress((current / videoDuration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      const initialTime =
        learning_progress &&
        videoRef.current?.duration &&
        learning_progress.video_time_position < videoRef.current?.duration - 10
          ? learning_progress.video_time_position
          : 0;

      videoRef.current.currentTime = initialTime;
      setMaxAllowedTime(initialTime);
    }
  };

  const handleProgressChange = (event: Event, newValue: number | number[]) => {
    if (videoRef.current) {
      const newTime = ((newValue as number) / 100) * duration;

      // Only allow seeking backward or up to the max allowed time
      if (newTime <= maxAllowedTime) {
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(newValue as number);
      }
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

  useEffect(() => {
    const video = videoRef.current;

    const handleVisibilityChange = () => {
      if (document.hidden && video && playing) {
        video.pause();
        setPlaying(false);
        handleMoveToNext(params, false);
      }
    };

    const handleBeforeUnload = () => {
      if (video) {
        if (playing) {
          video.pause();
          setPlaying(false);
        }
        handleMoveToNext(params, false);
      }
    };

    // Thêm handler cho khi người dùng rời khỏi trang (page unload)
    const handlePageHide = () => {
      if (video && playing) {
        video.pause();
        setPlaying(false);
      }
      handleMoveToNext(params, false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [currentTime, duration, handleMoveToNext, params, playing]);

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <VideoContainer>
          {/* Video player */}
          <Box
            component="video"
            ref={videoRef}
            src={lesson.video_url}
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
                  "& .MuiSlider-track": {
                    transition: "none",
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
        <Typography variant="h5" fontWeight="600" gutterBottom mb={2}>
          {lesson.title || "01 - Introduction to Project Management"}
        </Typography>

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
            {lesson.content ||
              "This training session offers a comprehensive introduction to the principles and methodologies of project management. Participants will gain an understanding of project management fundamentals, including project initiation, planning, execution, monitoring, and closure. Through interactive discussions and activities, attendees will explore key concepts such as project life cycles, project stakeholders, and the importance of effective project management in achieving organizational goals."}
          </Typography>
        </Paper>
      </Box>
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
          disabled={
            isMoving ||
            (learning_progress?.status !== "COMPLETED" &&
              (!videoRef.current?.duration ||
                !learning_progress?.video_time_position ||
                Math.floor(learning_progress.video_time_position) <
                  Math.floor(videoRef.current.duration)))
          }
          onClick={() => handleMoveToNext(params)}
        >
          Tiếp theo
        </NavButton>
      </NavigationContainer>
    </>
  );
};
export default VideoLesson;
