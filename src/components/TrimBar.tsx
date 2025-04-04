import { useRef, useState } from 'react';

interface TrimBarProps {
  duration: number;
  trimStart: number;
  trimEnd: number;
  setTrimStart: (time: number) => void;
  setTrimEnd: (time: number) => void;
  thumbnails: string[];
  currentTime: number;
}

const TrimBar = ({
  duration,
  trimStart,
  trimEnd,
  setTrimStart,
  setTrimEnd,
  thumbnails,
  currentTime,
}: TrimBarProps) => {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<'start' | 'end' | null>(null);

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
  const currentPercent = (currentTime / duration) * 100;

  return (
    <>
      {/* Time bubbles */}
      {hoveredHandle === 'start' && (
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            left: `calc(${startPercent}% - 20px)`,
            background: '#1db954',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            zIndex: 999,
            pointerEvents: 'none',
          }}
        >
          {trimStart.toFixed(1)}s
        </div>
      )}

      {hoveredHandle === 'end' && (
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            left: `calc(${endPercent}% - 20px)`,
            background: '#1db954',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            zIndex: 999,
            pointerEvents: 'none',
          }}
        >
          {trimEnd.toFixed(1)}s
        </div>
      )}

      <div
        ref={barRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: '#2c2c2c',
          borderRadius: '8px',
          userSelect: 'none',
          overflow: 'hidden',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Thumbnails background */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        >
          {thumbnails.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Thumbnail ${i}`}
              style={{
                flex: 1,
                objectFit: 'cover',
                height: '100%',
              }}
            />
          ))}
        </div>

        {/* Dark overlays outside trim range */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: `${startPercent}%`,
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${endPercent}%`,
            width: `${100 - endPercent}%`,
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1,
          }}
        />

        {/* Current time indicator */}
        <div
          style={{
            position: 'absolute',
            left: `${currentPercent}%`,
            top: 0,
            bottom: 0,
            width: '3px',
            backgroundColor: '#fff',
            zIndex: 10,
            boxShadow: '1px 6px 7px 1px rgba(40, 40, 44, 0.2)',
            pointerEvents: 'none',
          }}
        />

        {/* Trimmed area highlight */}
        <div
          style={{
            position: 'absolute',
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
            height: '100%',
            backgroundColor: 'rgba(60, 235, 121, 0.16)',
            borderTop: 'solid 2px rgba(60, 235, 121, 0.4) ',
            borderBottom: 'solid 2px rgba(60, 235, 121, 0.4) ',
            zIndex: 2,
          }}
        />

        {/* Trim handles */}
        <div
          onMouseDown={() => handleMouseDown('start')}
          onMouseEnter={() => setHoveredHandle('start')}
          onMouseLeave={() => setHoveredHandle(null)}
          style={{
            position: 'absolute',
            left: `${startPercent}%`,
            width: '10px',
            height: '100%',
            backgroundColor: '#1db954',
            cursor: 'ew-resize',
            zIndex: 4,
            borderRadius: '2px',
          }}
        />

        <div
          onMouseDown={() => handleMouseDown('end')}
          onMouseEnter={() => setHoveredHandle('end')}
          onMouseLeave={() => setHoveredHandle(null)}
          style={{
            position: 'absolute',
            left: `${endPercent}%`,
            width: '10px',
            height: '100%',
            backgroundColor: '#1db954',
            cursor: 'ew-resize',
            zIndex: 4,
            borderRadius: '2px',
            transform: endPercent < 97 ? 'translateX(0)' : 'translateX(-100%)',
          }}
        />
      </div>
    </>
  );
};

export default TrimBar;
