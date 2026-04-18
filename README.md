# 祈研所 Qi-Lab

> 探索技术、设计与创意的交汇之处 — 一个用代码构建、用设计表达的创意实验室。

## 技术栈

- **框架**: [Astro 6](https://astro.build) — 静态站点生成 (SSG)，Islands Architecture
- **样式**: 原生 CSS + 设计令牌系统 (`--qi-*` variables, 338 行 tokens)
- **交互**: 原生 JavaScript (View Transitions / Canvas / 3D Tilt / Pagefind)
- **搜索**: [Pagefind](https://pagefind.app) — 静态全文搜索，中文分词
- **部署**: GitHub Pages
- **CI/CD**: GitHub Actions (Lint + Test + Build + Size Check + Deploy)

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
npm run build      # 生产构建 (30 页面, ~3.6s)
npm run preview    # 预览构建产物
```

### 代码质量

```bash
npm run lint           # ESLint 检查
npm run format         # Prettier 格式化
npm run format:check   # Prettier 检查（不修改文件）
npm test               # Vitest 单元测试 (15 tests)
npm run size-check     # 构建产物大小检查 (6MB 预算)
```

## 项目结构

```
src/
├── components/        # Astro 组件 (18 个)
│   ├── decorations/   # 装饰性组件 (SectionDivider)
│   ├── global/        # 全局组件 (Navigation, Footer, SearchModal, NoiseOverlay...)
│   ├── sections/      # 首页区块组件 (Hero, About, Featured, Toolbox, Platforms...)
│   └── ui/            # 通用 UI 组件 (DashCard, SectionHeader, OptimizedImage)
├── data/blog/zh/      # 博客文章 (6 篇 Markdown, 8000+ 字)
├── layouts/           # 页面布局 (BaseLayout)
├── pages/             # 路由页面 (首页/博客/标签/关于/404)
├── scripts/           # 交互脚本 (card-tilt, particles, cursor-glow, copy-code...)
├── styles/            # CSS 样式 (24 个文件, 设计令牌驱动)
│   ├── tokens.css          # 设计令牌 (338 行)
│   ├── dark-tokens.css     # 暗色模式令牌 (123 行)
│   ├── animations.css      # 动画系统
│   ├── home-hero.css       # Hero 主样式
│   ├── hero-float-cards.css # Hero 浮动装饰
│   ├── search-modal.css    # 搜索弹窗
│   └── code-blocks.css     # 代码块 + 复制按钮
└── test/              # 测试文件 (Vitest, 15 tests)
```

## 设计系统

项目采用 CSS 自定义属性构建的设计令牌系统（338 行 tokens.css）：

- **色彩**: `--qi-brand-emerald` / `--qi-brand-amber` / `--qi-brand-mint` + 10+ 级透明度
- **字体**: `--qi-font-serif` / `--qi-font-sans` / `--qi-font-mono` + `--qi-font-scaled-*` 响应式缩放
- **间距**: `--qi-space-xs` ~ `--qi-space-9xl` + `--qi-container-padding` 响应式
- **排版节奏**: `--qi-leading-tight/normal/relaxed` + `--qi-tracking-tight/wide/widest`
- **断点**: 480px / 768px / 1024px / 1440px / 1920px / 2560px / 3440px
- **暗色模式**: 123 行 dark-tokens.css，完整覆盖色彩/边框/不透明度令牌

## 内容管理

博客文章使用 Astro Content Layer，Markdown 文件位于 `src/data/blog/zh/`。

支持的 frontmatter 字段：`title` / `description` / `pubDate` / `updatedDate` / `heroImage` / `tags` / `category` / `author` / `draft` / `lang`。

## 质量基线

| 指标 | 值 |
|------|-----|
| 静态页面 | 30 页 |
| 博客文章 | 6 篇 (8000+ 字) |
| 单元测试 | 15 passing |
| 构建时间 | ~3.6s |
| 构建产物 | 4.0 MB / 6 MB 预算 |
| CSS 文件 | 24 个 (均 ≤500 行) |
| 组件文件 | 18 个 (均 ≤300 行) |
| Pagefind 索引 | 30 页 |

## 许可证

[MIT](./LICENSE)
