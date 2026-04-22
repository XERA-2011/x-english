import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './styles.module.css';

/* ── Types & Data ── */

interface WritingTopic {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
  targetWords: [number, number] | number;
}

interface WritingCategory {
  title: string;
  emoji: string;
  topics: WritingTopic[];
}

const CATEGORIES: WritingCategory[] = [
  {
    title: 'PET3 A节 · 应用文',
    emoji: '📮',
    topics: [
      { id: 'pet3-apology', label: '道歉信', emoji: '🙏', prompt: '写一封道歉信。说明道歉原因，表达歉意，并提出补救措施。', targetWords: 100 },
      { id: 'pet3-invitation', label: '邀请信', emoji: '💌', prompt: '写一封邀请信。说明活动内容、时间、地点，并表达期待。', targetWords: 100 },
      { id: 'pet3-gratitude', label: '感谢信', emoji: '🌸', prompt: '写一封感谢信。说明感谢的原因和具体帮助，再次表达谢意。', targetWords: 100 },
      { id: 'pet3-request', label: '请求信', emoji: '📩', prompt: '写一封请求信。正式提出请求，说明原因，并表达感谢。', targetWords: 100 },
      { id: 'pet3-complaint', label: '投诉信', emoji: '📢', prompt: '写一封投诉信。说明投诉对象、具体问题及影响，并提出期望的解决方案。', targetWords: 100 },
      { id: 'pet3-inquiry', label: '询问信', emoji: '❓', prompt: '写一封询问信。自我介绍，说明咨询内容，列出具体问题。', targetWords: 100 },
      { id: 'pet3-suggestion', label: '建议信', emoji: '💡', prompt: '写一封建议信。回应对方的咨询，提出具体的建议。', targetWords: 100 },
      { id: 'pet3-job', label: '求职信', emoji: '💼', prompt: '写一封求职信。说明应聘职位、个人优势及面试请求。', targetWords: 100 },
      { id: 'pet3-note', label: '便条', emoji: '📝', prompt: '写一则便条。说明核心事由，请求对方协助或留下提醒事项。', targetWords: 100 },
      { id: 'pet3-notice', label: '通知', emoji: '📋', prompt: '写一则通知。说明活动时间、地点、内容及注意事项。', targetWords: 100 },
    ],
  },
  {
    title: 'PET3 B节 · 短文写作',
    emoji: '📄',
    topics: [
      { id: 'pet3-phenomenon', label: '现象评论', emoji: '🔍', prompt: '描述一种社会现象，分析其产生的原因，并给出你的看法或建议。', targetWords: [120, 150] },
      { id: 'pet3-opinion', label: '观点论述', emoji: '💬', prompt: '针对某一个话题或争议，表明你的观点并给出理由进行论证。', targetWords: [120, 150] },
      { id: 'pet3-chart', label: '图表描述', emoji: '📊', prompt: '描述给出的图表数据趋势，分析产生该趋势的原因及其可能的影响。', targetWords: [120, 150] },
      { id: 'pet3-picture', label: '看图作文', emoji: '🖼️', prompt: '描述图片/漫画的内容，揭示其深层含义或反映的问题，并发表评论。', targetWords: [120, 150] },
    ],
  },
  {
    title: '通用写作',
    emoji: '✍️',
    topics: [
      { id: 'gen-argumentative', label: '议论文', emoji: '⚖️', prompt: '就某一观点进行正反面论述，并得出结论。', targetWords: [120, 180] },
      { id: 'gen-practical', label: '应用文', emoji: '📧', prompt: '撰写日常应用文体，如邮件、演讲稿等。', targetWords: [100, 120] },
      { id: 'gen-expository', label: '说明文', emoji: '📋', prompt: '客观地说明事物的特征、本质或规律。', targetWords: [120, 180] },
    ],
  },
];

const STORAGE_KEY = 'xe-writing-history';

interface CheckinRecord {
  id: string; // unique record id
  topicId: string;
  date: string;
  wordCount: number;
}

