import {type ReactNode, useRef, useState} from 'react';
import styles from './styles.module.css';

interface AudioPlayerProps {
  /** 音频文件路径 */
  src: string;
  /** 显示标签 */
  label?: string;
}

export default function AudioPlayer({
  src,
  label,
}: AudioPlayerProps): ReactNode {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5];

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.playbackRate = speed;
      audio.play();
    }
  };

  const cycleSpeed = () => {
    const idx = speeds.indexOf(speed);
    const next = speeds[(idx + 1) % speeds.length];
    setSpeed(next);
    if (audioRef.current) {
      audioRef.current.playbackRate = next;
    }
  };

  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  return (
    <div className={styles.player}>
      <audio
        ref={audioRef}
        src={src}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handlePause}
        preload="metadata"
      />
      <button
        className={`${styles.playBtn} ${playing ? styles.playing : ''}`}
        onClick={togglePlay}
        aria-label={playing ? '暂停' : '播放'}
      >
        {playing ? '⏸' : '▶️'}
      </button>
      {label && <span className={styles.label}>{label}</span>}
      <button className={styles.speedBtn} onClick={cycleSpeed}>
        {speed}x
      </button>
    </div>
  );
}
