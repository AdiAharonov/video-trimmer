import { useRef, useState, useEffect } from 'react';
import Timeline from './Timeline';
import TrimBar from './TrimBar';
import styles from '../styles/VideoPlayer.module.css';

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

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

  return (
    <div className={styles.videoPlayer}>
      <video
        className={styles.videoElement}
        ref={videoRef}
        src="/sample.mp4"
        controls
      />
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <p>
        Time: {currentTime.toFixed(1)} / {duration.toFixed(1)} seconds
      </p>

      <div className={styles.timeline}>
        <Timeline currentTime={currentTime} duration={duration} />
      </div>
      <div className={styles.trimBar}>
        <TrimBar />
      </div>
    </div>
  );
};

export default VideoPlayer;
