import { useRef, useState } from 'react';

interface TrimBarProps {
  duration: number;
  trimStart: number;
  trimEnd: number;
  setTrimStart: (time: number) => void;
  setTrimEnd: (time: number) => void;
}

const TrimBar = ({
  duration,
  trimStart,
  trimEnd,
  setTrimStart,
  setTrimEnd,
}: TrimBarProps) => {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);

  const handleMouseDown = (handle: 'start' | 'end') => {
    setDragging(handle);
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!dragging || !barRef.current || duration === 0) return;

    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const time = Math.max(0, Math.min(duration, percent * duration));

    if (dragging === 'start' && time < trimEnd) {
      setTrimStart(time);
    } else if (dragging === 'end' && time > trimStart) {
      setTrimEnd(time);
    }
  };

  const startPercent = (trimStart / duration) * 100;
  const endPercent = (trimEnd / duration) * 100;

  return (
    <div
      ref={barRef}
      style={{
        width: '100%',
        height: '100%',
        background: '#ddd',
        position: 'relative',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Trim range display */}
      <div
        style={{
          position: 'absolute',
          left: `${startPercent}%`,
          width: `${endPercent - startPercent}%`,
          height: '100%',
          backgroundColor: 'rgba(0, 128, 0, 0.5)',
        }}
      />

      {/* Start handle */}
      <div
        onMouseDown={() => handleMouseDown('start')}
        style={{
          position: 'absolute',
          left: `${startPercent}%`,
          width: '10px',
          height: '100%',
          backgroundColor: '#007bff',
          cursor: 'ew-resize',
        }}
      />

      {/* End handle */}
      <div
        onMouseDown={() => handleMouseDown('end')}
        style={{
          position: 'absolute',
          left: `${endPercent}%`,
          width: '10px',
          height: '100%',
          backgroundColor: '#ff4136',
          cursor: 'ew-resize',
        }}
      />
    </div>
  );
};

export default TrimBar;
