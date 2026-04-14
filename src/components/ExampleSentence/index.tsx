import type {ReactNode} from 'react';
import styles from './styles.module.css';

interface ExampleSentenceProps {
  /** 英文例句 */
  en: string;
  /** 中文翻译 */
  cn?: string;
  /** 需高亮的关键词/短语列表 */
  highlights?: string[];
  /** 语法/用法注释 */
  note?: string;
}

function highlightText(text: string, highlights: string[]): ReactNode[] {
  if (!highlights || highlights.length === 0) return [text];

  const escaped = highlights.map((h) =>
    h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const isHighlighted = highlights.some(
      (h) => h.toLowerCase() === part.toLowerCase()
    );
    return isHighlighted ? (
      <mark key={i} className={styles.highlight}>
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

export default function ExampleSentence({
  en,
  cn,
  highlights = [],
  note,
}: ExampleSentenceProps): ReactNode {
  return (
    <div className={styles.example}>
      <div className={styles.sentenceRow}>
        <span className={styles.icon}>📝</span>
        <p className={styles.en}>{highlightText(en, highlights)}</p>
      </div>
      {cn && <p className={styles.cn}>{cn}</p>}
      {note && (
        <div className={styles.note}>
          <span className={styles.noteIcon}>💡</span>
          <span>{note}</span>
        </div>
      )}
    </div>
  );
}