function loadRecords(): CheckinRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function saveRecords(records: CheckinRecord[]) {
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

export default function WritingCheckin(): React.ReactNode {
  const [step, setStep] = useState<'select' | 'write' | 'preview'>('select');
  const [selectedTopic, setSelectedTopic] = useState<WritingTopic | null>(null);
  const [text, setText] = useState('');
  const [records, setRecords] = useState<CheckinRecord[]>([]);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const handleSelectTopic = (topic: WritingTopic) => {
    setSelectedTopic(topic);
    setText(''); // Reset text when new topic selected
    setStep('write');
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  const getWordCountText = (topic: WritingTopic) => {
    if (Array.isArray(topic.targetWords)) {
      return `${topic.targetWords[0]}-${topic.targetWords[1]} 词`;
    }
    return `约 ${topic.targetWords} 词`;
  };

  const generatePoster = useCallback(() => {
    if (!canvasRef.current || !selectedTopic) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed width, dynamic height
    const width = 750;
    const dpr = window.devicePixelRatio || 2;
    
    // Preparation pass to determine text height
    ctx.font = '32px Inter, "Noto Sans SC", sans-serif';
    const paragraphs = text.split('\n');
    const allLines: string[] = [];
    
    paragraphs.forEach(p => {
      if (p.trim() === '') {
        allLines.push('');
        return;
      }
      const words = p.split(' ');
      let currentLine = words[0] || '';
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const metrics = ctx.measureText(currentLine + ' ' + word);
        if (metrics.width > width - 100) {
          allLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine += ' ' + word;
        }
      }
      allLines.push(currentLine);
    });

    const textStartY = 330;
    const lineHeight = 48;
    const textHeight = allLines.length * lineHeight;
    const height = textStartY + textHeight + 140; // Add footer space

    // Set actual canvas size
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Scale context to ensure crisp rendering
    ctx.scale(dpr, dpr);

    // 1. Draw Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Header Area
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, 160);
    
    ctx.fillStyle = '#18E299'; // Primary color
    ctx.font = 'bold 44px Inter, "Noto Sans SC", sans-serif';
    ctx.fillText('🔥 X-English 写作打卡', 50, 75);

    ctx.fillStyle = '#666666';
    ctx.font = '28px Inter, "Noto Sans SC", sans-serif';
    ctx.fillText(`坚持写作，每天进步一点点 ✨`, 50, 125);

    // 3. Draw Topic Info
    ctx.font = 'bold 36px Inter, "Noto Sans SC", sans-serif';
    ctx.fillStyle = '#0d0d0d';
    ctx.fillText(`${selectedTopic.emoji} ${selectedTopic.label}`, 50, 220);
    
    const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
    ctx.font = '28px Inter, "Noto Sans SC", sans-serif';
    ctx.fillStyle = '#888888';
    const dateStr = new Date().toLocaleDateString('zh-CN');
    ctx.fillText(`📝 ${wc} 词   📅 ${dateStr}`, 50, 270);

    // Divider
    ctx.strokeStyle = '#eaeaea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.lineTo(width - 50, 300);
    ctx.stroke();

    // 4. Draw User Text
    ctx.fillStyle = '#333333';
    ctx.font = '32px Inter, "Noto Sans SC", sans-serif';
    let currentY = textStartY + 30;
    allLines.forEach(line => {
      ctx.fillText(line, 50, currentY);
      currentY += lineHeight;
    });

    // 5. Draw Footer
    ctx.beginPath();
    ctx.moveTo(50, height - 90);
    ctx.lineTo(width - 50, height - 90);
    ctx.stroke();

    ctx.fillStyle = '#aaaaaa';
    ctx.font = '24px Inter, "Noto Sans SC", sans-serif';
    ctx.fillText('扫描/访问 x-english.pages.dev 获取更多英语资料', 50, height - 40);

    // Convert to image
    const dataUrl = canvas.toDataURL('image/png');
    setPosterUrl(dataUrl);

  }, [text, selectedTopic]);

  const handleGenerateClick = () => {
    if (!selectedTopic || !text.trim()) return;
    
    // Save record
    const newRecord: CheckinRecord = {
      id: Date.now().toString(),
      topicId: selectedTopic.id,
      date: getToday(),
      wordCount: wordCount,
    };
    const newRecords = [...records, newRecord];
    setRecords(newRecords);
    saveRecords(newRecords);

    setStep('preview');
    // Generate poster after a tiny delay to ensure canvas is rendered
    setTimeout(generatePoster, 50);
  };

  const handleDownload = () => {
    if (!posterUrl) return;
    const a = document.createElement('a');
    a.href = posterUrl;
    a.download = `x-english-writing-${getToday()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const todayCount = records.filter(r => r.date === getToday()).length;
  const totalCount = records.length;

  return (
    <div className={styles.container}>
      {/* View 1: Select Topic */}
      {step === 'select' && (
        <div className={styles.selectView}>
          <div className={styles.header}>
            <div>
              <h3 className={styles.title}>选择写作题目</h3>
              <p className={styles.subtitle}>选择一个类型开始今天的练习。你已累计打卡 {totalCount} 次，今日打卡 {todayCount} 次。</p>
            </div>
          </div>
          
          <div className={styles.categories}>
            {CATEGORIES.map(cat => (
              <div key={cat.title} className={styles.category}>
                <h4 className={styles.categoryTitle}>{cat.emoji} {cat.title}</h4>
                <div className={styles.topicGrid}>
                  {cat.topics.map(topic => (
                    <button
                      key={topic.id}
                      className={styles.topicCard}
                      onClick={() => handleSelectTopic(topic)}
                    >
                      <span className={styles.topicEmoji}>{topic.emoji}</span>
                      <span className={styles.topicLabel}>{topic.label}</span>
                      <span className={styles.topicTarget}>{getWordCountText(topic)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Write Area */}
      {step === 'write' && selectedTopic && (
        <div className={styles.writeView}>
          <div className={styles.writeHeader}>
            <button className={styles.backBtn} onClick={() => setStep('select')}>
              ← 返回选题
            </button>
            <div className={styles.writeTopicInfo}>
              <span className={styles.writeEmoji}>{selectedTopic.emoji}</span>
              <span className={styles.writeLabel}>{selectedTopic.label}</span>
            </div>
          </div>

          <div className={styles.promptBox}>
            <strong>📝 题目要求：</strong>{selectedTopic.prompt}
            <br />
            <span className={styles.targetWords}>目标字数：{getWordCountText(selectedTopic)}</span>
          </div>

          <textarea
            className={styles.textarea}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="在此输入你的英文作文..."
            spellCheck={false}
          />

          <div className={styles.writeFooter}>
            <span className={styles.wordCount}>当前字数：<strong>{wordCount}</strong></span>
            <button 
              className={styles.generateBtn} 
              onClick={handleGenerateClick}
              disabled={wordCount === 0}
            >
              生成打卡海报
            </button>
          </div>
        </div>
      )}

      {/* View 3: Preview & Share */}
      {step === 'preview' && (
        <div className={styles.previewView}>
          <div className={styles.previewHeader}>
            <button className={styles.backBtn} onClick={() => setStep('write')}>
              ← 返回修改
            </button>
            <h3 className={styles.previewTitle}>✨ 打卡海报生成成功</h3>
          </div>

          <div className={styles.posterContainer}>
            {/* Hidden canvas used for drawing */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {posterUrl ? (
              <img src={posterUrl} alt="写作打卡海报" className={styles.posterImage} />
            ) : (
              <div className={styles.loading}>正在生成海报...</div>
            )}
          </div>

          <div className={styles.previewActions}>
            <button className={styles.downloadBtn} onClick={handleDownload} disabled={!posterUrl}>
              ⬇️ 保存图片
            </button>
            <p className={styles.shareHint}>保存图片后可分享至社交媒体打卡</p>
          </div>
        </div>
      )}
    </div>
  );
}
