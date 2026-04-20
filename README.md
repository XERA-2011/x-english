# X-English

X-English 是一个基于 Docusaurus 构建的英语学习文档站，当前内容覆盖通用英语能力训练（词汇、语法、听力、阅读、写作）与 **PETS-3 专项备考**。

**⚠️ 约定：本项目统一使用 [pnpm](https://pnpm.io/) 作为包管理器。请勿使用 `npm` 或 `yarn` 生成/提交 lock 文件。**

## 🌐 在线地址

| Platform | URL |
|---|---|
| Cloudflare Pages | [x-english.pages.dev](https://x-english.pages.dev/) |
| Vercel | [x-english.vercel.app](https://x-english.vercel.app/) |
| GitHub Pages | [xera-2011.github.io/x-english](https://xera-2011.github.io/x-english/) |

## 环境要求

- Node.js: `>=20.0`（建议使用 20/22 LTS）
- pnpm: 建议 `>=9`

## 安装依赖

```bash
pnpm install
```

## 本地开发

```bash
pnpm start
```

启动本地开发服务器并支持热更新。

## 常用命令

```bash
# 生产构建
pnpm build

# 本地预览构建结果
pnpm serve

# 文档构建校验（用于 CI / 本地检查）
pnpm run lint

# TypeScript 类型检查
pnpm run typecheck

# 内容质量检查（标题与本地链接）
pnpm run check:content

# CI 全量检查
pnpm run ci

# 清理构建/缓存产物
pnpm run clean
```

## 部署说明

当前仓库的**主发布链路**为 GitHub Pages：

- PR / Push 质量门禁：`.github/workflows/ci.yml`
- 主分支发布：`.github/workflows/deploy.yml`

Cloudflare / Vercel 作为可选分发渠道，按需接入（不作为主门禁）。

Vercel 使用仓库内 `vercel.json` 统一构建与路由行为（`cleanUrls: true`），避免文档路由在刷新时出现短暂 404。

如需手动发布到 Cloudflare，可使用：

```bash
pnpm run deploy
```

## 当前内容结构

### 通用模块

- 📖 语法（`docs/grammar`）
- 📝 词汇（`docs/vocabulary`）
- 📚 阅读（`docs/reading`）
- ✍️ 写作（`docs/writing`）
- 🎧 听力（`docs/listening`）

### PETS-3 专区

- 🏆 PET3（`docs/pet3`）
  - 口试指导
  - 听力
  - 语言知识运用
  - 阅读理解
  - 写作全攻略
  - 写作句型与范文

## 可用 MDX 组件

| 组件 | 用途 |
|---|---|
| `<Quiz />` | 交互式测验 |
| `<Flashcard />` | 翻转词卡 |
| `<ExampleSentence />` | 例句展示 |
| `<DifficultyBadge />` | CEFR 难度标签 |
| `<VocabTable />` | 词汇表格 |
| `<AudioPlayer />` | 音频播放 |
| `<GrammarDiagram />` | 语法结构图 |

## 维护建议

- 新增文档前先确认目录归属与侧边栏位置
- 提交前至少执行一次 `pnpm run lint`
- 避免提交构建产物与日志文件
