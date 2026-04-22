import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './styles.module.css';

/* ── Types & Data ── */

interface WritingTopic {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
  targetWords: [number, number] | number;
  template?: string;
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
      { id: 'pet3-apology', label: '道歉信', emoji: '🙏', prompt: '写一封道歉信。说明道歉原因，表达歉意，并提出补救措施。', targetWords: 100, template: 'Dear Prof. Wan,\n\n**First of all, please allow me to express my deep sorry for** not being able to keep our appointment. **I do know that this is very impolite and must have caused you much trouble.**\n\n**I do reckon that at present any explanation is pale and futile. However, I do not want you to misunderstand me.** On my way to your office, an old lady suddenly fainted due to heart attack on the bus. I stopped a taxi and sent her into a nearby hospital. I stayed there until her son came, which spoiled our appointment.\n\n**I am aware that** our appointment **is important. I do hope that you would be kind enough to spare your valuable time to meet me. I am looking forward to hearing from you.**\n\n**Sincerely yours,**\nLi Ming' },
      { id: 'pet3-invitation', label: '邀请信', emoji: '💌', prompt: '写一封邀请信。说明活动内容、时间、地点，并表达期待。', targetWords: 100, template: 'Dear Mr. Doe,\n\nThe 15th annual Trade Show **will be held in** Beijing **next month. You are cordially invited to attend this most exciting event of the year.**\n\nDates: October 5th through 10th\nTime: 10:00 a.m. to 5:00 p.m.\nPlace: Beijing Industrial Exhibition Hall\n\nWe will have the latest products from our line on display, and **our expert staff will be available to provide you with all the information you need and to answer any questions you may have. Free drinks and snacks will also be provided, and you are welcome to bring along your friends.**\n\n**We look forward to seeing you at** the Trade Show.\n\n**Yours sincerely,**\nWang Yue' },
      { id: 'pet3-gratitude', label: '感谢信', emoji: '🌸', prompt: '写一封感谢信。说明感谢的原因和具体帮助，再次表达谢意。', targetWords: 100, template: 'Dear John,\n\n**I am writing to express my heartfelt gratitude to you for** your warm reception and hospitality during my stay in your city. **Your kindness made my trip an unforgettable experience.**\n\n**I still remember the days we spent together.** You took me to visit many famous scenic spots and historical sites, such as the local museum and the beautiful national park. **Thanks to your detailed introduction, I have learned a lot about** the culture and history of your hometown. **In addition,** the food you prepared for me was incredibly delicious.\n\n**I sincerely hope that you will have a chance to visit my city in the near future, so that I can repay your kindness and show you around.**\n\n**Thank you once again for everything.**\n\n**Yours sincerely,**\nLi Ming' },
      { id: 'pet3-request', label: '请求信', emoji: '📩', prompt: '写一封请求信。正式提出请求，说明原因，并表达感谢。', targetWords: 100, template: '**Dear Sir/Madam,**\n\nI am a sophomore majoring in Computer Science at Beijing University. **I am writing to formally request the opportunity to** participate in the upcoming summer exchange program organized by your esteemed university.\n\n**The reason for this request is that I have always been fascinated by** your advanced research facilities and outstanding academic environment. **I believe this program will greatly broaden my horizons and enhance my understanding of** artificial intelligence, **which aligns perfectly with my career goals.**\n\n**I have enclosed my resume** and transcript **for your review. I am fully prepared to meet the academic challenges and contribute to** the program.\n\n**Thank you for considering my application. I look forward to your favorable reply.**\n\n**Yours sincerely,**\nLi Ming' },
      { id: 'pet3-complaint', label: '投诉信', emoji: '📢', prompt: '写一封投诉信。说明投诉对象、具体问题及影响，并提出期望的解决方案。', targetWords: 100, template: '**Dear Manager,**\n\n**Much to my regret, I write this to place a complaint against** your delivery service in your company.\n\nThe Samsung tape recorder model number JB/4073, which I ordered from your company on Nov. 1, arrived yesterday. The serial number of the machine is 4703-0461. **I am sorry to report that** the recorder **has been badly damaged. There was no unusual damage to the packing case, but when I opened it, I found that** the lid of the recorder had been cracked and that the front surface of the machine had been scratched.\n\n**Since there was such damage to the goods, I decided to file a complaint against** the delivery service. **Would you please let me know whether I should return** the recorder **to you for a replacement?**\n\n**Sincerely yours,**\nJonathan Edwards' },
      { id: 'pet3-inquiry', label: '询问信', emoji: '❓', prompt: '写一封询问信。自我介绍，说明咨询内容，列出具体问题。', targetWords: 100, template: '**Dear Sir or Madam,**\n\n**I am writing to ask for information about** training courses in automobile repair **that your** Vocation Repair Center **offers.** I enjoy working with cars and would like to train to be a mechanic.\n\n**I would like to take the course from** September **to** December, **but I can only study in the evenings because I have a full-time course in my college. Therefore, I want to know if there are any evening classes available during this period. Also, could you please tell me the exact tuition fee and the deadline for registration?**\n\n**I would appreciate it if you could send me the details and an application form as soon as possible.**\n\n**Yours sincerely,**\nJiang Peng' },
      { id: 'pet3-suggestion', label: '建议信', emoji: '💡', prompt: '写一封建议信。回应对方的咨询，提出具体的建议。', targetWords: 100, template: '**Dear Peter,**\n\n**I\'m glad to receive your letter asking for my advice on how to** learn Chinese well.\n\n**Here are a few suggestions. First, it is important to** take a Chinese course, **as you\'ll be able to** learn from the teacher and practice with your fellow students. **Then, it also helps to** watch TV and read books, newspapers and magazines in Chinese whenever possible.\n\n**Besides, it is a good idea to** learn and sing Chinese songs, **because by doing so you\'ll** learn and remember Chinese words more easily. **You can also** make more Chinese friends. They will tell you a lot about China and help you learn Chinese.\n\n**Try and write me in** Chinese **next time.**\n\n**Best wishes,**\nLi Ming' },
      { id: 'pet3-job', label: '求职信', emoji: '💼', prompt: '写一封求职信。说明应聘职位、个人优势及面试请求。', targetWords: 100, template: '**Dear Sirs,**\n\n**In reply to your advertisement in today\'s** China Daily, **I am now writing to apply for the position of** sales manager.\n\nI am a male, currently 24 years old. I graduated from Peking University and majored in international trade. At college, I have passed CET-6. **Besides, I joined various kinds of social activities and organizations in my spare time, which have greatly developed my ability of dealing with complicated situations. I am confident and enthusiastic, so I believe that my personal qualities will allow me to make a valuable contribution to your company.**\n\n**I enclose my curriculum vitae; I hope I can get an opportunity for a personal interview at any time. Thank you for your consideration.**\n\n**Sincerely yours,**\nLiu Jun' },
      { id: 'pet3-note', label: '便条', emoji: '📝', prompt: '写一则便条。说明核心事由，请求对方协助或留下提醒事项。', targetWords: 100, template: '**Mrs** Wilson,\n\n**I’m going out** shopping, **and won’t be back until about** 5:00 pm. **I have taken with me** the two books you asked me to return to the City Library.\n\n**At about** 1 o’clock this afternoon, Tracy **called, saying that she couldn’t meet you at** Bolton Coffee **tomorrow morning as she has something important to attend to. She felt very sorry about that, but said that you could set some other time for the meeting.**\n\n**She wanted you to call her back as soon as you are home. She has already told** Susan **about this change. Have a good afternoon.**\n\nLi Hua' },
      { id: 'pet3-notice', label: '通知', emoji: '📋', prompt: '写一则通知。说明活动时间、地点、内容及注意事项。', targetWords: 100, template: '[center]**NOTICE**[/center]\n\n**The Student Union is pleased to announce that** an English Speech Contest **will be held in the school auditorium on next Friday, May 15th, from 2:00 p.m. to 5:00 p.m.**\n\n**The purpose of this contest is to** improve students\' spoken English and provide a stage to show their language talent. **The topic of the speech is** "My Dream in the Future", **and each participant will have 3 to 5 minutes to deliver their speech.**\n\n**Those who are interested are invited to sign up at** the Student Union office **before this Wednesday. Please note that all participants should prepare their own materials. The top three winners will receive special prizes and certificates.**\n\n**We look forward to your active participation.**\n\n[right]**The Student Union**[/right]\n[right]**May 10th**[/right]' },
    ],
  },
  {
    title: 'PET3 B节 · 短文写作',
    emoji: '📄',
    topics: [
      { id: 'pet3-phenomenon', label: '现象评论', emoji: '🔍', prompt: '描述一种社会现象，分析其产生的原因，并给出你的看法或建议。', targetWords: [120, 150], template: '**Recently, the phenomenon of** food delivery services **has aroused wide concern among the public. It is very common to see** deliverymen riding their e-bikes in a hurry on the streets.\n\n**There are several reasons for this phenomenon. First of all, the rapid development of** the Internet and smartphones **makes it easy for people to** order food online. **Secondly, modern people are living at a fast pace and often do not have enough time to** cook by themselves. **Last but not least,** various food delivery apps offer discounts, **which attract more customers.**\n\n**In my opinion, this phenomenon is both positive and negative. On the one hand, it provides great convenience to our daily life. On the other hand, it generates** a lot of plastic waste. **Therefore, we should take proper measures to balance** convenience and environmental protection.' },
      { id: 'pet3-opinion', label: '观点论述', emoji: '💬', prompt: '针对某一个话题或争议，表明你的观点并给出理由进行论证。', targetWords: [120, 150], template: '**When it comes to the issue of whether** college students should take part-time jobs, **people\'s opinions differ greatly. Some people believe that** part-time jobs are a waste of time, **while others hold the view that they are highly beneficial.**\n\n**From my perspective, I am in favor of the latter view. My reasons are as follows. To begin with,** doing part-time jobs **can help** students **gain valuable social experience and improve their practical skills, which cannot be learned from textbooks. Furthermore, it allows** students to earn some pocket money and relieve the financial burden on their parents.\n\n**In conclusion, taking all these factors into consideration, we may safely draw the conclusion that** taking part-time jobs **is a rewarding experience for** college students **as long as it does not affect their academic studies.**' },
      { id: 'pet3-chart', label: '图表描述', emoji: '📊', prompt: '描述给出的图表数据趋势，分析产生该趋势的原因及其可能的影响。', targetWords: [120, 150], template: '**As is vividly shown in the chart, we can see that the number of** people using mobile payments **has changed remarkably during the period from** 2015 **to** 2020. **The percentage rose sharply from** 30% **in** 2015 **to over** 85% **in** 2020.\n\n**Several factors contribute to this change. For one thing,** smartphones have become extremely popular in recent years, making mobile payment accessible to almost everyone. **For another,** the payment process is incredibly fast and convenient, eliminating the need to carry cash or bank cards. **Moreover,** high security measures have increased people\'s confidence in this payment method.\n\n**Judging from the figures, we can predict that the trend of** mobile payment **will continue to grow in the coming years. Thus, it is necessary for** traditional businesses **to adapt to this** cashless **trend.**' },
      { id: 'pet3-picture', label: '看图作文', emoji: '🖼️', prompt: '描述图片/漫画的内容，揭示其深层含义或反映的问题，并发表评论。', targetWords: [120, 150], template: '**As is vividly depicted in the picture,** a young man is sitting in front of his computer, surrounded by piles of books, but he is busy playing computer games instead of studying. **The picture, though simple, conveys a profound message about** time management.\n\n**It is obvious that the drawer intends to remind us of the importance of** self-control. **In the digital age, we are constantly distracted by** entertainment on the Internet. **Without** self-discipline, **we can hardly focus on our studies or work, which will eventually lead to failure in the future.**\n\n**To sum up, we should attach great importance to** self-control. **We must learn to strike a balance between** work and play. **Only in this way can we make the most of our time and achieve our goals.**' },
    ],
  },
  {
    title: '通用写作',
    emoji: '✍️',
    topics: [
      { id: 'gen-argumentative', label: '议论文', emoji: '⚖️', prompt: '就某一观点进行正反面论述，并得出结论。', targetWords: [120, 180], template: '**There is a widespread concern over the issue of** environmental protection. **But it is well known that the opinion concerning this hot topic varies from person to person.**\n\n**A majority of people think that** the government should take the main responsibility. **In their views, there are two factors contributing to this attitude. Firstly,** only the government has the power to pass strict laws to punish polluters. **Secondly,** large-scale environmental projects require massive financial support that individuals cannot afford.\n\n**People, however, differ in their opinions on this matter. Some people hold the idea that** every individual should be responsible. **In their point of view,** pollution is caused by our daily activities. **On the other hand, small actions like** recycling **can make a big difference.**\n\n**As far as I am concerned, I firmly support the view that** it requires joint efforts. **It is not only because** the government provides regulations, **but also because** individual actions put them into practice.' },
      { id: 'gen-practical', label: '应用文', emoji: '📧', prompt: '撰写日常应用文体，如邮件、演讲稿等。', targetWords: [100, 120], template: '**Dear Mr. Smith,**\n\n**I am writing to express my interest in joining** the volunteer team for the upcoming International Cultural Festival. \n\n**First and foremost, I have been** learning cross-cultural communication for two years, **which enables me to** interact smoothly with guests from different backgrounds. **Moreover, I have previous experience in organizing similar** campus events, **so I am very familiar with** the coordination of activities and emergency handling. **I am available to work for the entire duration of the** festival **and can take on various tasks such as** reception and stage management.\n\n**I have attached my resume for your reference. If you have any questions, please feel free to contact me. Looking forward to hearing from you soon.**\n\n**Yours sincerely,**\nLi Ming' },
      { id: 'gen-expository', label: '说明文', emoji: '📋', prompt: '客观地说明事物的特征、本质或规律。', targetWords: [120, 180], template: '**Nowadays,** Artificial Intelligence (AI) **has become increasingly important in our daily lives. It refers to** the simulation of human intelligence processes by computer systems, enabling machines to learn, reason, and make decisions.\n\n**The characteristics of** AI **can be listed as follows. First,** it has an incredible capability to process and analyze massive amounts of data in seconds, **which is impossible for human beings. Second,** AI systems can continuously improve their performance through machine learning algorithms without human intervention. **Furthermore,** it never feels tired and can work 24 hours a day with high accuracy.\n\n**In summary, understanding** AI **is of great significance for us because** it is reshaping various industries, from healthcare to transportation. **We should embrace this** technology **while paying attention to its potential risks.**' },
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
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
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

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  const renderTemplate = (text?: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let align: 'left' | 'center' | 'right' = 'left';
      let content = line.trim();
      
      if (!content) {
        return <div key={i} style={{ minHeight: '1.6em' }}></div>;
      }

      if (content.startsWith('[center]') && content.endsWith('[/center]')) {
        align = 'center';
        content = content.slice(8, -9).trim();
      } else if (content.startsWith('[right]') && content.endsWith('[/right]')) {
        align = 'right';
        content = content.slice(7, -8).trim();
      } else {
        content = line; 
      }

      const parts = content.split(/(\*\*.*?\*\*)/g);
      const renderedContent = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={j} className={styles.highlightText}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={j}>{part}</span>;
      });

      return (
        <div key={i} style={{ textAlign: align }}>
          {renderedContent}
        </div>
      );
    });
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

          {selectedTopic.template && (
            <div className={styles.templateBox}>
              <h4 className={styles.templateTitle}>📝 写作模板参考（高亮部分可复用）</h4>
              <div className={styles.templateContent}>
                {renderTemplate(CATEGORIES.flatMap(c => c.topics).find(t => t.id === selectedTopic.id)?.template)}
              </div>
            </div>
          )}
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
            <div className={styles.actionButtons}>
              <button 
                className={`${styles.copyBtn} ${copyStatus === 'copied' ? styles.copySuccess : ''} ${copyStatus === 'error' ? styles.copyError : ''}`} 
                onClick={handleCopyImage} 
                disabled={!posterUrl || copyStatus !== 'idle'}
              >
                {copyStatus === 'copied' ? '✅ 已复制' : copyStatus === 'error' ? '❌ 复制失败' : '📋 复制图片'}
              </button>
              <button className={styles.downloadBtn} onClick={handleDownload} disabled={!posterUrl}>
                ⬇️ 保存图片
              </button>
            </div>
            <p className={styles.shareHint}>复制或保存图片后，可分享至社交媒体打卡</p>
          </div>
        </div>
      )}
    </div>
  );
}
