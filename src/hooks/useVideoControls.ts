/**
 * useVideoControls
 * Handles all video control logic such as play/pause, seek, and tracking current time & duration.
 */

import { useRef, useState, useEffect } from 'react';

export const useVideoControls = () => {
  /** Reference to the video HTML element */
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /** State to track if the video is playing */
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  /** State to track the current time of the video */
  const [currentTime, setCurrentTime] = useState<number>(0);

  /** State to track the full duration of the video */
  const [duration, setDuration] = useState<number>(0);

  /**
   * Toggles play/pause on the video
   */
  const togglePlay = (): void => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  /**
   * Seek to a specific time in the video
   * @param time - time in seconds to seek to
   */
  const seek = (time: number): void => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  /**
   * Sets up event listeners for metadata and time updates
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return {
    videoRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    togglePlay,
    seek,
  };
};