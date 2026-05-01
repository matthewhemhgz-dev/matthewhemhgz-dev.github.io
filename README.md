# 祈研所 Qi-Lab

> 探索技术、设计与创意的交汇之处 — 一个用代码构建、用设计表达的创意实验室。

## 项目介绍

祈研所（Qi-Lab）是一个专注于分享前端技术、知识管理和设计系统的个人品牌网站。采用现代化的技术栈构建，致力于为用户提供高质量的技术内容和优雅的用户体验。

## 核心功能特点

### 🚀 技术特性
- 高性能静态站点生成（SSG）
- Islands Architecture 架构，按需加载交互组件
- 完整的设计系统，338 个设计令牌
- PWA 支持，可离线访问
- 全文搜索功能，支持中英双语
- 响应式设计，支持多种设备

### 📝 内容系统
- 34 篇技术博客文章（140,000+ 字）
- 中英双语完整支持
- 智能文章推荐系统
- 标签分类系统
- RSS 订阅
- 阅读进度跟踪

### 🎨 设计亮点
- Bento 网格布局
- 玻璃态设计风格
- 12+ 种微动画效果
- 深色/浅色模式切换
- 玻璃态设计系统
- 精细的视觉层级设计

### ✨ 交互体验
- 卡片 3D 倾斜效果
- 粒子背景动画
- 搜索建议与历史记录
- 代码复制功能
- 滚动视差效果
- 阅读进度指示

### 🔍 可访问性
- WCAG 2 AA 标准
- 语义化 HTML
- 键盘导航支持
- 高对比度配色方案

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | [Astro 6](https://astro.build) | 静态站点生成，Islands Architecture |
| 样式 | 原生 CSS + Tailwind CSS | 设计令牌系统驱动的样式方案 |
| 交互 | 原生 JavaScript | View Transitions, Canvas 动画 |
| 搜索 | [Pagefind](https://pagefind.app) | 静态全文搜索 |
| 部署 | GitHub Pages | 静态托管 |
| 测试 | Vitest + Playwright | 单元测试 + 端到端测试 |
| 质量 | ESLint + Prettier | 代码检查与格式化 |
| 性能 | Lighthouse | 性能审计 |
| PWA | @vite-pwa/astro | 离线访问支持 |
| 国际化 | Astro i18n | 中英双语 |

## 快速开始

### 前置要求

- Node.js >= 20.0.0
- npm >= 10.0.0 或 pnpm >= 8.0.0

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
npm run lint           # ESLint 代码检查
npm run format         # Prettier 代码格式化
npm run format:check   # Prettier 格式检查
npm test               # Vitest 单元测试
npm run test:e2e       # Playwright 端到端测试
npm run size-check     # 构建产物大小检查
npm run lighthouse     # Lighthouse 性能审计
```

## 项目结构

```
workspace/
├── src/
│   ├── components/        # Astro 组件 (26 个)
│   │   ├── decorations/   # 装饰性组件
│   │   ├── global/        # 全局组件 (Navigation, Footer, SearchModal, BackToTop...)
│   │   ├── sections/      # 首页区块组件
│   │   └── ui/            # 通用 UI 组件
│   ├── data/
│   │   ├── blog/         # 博客文章
│   │   │   ├── zh/            # 中文文章 (17 篇)
│   │   │   └── en/            # 英文文章 (17 篇)
│   │   ├── icons.ts
│   │   ├── projects.ts
│   │   └── tags.ts
│   ├── layouts/           # 页面布局
│   ├── pages/             # 路由页面
│   │   ├── zh/          # 中文主站
│   │   └── en/            # 英文分站
│   ├── scripts/           # 交互脚本
│   ├── styles/            # CSS 样式 (40 个文件)
│   ├── test/              # 测试文件
│   ├── types/             # 类型定义
│   └── utils/             # 工具函数
├── public/              # 静态资源
├── e2e/               # 端到端测试
├── docs/              # 文档
├── scripts/           # 构建脚本
└── dist/              # 构建产物
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

博客文章使用 Astro Content Layer，Markdown 文件位于 `src/data/blog/zh/` 和 `src/data/blog/en/`。

支持的 frontmatter 字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 文章标题 |
| description | string | 文章描述 |
| pubDate | string | 发布日期 (YYYY-MM-DD) |
| updatedDate | string | 更新日期 (可选) |
| heroImage | string | 封面图片 |
| tags | string[] | 标签列表 |
| category | string | 文章分类 |
| author | string | 作者 |
| draft | boolean | 是否为草稿 |
| lang | string | 语言 (zh/en) |

### 内容体系

项目已建立完整的技术内容体系，包括：

- **知识管理体系系列**：深入探讨知识管理的核心概念、工具和实践方法
  - 《知识管理体系基础：构建你的第二大脑》
  - 《知识管理工具与实践：从理论到落地》
  - 《Zettelkasten 笔记法实践指南》
  - 《Notion + Obsidian 双轨工作流》
- **技术架构系列**
  - 《前端架构演进之路》
  - 《CSS 架构：构建可扩展的项目》
  - 《设计系统从零构建》
- **设计系统系列**
  - 《设计令牌最佳实践》
  - 《设计令牌系统完整指南》
- **性能优化系列**
  - 《如何优化前端性能》
  - 《SSG 最佳实践》
  - 《Astro SSG：为什么我选择了它》

## 国际化 (i18n)

项目支持全量的中英双语切换：

- **路由**: `/` (中文) 和 `/en/` (英文)
- **内容同步**: 博客文章与标签系统在不同语境下保持功能对等。
- **英文内容**: 全量完成 17 篇博客文章的英文翻译，包括知识管理、技术架构和设计系统相关内容。
- **SEO**: 自动注入对应的 `hreflang` 与各语种 JSON-LD 结构化数据。

## 贡献指南

详细的贡献指南请参考 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 部署文档

详细的部署文档请参考 [DEPLOY.md](./DEPLOY.md)。

## 质量基线

| 指标 | 值 |
|------|-----|
| 静态页面 | 104 页 |
| 博客文章 | 34 篇 (140,000+ 字) |
| 单元测试 | 15 passing |
| 端到端测试 | 94 passing |
| 构建时间 | ~7.8s |
| 构建产物 | 7.8 MB / 10 MB 预算 |
| CSS 文件 | 40 个 (均 ≤500 行) |
| 组件文件 | 26 个 (均 ≤300 行) |
| Pagefind 索引 | 104 页 |
| 可访问性 | WCAG 2 AA 标准 |
| 微动画效果 | 12+ 种 |

## 许可证

[MIT](./LICENSE)
