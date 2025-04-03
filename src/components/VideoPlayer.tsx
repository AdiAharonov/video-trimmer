import Timeline from './Timeline';
import TrimBar from './TrimBar';
import styles from '../styles/VideoPlayer.module.css';

const VideoPlayer = () => {
  return (
    <div className={styles.videoPlayer}>
      <video className={styles.videoElement} controls />
      <div className={styles.timeline}>
        <Timeline />
      </div>
      <div className={styles.trimBar}>
        <TrimBar />
      </div>
    </div>
  );
};

export default VideoPlayer;
