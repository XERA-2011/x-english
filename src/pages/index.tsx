import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import { type ReactNode } from 'react';

const MODULES = [
  {
    title: '📖 语法 Grammar',
    description: '从基础时态到高级从句，构建坚实的英语骨架。',
    path: '/docs/grammar/intro',
  },
  {
    title: '📝 词汇 Vocabulary',
    description: '核心高频词汇与场景词汇，摆脱死记硬背。',
    path: '/docs/vocabulary/intro',
  },
  {
    title: '📚 阅读 Reading',
    description: '分级阅读材料，提升语感与理解能力。',
    path: '/docs/reading/intro',
  },
  {
    title: '✍️ 写作 Writing',
    description: '从句子结构到篇章逻辑，写出地道英文。',
    path: '/docs/writing/intro',
  },
  {
    title: '🎧 听力 Listening',
    description: '泛听与精听结合，打破听力障碍。',
    path: '/docs/listening/intro',
  },
  {
    title: '🏆 PET3 备考 PETS-3',
    description: '口试指导、听力、阅读、写作全攻略，助你顺利通关。',
    path: '/docs/pet3/speaking/speaking-guide',
  },
];

const FEATURES = [
  {
    icon: '💡',
    title: '交互式测验 Quiz',
    description: '内置填空、单选与判断等多种题型，答题后立即可见正误判断及详尽的语法/词汇知识点深度解析。',
  },
  {
    icon: '🎴',
    title: '智能记忆词卡 Flashcard',
    description: '交互式双面翻转词卡，随时随地检测自己的词汇熟练度。科学巩固，告别传统枯燥的单词背诵。',
  },
  {
    icon: '🎧',
    title: '跟读与精听播放器 Audio',
    description: '配备定制的高清音频控制器，并结合 CEFR 难度标签（A2 - B2），让你的听力与口语跟读练习循序渐进。',
  },
  {
    icon: '✍️',
    title: '写作打卡海报 Poster',
    description: '提供各类考试及日常写作题目、高亮核心模版和译文折叠。在线写作、实时字数统计，一键生成精美海报分享打卡。',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroWash}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            Master English with<br />
            <span className={styles.heroTitleHighlight}>Engineering Precision</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            X-English 是一个面向中文学习者的现代化英语知识库。我们将英语学习解构为语法、词汇与 PETS-3 备考等核心模块，助你从零基础到流利表达。
          </p>
          <div className={styles.heroButtons}>
            <Link
              className={clsx('button', styles.btnPrimary)}
              to="/docs/grammar/intro">
              Get Started
            </Link>
            <Link
              className={clsx('button', styles.btnSecondary)}
              to="/docs/vocabulary/intro">
              Explore Vocabulary
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function ModulesSection() {
  return (
    <section className={styles.modulesSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Learning Path</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Structure your learning
          </Heading>
          <p className={styles.sectionDescription}>
            系统化的知识结构，配合丰富的交互式组件，让学习英语像查阅技术文档一样清晰高效。
          </p>
        </div>
        
        <div className={styles.grid}>
          {MODULES.map((mod, idx) => (
            <Link key={idx} to={mod.path} className={styles.gridCard}>
              <Heading as="h3" className={styles.cardTitle}>{mod.title}</Heading>
              <p className={styles.cardDesc}>{mod.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Interactive Learning</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Premium Interactive Experience
          </Heading>
          <p className={styles.sectionDescription}>
            不止是静态的阅读，我们提供丰富的现代化交互组件，让每一次练习都获得即时反馈，极大提升学习效率。
          </p>
        </div>
        
        <div className={styles.featuresGrid}>
          {FEATURES.map((feat, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feat.icon}</div>
              <Heading as="h3" className={styles.featureTitle}>{feat.title}</Heading>
              <p className={styles.featureDesc}>{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="首页"
      description="X-English 系统化英语学习平台。从语法到词汇，全面提升英语能力。">
      <HomepageHeader />
      <main>
        <ModulesSection />
        <FeaturesSection />
      </main>
    </Layout>
  );
}
