# 祈研所 Qi-Lab 项目架构文档

## 1. 项目概述

祈研所 (Qi-Lab) 是一个基于 Astro 6 框架构建的个人技术博客网站，专注于技术、设计与创意的交汇。项目采用现代前端技术栈，实现了丰富的动效和交互体验，同时保持高性能和可维护性。

**网站定位**: 个人品牌展示 + 技术博客 + 项目作品集

## 2. 技术架构

### 2.1 核心技术栈

| 分类 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **框架** | Astro | ^6.1.6 | 静态站点生成 (SSG)，Islands Architecture |
| **样式** | Tailwind CSS | ^3.4.13 | 原子化 CSS 框架 |
| **样式** | 设计令牌系统 | 自定义 | `--qi-*` CSS 变量 |
| **交互** | 原生 JavaScript | ES6+ | View Transitions / Canvas / 3D Tilt / 微动画 |
| **搜索** | Pagefind | ^1.5.2 | 静态全文搜索 |
| **图标** | Lucide Icons | 内联 SVG | 图标库 |
| **部署** | GitHub Pages | - | 静态站点托管 |
| **CI/CD** | GitHub Actions | - | 自动化构建和部署 |

### 2.2 架构特点

- **静态优先**: 大部分内容在构建时生成，减少客户端渲染负担
- **组件化设计**: 模块化的组件结构，便于维护和扩展
- **响应式设计**: 支持多设备适配，从移动设备到桌面端
- **性能优化**: 懒加载、代码分割、资源压缩等多种优化策略
- **可访问性**: 遵循 WCAG 2 AA 标准，确保网站对所有用户可访问
- **PWA 支持**: 支持离线访问和推送通知

### 2.3 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        浏览器层                                │
├─────────────────────────────────────────────────────────────────┤
│  HTML / CSS / JavaScript / Service Worker / Manifest          │
├─────────────────────────────────────────────────────────────────┤
│                        应用层                                  │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│   页面路由    │    组件层    │   数据层     │     工具层       │
│  (Pages)     │ (Components) │  (Data)      │   (Utils)       │
├──────────────┼──────────────┼──────────────┼──────────────────┤
│ /            │ Navigation   │ blog posts   │ reading-time    │
│ /about       │ Footer       │ projects     │ search          │
│ /projects    │ HeroSection  │ tags         │ i18n            │
│ /blog        │ Card         │              │                 │
│ /tags        │ OptimizedImg │              │                 │
│ /en/...      │ ...          │              │                 │
├─────────────────────────────────────────────────────────────────┤
│                        Astro 框架                              │
├─────────────────────────────────────────────────────────────────┤
│  Content Layer / Markdown / MDX / SSR / SSG                   │
├─────────────────────────────────────────────────────────────────┤
│                        基础设施                                │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│  Tailwind    │   Pagefind   │   Vite       │   GitHub         │
│   CSS        │   (Search)   │ (Build)      │   Actions        │
└──────────────┴──────────────┴──────────────┴──────────────────┘
```

## 3. 项目结构

### 3.1 目录结构

```
/workspace/
├── src/                              # 源代码目录
│   ├── components/                   # Astro 组件 (30+ 个)
│   │   ├── decorations/              # 装饰性组件
│   │   ├── global/                   # 全局组件
│   │   ├── sections/                 # 页面区块组件
│   │   └── ui/                       # 通用 UI 组件
│   ├── data/                         # 数据文件
│   │   └── projects.ts               # 项目数据
│   ├── layouts/                      # 页面布局
│   ├── pages/                        # 路由页面
│   │   ├── en/                       # 英文分站
│   │   ├── blog/                     # 博客列表和详情
│   │   ├── tags/                     # 标签页面
│   │   ├── projects.astro            # 项目展示页面
│   │   ├── about.astro               # 关于页面
│   │   └── index.astro               # 首页
│   ├── scripts/                      # 交互脚本
│   ├── styles/                       # CSS 样式
│   │   ├── base/                     # 基础样式和设计令牌
│   │   ├── components/               # 组件样式
│   │   ├── sections/                 # 区块样式
│   │   ├── pages/                    # 页面样式
│   │   └── utilities/                # 工具类样式
│   └── utils/                        # 工具函数
├── public/                           # 静态资源
│   ├── images/                       # 图片资源
│   └── favicon.*                     # 网站图标
├── .trae/                            # 项目体检文档
├── docs/                             # 项目文档
├── e2e/                              # 端到端测试
├── scripts/                          # 自动化脚本
├── astro.config.mjs                  # Astro 配置
├── tailwind.config.mjs               # Tailwind 配置
├── tsconfig.json                     # TypeScript 配置
└── package.json                      # 项目依赖
```

### 3.2 目录职责说明

| 目录 | 职责 | 状态 |
|------|------|------|
| `src/components/` | Astro 组件，包括全局组件、页面区块、UI 组件、装饰组件 | 活跃 |
| `src/data/` | 静态数据文件（项目列表等） | 活跃 |
| `src/layouts/` | 页面布局组件 | 活跃 |
| `src/pages/` | 路由页面，包括中英文版本 | 活跃 |
| `src/scripts/` | 客户端交互脚本（粒子系统、动效等） | 活跃 |
| `src/styles/` | CSS 样式文件，按功能组织 | 活跃 |
| `src/utils/` | 工具函数 | 活跃 |
| `public/` | 静态资源（图片、图标等） | 活跃 |
| `e2e/` | Playwright 端到端测试 | 活跃 |
| `scripts/` | 自动化脚本（性能审计、资源管理等） | 活跃 |

## 4. 核心组件

### 4.1 全局组件

| 组件 | 职责 | 文件路径 |
|------|------|----------|
| Navigation | 导航栏，支持响应式和主题切换 | `src/components/global/Navigation.astro` |
| Footer | 页脚，包含联系信息和链接 | `src/components/global/Footer.astro` |
| SearchModal | 搜索模态框，集成 Pagefind | `src/components/global/SearchModal.astro` |
| BackToTop | 回到顶部按钮 | `src/components/global/BackToTop.astro` |
| ThemeToggle | 主题切换（亮色/暗色） | `src/components/global/ThemeToggle.astro` |
| LanguageToggle | 语言切换（中文/英文） | `src/components/LanguageToggle.astro` |
| ParticlesCanvas | 粒子背景画布 | `src/components/global/ParticlesCanvas.astro` |

### 4.2 页面区块组件

| 组件 | 职责 | 文件路径 |
|------|------|----------|
| HeroSection | 首页英雄区 | `src/components/sections/HeroSection.astro` |
| AboutSection | 关于区块 | `src/components/sections/AboutSection.astro` |
| FeaturedSection | 精选博客区块 | `src/components/sections/FeaturedSection.astro` |
| ProjectsSection | 项目展示区块 | `src/components/sections/ProjectsSection.astro` |
| ToolboxSection | 工具展示区块 | `src/components/sections/ToolboxSection.astro` |
| PlatformsSection | 平台展示区块 | `src/components/sections/PlatformsSection.astro` |
| ResearchSection | 研究方法论区块 | `src/components/sections/ResearchSection.astro` |
| CtaSection | 行动号召区块 | `src/components/sections/CtaSection.astro` |

### 4.3 UI 组件

| 组件 | 职责 | 文件路径 |
|------|------|----------|
| SectionHeader | 区块标题组件 | `src/components/ui/SectionHeader.astro` |
| OptimizedImage | 优化图片组件 | `src/components/ui/OptimizedImage.astro` |
| DashCard | 卡片组件 | `src/components/ui/DashCard.astro` |
| ArticleCard | 文章卡片 | `src/components/ui/ArticleCard.astro` |
| CodeBlock | 代码块组件 | `src/components/ui/CodeBlock.astro` |

## 5. 数据流

### 5.1 页面渲染流程

```
用户请求 → Astro 路由 → 页面组件 → 布局组件 → 全局组件 → HTML 输出
                              ↓
                         内容层查询 → Markdown/MDX 解析 → 渲染
