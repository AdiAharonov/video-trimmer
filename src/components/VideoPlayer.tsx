import Timeline from "./Timeline";
import TrimBar from "./TrimBar";

const VideoPlayer = () => {
  return (
    <div className="video-player">
      <video />
      <Timeline />
      <TrimBar />
    </div>
  );
};

export default VideoPlayer;
