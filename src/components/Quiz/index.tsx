import {type ReactNode, useState} from 'react';
import styles from './styles.module.css';

type QuizType = 'multiple-choice' | 'true-false' | 'fill-blank';

interface QuizProps {
  /** 题目类型 */
  type?: QuizType;
  /** 问题 */
  question: string;
  /** 选项（选择题/判断题用） */
  options?: string[];
  /** 正确答案 */
  answer: string;
  /** 解析说明 */
  explanation?: string;
}

export default function Quiz({
  type = 'multiple-choice',
  question,
  options = [],
  answer,
  explanation,
}: QuizProps): ReactNode {
  const [selected, setSelected] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isCorrect =
    type === 'fill-blank'
      ? inputValue.trim().toLowerCase() === answer.trim().toLowerCase()
      : selected === answer;

  const handleSubmit = () => {
    if (type === 'fill-blank' && !inputValue.trim()) return;
    if (type !== 'fill-blank' && !selected) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected(null);
    setInputValue('');
    setSubmitted(false);
  };

  const actualOptions =
    type === 'true-false' ? ['True', 'False'] : options;

  return (
    <div className={styles.quiz}>
      <div className={styles.quizHeader}>
        <span className={styles.quizIcon}>
          {submitted ? (isCorrect ? '✅' : '❌') : '💡'}
        </span>
        <span className={styles.quizLabel}>练习题</span>
      </div>

      <p className={styles.quizQuestion}>{question}</p>

      {type === 'fill-blank' ? (
        <div className={styles.fillBlank}>
          <input
            type="text"
            className={styles.fillInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你的答案..."
            disabled={submitted}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
      ) : (
        <div className={styles.options}>
          {actualOptions.map((opt) => (
            <button
              key={opt}
              className={`${styles.option} ${
                selected === opt ? styles.optionSelected : ''
              } ${
                submitted && opt === answer
                  ? styles.optionCorrect
                  : submitted && selected === opt && opt !== answer
                  ? styles.optionWrong
                  : ''
              }`}
              onClick={() => !submitted && setSelected(opt)}
              disabled={submitted}
            >
              <span className={styles.optionDot} />
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

      <div className={styles.quizActions}>
        {!submitted ? (
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={type === 'fill-blank' ? !inputValue.trim() : !selected}
          >
            提交答案
          </button>
        ) : (
          <button className={styles.resetBtn} onClick={handleReset}>
            再做一次
          </button>
        )}
      </div>

      {submitted && (
        <div
          className={`${styles.feedback} ${
            isCorrect ? styles.feedbackCorrect : styles.feedbackWrong
          }`}
        >
          <div className={styles.feedbackTitle}>
            {isCorrect ? '🎉 正确！' : `❌ 不对，正确答案是：${answer}`}
          </div>
          {explanation && (
            <p className={styles.feedbackExplanation}>{explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
