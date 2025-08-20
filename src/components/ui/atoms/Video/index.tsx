import React, { useState } from "react";
import { Box, Typography, styled, IconButton } from "@mui/material";
import {
  FullscreenRounded as FullscreenIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";

//#region  Styled components

// Thêm styled components cho VideoPlayer
const VideoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  backgroundColor: "#000",
  marginBottom: theme.spacing(3),
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1, 2),
  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  opacity: 0,
  transition: "opacity 0.3s ease",
  "&:hover": {
    opacity: 1,
  },
}));

const ProgressBar = styled(Box)(() => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 4,
  backgroundColor: "rgba(255,255,255,0.2)",
  cursor: "pointer",
}));

const ProgressFill = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.primary.main,
  width: "0%",
}));

const VideoControlButton = styled(IconButton)(({ theme }) => ({
  color: "#fff",
  padding: theme.spacing(0.5),
}));

//#endregion
export const VideoPlayer: React.FC<{ videoUrl: string; title: string }> = ({
  videoUrl,
  title,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition =
        e.clientX - progressBar.getBoundingClientRect().left;
      const progressBarWidth = progressBar.clientWidth;
      const seekTime =
        (clickPosition / progressBarWidth) * videoRef.current.duration;

      videoRef.current.currentTime = seekTime;
    }
  };

  return (
    <VideoContainer
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        style={{ width: "100%", display: "block" }}
        onTimeUpdate={handleTimeUpdate}
        onClick={handlePlayPause}
      />

      <VideoControls sx={{ opacity: showControls ? 1 : 0 }}>
        <Box display="flex" alignItems="center">
          <VideoControlButton onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </VideoControlButton>

          <Typography variant="body2" color="white" sx={{ ml: 1 }}>
            {Math.floor(progress)}%
          </Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <Typography variant="body2" color="white" sx={{ mr: 1 }}>
            {title}
          </Typography>

          <VideoControlButton onClick={handleMuteToggle}>
            {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </VideoControlButton>

          <VideoControlButton onClick={handleFullscreen}>
            <FullscreenIcon />
          </VideoControlButton>
        </Box>
      </VideoControls>

      <ProgressBar onClick={handleProgressClick}>
        <ProgressFill sx={{ width: `${progress}%` }} />
      </ProgressBar>
    </VideoContainer>
  );
};
