# X-English 🇬🇧

X-English 是一个基于 Docusaurus 构建的现代化、系统化的英语学习平台。项目支持纯前端本地化运行。

**⚠️ 注意：本项目统一使用 [pnpm](https://pnpm.io/) 作为包管理器。请勿使用 `npm` 或 `yarn` 提交 \`lock\` 文件。**

## 安装依赖 (Installation)

确保你系统安装了 Node.js（推荐 v22+），然后使用 pnpm 安装依赖：

```bash
pnpm install
```

## 本地开发开发 (Local Development)

```bash
pnpm start
```

该命令会启动本地开发服务器并自动在浏览器中打开页面。大多数的代码变动都会触发热更新，无需手动重启服务器。

## 构建生产版本 (Build)

```bash
pnpm build
```

该命令会将静态文件构建并输出到 `build` 目录中。这些文件可以直接部署到任何静态资源托管服务上（例如 GitHub Pages、Vercel、Netlify 等）。

### 本地预览构建结果
```bash
pnpm serve
```

## 部署 (Deployment)

如果你使用 GitHub Pages 进行托管，可以使用以下命令快速构建并发布到 `gh-pages` 分支：

```bash
GIT_USER=<Your GitHub username> pnpm deploy
```
