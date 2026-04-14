import type {ReactNode} from 'react';
import styles from './styles.module.css';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface DifficultyBadgeProps {
  level: Level;
  label?: string;
}

const levelConfig: Record<Level, { color: string; bg: string; text: string }> = {
  A1: { color: '#0fa76e', bg: 'rgba(24, 226, 153, 0.1)', text: '入门' },
  A2: { color: '#65a30d', bg: 'rgba(132, 204, 22, 0.1)', text: '基础' },
  B1: { color: '#ca8a04', bg: 'rgba(234, 179, 8, 0.1)', text: '中级' },
  B2: { color: '#ea580c', bg: 'rgba(249, 115, 22, 0.1)', text: '中高级' },
  C1: { color: '#dc2626', bg: 'rgba(239, 68, 68, 0.1)', text: '高级' },
  C2: { color: '#9333ea', bg: 'rgba(168, 85, 247, 0.1)', text: '精通' },
};

export default function DifficultyBadge({
  level,
  label,
}: DifficultyBadgeProps): ReactNode {
  const config = levelConfig[level];
  return (
    <span
      className={styles.badge}
      style={{
        color: config.color,
        background: config.bg,
        borderColor: config.color,
      }}
    >
      {level} · {label || config.text}
    </span>
  );
}
