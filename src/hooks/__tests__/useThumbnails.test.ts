import { renderHook, act } from '@testing-library/react';
import { useThumbnails } from '../useThumbnails';

describe('useThumbnails (mocked)', () => {
  const originalCreateElement = document.createElement;

  beforeAll(() => {
    // Mock canvas context
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      drawImage: vi.fn(),
    }));

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          getContext: () => ({
            drawImage: vi.fn(),
          }),
          toDataURL: () => 'data:image/mock',
          width: 160,
          height: 90,
        } as any;
      }

      if (tagName === 'video') {
        const mockVideo: Partial<HTMLVideoElement> = {
          src: 'mock.mp4',
          muted: true,
          currentTime: 0,
          addEventListener: (event, callback) => {
            if (event === 'loadedmetadata' || event === 'seeked') {
              setTimeout(() => callback({}), 0);
            }
          },
          removeEventListener: () => {},
        };
        Object.defineProperty(mockVideo, 'duration', {
          get: () => 10,
        });
        return mockVideo as HTMLVideoElement;
      }

      // fallback to real one
      return originalCreateElement.call(document, tagName);
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('sets 10 mocked thumbnails after generateThumbnails', async () => {
    const { result } = renderHook(() => useThumbnails());

    await act(async () => {
      await result.current.generateThumbnails(10, 'mock.mp4');
    });

    expect(result.current.thumbnails.length).toBe(10);
    expect(result.current.thumbnails[0]).toBe('data:image/mock');
  });
});
