# 祈研所 Qi-Lab

> 探索技术、设计与创意的交汇之处 — 一个用代码构建、用设计表达的创意实验室。

## 技术栈

- **框架**: [Astro 6](https://astro.build) — 静态站点生成 (SSG)，Islands Architecture
- **样式**: 原生 CSS + 设计令牌系统 (`--qi-*` variables, 338 行 tokens)
- **交互**: 原生 JavaScript (View Transitions / Canvas / 3D Tilt / Pagefind)
- **搜索**: [Pagefind](https://pagefind.app) — 静态全文搜索，支持中英双语分词
- **部署**: GitHub Pages
- **质量保障**: 历经 7 轮深度的高级 UI/UX 审计 + 端到端测试 (94/94 测试通过) + WCAG 2 AA 可访问性标准
- **CI/CD**: GitHub Actions (Lint + Test + Build + Size Check + Performance Test + Deploy)
- **性能监控**: Lighthouse 审计集成，提供关键性能指标分析
- **PWA 支持**: 离线访问、安装到主屏幕、Service Worker
- **Newsletter**: 邮件订阅功能，支持用户订阅网站更新
- **相关文章推荐**: 基于标签相似度、类别匹配和日期接近度的智能推荐算法
- **品牌内核**: 专注于“思维架构与知识工程”，每一处视觉与文案均经过微观逻辑校准

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
npm run build      # 生产构建 (38 页面, ~6.0s)
npm run preview    # 预览构建产物
```

### 代码质量

```bash
npm run lint           # ESLint 检查
npm run format         # Prettier 格式化
npm run format:check   # Prettier 检查（不修改文件）
npm test               # Vitest 单元测试 (15 tests)
npm run size-check     # 构建产物大小检查 (6MB 预算)
npm run lighthouse     # Lighthouse 性能审计
```

## 项目结构

```
src/
├── components/        # Astro 组件 (25 个)
│   ├── decorations/   # 装饰性组件 (SectionDivider)
│   ├── global/        # 全局组件 (Navigation, Footer, SearchModal, BackToTop...)
│   ├── sections/      # 首页区块组件 (Hero, About, Featured, Toolbox, Platforms, Testimonials...)
│   └── ui/            # 通用 UI 组件 (DashCard, SectionHeader, OptimizedImage)
├── data/blog/         # 博客文章
│   ├── zh/            # 中文文章 (15 篇 Markdown, 120,000+ 字)
│   └── en/            # 英文文章 (15 篇 Markdown, 全量翻译完成)
├── layouts/           # 页面布局 (BaseLayout)
├── pages/             # 路由页面
│   ├── [zh]/          # 中文主站 (首页/博客/标签/关于)
│   └── en/            # 英文分站 (全量 Feature Parity)
├── scripts/           # 交互脚本 (card-tilt, particles, cursor-glow, copy-code...)
├── styles/            # CSS 样式 (38 个文件, 设计令牌驱动)
│   ├── base/               # 基础样式 (tokens, dark-tokens, reset, global)
│   ├── components/         # 组件样式
│   ├── sections/           # 区块样式
│   ├── pages/              # 页面样式
│   └── utilities/          # 工具类样式
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

## 国际化 (i18n)

项目支持全量的中英双语切换：

- **路由**: `/` (中文) 和 `/en/` (英文)
- **内容同步**: 博客文章与标签系统在不同语境下保持功能对等。
- **英文内容**: 全量完成 15 篇博客文章的英文翻译，包括知识管理、技术架构和设计系统相关内容。
- **SEO**: 自动注入对应的 `hreflang` 与各语种 JSON-LD 结构化数据。

## 质量基线

| 指标          | 值                  |
| ------------- | ------------------- |
| 静态页面      | 104 页              |
| 博客文章      | 15 篇 (120,000+ 字) |
| 单元测试      | 15 passing          |
| 端到端测试    | 94 passing          |
| 构建时间      | ~7.8s               |
| 构建产物      | 7.8 MB / 10 MB 预算 |
| CSS 文件      | 38 个 (均 ≤500 行)  |
| 组件文件      | 26 个 (均 ≤300 行)  |
| Pagefind 索引 | 104 页              |
| 可访问性      | WCAG 2 AA 标准      |

## 许可证

[MIT](./LICENSE)
