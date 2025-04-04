import { useRef, useState, useEffect, ChangeEvent } from 'react';
import Timeline from './Timeline';
import TrimBar from './TrimBar';
import styles from '../styles/VideoPlayer.module.css';

// Icons
import { FaUpload, FaPlay, FaPause, FaDownload } from 'react-icons/fa';
import { MdContentCut } from 'react-icons/md';

/**
 * VideoPlayer component handles video playback, trimming logic,
 * thumbnail generation, and downloading the trimmed segment.
 */
const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrimming, setIsTrimming] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);

  /**
   * Toggles video playback.
   */
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
    setIsPlaying(!video.paused);
  };

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

  /**
   * Seeks video to specified time.
   */
  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  /**
   * Starts playback from trimStart and pauses at trimEnd.
   */
  const previewTrimmed = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = trimStart;
      videoRef.current.play();
      setIsPlaying(true);
      setIsTrimming(true);
    }
  };

  /**
   * Generates thumbnails for the timeline from the video.
   */
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

  /**
   * Records trimmed segment using MediaRecorder.
   */
  const recordTrimmedSegment = async (
    videoEl: HTMLVideoElement,
    trimStart: number,
    trimEnd: number
  ) => {
    return new Promise<Blob>((resolve, reject) => {
      if (!('MediaRecorder' in window)) {
        reject(new Error('MediaRecorder not supported'));
        return;
      }

      const stream = videoEl.captureStream();
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));

      videoEl.currentTime = trimStart;

      const onTimeUpdate = () => {
        if (videoEl.currentTime >= trimEnd) {
          videoEl.pause();
          recorder.stop();
          videoEl.removeEventListener('timeupdate', onTimeUpdate);
        }
      };

      videoEl.addEventListener('timeupdate', onTimeUpdate);
      recorder.start();
      videoEl.play();
    });
  };

  /**
   * Downloads the recorded video segment as a file.
   */
  const handleDownload = async () => {
    if (!videoRef.current) return;
    try {
      const blob = await recordTrimmedSegment(videoRef.current, trimStart, trimEnd);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'trimmed-video.webm';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Recording failed', err);
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
              currentTime={currentTime}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
