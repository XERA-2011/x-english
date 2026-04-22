import {type ReactNode, useState, useEffect, useCallback} from 'react';
import styles from './styles.module.css';

/* ── Writing type definitions ── */

interface WritingType {
  id: string;
  label: string;
  emoji: string;
}

interface WritingCategory {
  title: string;
  emoji: string;
  types: WritingType[];
}

const CATEGORIES: WritingCategory[] = [
  {
    title: 'PET3 A节 · 应用文',
    emoji: '📮',
    types: [
      {id: 'pet3-apology', label: '道歉信', emoji: '🙏'},
      {id: 'pet3-invitation', label: '邀请信', emoji: '💌'},
      {id: 'pet3-gratitude', label: '感谢信', emoji: '🌸'},
      {id: 'pet3-request', label: '请求信', emoji: '📩'},
      {id: 'pet3-complaint', label: '投诉信', emoji: '📢'},
      {id: 'pet3-inquiry', label: '询问信', emoji: '❓'},
      {id: 'pet3-suggestion', label: '建议信', emoji: '💡'},
      {id: 'pet3-job', label: '求职信', emoji: '💼'},
      {id: 'pet3-note', label: '便条', emoji: '📝'},
      {id: 'pet3-notice', label: '通知', emoji: '📋'},
    ],
  },
  {
    title: 'PET3 B节 · 短文写作',
    emoji: '📄',
    types: [
      {id: 'pet3-phenomenon', label: '现象评论', emoji: '🔍'},
      {id: 'pet3-opinion', label: '观点论述', emoji: '💬'},
      {id: 'pet3-chart', label: '图表描述', emoji: '📊'},
      {id: 'pet3-picture', label: '看图作文', emoji: '🖼️'},
    ],
  },
  {
    title: '通用写作',
    emoji: '✍️',
    types: [
      {id: 'gen-argumentative', label: '议论文', emoji: '⚖️'},
      {id: 'gen-practical', label: '应用文', emoji: '📧'},
      {id: 'gen-expository', label: '说明文', emoji: '📋'},
      {id: 'gen-graph', label: '图表作文', emoji: '📈'},
      {id: 'gen-picture', label: '看图作文', emoji: '🎨'},
    ],
  },
];

/* ── localStorage helpers ── */

const STORAGE_KEY = 'xe-writing-checkin';

interface CheckinRecord {
  /** Total check-in count for each type id */
  counts: Record<string, number>;
  /** Dates when each type was checked in (YYYY-MM-DD) */
  history: Record<string, string[]>;
}

function loadRecords(): CheckinRecord {
  if (typeof window === 'undefined') return {counts: {}, history: {}};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CheckinRecord;
  } catch {
    /* ignore */
  }
  return {counts: {}, history: {}};
}

function saveRecords(records: CheckinRecord) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function getToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ── Component ── */

export default function WritingCheckin(): ReactNode {
  const [records, setRecords] = useState<CheckinRecord>({
    counts: {},
    history: {},
  });
  const [justChecked, setJustChecked] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const today = getToday();

  const isCheckedToday = useCallback(
    (id: string) => {
      const dates = records.history[id];
      if (!dates) return false;
      return dates.includes(today);
    },
    [records, today],
  );

  const handleCheckin = (id: string) => {
    setRecords((prev) => {
      const newCounts = {...prev.counts};
      newCounts[id] = (newCounts[id] || 0) + 1;

      const newHistory = {...prev.history};
      const dates = newHistory[id] ? [...newHistory[id]] : [];
      if (!dates.includes(today)) {
        dates.push(today);
      }
      newHistory[id] = dates;

      const updated = {counts: newCounts, history: newHistory};
      saveRecords(updated);
      return updated;
    });

    setJustChecked(id);
    setShowConfetti(true);
    setTimeout(() => setJustChecked(null), 1200);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  // Stats
  const totalCheckins = Object.values(records.counts).reduce(
    (a, b) => a + b,
    0,
  );
  const todayCheckins = CATEGORIES.flatMap((c) => c.types).filter((t) =>
    isCheckedToday(t.id),
  ).length;
  const totalTypes = CATEGORIES.flatMap((c) => c.types).length;

  // Streak calculation (consecutive days with at least one check-in)
  const allDates = new Set<string>();
  for (const dates of Object.values(records.history)) {
    for (const d of dates) allDates.add(d);
  }
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (allDates.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>🔥</span>
          <div>
            <h3 className={styles.headerTitle}>写作打卡</h3>
            <p className={styles.headerSub}>
              选择一种写作类型进行打卡，记录你的练习轨迹
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{streak}</span>
          <span className={styles.statLabel}>🔥 连续天数</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{todayCheckins}</span>
          <span className={styles.statLabel}>📅 今日打卡</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{totalCheckins}</span>
          <span className={styles.statLabel}>✅ 累计打卡</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>
            {totalTypes > 0
              ? Math.round(
                  (Object.keys(records.counts).filter(
                    (k) => records.counts[k] > 0,
                  ).length /
                    totalTypes) *
                    100,
                )
              : 0}
            %
          </span>
          <span className={styles.statLabel}>📊 题型覆盖</span>
        </div>
      </div>

      {/* Confetti overlay */}
      {showConfetti && (
        <div className={styles.confettiOverlay} aria-hidden="true">
          {['🎉', '⭐', '✨', '🌟', '💪', '🎊'].map((e, i) => (
            <span
              key={i}
              className={styles.confettiPiece}
              style={{
                left: `${15 + i * 14}%`,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              {e}
            </span>
          ))}
        </div>
      )}

      {/* Categories */}
      {CATEGORIES.map((cat) => (
        <div key={cat.title} className={styles.category}>
          <div className={styles.categoryHeader}>
            <span>{cat.emoji}</span>
            <span className={styles.categoryTitle}>{cat.title}</span>
          </div>
          <div className={styles.typeGrid}>
            {cat.types.map((t) => {
              const count = records.counts[t.id] || 0;
              const checked = isCheckedToday(t.id);
              const isJust = justChecked === t.id;

              return (
                <button
                  key={t.id}
                  className={`${styles.typeCard} ${checked ? styles.typeChecked : ''} ${isJust ? styles.typeBounce : ''}`}
                  onClick={() => handleCheckin(t.id)}
                  title={`打卡「${t.label}」`}
                >
                  <span className={styles.typeEmoji}>{t.emoji}</span>
                  <span className={styles.typeLabel}>{t.label}</span>
                  <span
                    className={`${styles.typeCount} ${count > 0 ? styles.typeCountActive : ''}`}
                  >
                    {count > 0 ? `${count}次` : '—'}
                  </span>
                  {checked && (
                    <span className={styles.todayBadge}>今日 ✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Footer hint */}
      <p className={styles.footerHint}>
        💾 数据保存在浏览器本地，清除浏览器缓存将重置打卡记录
      </p>
    </div>
  );
}
