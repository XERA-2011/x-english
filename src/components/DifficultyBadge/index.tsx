import type {ReactNode} from 'react';
import styles from './styles.module.css';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface DifficultyBadgeProps {
  level: Level;
  label?: string;
}

const levelConfig: Record<Level, { color: string; bg: string; text: string }> = {
  A1: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', text: '入门' },
  A2: { color: '#84cc16', bg: 'rgba(132, 204, 22, 0.12)', text: '基础' },
  B1: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)', text: '中级' },
  B2: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', text: '中高级' },
  C1: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', text: '高级' },
  C2: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', text: '精通' },
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
