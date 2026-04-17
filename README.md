# X-English

X-English 是一个基于 Docusaurus 构建的现代化、系统化的英语学习平台。项目支持纯前端本地化运行。

**⚠️ 注意：本项目统一使用 [pnpm](https://pnpm.io/) 作为包管理器。请勿使用 `npm` 或 `yarn` 提交 \`lock\` 文件。**

## 🌐 Live Demo

| Platform | URL |
|----------|-----|
| Cloudflare Pages | [x-english.pages.dev](https://x-english.pages.dev/) |
| Vercel | [x-english.vercel.app](https://x-english.vercel.app/) |
| GitHub Pages | [xera-2011.github.io/x-english](https://xera-2011.github.io/x-english/) |

## 安装依赖 (Installation)

确保你系统安装了 Node.js（推荐 v22+），然后使用 pnpm 安装依赖：

```bash
pnpm install
```

## 本地开发 (Local Development)

```bash
pnpm start
```

该命令会启动本地开发服务器并自动在浏览器中打开页面。大多数的代码变动都会触发热更新，无需手动重启服务器。

## 构建生产版本 (Build)

```bash
pnpm build
```

该命令会将静态文件构建并输出到 `build` 目录中。这些文件可以直接部署到任何静态资源托管服务上（例如 GitHub Pages、Vercel 等）。

### 本地预览构建结果
```bash
pnpm serve
```

## 部署 (Deployment)

本项目已配置完善的自动化构建（CI/CD），在本地**无须**执行部署命令。你只需向 GitHub `main` 分支提交代码，各大平台即可自动完成发版：

- **GitHub Pages**：已在 `.github/workflows/deploy.yml` 植入构建脚本。推送代码后，前往 GitHub 仓库的 `Settings -> Pages -> Build and deployment -> Source` 设为 `GitHub Actions` 即可。
- **Cloudflare Pages / Vercel**：绑定你的 GitHub 仓库后，每次提交也会触发自动构建部署，全部无缝支持根域名访问。

## 🎨 设计规范 (Design System)

UI 风格参照 **[Mintlify](https://mintlify.com/)** 设计系统，设计规范来源于 **[awesome-design-md](https://github.com/VoltAgent/awesome-design-md)**，核心原则：**边框代替阴影、纯白表面、紧凑字距**。

- **主色**：薄荷绿 `#18E299`（变量 `--ifm-color-primary`）
- **字体**：正文 `Inter` + `Noto Sans SC`；代码 `JetBrains Mono`
- **字重**：仅用 `400 / 500 / 600` 三档；标题负字距（`h1: -0.04em`）
- **圆角**：按钮/徽章 `9999px`（药丸形），卡片 `16px`
- **卡片**：`border: 1px solid var(--xe-border)`，避免大阴影和彩色渐变背景

### 可用 MDX 组件

| 组件 | 用途 |
|------|------|
| `<Quiz />` | 交互式测验 |
| `<Flashcard />` | 3D 翻转词卡 |
| `<ExampleSentence />` | 例句（关键词高亮） |
| `<DifficultyBadge />` | CEFR A1–C2 难度标签 |
| `<VocabTable />` | 词汇表格 |
| `<AudioPlayer />` | 音频播放 |
| `<GrammarDiagram />` | 句子成分分析 |

## 📋 内容路线图 (Content Roadmap)

目标：覆盖大学英语四级 (CET-4) 考试所需的词汇量与阅读量。

### 📝 词汇 Vocabulary（目标 ~4,500 词）

- [x] 核心 100 词（top-100）
- [x] 日常生活篇（~200 词）
- [x] 校园学习篇（~200 词）
- [x] 工作职场篇（~200 词）
- [x] 社会热点篇（~200 词）
- [x] 科技自然篇（~200 词）
- [x] 情感交际篇（~200 词）
- [x] 四级高频词汇（~3000 词）

### 📖 语法 Grammar

- [x] 一般现在时 (Simple Present)
- [x] 一般过去时 (Simple Past)
- [x] 一般将来时 (Simple Future)
- [x] 现在进行时 (Present Continuous)
- [x] 过去进行时 (Past Continuous)
- [x] 现在完成时 (Present Perfect)
- [x] 过去完成时 (Past Perfect)
- [x] 被动语态 (Passive Voice)
- [x] 虚拟语气 (Subjunctive Mood)
- [x] 定语从句 (Relative Clauses)
- [x] 名词性从句 (Noun Clauses)
- [x] 状语从句 (Adverbial Clauses)
- [x] 非谓语动词 (Non-finite Verbs)
- [x] 倒装句 (Inversion)
- [x] 强调句 (Cleft Sentences)

### 📚 阅读 Reading

- [x] 日常话题（5 篇）
- [x] 校园生活（5 篇）
- [x] 科技发展（5 篇）
- [x] 社会文化（5 篇）
- [x] 经济商务（5 篇）
- [x] 环境健康（5 篇）

### 🎧 听力 Listening

- [x] 短对话理解（10 组）
- [x] 长对话理解（5 组）
- [x] 短文听写（5 篇）

### ✍️ 写作 Writing

- [x] 议论文模板与范文（5 篇）
- [x] 应用文模板与范文（5 篇）
- [x] 图表描述模板与范文（5 篇）

### 🎤 发音 Pronunciation

- [x] 48 个国际音标
- [x] 连读与弱读规则
- [x] 语调与重音
