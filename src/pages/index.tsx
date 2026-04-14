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
    title: '🎤 发音 Pronunciation',
    description: '掌握国际音标与连读规则，开口自信表达。',
    path: '/docs/pronunciation/intro',
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
            X-English 是一个面向中文学习者的现代化英语知识库。我们将英语学习解构为语法、词汇、发音等六大核心模块，助你从零基础到流利表达。
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

export default function Home(): ReactNode {
  return (
    <Layout
      title="首页"
      description="X-English 系统化英语学习平台。从语法到词汇，全面提升英语能力。">
      <HomepageHeader />
      <main>
        <ModulesSection />
      </main>
    </Layout>
  );
}
