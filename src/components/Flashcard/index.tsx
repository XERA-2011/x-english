import {type ReactNode, useState} from 'react';
import styles from './styles.module.css';

interface FlashcardProps {
  /** 正面内容（英文单词） */
  front: string;
  /** 背面内容（中文释义） */
  back: string;
  /** 音标 */
  phonetic?: string;
  /** 例句 */
  example?: string;
  /** 例句翻译 */
  exampleCn?: string;
}

export default function Flashcard({
  front,
  back,
  phonetic,
  example,
  exampleCn,
}: FlashcardProps): ReactNode {
  const [flipped, setFlipped] = useState(false);

  const isVeryLong = front.length > 25;
  const isLong = front.length > 12;

  const frontClass = `${styles.frontWord} ${
    isVeryLong ? styles.frontWordVeryLong : isLong ? styles.frontWordLong : ''
  }`;
  
  const backClass = `${styles.backWord} ${
    isVeryLong ? styles.backWordVeryLong : isLong ? styles.backWordLong : ''
  }`;

  return (
    <div
      className={`${styles.flashcard} ${flipped ? styles.flipped : ''}`}
      onClick={() => setFlipped(!flipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped(!flipped)}
    >
      <div className={styles.cardInner}>
        {/* Front */}
        <div className={styles.cardFront}>
          <div className={styles.cardLabel}>点击翻转 👆</div>
          <div className={frontClass}>{front}</div>
          {phonetic && <div className={styles.phonetic}>{phonetic}</div>}
        </div>

        {/* Back */}
        <div className={styles.cardBack}>
          <div className={styles.cardLabel}>点击翻回 👆</div>
          <div className={backClass}>{front}</div>
          <div className={styles.backMeaning}>{back}</div>
          {phonetic && <div className={styles.phonetic}>{phonetic}</div>}
          {example && (
            <div className={styles.exampleSection}>
              <p className={styles.exampleEn}>📖 {example}</p>
              {exampleCn && (
                <p className={styles.exampleCn}>{exampleCn}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
