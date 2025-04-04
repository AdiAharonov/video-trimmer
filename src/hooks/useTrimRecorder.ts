/**
 * useTrimRecorder.ts
 * Custom hook to record a trimmed segment of a video using MediaRecorder.
 */
import { useCallback } from 'react';

/**
 * Records a trimmed segment of a video using MediaRecorder.
 *
 * @returns A function that accepts a video element and trim times, and returns a Blob.
 */
export const useTrimRecorder = () => {
  const recordTrimmedSegment = useCallback(
    async (videoEl: HTMLVideoElement, trimStart: number, trimEnd: number): Promise<Blob> => {
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
    },
    []
  );

  return { recordTrimmedSegment };
};