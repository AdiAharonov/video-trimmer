import { renderHook, act } from '@testing-library/react';
import { useVideoControls } from '../useVideoControls';

describe('useVideoControls', () => {
  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useVideoControls());

    expect(result.current.videoRef.current).toBeNull();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTime).toBe(0);
    expect(result.current.duration).toBe(0);
  });

  it('toggles play and pause correctly', () => {
    const { result } = renderHook(() => useVideoControls());
    const mockVideo = {
      paused: true,
      play: vi.fn(() => {
        mockVideo.paused = false;
      }),
      pause: vi.fn(() => {
        mockVideo.paused = true;
      })
    } as unknown as HTMLVideoElement;

    act(() => {
      result.current.videoRef.current = mockVideo;
      result.current.togglePlay();
    });

    expect(mockVideo.play).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.togglePlay();
    });

    expect(mockVideo.pause).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it('seeks to correct time', () => {
    const { result } = renderHook(() => useVideoControls());
    const mockVideo = { currentTime: 0 } as HTMLVideoElement;

    act(() => {
      result.current.videoRef.current = mockVideo;
      result.current.seek(42);
    });

    expect(mockVideo.currentTime).toBe(42);
  });

});