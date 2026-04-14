import {type ReactNode, useState} from 'react';
import styles from './styles.module.css';

interface WordEntry {
  word: string;
  pos?: string;
  phonetic?: string;
  meaning: string;
  example?: string;
}

interface VocabTableProps {
  words: WordEntry[];
  title?: string;
}

export default function VocabTable({
  words,
  title,
}: VocabTableProps): ReactNode {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className={styles.vocabTable}>
      {title && <div className={styles.tableTitle}>📚 {title}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>单词</th>
            <th>词性</th>
            <th>释义</th>
            <th>例句</th>
          </tr>
        </thead>
        <tbody>
          {words.map((w, i) => (
            <tr
              key={w.word}
              className={hoveredIdx === i ? styles.rowHovered : ''}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <td className={styles.wordCell}>
                <span className={styles.word}>{w.word}</span>
                {w.phonetic && (
                  <span className={styles.phonetic}>{w.phonetic}</span>
                )}
              </td>
              <td className={styles.posCell}>
                {w.pos && <span className={styles.pos}>{w.pos}</span>}
              </td>
              <td className={styles.meaningCell}>{w.meaning}</td>
              <td className={styles.exampleCell}>
                {w.example && (
                  <span className={styles.exampleText}>{w.example}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
