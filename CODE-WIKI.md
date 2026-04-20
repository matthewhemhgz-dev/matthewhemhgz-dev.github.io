# 祈研所 Qi-Lab 项目 Wiki

## 1. 项目概览

**祈研所（Qi-Lab）** 是一个个人品牌网站，探索技术、设计与创意的交汇之处，是一个用代码构建、用设计表达的创意实验室。

- **框架**: [Astro 6](https://astro.build) — 静态站点生成 (SSG)，Islands Architecture
- **样式**: 原生 CSS + 设计令牌系统 (`--qi-*` variables)
- **交互**: 原生 JavaScript (View Transitions / Canvas / 3D Tilt / Pagefind)
- **搜索**: [Pagefind](https://pagefind.app) — 静态全文搜索，中文分词
- **部署**: GitHub Pages
- **CI/CD**: GitHub Actions (Lint + Test + Build + Size Check + Deploy)

## 2. 目录结构

```
/src
├── components/        # Astro 组件 (25 个)
│   ├── decorations/   # 装饰性组件 (SectionDivider)
│   ├── global/        # 全局组件 (Navigation, Footer, SearchModal, BackToTop, ScrollProgress...)
│   ├── sections/      # 首页区块组件 (Hero, About, Featured, Toolbox, Platforms, Testimonials...)
│   └── ui/            # 通用 UI 组件 (DashCard, SectionHeader, OptimizedImage)
├── data/blog/zh/      # 博客文章 (7 篇 Markdown, 65,000+ 字)
├── layouts/           # 页面布局 (BaseLayout)
├── pages/             # 路由页面 (首页/博客/标签/关于/404)
├── scripts/           # 交互脚本 (card-tilt, particles, cursor-glow, copy-code...)
├── styles/            # CSS 样式 (36 个文件, 设计令牌驱动)
│   ├── base/               # 基础样式 (tokens, dark-tokens, reset, global)
│   ├── components/         # 组件样式
│   ├── sections/           # 区块样式
│   ├── pages/              # 页面样式
│   └── utilities/          # 工具类样式
├── test/              # 测试文件 (Vitest, 15 tests)
└── utils/             # 工具函数 (reading-time.ts)
```

## 3. 系统架构与主流程

### 3.1 架构概览

祈研所项目采用 Astro 的静态站点生成 (SSG) 架构，结合 Islands Architecture 实现部分交互功能。整体架构分为以下几层：

1. **内容层**：基于 Astro Content Layer，使用 Markdown 文件管理博客内容
2. **组件层**：模块化的 Astro 组件，分为全局组件、页面区块组件和 UI 组件
3. **布局层**：统一的页面布局，处理 SEO、主题切换等全局功能
4. **页面层**：基于文件系统的路由，生成静态页面
5. **交互层**：使用原生 JavaScript 实现动态效果和交互功能
6. **样式层**：基于设计令牌系统的 CSS 样式

### 3.2 主流程

1. **开发流程**：
   - 编写 Markdown 博客内容
   - 开发/修改 Astro 组件
   - 运行 `npm run dev` 启动开发服务器
   - 进行代码质量检查 (`npm run lint`, `npm test`)

2. **构建流程**：
   - 运行 `npm run build` 生成静态页面
   - 生成 Pagefind 搜索索引
   - 执行构建产物大小检查
   - 部署到 GitHub Pages

3. **页面渲染流程**：
   - 服务器端：Astro 构建时生成静态 HTML
   - 客户端：加载必要的 JavaScript 实现交互功能
   - 主题切换：通过 localStorage 和 CSS 类实现
   - 页面过渡：使用 Astro 的 View Transitions API

## 4. 核心模块与功能

### 4.1 内容管理模块

**功能**：管理博客文章内容，支持 Markdown 格式和丰富的 frontmatter 字段。

**实现**：
- 使用 Astro Content Layer，配置文件为 [content.config.ts](file:///workspace/src/content.config.ts)
- 博客文章存储在 `src/data/blog/zh/` 目录
- 支持的 frontmatter 字段：`title` / `description` / `pubDate` / `updatedDate` / `heroImage` / `tags` / `category` / `author` / `draft` / `lang`

**使用示例**：
```markdown
---
title: "AI 时代的知识工作者"
description: "探讨 AI 如何改变知识工作者的工作方式"
pubDate: 2026-04-01
tags: [AI, 知识管理, 工作效率]
heroImage: "/images/blog/ai-era-knowledge-worker.jpg"
---

正文内容...
```

### 4.2 布局模块

**功能**：提供统一的页面布局，处理 SEO、主题切换、全局组件等。

**实现**：
- 主布局文件：[BaseLayout.astro](file:///workspace/src/layouts/BaseLayout.astro)
- 包含导航栏、页脚、搜索模态框、粒子背景等全局组件
- 支持主题切换（亮色/暗色）
- 实现 SEO 优化（元标签、Open Graph、Twitter Card）
- 支持页面过渡效果

**关键组件**：
- Navigation：导航栏，处理页面导航和移动端菜单
- Footer：页脚，显示版权信息和联系方式
- SearchModal：搜索模态框，使用 Pagefind 实现全文搜索
- ParticlesCanvas：粒子背景效果
- NoiseOverlay：噪点叠加效果

### 4.3 页面模块

**功能**：实现网站的各个页面，包括首页、博客列表、博客详情、标签页、关于页面等。

**实现**：
- 基于 Astro 的文件系统路由
- 主要页面：
  - [index.astro](file:///workspace/src/pages/index.astro)：首页
  - [blog/index.astro](file:///workspace/src/pages/blog/index.astro)：博客列表页
  - [blog/[slug].astro](file:///workspace/src/pages/blog/[slug].astro)：博客详情页
  - [tags/[tag].astro](file:///workspace/src/pages/tags/[tag].astro)：标签页
  - [about.astro](file:///workspace/src/pages/about.astro)：关于页面
  - [404.astro](file:///workspace/src/pages/404.astro)：404 页面

### 4.4 样式模块

**功能**：提供统一的样式系统，基于设计令牌实现响应式设计和主题切换。

**实现**：
- 设计令牌系统：[tokens.css](file:///workspace/src/styles/base/tokens.css)
- 暗色模式令牌：[dark-tokens.css](file:///workspace/src/styles/base/dark-tokens.css)
- 模块化 CSS 文件，按功能（base/components/sections/pages/utilities）组织

**设计令牌**：
- **色彩**: `--qi-brand-emerald` / `--qi-brand-amber` / `--qi-brand-mint` + 10+ 级透明度
- **字体**: `--qi-font-serif` / `--qi-font-sans` / `--qi-font-mono` + `--qi-font-scaled-*` 响应式缩放
- **间距**: `--qi-space-xs` ~ `--qi-space-9xl` + `--qi-container-padding` 响应式
- **排版节奏**: `--qi-leading-tight/normal/relaxed` + `--qi-tracking-tight/wide/widest`
- **断点**: 480px / 768px / 1024px / 1440px / 1920px / 2560px / 3440px

### 4.5 交互模块

**功能**：实现网站的交互效果，包括粒子背景、卡片倾斜、光标效果、滚动效果等。

**实现**：
- 模块化 JavaScript 脚本，存储在 `src/scripts/` 目录
- 主要脚本：
  - [init.js](file:///workspace/src/scripts/init.js)：初始化所有交互功能
  - [particles.js](file:///workspace/src/scripts/particles.js)：粒子背景效果
  - [card-tilt.js](file:///workspace/src/scripts/card-tilt.js)：卡片 3D 倾斜效果
  - [cursor-glow.js](file:///workspace/src/scripts/cursor-glow.js)：光标发光效果
  - [scroll-parallax.js](file:///workspace/src/scripts/scroll-parallax.js)：滚动视差效果
  - [copy-code.ts](file:///workspace/src/scripts/copy-code.ts)：代码块复制功能

## 5. 核心 API/类/函数

### 5.1 内容集合配置

**文件**: [content.config.ts](file:///workspace/src/content.config.ts)

```typescript
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,mdoc}", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string().min(1, '标题不能为空'),
    description: z.string().min(1, '描述不能为空').max(160, '描述不超过160字符'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    lang: z.literal('zh').default('zh'),
    category: z.string().default('随思随想'),
    tags: z.array(z.string()).default([]),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    readingTime: z.string().optional(),
    author: z.string().default('Qi-Lab'),
    ogImage: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});
```

**功能**：定义博客内容集合的结构和验证规则，支持从指定目录加载 Markdown 文件。

### 5.2 阅读时间计算

**文件**: [reading-time.ts](file:///workspace/src/utils/reading-time.ts)

**功能**：计算文章的阅读时间，基于中文字符数和英文单词数。

### 5.3 导航组件

**文件**: [Navigation.astro](file:///workspace/src/components/global/Navigation.astro)

**功能**：实现网站导航栏，包括 logo、导航链接、搜索按钮和主题切换按钮，支持移动端响应式菜单。

### 5.4 搜索模态框

**文件**: [SearchModal.astro](file:///workspace/src/components/global/SearchModal.astro)

**功能**：实现基于 Pagefind 的全文搜索功能，支持搜索结果高亮和导航。

### 5.5 首页 Hero 区块

**文件**: [HeroSection.astro](file:///workspace/src/components/sections/HeroSection.astro)

**功能**：实现网站首页的 Hero 区块，包含标题、描述、CTA 按钮和浮动卡片装饰效果。

### 5.6 博客列表页

**文件**: [blog/index.astro](file:///workspace/src/pages/blog/index.astro)

**功能**：实现博客文章列表页，支持按日期排序和分页。

### 5.7 博客详情页

**文件**: [blog/[slug].astro](file:///workspace/src/pages/blog/[slug].astro)

**功能**：实现博客文章详情页，支持 Markdown 渲染、代码高亮、阅读时间显示和相关文章推荐。

### 5.8 标签页

**文件**: [tags/[tag].astro](file:///workspace/src/pages/tags/[tag].astro)

**功能**：实现标签页面，显示包含指定标签的所有博客文章。

## 6. 技术栈与依赖

### 6.1 核心依赖

| 依赖 | 版本 | 用途 | 来源 |
|------|------|------|------|
| astro | ^6.1.6 | 静态站点生成框架 | [package.json](file:///workspace/package.json) |
| @astrojs/rss | ^4.0.18 | RSS 订阅功能 | [package.json](file:///workspace/package.json) |
| @astrojs/sitemap | ^3.7.2 | 网站地图生成 | [package.json](file:///workspace/package.json) |
| astro-pagefind | ^1.8.6 | 静态全文搜索 | [package.json](file:///workspace/package.json) |
| pagefind | ^1.5.2 | 搜索索引生成 | [package.json](file:///workspace/package.json) |

### 6.2 开发依赖

| 依赖 | 版本 | 用途 | 来源 |
|------|------|------|------|
| @eslint/js | ^9.0.0 | ESLint 核心 | [package.json](file:///workspace/package.json) |
| @playwright/test | ^1.59.1 | 端到端测试 | [package.json](file:///workspace/package.json) |
| eslint | ^9.0.0 | 代码质量检查 | [package.json](file:///workspace/package.json) |
| eslint-plugin-astro | ^1.0.0 | Astro 代码检查 | [package.json](file:///workspace/package.json) |
| happy-dom | ^20.9.0 | DOM 模拟（测试用） | [package.json](file:///workspace/package.json) |
| jsdom | ^29.0.2 | DOM 模拟（测试用） | [package.json](file:///workspace/package.json) |
| prettier | ^3.0.0 | 代码格式化 | [package.json](file:///workspace/package.json) |
| prettier-plugin-astro | ^0.14.0 | Astro 文件格式化 | [package.json](file:///workspace/package.json) |
| typescript-eslint | ^8.0.0 | TypeScript 代码检查 | [package.json](file:///workspace/package.json) |
| vitest | ^3.2.4 | 单元测试框架 | [package.json](file:///workspace/package.json) |

## 7. 开发与部署

### 7.1 开发流程

1. **前置要求**：
   - Node.js >= 20.0.0
   - npm >= 10.0.0

2. **安装**：
   ```bash
   git clone https://github.com/matthewhemhgz-dev/matthewhemhgz-dev.github.io.git
   cd matthewhemhgz-dev.github.io
   npm install
   ```

3. **开发命令**：
   ```bash
   npm run dev        # 启动开发服务器 (localhost:4321)
   npm run build      # 生产构建 (30 页面, ~3.6s)
   npm run preview    # 预览构建产物
   ```

4. **代码质量**：
   ```bash
   npm run lint           # ESLint 检查
   npm run format         # Prettier 格式化
   npm run format:check   # Prettier 检查（不修改文件）
   npm test               # Vitest 单元测试 (15 tests)
   npm run size-check     # 构建产物大小检查 (6MB 预算)
   ```

### 7.2 部署流程

- **部署目标**：GitHub Pages
- **CI/CD**：使用 GitHub Actions 自动部署
- **部署配置**：[.github/workflows/deploy.yml](file:///workspace/.github/workflows/deploy.yml)
- **部署流程**：
  1. 推送代码到 main 分支
  2. GitHub Actions 触发构建
  3. 执行 lint、test、build、size-check
  4. 部署到 GitHub Pages

## 8. 配置与环境

### 8.1  Astro 配置

**文件**: [astro.config.mjs](file:///workspace/astro.config.mjs)

```javascript
export default defineConfig({
  site: 'https://matthewhemhgz-dev.github.io',
  base: '/',
  output: 'static',
  outDir: './dist',
  compressHTML: true,
  build: {
    assets: '_astro',
  },
  markdown: {
    syntaxHighlight: {
      excludeLangs: ['mermaid'],
    },
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap({
    filter: (page) => !page.includes('/404'),
    i18n: {
      defaultLocale: 'zh',
      locales: {
        zh: 'zh-CN',
      },
    },
  }), pagefind()],
  vite: {
    build: {
      cssMinify: true,
      assetsInlineLimit: 0,
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
});
```

### 8.2 测试配置

**文件**: [vitest.config.ts](file:///workspace/vitest.config.ts)
- 配置 Vitest 单元测试框架

**文件**: [playwright.config.ts](file:///workspace/playwright.config.ts)
- 配置 Playwright 端到端测试框架

## 9. 监控与维护

### 9.1 构建产物大小检查

**文件**: [scripts/check-bundle-size.mjs](file:///workspace/scripts/check-bundle-size.mjs)
- 检查构建产物大小，确保不超过 6MB 预算

### 9.2 性能指标

| 指标 | 值 | 来源 |
|------|-----|------|
| 静态页面 | 38 页 | [README.md](file:///workspace/README.md) |
| 博客文章 | 7 篇 (65,000+ 字) | [README.md](file:///workspace/README.md) |
| 单元测试 | 15 passing | [README.md](file:///workspace/README.md) |
| 构建时间 | ~6.0s | [README.md](file:///workspace/README.md) |
| 构建产物 | 4.3 MB / 6 MB 预算 | [README.md](file:///workspace/README.md) |
| CSS 文件 | 36 个 (均 ≤500 行) | [README.md](file:///workspace/README.md) |
| 组件文件 | 25 个 (均 ≤300 行) | [README.md](file:///workspace/README.md) |
| Pagefind 索引 | 38 页 | [README.md](file:///workspace/README.md) |

## 10. 总结与亮点回顾

### 10.1 项目亮点

1. **技术选型**：使用 Astro 6 框架，结合静态站点生成和 Islands Architecture，实现高性能的静态网站。

2. **设计系统**：构建了完整的设计令牌系统，支持响应式设计和暗色模式，确保视觉一致性。

3. **交互体验**：实现了丰富的交互效果，包括粒子背景、卡片 3D 倾斜、光标发光、滚动视差等。

4. **搜索功能**：集成 Pagefind 实现静态全文搜索，支持中文分词，提升内容可发现性。

5. **代码质量**：建立了完善的代码质量保障体系，包括 ESLint、Prettier、Vitest 单元测试和 Playwright 端到端测试。

6. **CI/CD**：配置了 GitHub Actions 自动部署流程，确保代码质量和构建产物大小符合要求。

7. **内容管理**：使用 Astro Content Layer 管理博客内容，支持丰富的 frontmatter 字段和 Markdown 语法。

8. **性能优化**：通过压缩 HTML、CSS 最小化、资源内联限制等配置，优化网站性能。

### 10.2 适用场景

- **个人品牌网站**：展示个人作品、博客文章和专业技能
- **技术博客**：分享技术文章、教程和思考
- **创意实验室**：探索技术与设计的结合
- **作品集**：展示项目案例和创意作品

### 10.3 未来发展方向

- **内容扩展**：增加更多博客文章和项目案例
- **功能增强**：添加更多交互功能和用户体验优化
- **多语言支持**：扩展多语言能力，支持英文内容
- **社区互动**：添加评论系统，增强与读者的互动
- **性能优化**：进一步优化网站性能和加载速度

## 11. 附录

### 11.1 项目资源

- **GitHub 仓库**：[matthewhemhgz-dev/matthewhemhgz-dev.github.io](https://github.com/matthewhemhgz-dev/matthewhemhgz-dev.github.io)
- **部署地址**：[https://matthewhemhgz-dev.github.io](https://matthewhemhgz-dev.github.io)

### 11.2 相关文档

- **Astro 文档**：[https://docs.astro.build](https://docs.astro.build)
- **Pagefind 文档**：[https://pagefind.app/docs](https://pagefind.app/docs)
- **设计令牌系统**：[src/styles/tokens.css](file:///workspace/src/styles/tokens.css)
- **项目路线图**：[PROJECT-ROADMAP.md](file:///workspace/PROJECT-ROADMAP.md)

### 11.3 许可证

项目采用 MIT 许可证，详见 [LICENSE](file:///workspace/LICENSE) 文件。