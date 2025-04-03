interface TimelineProps {
    currentTime: number;
    duration: number;
  }
  
  const Timeline = ({ currentTime, duration }: TimelineProps) => {
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
  