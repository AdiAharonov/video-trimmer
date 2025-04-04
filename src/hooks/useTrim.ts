import { useState } from 'react';

interface UseTrimReturn {
  trimStart: number;
  trimEnd: number;
  setTrimStart: (value: number) => void;
  setTrimEnd: (value: number) => void;
  isTrimming: boolean;
  setIsTrimming: (value: boolean) => void;
  previewTrimmed: () => void;
  handleDownload: () => Promise<void>;
}

/**
 * useTrim
 * Handles video trimming logic: start/end positions, preview playback, recording, and download.
 */
export const useTrim = (videoRef: React.RefObject<HTMLVideoElement | null> ) => {
  /** Indicates whether the video is currently trimming (previewing) */
  const [isTrimming, setIsTrimming] = useState(false);

  /** Start position of the trim (in seconds) */
  const [trimStart, setTrimStart] = useState(0);

  /** End position of the trim (in seconds) */
  const [trimEnd, setTrimEnd] = useState(0);

  /**
   * Starts previewing the trimmed segment.
   */
  const previewTrimmed = (): void => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = trimStart;
    video.play();
    setIsTrimming(true);
  };

  /**
   * Records the trimmed segment using MediaRecorder.
   * @returns A Promise resolving to a Blob representing the trimmed video.
   */
  const recordTrimmedSegment = async (): Promise<Blob> => {
    const video = videoRef.current;
    if (!video || !('MediaRecorder' in window)) {
      throw new Error('MediaRecorder not supported or video unavailable');
    }

    const stream = video.captureStream();
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    return new Promise((resolve, reject) => {
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
      recorder.onerror = (err) => reject(err);

      const stopOnTime = () => {
        if (video.currentTime >= trimEnd) {
          video.pause();
          recorder.stop();
          video.removeEventListener('timeupdate', stopOnTime);
        }
      };

      video.currentTime = trimStart;
      video.addEventListener('timeupdate', stopOnTime);

      recorder.start();
      video.play();
    });
  };

  /**
   * Initiates download of the trimmed segment.
   */
  const handleDownload = async (): Promise<void> => {
    try {
      const blob = await recordTrimmedSegment();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'trimmed-video.webm';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return {
    isTrimming,
    setIsTrimming,
    trimStart,
    trimEnd,
    setTrimStart,
    setTrimEnd,
    previewTrimmed,
    handleDownload,
  } as UseTrimReturn;
};