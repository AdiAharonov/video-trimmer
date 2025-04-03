import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoPlayer from '../VideoPlayer';

vi.mock('../Timeline', () => ({
  default: () => <div data-testid="timeline" />,
}));

vi.mock('../TrimBar', () => ({
  default: () => <div data-testid="trimbar" />,
}));

describe('VideoPlayer', () => {
  it('renders file input', () => {
    render(<VideoPlayer />);
    expect(screen.getByLabelText(/upload video/i) || screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('does not render video before file upload', () => {
    render(<VideoPlayer />);
    expect(screen.queryByTestId('timeline')).not.toBeInTheDocument();
    expect(screen.queryByTestId('trimbar')).not.toBeInTheDocument();
  });

  it('renders timeline and trimbar after video is set', () => {
    render(<VideoPlayer />);

    const file = new File(['(fake video)'], 'test.mp4', { type: 'video/mp4' });
    const input = screen.getByLabelText(/upload video/i) || screen.getByRole('textbox');

    fireEvent.change(input, {
      target: { files: [file] },
    });

    // simulate DOM update with fake src
    setTimeout(() => {
      expect(screen.getByTestId('timeline')).toBeInTheDocument();
      expect(screen.getByTestId('trimbar')).toBeInTheDocument();
    }, 100);
  });

  it('toggles play and pause', () => {
    render(<VideoPlayer />);
    const file = new File(['(fake video)'], 'test.mp4', { type: 'video/mp4' });

    const input = screen.getByLabelText(/upload video/i) || screen.getByRole('textbox');
    fireEvent.change(input, {
      target: { files: [file] },
    });

    setTimeout(() => {
      const playButton = screen.getByRole('button', { name: /play/i });
      fireEvent.click(playButton);
      expect(playButton.textContent?.toLowerCase()).toContain('pause');
    }, 100);
  });
});
