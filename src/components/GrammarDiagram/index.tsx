import type {ReactNode} from 'react';
import styles from './styles.module.css';

interface SentencePart {
  text: string;
  role: string;
  color: string;
}

interface GrammarDiagramProps {
  /** 完整句子 */
  sentence: string;
  /** 句子成分分解 */
  parts: SentencePart[];
}

export default function GrammarDiagram({
  sentence,
  parts,
}: GrammarDiagramProps): ReactNode {
  return (
    <div className={styles.diagram}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>🔍</span>
        <span className={styles.headerLabel}>句子成分分析</span>
      </div>
      <div className={styles.sentence}>{sentence}</div>
      <div className={styles.parts}>
        {parts.map((part, i) => (
          <div key={i} className={styles.part}>
            <span
              className={styles.partText}
              style={{borderColor: part.color, background: `${part.color}15`}}
            >
              {part.text}
            </span>
            <span
              className={styles.partRole}
              style={{color: part.color, background: `${part.color}18`}}
            >
              {part.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
