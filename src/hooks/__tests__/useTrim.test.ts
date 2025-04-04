import { renderHook, act } from '@testing-library/react';
import { useTrim } from '../useTrim';

describe('useTrim', () => {
  const createMockVideo = () => {
    let currentTime = 0;
    return {
      play: vi.fn(),
      pause: vi.fn(),
      get currentTime() {
        return currentTime;
      },
      set currentTime(value: number) {
        currentTime = value;
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as HTMLVideoElement;
  };

  it('initializes trim values correctly', () => {
    const videoRef = { current: createMockVideo() } as any;
    const { result } = renderHook(() => useTrim(videoRef));

    expect(result.current.trimStart).toBe(0);
    expect(result.current.trimEnd).toBe(0);
    expect(result.current.isTrimming).toBe(false);
  });


  it('logs error if MediaRecorder is not supported', async () => {
    delete global.MediaRecorder; // Remove MediaRecorder from global

    const videoRef = { current: createMockVideo() } as any;
    const { result } = renderHook(() => useTrim(videoRef));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      await result.current.handleDownload();
    });

    // Check if error was logged with the correct message
    expect(consoleSpy).toHaveBeenCalledWith('Download failed:', expect.objectContaining({
      message: expect.stringContaining('MediaRecorder not supported or video unavailable'),
    }));

    // Restore global MediaRecorder
    global.MediaRecorder = { start: vi.fn(), stop: vi.fn() };
  });
});
