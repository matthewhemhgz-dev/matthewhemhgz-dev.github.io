# 祈研所 Qi-Lab

> 探索技术、设计与创意的交汇之处 — 一个用代码构建、用设计表达的创意实验室。

## 技术栈

- **框架**: [Astro 6](https://astro.build) — 静态站点生成 (SSG)
- **样式**: 原生 CSS + 设计令牌系统 (`--qi-*` variables)
- **交互**: 原生 JavaScript (View Transitions / Canvas / 3D Tilt)
- **部署**: GitHub Pages
- **CI/CD**: GitHub Actions (Lint + Test + Build + Deploy)

## 快速开始

### 前置要求

- Node.js >= 20.0.0
- npm >= 10.0.0

### 安装

```bash
git clone https://github.com/matthewhemhgz-dev/matthewhemhgz-dev.github.io.git
cd matthewhemhgz-dev.github.io
npm install
```

### 开发

```bash
npm run dev        # 启动开发服务器 (localhost:4321)
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

### 代码质量

```bash
npm run lint           # ESLint 检查
npm run format         # Prettier 格式化
npm run format:check   # Prettier 检查（不修改文件）
npm test               # Vitest 单元测试
```

## 项目结构

```
src/
├── components/        # Astro 组件 (18 个)
│   ├── decorations/   # 装饰性组件 (SectionDivider)
│   ├── global/        # 全局组件 (Navigation, Footer, BrandLogo...)
│   ├── sections/      # 首页区块组件 (Hero, About, Featured...)
│   └── ui/            # 通用 UI 组件 (DashCard, SectionHeader)
├── data/blog/zh/      # 博客文章 (Markdown)
├── layouts/           # 页面布局 (BaseLayout)
├── pages/             # 路由页面 (8 个)
├── scripts/           # 交互脚本 (card-tilt, particles, cursor-glow...)
├── styles/            # CSS 样式 (20 个文件, 设计令牌驱动)
└── test/              # 测试文件 (Vitest)
```

## 设计系统

项目采用 CSS 自定义属性构建的设计令牌系统：

- **色彩**: `--qi-brand-emerald` / `--qi-ink` / `--qi-amber` 等
- **字体**: `--qi-font-serif` / `--qi-font-mono` + `--qi-font-scaled-*` 响应式缩放
- **间距**: `--qi-space-xs` ~ `--qi-space-6xl` + `--qi-container-padding` 响应式
- **断点**: 480px / 768px / 1024px / 1440px / 1920px / 2560px / 3440px

## 内容管理

博客文章使用 Astro Content Layer，Markdown 文件位于 `src/data/blog/zh/`。

支持的 frontmatter 字段：`title` / `description` / `pubDate` / `tags` / `category` / `author` / `draft` 等。

## 许可证

[MIT](./LICENSE)
