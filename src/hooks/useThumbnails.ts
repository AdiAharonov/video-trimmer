import { useState } from 'react';

/**
 * Hook to generate video thumbnails using an offscreen video and canvas.
 * @returns `thumbnails` array, `generateThumbnails` function and `isGenerating` boolean
 */
export const useThumbnails = () => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  /**
   * Generate thumbnails from a video by capturing frames at even intervals.
   * @param videoDuration The total duration of the video in seconds.
   * @param videoSrc The source URL of the video file.
   */
  const generateThumbnails = async (videoDuration: number, videoSrc: string) => {
    setIsGenerating(true)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGenerating(false)
      return;
    }

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
    setIsGenerating(false)
  };

  return { thumbnails, generateThumbnails, isGenerating };
};
