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
  translation?: string;
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
      { id: 'pet3-apology', label: '道歉信', emoji: '🙏', prompt: '写一封道歉信。说明道歉原因，表达歉意，并提出补救措施。', targetWords: 100, template: 'Dear Prof. Wan,\n\n**I am writing to apologize for** not being able to keep our appointment. **I am terribly sorry for the inconvenience this has caused you.**\n\nOn my way to your office, an old lady suddenly fainted due to heart attack on the bus. I stopped a taxi and sent her into a nearby hospital. I stayed there until her son came, which spoiled our appointment. **I hope you can understand my situation and accept my sincere apology.**\n\n**Please allow me to make up for this matter by** visiting your office again tomorrow if you are available. **Thank you for your understanding.**\n\n**Yours sincerely,**\nLi Ming', translation: '尊敬的万教授，\n\n我写信是为了就未能赴约向您道歉。对此给您带来的不便，我深感抱歉。\n\n在去您办公室的路上，一位老太太在公交车上突发心脏病晕倒了。我拦了一辆出租车把她送到了附近的医院。我在那里一直等到她儿子过来，这导致我错过了我们的约定。希望您能理解我的处境，并接受我诚挚的歉意。\n\n请允许我明天在您方便的时候再次拜访您，以此来弥补这件事。感谢您的理解。\n\n此致\n敬礼\n李明' },
      { id: 'pet3-invitation', label: '邀请信', emoji: '💌', prompt: '写一封邀请信。说明活动内容、时间、地点，并表达期待。', targetWords: 100, template: 'Dear Mr. Doe,\n\n**I am very glad to invite you to** the 15th annual Trade Show. **The event will be held at** Beijing Industrial Exhibition Hall **on** October 5th through 10th.\n\nWe will have the latest products from our line on display, and our expert staff will be available to answer any questions you may have. **We believe it will be a great chance for you to** explore new business opportunities in our industry.\n\n**Your presence would be a great honor to us. Please let me know whether you can come.**\n\n**Yours sincerely,**\nWang Yue', translation: '亲爱的Doe先生，\n\n我很高兴邀请你参加第15届年度贸易展。活动将于10月5日至10日在北京工业展览馆举行。\n\n我们将展出我们产品线的最新产品，并且我们的专业人员将随时回答您可能有的任何问题。我们相信这将是你探索行业内新商机的好机会。\n\n若你能出席，我们将不胜荣幸。请告知你是否能参加。\n\n此致\n敬礼\n王跃' },
      { id: 'pet3-gratitude', label: '感谢信', emoji: '🌸', prompt: '写一封感谢信。说明感谢的原因和具体帮助，再次表达谢意。', targetWords: 100, template: 'Dear John,\n\n**I am writing to express my sincere gratitude for** your warm reception and hospitality during my stay in your city.\n\nYou took me to visit many famous scenic spots and historical sites, and prepared incredibly delicious food for me. **Without your help in** organizing the trip, **I could not have** enjoyed such an unforgettable experience.\n\n**Thank you again for your kindness and support. Please accept my heartfelt thanks and best wishes.**\n\n**Yours sincerely,**\nLi Ming', translation: '亲爱的约翰，\n\n我写信是为了感谢您在我逗留贵市期间给予的热情接待和款待。\n\n您带我参观了许多著名的风景名胜和历史遗迹，还为我准备了极其美味的食物。如果没有您在安排行程上的支持，我不可能享受到如此难忘的经历。\n\n再次感谢您的关心与帮助。请接受我最诚挚的谢意和美好祝愿。\n\n此致\n敬礼\n李明' },
      { id: 'pet3-request', label: '请求信', emoji: '📩', prompt: '写一封请求信。正式提出请求，说明原因，并表达感谢。', targetWords: 100, template: 'Dear Sir/Madam,\n\n**I am writing to formally request** the opportunity to participate in the upcoming summer exchange program **for** I have always been fascinated by your advanced research facilities.\n\nI am a sophomore majoring in Computer Science at Beijing University. **I would appreciate it if you could** review my enclosed resume and transcript. **Any assistance from you would be highly valued.**\n\n**I am looking forward to your favorable reply.**\n\n**Yours sincerely,**\nLi Ming', translation: '尊敬的先生/女士：\n\n我写信是为了正式申请参加即将举办的暑期交换项目的机会，因为我一直对贵校先进的研究设施非常着迷。\n\n我是北京大学计算机科学专业的大二学生。若您能审阅我随信附上的简历和成绩单，我将不胜感激。非常感谢您的帮助与支持。\n\n期待您的回复。\n\n此致\n敬礼\n李明' },
      { id: 'pet3-complaint', label: '投诉信', emoji: '📢', prompt: '写一封投诉信。说明投诉对象、具体问题及影响，并提出期望的解决方案。', targetWords: 100, template: 'Dear Sir or Madam,\n\n**I am writing to complain about** the delivery service in your company. **I am sorry to trouble you, but the service did not meet my expectations.**\n\n**To begin with,** the Samsung tape recorder I ordered arrived with its lid cracked. **Moreover,** the front surface of the machine had been badly scratched. **As a result, I have suffered from** great inconvenience.\n\n**I would appreciate it if you could** replace the damaged recorder **as soon as possible. I am looking forward to your prompt reply.**\n\n**Yours sincerely,**\nJonathan Edwards', translation: '尊敬的先生/女士：\n\n我写信是为了投诉贵公司的送货服务。很抱歉打扰您，但该服务没有达到我的预期。\n\n首先，我订购的三星录音机送到时盖子裂开了。此外，机器的正面也被严重刮花了。这导致我遭受了极大的不便。\n\n希望您能尽快更换损坏的录音机。期待您的及时回复。\n\n此致\n敬礼\n乔纳森·爱德华兹' },
      { id: 'pet3-inquiry', label: '询问信', emoji: '❓', prompt: '写一封询问信。自我介绍，说明咨询内容，列出具体问题。', targetWords: 100, template: 'Dear Sir or Madam,\n\n**I am** a college student who enjoys working with cars. **I am writing to inquire about** the automobile repair training courses offered by your Vocation Repair Center.\n\n**First, could you please tell me** if there are any evening classes available from September to December? **Second, I would also like to know** the exact tuition fee. **Finally, is it possible to** inform me of the deadline for registration?\n\n**I would be grateful if you could send me more detailed information. Thank you for your time and I look forward to your reply.**\n\n**Yours sincerely,**\nJiang Peng', translation: '尊敬的先生/女士：\n\n我是一名喜欢和汽车打交道的大学生。我写信是想咨询关于贵职业维修中心提供的汽车维修培训课程的信息。\n\n首先，想请问在九月到十二月期间是否有晚间课程？其次，我还想了解确切的学费。最后，是否可以告知我报名的截止日期？\n\n如能提供更详细的信息，我将非常感激。感谢您的时间，期待您的回复。\n\n此致\n敬礼\n姜鹏' },
      { id: 'pet3-suggestion', label: '建议信', emoji: '💡', prompt: '写一封建议信。回应对方的咨询，提出具体的建议。', targetWords: 100, template: 'Dear Peter,\n\n**You have asked me for advice on** how to learn Chinese well, **and I am glad to help. In my opinion, you may take the following suggestions.**\n\n**First,** it is important to take a Chinese course to learn from a professional teacher. **Second,** watching TV and reading books in Chinese whenever possible is also helpful. **Besides,** making some Chinese friends can help you practice speaking.\n\n**I hope these suggestions will be useful to you. If you need further discussion, please feel free to contact me.**\n\n**Yours sincerely,**\nLi Ming', translation: '亲爱的彼得：\n\n你向我咨询关于如何学好中文的建议，我很乐意提供帮助。在我看来，你可以考虑以下建议。\n\n第一，报个中文班向专业的老师学习很重要。第二，只要有可能，多看中文电视、读中文书籍也是很有帮助的。此外，交一些中国朋友可以帮你练习口语。\n\n希望这些建议对你有帮助。如果需要进一步交流，请随时联系我。\n\n此致\n敬礼\n李明' },
      { id: 'pet3-job', label: '求职信', emoji: '💼', prompt: '写一封求职信。说明应聘职位、个人优势及面试请求。', targetWords: 100, template: 'Dear Sir or Madam,\n\n**I am writing to apply for the position of** sales manager **advertised in** China Daily. **I believe I am qualified for this job for the following reasons.**\n\n**First,** I graduated from Peking University with a major in international trade and have passed CET-6. **Second,** my rich experience in organizing campus activities has developed my communication skills. **In addition,** I am confident, enthusiastic, and ready to make a valuable contribution to your company.\n\n**I would be very grateful if you could offer me an interview opportunity. Please feel free to contact me at** any time. **I am looking forward to your reply.**\n\n**Yours sincerely,**\nLiu Jun', translation: '尊敬的先生/女士：\n\n我写信申请贵单位在《中国日报》上发布的销售经理一职。我认为自己能够胜任该岗位，理由如下：\n\n第一，我毕业于北京大学国际贸易专业，并且通过了英语六级。第二，我组织校园活动的丰富经验培养了我的沟通能力。此外，我充满自信和热情，已准备好为贵公司做出宝贵的贡献。\n\n若能给予面试机会，我将不胜感激。您可随时与我联系。期待您的回复。\n\n此致\n敬礼\n刘军' },
      { id: 'pet3-note', label: '便条', emoji: '📝', prompt: '写一则便条。说明核心事由，请求对方协助或留下提醒事项。', targetWords: 100, template: 'To: Mrs Wilson\nFrom: Li Hua\nDate: Tuesday\n\n**I am writing this note to let you know that** Tracy called this afternoon about tomorrow\'s meeting.\n\n**I will not be back until** about 5:00 pm. **In the meantime, could you please** call Tracy back as soon as possible? **I would really appreciate your help.**\n\n**I have already** left the two library books on your desk. **If anything urgent comes up, please feel free to reach me at** my mobile phone.\n\n**Sorry for any inconvenience this may cause.**', translation: '致：威尔逊太太\n发件人：李华\n日期：星期二\n\n我留此便条，通知您特蕾西今天下午打来电话说了明天会面的事。\n\n我要到下午5:00左右才能回来。在此期间，能否麻烦您尽快给特蕾西回个电话？非常感谢您的帮助。\n\n我已经把那两本图书馆的书放在了您的桌子上。如有紧急情况，请随时拨打我的手机与我联系。\n\n对此给您带来的不便，深表歉意。' },
      { id: 'pet3-notice', label: '通知', emoji: '📋', prompt: '写一则通知。说明活动时间、地点、内容及注意事项。', targetWords: 100, template: '[center]**NOTICE**[/center]\n\n**The Student Union is pleased to announce that** an English Speech Contest **will be held on** next Friday, May 15th **at** the school auditorium.\n\n**The event will start at** 2:00 p.m. **and end at** 5:00 p.m. **Participants will have the opportunity to** deliver a speech on the topic of "My Dream in the Future" and show their language talent.\n\n**Those who are interested are invited to sign up at** the Student Union office **before** this Wednesday. **Please note that** all participants should prepare their own materials.\n\n**We look forward to your active participation. For further information, please do not hesitate to contact** our staff.\n\n[right]**The Student Union**[/right]\n[right]**May 10th**[/right]', translation: '[center]通知[/center]\n\n学生会兹宣布，一场英语演讲比赛将于下周五（5月15日）在学校礼堂举行。\n\n活动将于下午2:00开始，下午5:00结束。参与者将有机会发表主题为“我未来的梦想”的演讲，并展示他们的语言天赋。\n\n有意参加者请于本周三前在学生会办公室报名。请注意，所有参赛者应自行准备材料。\n\n欢迎积极参与。如需进一步了解，请随时联系我们的工作人员。\n\n[right]学生会[/right]\n[right]5月10日[/right]' },
    ],
  },
  {
    title: 'PET3 B节 · 短文写作',
    emoji: '📄',
    topics: [
      { id: 'pet3-phenomenon', label: '现象评论', emoji: '🔍', prompt: '描述一种社会现象，分析其产生的原因，并给出你的看法或建议。', targetWords: [120, 150], template: '**Recently, the phenomenon of** food delivery services **has aroused wide concern among the public. There are different opinions among people as to** this trend.\n\n**Some reasons can explain this trend. First of all,** the rapid development of the Internet makes it easy to order food online. **Secondly,** modern people are living at a fast pace. **Furthermore,** various apps offer attractive discounts.\n\n**However, just like everything has both its good and bad sides,** ordering food online **also has its own disadvantages, such as** generating a lot of plastic waste. **In a word, the whole society should pay close attention to the problem of** environmental protection. **Only in this way can** we enjoy a better life **in the future.**', translation: '最近，外卖服务的现象引起了公众的广泛关注。关于这一趋势，人们有不同的观点。\n\n一些原因可以解释这一趋势。首先，互联网的快速发展使得在网上订餐变得很容易。其次，现代人生活节奏快。另外，各种应用程序提供吸引人的折扣。\n\n然而，正如任何事物都有两面一样，在网上订餐也有它的不利一面，像产生大量的塑料垃圾。总而言之，全社会应该密切关注环境保护这个问题。只有这样，我们才能在将来享受更好的生活。' },
      { id: 'pet3-opinion', label: '观点论述', emoji: '💬', prompt: '针对某一个话题或争议，表明你的观点并给出理由进行论证。', targetWords: [120, 150], template: '**When it comes to the issue of whether** college students should take part-time jobs, **people\'s opinions differ greatly. Some people suggest that** it is a waste of time. **On the contrary, there are some people in favor of** part-time jobs.\n\n**I fully agree with the statement that** taking part-time jobs is beneficial **because** of the following reasons. **For one thing,** it can help students gain valuable social experience. **For another,** it allows students to earn some pocket money and relieve the financial burden on their parents.\n\n**From what has been discussed above, we may reasonably arrive at the conclusion that** taking part-time jobs is a rewarding experience. **Personally, I believe that** students should balance their studies and work.', translation: '当谈到大学生是否应该做兼职这个问题时，人们的意见分歧很大。一些人认为这是在浪费时间。相反，有一些人赞成做兼职。\n\n我完全同意做兼职是有益的这种观点，主要理由如下。一方面，它可以帮助学生获得宝贵的社会经验。另一方面，它允许学生赚一些零花钱，减轻父母的经济负担。\n\n综上所述，我们可以清楚地得出结论，做兼职是一段有益的经历。就我个人而言，我相信学生应该平衡他们的学业和工作。' },
      { id: 'pet3-chart', label: '图表描述', emoji: '📊', prompt: '描述给出的图表数据趋势，分析产生该趋势的原因及其可能的影响。', targetWords: [120, 150], template: '**As is clearly shown in the chart, there has been a dramatic change in** the number of people using mobile payments. The percentage rose sharply from 30% in 2015 to over 85% in 2020.\n\n**The causes for** this change **are varied. They include** the popularity of smartphones and the convenience of paying without cash. **Perhaps the main cause is** the high security measures that have increased people\'s confidence.\n\n**With the development of society,** mobile payment will continue to grow. **So it\'s urgent and necessary to** adapt to this cashless trend. **Consequently, I\'m confident that a bright future is awaiting us because** our lives will become much easier.', translation: '如图表清楚所示，使用移动支付的人数发生了显著变化。百分比从2015年的30%急剧上升到2020年的85%以上。\n\n造成这种变化的原因有很多。包括智能手机的普及和无现金支付的便利性。主要的原因可能是高度的安全措施增加了人们的信心。\n\n随着社会的发展，移动支付将继续增长。因此，迫切需要适应这种无现金的趋势。因此，坚信美好的未来正等着我们，因为我们的生活将变得更加轻松。' },
      { id: 'pet3-picture', label: '看图作文', emoji: '🖼️', prompt: '描述图片/漫画的内容，揭示其深层含义或反映的问题，并发表评论。', targetWords: [120, 150], template: '**As is vividly depicted in the picture,** a young man is busy playing computer games instead of studying. **Man is now facing a big problem** of time management **which is becoming more and more serious.**\n\n**Today,** internet distractions **have brought a lot of harm in our daily life. First,** they prevent us from focusing on our studies or work. **Second,** they harm our physical health. **What makes things worse is that** some people eventually fail in the future due to a lack of self-discipline.\n\n**Confronted with** these distractions, **we should take a series of effective measures to** improve our self-control. **In my opinion, I think it necessary to** strike a balance between work and play. **Only in this way can you** make the most of your time and achieve your goals.', translation: '正如图片中生动描绘的那样，一个年轻人正忙于打电脑游戏而不是学习。人类正面临着一个严重的时间管理问题，这个问题变得越来越严重。\n\n现在，互联网干扰给我们的日常生活带来了许多危害。首先，它们阻碍我们专注于学习或工作。其次，它们损害我们的身体健康。更为糟糕的是，由于缺乏自律，有些人最终在未来遭遇失败。\n\n面临这些干扰，我们应该采取一系列行之有效的方法来提高我们的自我控制能力。对我来说，我认为有必要在工作和娱乐之间取得平衡。只有这样，我们才能充分利用时间并实现目标。' },
    ],
  },
  {
    title: '通用写作',
    emoji: '✍️',
    topics: [
      { id: 'gen-argumentative', label: '议论文', emoji: '⚖️', prompt: '就某一观点进行正反面论述，并得出结论。', targetWords: [120, 180], template: '**There is a widespread concern over the issue of** environmental protection. **But it is well known that the opinion concerning this hot topic varies from person to person.**\n\n**A majority of people think that** the government should take the main responsibility. **In their views, there are two factors contributing to this attitude. Firstly,** only the government has the power to pass strict laws to punish polluters. **Secondly,** large-scale environmental projects require massive financial support that individuals cannot afford.\n\n**People, however, differ in their opinions on this matter. Some people hold the idea that** every individual should be responsible. **In their point of view,** pollution is caused by our daily activities. **On the other hand, small actions like** recycling **can make a big difference.**\n\n**As far as I am concerned, I firmly support the view that** it requires joint efforts. **It is not only because** the government provides regulations, **but also because** individual actions put them into practice.', translation: '人们普遍关注环境保护的问题。众所周知，对于这个热门话题，人们的观点因人而异。\n\n大多数人认为政府应该承担主要责任。在他们看来，导致这种态度的因素有两个。首先，只有政府有权通过严格的法律来惩罚污染者。其次，大型环保项目需要大量的资金支持，这是个人无法负担的。\n\n然而，人们在这个问题上的观点存在分歧。有些人认为每个人都应该负责。在他们看来，污染是由我们的日常活动造成的。另一方面，像回收利用这样的小举动也能产生很大的影响。\n\n就我而言，我坚决支持这需要共同努力的观点。这不仅因为政府提供法规，而且还因为个人的行动将其付诸实践。' },
      { id: 'gen-practical', label: '应用文', emoji: '📧', prompt: '撰写日常应用文体，如邮件、演讲稿等。', targetWords: [100, 120], template: '**Dear Mr. Smith,**\n\n**I am writing to express my interest in joining** the volunteer team for the upcoming International Cultural Festival. \n\n**First and foremost, I have been** learning cross-cultural communication for two years, **which enables me to** interact smoothly with guests from different backgrounds. **Moreover, I have previous experience in organizing similar** campus events, **so I am very familiar with** the coordination of activities and emergency handling. **I am available to work for the entire duration of the** festival **and can take on various tasks such as** reception and stage management.\n\n**I have attached my resume for your reference. If you have any questions, please feel free to contact me. Looking forward to hearing from you soon.**\n\n**Yours sincerely,**\nLi Ming', translation: '尊敬的史密斯先生，\n\n我写信是为了表达我有意加入即将到来的国际文化节的志愿团队。\n\n首先，我一直在学习跨文化交流达两年之久，这使我能够与来自不同背景的客人顺畅互动。此外，我以前有组织类似校园活动的经验，所以我非常熟悉活动的协调和突发事件的处理。我可以在整个文化节期间工作，并能承担各种任务，如接待和舞台管理。\n\n随信附上我的简历供您参考。如果您有任何问题，请随时与我联系。期待很快收到您的回复。\n\n您真诚的，\n李明' },
      { id: 'gen-expository', label: '说明文', emoji: '📋', prompt: '客观地说明事物的特征、本质或规律。', targetWords: [120, 180], template: '**Nowadays,** Artificial Intelligence (AI) **has become increasingly important in our daily lives. It refers to** the simulation of human intelligence processes by computer systems, enabling machines to learn, reason, and make decisions.\n\n**The characteristics of** AI **can be listed as follows. First,** it has an incredible capability to process and analyze massive amounts of data in seconds, **which is impossible for human beings. Second,** AI systems can continuously improve their performance through machine learning algorithms without human intervention. **Furthermore,** it never feels tired and can work 24 hours a day with high accuracy.\n\n**In summary, understanding** AI **is of great significance for us because** it is reshaping various industries, from healthcare to transportation. **We should embrace this** technology **while paying attention to its potential risks.**', translation: '如今，人工智能（AI）在我们的日常生活中变得越来越重要。它指的是计算机系统对人类智能过程的模拟，使机器能够学习、推理和做决定。\n\n人工智能的特点可以列举如下。首先，它具有在几秒钟内处理和分析海量数据的惊人能力，这对人类来说是不可能的。其次，人工智能系统可以在没有人工干预的情况下，通过机器学习算法不断提高自身性能。此外，它从不感到疲倦，并且可以每天24小时高精度地工作。\n\n总之，了解人工智能对我们来说意义重大，因为它正在重塑从医疗到交通的各个行业。我们应该拥抱这项技术，同时关注其潜在的风险。' },
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
    ctx.fillText('X-English 写作打卡', 50, 75);

    ctx.fillStyle = '#666666';
    ctx.font = '28px Inter, "Noto Sans SC", sans-serif';
    ctx.fillText(`坚持写作，每天进步一点点`, 50, 125);

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
    ctx.fillText('访问 x-english.pages.dev 获取更多英语资料', 50, height - 40);

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
              <div className={styles.templateHeader}>
                <h4 className={styles.templateTitle}>📝 写作模板参考（高亮部分可复用）</h4>
              </div>
              <div className={styles.templateContent}>
                {renderTemplate(selectedTopic.template)}
              </div>

              {selectedTopic.translation && (
                <div className={styles.translationContent}>
                  <hr className={styles.translationDivider} />
                  <div className={styles.templateContent}>
                    {renderTemplate(selectedTopic.translation)}
                  </div>
                </div>
              )}
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
                {copyStatus === 'copied' ? '已复制' : copyStatus === 'error' ? '复制失败' : '复制图片'}
              </button>
              <button className={styles.downloadBtn} onClick={handleDownload} disabled={!posterUrl}>
                保存图片
              </button>
            </div>
            <p className={styles.shareHint}>复制或保存图片后，可分享至社交媒体打卡</p>
          </div>
        </div>
      )}
    </div>
  );
}
