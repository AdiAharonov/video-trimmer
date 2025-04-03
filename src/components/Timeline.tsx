interface TimelineProps {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
  }
  
  const Timeline = ({ currentTime, duration, onSeek }: TimelineProps) => {
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const clickedPercent = clickX / width;
      const newTime = clickedPercent * duration;
      onSeek(newTime);
    };
  
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: '#007bff',
          }}
        />
      </div>
    );
  };
  
  export default Timeline;
  