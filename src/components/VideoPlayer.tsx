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
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

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

  const generateThumbnails = async (videoDuration: number, videoSrc: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const offscreenVideo = document.createElement('video');
    offscreenVideo.src = videoSrc;
    offscreenVideo.muted = true;
    offscreenVideo.crossOrigin = 'anonymous';
  
    await new Promise<void>((resolve) => {
      offscreenVideo.addEventListener('loadedmetadata', () => resolve());
    });
  
    const frames: string[] = [];
    const numberOfThumbnails = 10;
    canvas.width = 160;
    canvas.height = 90;
  
    for (let i = 0; i < numberOfThumbnails; i++) {
      const time = (i / numberOfThumbnails) * videoDuration;
  
      await new Promise<void>((resolve) => {
        const seekHandler = () => {
          ctx.drawImage(offscreenVideo, 0, 0, canvas.width, canvas.height);
          frames.push(canvas.toDataURL());
          offscreenVideo.removeEventListener('seeked', seekHandler);
          resolve();
        };
  
        offscreenVideo.addEventListener('seeked', seekHandler);
        offscreenVideo.currentTime = time;
      });
    }
  
    setThumbnails(frames);
  };
  
  

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const newDuration = video.duration;
      setDuration(newDuration);

      requestAnimationFrame(() => {
        generateThumbnails(newDuration, video.src);

      });
    };

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
          <video
            className={styles.videoElement}
            ref={videoRef}
            src={videoSrc}
            controls={!isGeneratingThumbnails}
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
              thumbnails={thumbnails}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
