import { useRef, useState, useEffect, ChangeEvent } from 'react';
import Timeline from './Timeline';
import TrimBar from './TrimBar';
import styles from '../styles/VideoPlayer.module.css';

// Icons
import { FaUpload, FaPlay, FaPause, FaDownload } from 'react-icons/fa';
import { MdContentCut } from 'react-icons/md';

// Hooks
import { useThumbnails } from '../hooks/useThumbnails';
import { useVideoControls } from '../hooks/useVideoControls';
import { useTrim } from '../hooks/useTrim';


/**
 * VideoPlayer component handles video playback, trimming logic,
 * thumbnail generation, and downloading the trimmed segment.
 */
const VideoPlayer = () => {

  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const {
    videoRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    togglePlay,
    seek,
  } = useVideoControls();

  const {
    trimStart,
    trimEnd,
    setTrimStart,
    setTrimEnd,
    previewTrimmed,
    handleDownload,
    isTrimming,
    setIsTrimming,
  } = useTrim(videoRef);
  
  const { thumbnails, generateThumbnails } = useThumbnails();
  


  /**
   * Handles file input change and loads video.
   */
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const newDuration = video.duration;
      setDuration(newDuration);
      requestAnimationFrame(() => generateThumbnails(newDuration, video.src));
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);

      if (isTrimming && current >= trimEnd - 0.05) {
        video.pause();
        setIsPlaying(false);
        setIsTrimming(false);
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
          <video
            className={styles.videoElement}
            ref={videoRef}
            src={videoSrc}
            controls
          />

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
              onClick={handleDownload}
              disabled={trimEnd <= trimStart}
              title="Will export the desired section"
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
            <Timeline currentTime={currentTime} duration={duration} onSeek={seek} />
          </div>

          <div className={styles.trimBar}>
            <TrimBar
              duration={duration}
              trimStart={trimStart}
              trimEnd={trimEnd}
              setTrimStart={setTrimStart}
              setTrimEnd={setTrimEnd}
              thumbnails={thumbnails}
              currentTime={currentTime}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
