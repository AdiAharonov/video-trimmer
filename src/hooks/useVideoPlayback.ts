/**
 * Hook for managing video playback (play/pause), current time, and trimming state.
 */
import { useRef, useState, useEffect } from 'react';

export const useVideoPlayback = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrimming, setIsTrimming] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  /**
   * Toggle video playback
   */
  const togglePlay = () => {
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
   * Preview the trimmed section (from trimStart to trimEnd)
   */
  const previewTrimmed = (trimStart: number, trimEnd: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = trimStart;
    video.play();
    setIsPlaying(true);
    setIsTrimming(true);

    const stopAtEnd = () => {
      if (video.currentTime >= trimEnd - 0.05) {
        video.pause();
        setIsPlaying(false);
        setIsTrimming(false);
        video.removeEventListener('timeupdate', stopAtEnd);
      }
    };

    video.addEventListener('timeupdate', stopAtEnd);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const setDurationOnLoad = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', setDurationOnLoad);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', setDurationOnLoad);
    };
  }, [videoRef.current]);

  return {
    videoRef,
    isPlaying,
    isTrimming,
    currentTime,
    duration,
    togglePlay,
    previewTrimmed,
  };
};