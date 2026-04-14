import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'X-English',
  tagline: '系统化英语学习平台 · 从零基础到流利表达',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://x-english.pages.dev',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'xera-2011',
  projectName: 'x-english',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/xera-2011/x-english/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/xera-2011/x-english/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'warn',
          blogTitle: '学习博客',
          blogDescription: '英语学习技巧与心得分享',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'X-English',
      logo: {
        alt: 'X-English Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'grammarSidebar',
          position: 'left',
          label: '📖 语法',
        },
        {
          type: 'docSidebar',
          sidebarId: 'vocabularySidebar',
          position: 'left',
          label: '📝 词汇',
        },
        {
          type: 'docSidebar',
          sidebarId: 'pronunciationSidebar',
          position: 'left',
          label: '🎤 发音',
        },
        {
          type: 'docSidebar',
          sidebarId: 'readingSidebar',
          position: 'left',
          label: '📚 阅读',
        },
        {
          type: 'docSidebar',
          sidebarId: 'writingSidebar',
          position: 'left',
          label: '✍️ 写作',
        },
        {
          type: 'docSidebar',
          sidebarId: 'listeningSidebar',
          position: 'left',
          label: '🎧 听力',
        },
        {to: '/blog', label: '💡 博客', position: 'right'},
        {
          href: 'https://github.com/xera-2011/x-english',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '核心模块',
          items: [
            {label: '语法', to: '/docs/grammar/intro'},
            {label: '词汇', to: '/docs/vocabulary/intro'},
            {label: '发音', to: '/docs/pronunciation/intro'},
          ],
        },
        {
          title: '技能提升',
          items: [
            {label: '阅读', to: '/docs/reading/intro'},
            {label: '写作', to: '/docs/writing/intro'},
            {label: '听力', to: '/docs/listening/intro'},
          ],
        },
        {
          title: '更多',
          items: [
            {label: '学习博客', to: '/blog'},
            {label: 'GitHub', href: 'https://github.com/xera-2011/x-english'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} X-English. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
