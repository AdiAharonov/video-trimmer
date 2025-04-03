import { useRef, useState, useEffect, ChangeEvent } from 'react';
import Timeline from './Timeline';
import TrimBar from './TrimBar';
import styles from '../styles/VideoPlayer.module.css';

// Icons
import { FaUpload, FaPlay, FaPause, FaDownload } from 'react-icons/fa';
import { MdContentCut } from 'react-icons/md';

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isTrimming, setIsTrimming] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(0);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoSrc(videoURL);
      setCurrentTime(0);
      setIsPlaying(false);
      setTrimStart(0);
      setTrimEnd(0);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const previewTrimmed = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = trimStart;
      videoRef.current.play();
      setIsPlaying(true);
      setIsTrimming(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);

      if (isTrimming && current >= trimEnd - 0.05) {
        setTimeout(() => {
          video.pause();
          setIsPlaying(false);
          setIsTrimming(false);
        }, 10);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoSrc, trimEnd, isTrimming]);

  return (
    <div className={styles.videoPlayer}>
      <label htmlFor="video-upload" className={styles.uploadButton}>
        <FaUpload style={{ marginRight: '8px' }} />
        Upload Video
      </label>
      <input
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className={styles.uploadInput}
      />

      {videoSrc && (
        <>
          <video className={styles.videoElement} ref={videoRef} src={videoSrc} controls />

          <div className={styles.buttonGroup}>
            <button onClick={togglePlay} className={styles.actionButton}>
              {isPlaying ? <FaPause /> : <FaPlay />} {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={previewTrimmed}
              disabled={trimEnd <= trimStart}
              className={styles.actionButton}
            >
              <MdContentCut style={{ marginRight: 4 }} />
              Preview Trim
            </button>

            <button
              onClick={() => alert('Export is not yet implemented.')}
              disabled
              title="Exporting would require ffmpeg.wasm or a backend service"
              className={styles.actionButton}
            >
              <FaDownload style={{ marginRight: 4 }} />
              Export Trim
            </button>
          </div>

          <p>
            Time: {currentTime.toFixed(1)} / {duration.toFixed(1)} seconds
          </p>

          <div className={styles.timeline}>
            <Timeline currentTime={currentTime} duration={duration} onSeek={handleSeek} />
          </div>

          <div className={styles.trimBar}>
            <TrimBar
              duration={duration}
              trimStart={trimStart}
              trimEnd={trimEnd}
              setTrimStart={setTrimStart}
              setTrimEnd={setTrimEnd}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
