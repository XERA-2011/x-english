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
      { id: 'pet3-apology', label: '道歉信', emoji: '🙏', prompt: '写一封道歉信。说明道歉原因，表达歉意，并提出补救措施。', targetWords: 100, template: 'Dear Prof. Wan,\n\n**First of all, please allow me to express my deep sorry for** not being able to keep our appointment. **I do know that this is very impolite and must have caused you much trouble.**\n\n**I do reckon that at present any explanation is pale and futile. However, I do not want you to misunderstand me.** On my way to your office, an old lady suddenly fainted due to heart attack on the bus. I stopped a taxi and sent her into a nearby hospital. I stayed there until her son came, which spoiled our appointment.\n\n**I am aware that** our appointment **is important. I do hope that you would be kind enough to spare your valuable time to meet me. I am looking forward to hearing from you.**\n\n**Sincerely yours,**\nLi Ming', translation: '尊敬的万教授，\n\n首先，请允许我为您表达深深的歉意，因为我未能赴约。深知这非常不礼貌，并且一定给您带来了很多麻烦。\n\n我知道目前任何解释都显得苍白无力。然而，我不希望您误会我。在去您办公室的路上，一位老太太在公交车上突发心脏病晕倒了。我拦了一辆出租车把她送到了附近的医院。我在那里一直等到她儿子过来，这导致我错过了我们的约定。\n\n我知道我们的约定很重要。我真诚地希望您能抽出宝贵的时间再次见我。期待您的回复。\n\n您真诚的，\n李明' },
      { id: 'pet3-invitation', label: '邀请信', emoji: '💌', prompt: '写一封邀请信。说明活动内容、时间、地点，并表达期待。', targetWords: 100, template: 'Dear Mr. Doe,\n\nThe 15th annual Trade Show **will be held in** Beijing **next month. You are cordially invited to attend this most exciting event of the year.**\n\nDates: October 5th through 10th\nTime: 10:00 a.m. to 5:00 p.m.\nPlace: Beijing Industrial Exhibition Hall\n\nWe will have the latest products from our line on display, and **our expert staff will be available to provide you with all the information you need and to answer any questions you may have. Free drinks and snacks will also be provided, and you are welcome to bring along your friends.**\n\n**We look forward to seeing you at** the Trade Show.\n\n**Yours sincerely,**\nWang Yue', translation: '亲爱的Doe先生，\n\n第15届年度贸易展将于下个月在北京举行。我们诚挚地邀请您参加这一年度最激动人心的盛会。\n\n日期：10月5日至10日\n时间：上午10:00至下午5:00\n地点：北京工业展览馆\n\n我们将展出我们产品线的最新产品，并且我们的专业人员将随时为您提供所需的所有信息并回答您可能有的任何问题。我们还将提供免费的饮料和小吃，欢迎您带朋友一起来。\n\n我们期待在贸易展上见到您。\n\n您真诚的，\n王跃' },
      { id: 'pet3-gratitude', label: '感谢信', emoji: '🌸', prompt: '写一封感谢信。说明感谢的原因和具体帮助，再次表达谢意。', targetWords: 100, template: 'Dear John,\n\n**I am writing to express my heartfelt gratitude to you for** your warm reception and hospitality during my stay in your city. **Your kindness made my trip an unforgettable experience.**\n\n**I still remember the days we spent together.** You took me to visit many famous scenic spots and historical sites, such as the local museum and the beautiful national park. **Thanks to your detailed introduction, I have learned a lot about** the culture and history of your hometown. **In addition,** the food you prepared for me was incredibly delicious.\n\n**I sincerely hope that you will have a chance to visit my city in the near future, so that I can repay your kindness and show you around.**\n\n**Thank you once again for everything.**\n\n**Yours sincerely,**\nLi Ming', translation: '亲爱的约翰，\n\n我写信是为了表达我由衷的感谢，感谢您在我逗留贵市期间给予的热情接待和款待。您的善良让我的这次旅行成为了一次难忘的经历。\n\n我仍然记得我们一起度过的日子。您带我参观了许多著名的风景名胜和历史遗迹，例如当地的博物馆和美丽的国家公园。多亏了您详细的介绍，我学到了很多关于您家乡文化和历史的知识。此外，您为我准备的食物简直太美味了。\n\n我真诚地希望在不久的将来您能有机会来我的城市游玩，这样我就能报答您的好意并带您四处看看。\n\n再次感谢您所做的一切。\n\n您真诚的，\n李明' },
      { id: 'pet3-request', label: '请求信', emoji: '📩', prompt: '写一封请求信。正式提出请求，说明原因，并表达感谢。', targetWords: 100, template: '**Dear Sir/Madam,**\n\nI am a sophomore majoring in Computer Science at Beijing University. **I am writing to formally request the opportunity to** participate in the upcoming summer exchange program organized by your esteemed university.\n\n**The reason for this request is that I have always been fascinated by** your advanced research facilities and outstanding academic environment. **I believe this program will greatly broaden my horizons and enhance my understanding of** artificial intelligence, **which aligns perfectly with my career goals.**\n\n**I have enclosed my resume** and transcript **for your review. I am fully prepared to meet the academic challenges and contribute to** the program.\n\n**Thank you for considering my application. I look forward to your favorable reply.**\n\n**Yours sincerely,**\nLi Ming', translation: '尊敬的先生/女士，\n\n我是北京大学计算机科学专业的大二学生。我写信是想正式请求有机会参加贵校即将举办的暑期交换项目。\n\n提出这个请求的原因是我一直对贵校先进的研究设施和卓越的学术环境非常着迷。 我相信这个项目将极大地开阔我的视野，并加深我对人工智能的理解，这与我的职业目标完全契合。\n\n随信附上我的简历和成绩单供您审阅。我已经完全准备好迎接学术挑战并为该项目做出贡献。\n\n感谢您考虑我的申请。我期待您的佳音。\n\n您真诚的，\n李明' },
      { id: 'pet3-complaint', label: '投诉信', emoji: '📢', prompt: '写一封投诉信。说明投诉对象、具体问题及影响，并提出期望的解决方案。', targetWords: 100, template: '**Dear Manager,**\n\n**Much to my regret, I write this to place a complaint against** your delivery service in your company.\n\nThe Samsung tape recorder model number JB/4073, which I ordered from your company on Nov. 1, arrived yesterday. The serial number of the machine is 4703-0461. **I am sorry to report that** the recorder **has been badly damaged. There was no unusual damage to the packing case, but when I opened it, I found that** the lid of the recorder had been cracked and that the front surface of the machine had been scratched.\n\n**Since there was such damage to the goods, I decided to file a complaint against** the delivery service. **Would you please let me know whether I should return** the recorder **to you for a replacement?**\n\n**Sincerely yours,**\nJonathan Edwards', translation: '尊敬的经理，\n\n我非常遗憾地写这封信，就贵公司的送货服务提出投诉。\n\n我于11月1日向贵公司订购的型号为JB/4073的三星录音机昨天送到了。该机器的序列号是4703-0461。我很遗憾地报告，这台录音机已经严重损坏。包装箱并没有异常损坏，但是当我打开它时，我发现录音机的盖子已经裂开了，而且机器的正面也被刮花了。\n\n由于货物出现了这样的损坏，我决定对送货服务提出投诉。 请问我是否应该把录音机退还给您以要求更换？\n\n您真诚的，\n乔纳森·爱德华兹' },
      { id: 'pet3-inquiry', label: '询问信', emoji: '❓', prompt: '写一封询问信。自我介绍，说明咨询内容，列出具体问题。', targetWords: 100, template: '**Dear Sir or Madam,**\n\n**I am writing to ask for information about** training courses in automobile repair **that your** Vocation Repair Center **offers.** I enjoy working with cars and would like to train to be a mechanic.\n\n**I would like to take the course from** September **to** December, **but I can only study in the evenings because I have a full-time course in my college. Therefore, I want to know if there are any evening classes available during this period. Also, could you please tell me the exact tuition fee and the deadline for registration?**\n\n**I would appreciate it if you could send me the details and an application form as soon as possible.**\n\n**Yours sincerely,**\nJiang Peng', translation: '尊敬的先生或女士，\n\n我写信是为了询问关于贵职业维修中心提供的汽车维修培训课程的信息。我非常喜欢和汽车打交道，想接受培训成为一名机械师。\n\n我想在九月到十二月之间上课，但我只能在晚上学习，因为我在大学有全日制课程。因此，我想知道在此期间是否有晚间课程。另外，请问您能告诉我确切的学费和报名的截止日期吗？\n\n如果您能尽快把详细信息和申请表发给我，我将不胜感激。\n\n您真诚的，\n姜鹏' },
      { id: 'pet3-suggestion', label: '建议信', emoji: '💡', prompt: '写一封建议信。回应对方的咨询，提出具体的建议。', targetWords: 100, template: '**Dear Peter,**\n\n**I\'m glad to receive your letter asking for my advice on how to** learn Chinese well.\n\n**Here are a few suggestions. First, it is important to** take a Chinese course, **as you\'ll be able to** learn from the teacher and practice with your fellow students. **Then, it also helps to** watch TV and read books, newspapers and magazines in Chinese whenever possible.\n\n**Besides, it is a good idea to** learn and sing Chinese songs, **because by doing so you\'ll** learn and remember Chinese words more easily. **You can also** make more Chinese friends. They will tell you a lot about China and help you learn Chinese.\n\n**Try and write me in** Chinese **next time.**\n\n**Best wishes,**\nLi Ming', translation: '亲爱的彼得，\n\n很高兴收到你的来信，询问我关于如何学好中文的建议。\n\n这里有一些建议。首先，报个中文班很重要，因为这样你就能向老师学习并和同学们一起练习。其次，只要有可能，多看中文电视、读中文书籍、报纸和杂志也是很有帮助的。\n\n此外，学习并演唱中文歌曲也是个好主意，因为这样做你会更容易地学习和记住中文单词。你也可以多交一些中国朋友。他们会告诉你很多关于中国的事情并帮助你学习中文。\n\n下次试试用中文给我写信吧。\n\n最美好的祝愿，\n李明' },
      { id: 'pet3-job', label: '求职信', emoji: '💼', prompt: '写一封求职信。说明应聘职位、个人优势及面试请求。', targetWords: 100, template: '**Dear Sirs,**\n\n**In reply to your advertisement in today\'s** China Daily, **I am now writing to apply for the position of** sales manager.\n\nI am a male, currently 24 years old. I graduated from Peking University and majored in international trade. At college, I have passed CET-6. **Besides, I joined various kinds of social activities and organizations in my spare time, which have greatly developed my ability of dealing with complicated situations. I am confident and enthusiastic, so I believe that my personal qualities will allow me to make a valuable contribution to your company.**\n\n**I enclose my curriculum vitae; I hope I can get an opportunity for a personal interview at any time. Thank you for your consideration.**\n\n**Sincerely yours,**\nLiu Jun', translation: '尊敬的先生，\n\n回复贵公司今天在《中国日报》上登载的招聘广告，我现写信应聘销售经理一职。\n\n我是一名男性，今年24岁。我毕业于北京大学，主修国际贸易。在大学期间，我已经通过了大学英语六级考试。此外，我在业余时间参加了各种社会活动和组织，这极大地培养了我处理复杂情况的能力。我自信且充满热情，因此我相信我的个人素质将使我能够为贵公司做出宝贵的贡献。\n\n随信附上我的简历；我希望能随时有机会参加个人面试。感谢您的考虑。\n\n您真诚的，\n刘军' },
      { id: 'pet3-note', label: '便条', emoji: '📝', prompt: '写一则便条。说明核心事由，请求对方协助或留下提醒事项。', targetWords: 100, template: '**Mrs** Wilson,\n\n**I’m going out** shopping, **and won’t be back until about** 5:00 pm. **I have taken with me** the two books you asked me to return to the City Library.\n\n**At about** 1 o’clock this afternoon, Tracy **called, saying that she couldn’t meet you at** Bolton Coffee **tomorrow morning as she has something important to attend to. She felt very sorry about that, but said that you could set some other time for the meeting.**\n\n**She wanted you to call her back as soon as you are home. She has already told** Susan **about this change. Have a good afternoon.**\n\nLi Hua', translation: '威尔逊太太，\n\n我出去买东西了，大概要到下午5:00才回来。我已经把您让我还给市图书馆的两本书带走了。\n\n今天下午1点左右，特蕾西打来电话说，她明早不能在博尔顿咖啡馆和您见面了，因为她有重要的事情要处理。她对此感到非常抱歉，但表示您可以重新安排个见面的时间。\n\n她希望您一到家就给她回个电话。她已经把这个变动告诉了苏珊。祝您下午愉快。\n\n李华' },
      { id: 'pet3-notice', label: '通知', emoji: '📋', prompt: '写一则通知。说明活动时间、地点、内容及注意事项。', targetWords: 100, template: '[center]**NOTICE**[/center]\n\n**The Student Union is pleased to announce that** an English Speech Contest **will be held in the school auditorium on next Friday, May 15th, from 2:00 p.m. to 5:00 p.m.**\n\n**The purpose of this contest is to** improve students\' spoken English and provide a stage to show their language talent. **The topic of the speech is** "My Dream in the Future", **and each participant will have 3 to 5 minutes to deliver their speech.**\n\n**Those who are interested are invited to sign up at** the Student Union office **before this Wednesday. Please note that all participants should prepare their own materials. The top three winners will receive special prizes and certificates.**\n\n**We look forward to your active participation.**\n\n[right]**The Student Union**[/right]\n[right]**May 10th**[/right]', translation: '[center]通知[/center]\n\n学生会很高兴地宣布，一场英语演讲比赛将于下周五，即5月15日下午2:00至5:00在学校礼堂举行。\n\n本次比赛的目的是提高学生的英语口语水平，并提供一个展示语言天赋的舞台。演讲的主题是“我未来的梦想”，每位参赛者将有3到5分钟的时间发表演讲。\n\n有意参加者请于本周三前到学生会办公室报名。请注意，所有参赛者应自行准备材料。前三名获奖者将获得特别奖品和证书。\n\n我们期待您的积极参与。\n\n[right]学生会[/right]\n[right]5月10日[/right]' },
    ],
  },
  {
    title: 'PET3 B节 · 短文写作',
    emoji: '📄',
    topics: [
      { id: 'pet3-phenomenon', label: '现象评论', emoji: '🔍', prompt: '描述一种社会现象，分析其产生的原因，并给出你的看法或建议。', targetWords: [120, 150], template: '**Recently, the phenomenon of** food delivery services **has aroused wide concern among the public. It is very common to see** deliverymen riding their e-bikes in a hurry on the streets.\n\n**There are several reasons for this phenomenon. First of all, the rapid development of** the Internet and smartphones **makes it easy for people to** order food online. **Secondly, modern people are living at a fast pace and often do not have enough time to** cook by themselves. **Last but not least,** various food delivery apps offer discounts, **which attract more customers.**\n\n**In my opinion, this phenomenon is both positive and negative. On the one hand, it provides great convenience to our daily life. On the other hand, it generates** a lot of plastic waste. **Therefore, we should take proper measures to balance** convenience and environmental protection.', translation: '最近，外卖服务的现象引起了公众的广泛关注。在街上经常能看到外卖员骑着电动车匆匆忙忙地穿梭。\n\n造成这种现象有几个原因。首先，互联网和智能手机的快速发展使得人们很容易在网上订餐。其次，现代人生活节奏快，通常没有足够的时间自己做饭。最后，各种外卖应用提供折扣，吸引了更多的顾客。\n\n在我看来，这种现象既有积极的一面也有消极的一面。一方面，它为我们的日常生活提供了极大的便利。另一方面，它产生了大量的塑料垃圾。因此，我们应该采取适当的措施来平衡便利和环境保护。' },
      { id: 'pet3-opinion', label: '观点论述', emoji: '💬', prompt: '针对某一个话题或争议，表明你的观点并给出理由进行论证。', targetWords: [120, 150], template: '**When it comes to the issue of whether** college students should take part-time jobs, **people\'s opinions differ greatly. Some people believe that** part-time jobs are a waste of time, **while others hold the view that they are highly beneficial.**\n\n**From my perspective, I am in favor of the latter view. My reasons are as follows. To begin with,** doing part-time jobs **can help** students **gain valuable social experience and improve their practical skills, which cannot be learned from textbooks. Furthermore, it allows** students to earn some pocket money and relieve the financial burden on their parents.\n\n**In conclusion, taking all these factors into consideration, we may safely draw the conclusion that** taking part-time jobs **is a rewarding experience for** college students **as long as it does not affect their academic studies.**', translation: '当谈到大学生是否应该做兼职这个问题时，人们的意见分歧很大。有些人认为做兼职纯粹是在浪费时间，而另一些人则认为它们是非常有益的。\n\n从我的角度来看，我赞成后一种观点。我的理由如下。首先，做兼职可以帮助学生获得宝贵的社会经验并提高他们的实践技能，这是从书本上学不到的。此外，它允许学生赚一些零花钱，减轻父母的经济负担。\n\n总之，综合考虑所有这些因素，我们可以有把握地得出结论：做兼职对大学生来说是一段有益的经历，只要它不影响他们的学业。' },
      { id: 'pet3-chart', label: '图表描述', emoji: '📊', prompt: '描述给出的图表数据趋势，分析产生该趋势的原因及其可能的影响。', targetWords: [120, 150], template: '**As is vividly shown in the chart, we can see that the number of** people using mobile payments **has changed remarkably during the period from** 2015 **to** 2020. **The percentage rose sharply from** 30% **in** 2015 **to over** 85% **in** 2020.\n\n**Several factors contribute to this change. For one thing,** smartphones have become extremely popular in recent years, making mobile payment accessible to almost everyone. **For another,** the payment process is incredibly fast and convenient, eliminating the need to carry cash or bank cards. **Moreover,** high security measures have increased people\'s confidence in this payment method.\n\n**Judging from the figures, we can predict that the trend of** mobile payment **will continue to grow in the coming years. Thus, it is necessary for** traditional businesses **to adapt to this** cashless **trend.**', translation: '正如生动的图表所示，我们可以看到使用移动支付的人数在2015年到2020年期间发生了显著变化。百分比从2015年的30%急剧上升到2020年的85%以上。\n\n有几个因素导致了这种变化。一方面，智能手机在近年来变得极其普及，使得几乎每个人都能使用移动支付。另一方面，支付过程异常快速便捷，免去了携带现金或银行卡的需要。此外，高度的安全措施增加了人们对这种支付方式的信心。\n\n从这些数据来看，我们可以预测移动支付的趋势在未来几年将继续增长。因此，传统企业有必要适应这种无现金的趋势。' },
      { id: 'pet3-picture', label: '看图作文', emoji: '🖼️', prompt: '描述图片/漫画的内容，揭示其深层含义或反映的问题，并发表评论。', targetWords: [120, 150], template: '**As is vividly depicted in the picture,** a young man is sitting in front of his computer, surrounded by piles of books, but he is busy playing computer games instead of studying. **The picture, though simple, conveys a profound message about** time management.\n\n**It is obvious that the drawer intends to remind us of the importance of** self-control. **In the digital age, we are constantly distracted by** entertainment on the Internet. **Without** self-discipline, **we can hardly focus on our studies or work, which will eventually lead to failure in the future.**\n\n**To sum up, we should attach great importance to** self-control. **We must learn to strike a balance between** work and play. **Only in this way can we make the most of our time and achieve our goals.**', translation: '正如图片中生动描绘的那样，一个年轻人正坐在电脑前，周围堆满了书，但他却忙于打电脑游戏而不是学习。这幅画虽然简单，却传达了一个关于时间管理的深刻信息。\n\n很明显，画作者意在提醒我们自我控制的重要性。在数字时代，我们经常被互联网上的娱乐所分心。如果没有自律，我们很难专注于学习或工作，这最终将导致未来的失败。\n\n总之，我们应该高度重视自我控制。我们必须学会在工作和娱乐之间取得平衡。只有这样，我们才能充分利用时间并实现我们的目标。' },
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
