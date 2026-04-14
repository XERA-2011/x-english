import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type ModuleItem = {
  emoji: string;
  title: string;
  description: string;
  link: string;
  color: string;
};

const modules: ModuleItem[] = [
  {
    emoji: '📖',
    title: '语法体系',
    description: '从时态到从句，系统掌握英语语法核心规则，配合图解与练习深度理解。',
    link: '/docs/grammar/intro',
    color: '#3b82f6',
  },
  {
    emoji: '📝',
    title: '词汇积累',
    description: '按频率分级的核心词汇，搭配场景分类、构词法解析与翻转词卡复习。',
    link: '/docs/vocabulary/intro',
    color: '#8b5cf6',
  },
  {
    emoji: '🎤',
    title: '发音训练',
    description: '48个国际音标详解，连读、重音、语调规则，配合音频示范精准纠音。',
    link: '/docs/pronunciation/intro',
    color: '#ec4899',
  },
  {
    emoji: '📚',
    title: '阅读理解',
    description: '从入门到高级的分级阅读材料，掌握略读、精读等实用阅读策略。',
    link: '/docs/reading/intro',
    color: '#10b981',
  },
  {
    emoji: '✍️',
    title: '写作提升',
    description: '句型模板、段落结构、邮件与论文写作技巧，循序渐进提升写作能力。',
    link: '/docs/writing/intro',
    color: '#f59e0b',
  },
  {
    emoji: '🎧',
    title: '听力突破',
    description: '多级别听力素材与策略训练，从慢速到正常语速逐步提升听力水平。',
    link: '/docs/listening/intro',
    color: '#ef4444',
  },
];

type FeatureItem = {
  icon: string;
  title: string;
  description: string;
};

const features: FeatureItem[] = [
  {
    icon: '🏗️',
    title: '系统化知识体系',
    description: '六大模块涵盖英语学习全部维度，按照科学的学习路径循序渐进。',
  },
  {
    icon: '🎯',
    title: '互动式练习测验',
    description: '每个知识点配套选择题、填空题、翻转词卡等互动练习，学以致用。',
  },
  {
    icon: '📊',
    title: 'CEFR 分级体系',
    description: '内容按照 A1→C1 分级，无论你的基础如何，都能找到适合的起点。',
  },
  {
    icon: '🌏',
    title: '中英双语讲解',
    description: '所有语法规则和概念均提供中文讲解，降低理解门槛，学习更高效。',
  },
];

function HeroSection() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>🚀</span> 免费 · 开源 · 系统化
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            <span className={styles.heroTitleGradient}>X-English</span>
            <br />
            {siteConfig.tagline}
          </Heading>
          <p className={styles.heroSubtitle}>
            六大模块系统覆盖语法、词汇、发音、阅读、写作、听力，
            <br />
            配合互动练习与测验，让英语学习更高效、更有趣。
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.heroPrimary} to="/docs/grammar/intro">
              开始学习 →
            </Link>
            <Link className={styles.heroSecondary} to="#modules">
              浏览模块
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardHeader}>
              <span className={styles.dot} style={{background: '#ef4444'}} />
              <span className={styles.dot} style={{background: '#f59e0b'}} />
              <span className={styles.dot} style={{background: '#22c55e'}} />
            </div>
            <div className={styles.heroCardBody}>
              <div className={styles.codeLine}>
                <span className={styles.codeKeyword}>const</span>{' '}
                <span className={styles.codeVar}>skills</span> = [
              </div>
              <div className={styles.codeLine} style={{paddingLeft: '1.5rem'}}>
                <span className={styles.codeString}>"Grammar"</span>,
              </div>
              <div className={styles.codeLine} style={{paddingLeft: '1.5rem'}}>
                <span className={styles.codeString}>"Vocabulary"</span>,
              </div>
              <div className={styles.codeLine} style={{paddingLeft: '1.5rem'}}>
                <span className={styles.codeString}>"Pronunciation"</span>,
              </div>
              <div className={styles.codeLine} style={{paddingLeft: '1.5rem'}}>
                <span className={styles.codeString}>"Reading"</span>,
              </div>
              <div className={styles.codeLine} style={{paddingLeft: '1.5rem'}}>
                <span className={styles.codeString}>"Writing"</span>,
              </div>
              <div className={styles.codeLine} style={{paddingLeft: '1.5rem'}}>
                <span className={styles.codeString}>"Listening"</span>,
              </div>
              <div className={styles.codeLine}>];</div>
              <div className={styles.codeLine} style={{marginTop: '0.5rem'}}>
                <span className={styles.codeKeyword}>let</span>{' '}
                <span className={styles.codeVar}>level</span> ={' '}
                <span className={styles.codeString}>"Fluent"</span>;{' '}
                <span className={styles.codeComment}>// 🎯 目标</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ModuleCard({emoji, title, description, link, color}: ModuleItem) {
  return (
    <Link to={link} className={styles.moduleCard}>
      <div className={styles.moduleIcon} style={{'--module-color': color} as React.CSSProperties}>
        <span>{emoji}</span>
      </div>
      <Heading as="h3" className={styles.moduleTitle}>{title}</Heading>
      <p className={styles.moduleDesc}>{description}</p>
      <span className={styles.moduleLink} style={{color}}>
        开始学习 →
      </span>
    </Link>
  );
}

function ModulesSection() {
  return (
    <section id="modules" className={styles.modules}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>六大学习模块</Heading>
          <p className={styles.sectionSubtitle}>
            全方位覆盖英语学习核心技能，打造完整的知识体系
          </p>
        </div>
        <div className={styles.moduleGrid}>
          {modules.map((mod) => (
            <ModuleCard key={mod.title} {...mod} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>为什么选择 X-English</Heading>
          <p className={styles.sectionSubtitle}>
            科学的方法 + 优质的内容 + 互动的体验
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feat) => (
            <div key={feat.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{feat.icon}</span>
              <Heading as="h3" className={styles.featureTitle}>{feat.title}</Heading>
              <p className={styles.featureDesc}>{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaInner}>
          <Heading as="h2" className={styles.ctaTitle}>
            准备好开始你的英语学习之旅了吗？
          </Heading>
          <p className={styles.ctaSubtitle}>
            从语法基础开始，一步步构建你的英语能力
          </p>
          <Link className={styles.ctaButton} to="/docs/grammar/intro">
            立即开始 🚀
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="首页"
      description="X-English 系统化英语学习平台 - 语法、词汇、发音、阅读、写作、听力六大模块，互动练习与测验，让英语学习更高效。">
      <HeroSection />
      <main>
        <ModulesSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </Layout>
  );
}