```

### 5.2 搜索流程

```
用户输入 → SearchModal → Pagefind API → 搜索结果 → 结果渲染
```

### 5.3 主题切换流程

```
用户点击 → ThemeToggle → localStorage 设置 → document.documentElement 添加类 → CSS 变量切换
```

## 6. 样式系统

### 6.1 设计令牌结构

```
--qi-
├── bg-*           # 背景色
├── surface-*      # 表面色
├── text-*         # 文字色
├── brand-*        # 品牌色
├── space-*        # 间距
├── radius-*       # 圆角
├── shadow-*       # 阴影
├── font-*         # 字体
├── text-*         # 文字大小
└── transition-*   # 过渡动画
```

### 6.2 主题系统

- **浅色模式**: `data-theme="light"`（默认）
- **深色模式**: `data-theme="dark"`

## 7. 国际化

### 7.1 路由结构

- **中文**: `/`, `/about`, `/blog`, `/tags`, `/projects`
- **英文**: `/en/`, `/en/about`, `/en/blog`, `/en/tags`

### 7.2 内容组织

- 博客文章按语言分开存储
- 共享组件支持双语标签

## 8. CI/CD 流程

```
push → GitHub Actions → lint → test → build → size-check → lighthouse → deploy
```

## 9. 部署架构

- **生产环境**: GitHub Pages (`https://matthewhemhgz-dev.github.io`)
- **构建产物**: `dist/` 目录

## 10. 关键指标

| 指标 | 当前值 | 目标 |
|------|--------|------|
| 页面数量 | 115 | - |
| 构建时间 | ~12s | <10s |
| Lighthouse 得分 | 待测试 | 90+ |
| 组件数量 | 30+ | - |

---

**文档版本**: v2.0  
**创建日期**: 2026-04-28  
**适用项目**: qi-lab-site