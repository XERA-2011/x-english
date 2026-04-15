# X-English 🇬🇧

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
