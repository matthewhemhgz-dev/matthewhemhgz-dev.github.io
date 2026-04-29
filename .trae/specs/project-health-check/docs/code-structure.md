# 祈研所 Qi-Lab 代码结构清单

## 1. 项目根目录

| 文件/目录 | 用途 | 状态 |
|-----------|------|------|
| `.astro/` | Astro 构建缓存和类型定义 | 自动生成 |
| `.github/` | GitHub Actions CI/CD 配置 | 配置文件 |
| `.vscode/` | VS Code 工作区配置 | 开发工具 |
| `audit_report/` | 审计报告存档 | 文档 |
| `dist/` | 构建产物目录 | 自动生成 |
| `docs/` | 项目文档 | 文档 |
| `e2e/` | Playwright 端到端测试 | 测试 |
| `node_modules/` | Node.js 依赖 | 自动生成 |
| `public/` | 静态资源 | 资源 |
| `reports/` | 性能报告存档 | 文档 |
| `screenshots/` | 测试截图存档 | 文档 |
| `scripts/` | 自动化脚本 | 工具 |
| `src/` | 源代码 | 核心代码 |
| `.editorconfig` | 编辑器配置 | 配置 |
| `.gitignore` | Git 忽略配置 | 配置 |
| `.prettierignore` | Prettier 忽略配置 | 配置 |
| `.prettierrc` | Prettier 格式化配置 | 配置 |
| `ARCHITECTURE.md` | 架构文档 | 文档 |
| `CHANGELOG.md` | 变更日志 | 文档 |
| `CODE-WIKI.md` | 代码维基 | 文档 |
| `CONTENT-CALENDAR.md` | 内容日历 | 文档 |
| `CONTRIBUTING.md` | 贡献指南 | 文档 |
| `PROJECT-ROADMAP.md` | 项目路线图 | 文档 |
| `QUALITY_REVIEW.md` | 质量评审 | 文档 |
| `README.md` | 项目说明 | 文档 |
| `astro.config.mjs` | Astro 框架配置 | 核心配置 |
| `eslint.config.mjs` | ESLint 配置 | 配置 |
| `package.json` | 项目依赖和脚本 | 核心配置 |
| `playwright.config.ts` | Playwright 配置 | 测试配置 |
| `tailwind.config.mjs` | Tailwind CSS 配置 | 样式配置 |
| `tsconfig.json` | TypeScript 配置 | 配置 |
| `vitest.config.ts` | Vitest 配置 | 测试配置 |

## 2. src/ 目录结构

### 2.1 src/components/

| 子目录 | 用途 | 文件数量 |
|--------|------|----------|
| `decorations/` | 装饰性组件（分隔线、背景等） | 5+ |
| `global/` | 全局组件（导航、页脚、搜索等） | 7+ |
| `sections/` | 页面区块组件（首页各区块） | 10+ |
| `ui/` | 通用 UI 组件（卡片、图片、按钮等） | 8+ |

#### 2.1.1 src/components/decorations/

| 文件 | 用途 |
|------|------|
| `SectionDivider.astro` | 区块分隔线组件 |
| `ParticleDecoration.astro` | 粒子装饰组件 |
| `BrandPattern.astro` | 品牌图案装饰 |

#### 2.1.2 src/components/global/

| 文件 | 用途 |
|------|------|
| `Navigation.astro` | 导航栏组件 |
| `Footer.astro` | 页脚组件 |
| `SearchModal.astro` | 搜索模态框 |
| `BackToTop.astro` | 返回顶部按钮 |
| `ThemeToggle.astro` | 主题切换按钮 |
| `ParticlesCanvas.astro` | 粒子背景画布 |

#### 2.1.3 src/components/sections/

| 文件 | 用途 |
|------|------|
| `HeroSection.astro` | 首页英雄区 |
| `AboutSection.astro` | 关于区块 |
| `FeaturedSection.astro` | 精选博客区块 |
| `ProjectsSection.astro` | 项目展示区块 |
| `ToolboxSection.astro` | 工具展示区块 |
| `PlatformsSection.astro` | 平台展示区块 |
| `ResearchSection.astro` | 研究方法论区块 |
| `CtaSection.astro` | 行动号召区块 |

#### 2.1.4 src/components/ui/

| 文件 | 用途 |
|------|------|
| `SectionHeader.astro` | 区块标题组件 |
| `OptimizedImage.astro` | 优化图片组件 |
| `DashCard.astro` | 仪表盘卡片 |
| `ArticleCard.astro` | 文章卡片 |
| `CodeBlock.astro` | 代码块组件 |
| `TagBadge.astro` | 标签徽章 |

### 2.2 src/data/

| 文件 | 用途 |
|------|------|
| `projects.ts` | 项目数据和类型定义 |

### 2.3 src/layouts/

| 文件 | 用途 |
|------|------|
| `BaseLayout.astro` | 基础布局组件 |

### 2.4 src/pages/

| 文件/目录 | 用途 |
|-----------|------|
| `index.astro` | 首页 |
| `about.astro` | 关于页面 |
| `projects.astro` | 项目展示页面 |
| `blog/` | 博客相关页面 |
| `tags/` | 标签页面 |
| `en/` | 英文版本页面 |

### 2.5 src/scripts/

| 文件 | 用途 |
|------|------|
| `init.js` | 初始化脚本 |
| `particles.js` | 粒子系统核心 |
| `particle-resonance.js` | 粒子共振效果 |
| `fluid-harmonics.js` | 流体谐波效果 |
| `scroll-reveal.js` | 滚动揭示效果 |
| `scroll-parallax.js` | 滚动视差效果 |
| `card-tilt.js` | 卡片 3D 倾斜效果 |
| `cursor-glow.js` | 鼠标光晕效果 |
| `copy-code.ts` | 代码复制功能 |
| `interaction-enhancements.js` | 交互增强 |
| `effects-manager.js` | 效果管理器 |

### 2.6 src/styles/

| 子目录 | 用途 |
|--------|------|
| `base/` | 基础样式和设计令牌 |
| `components/` | 组件样式 |
| `sections/` | 区块样式 |
| `pages/` | 页面样式 |
| `utilities/` | 工具类样式 |

#### 2.6.1 src/styles/base/

| 文件 | 用途 |
|------|------|
| `tokens.css` | 设计令牌（颜色、间距、字体等） |
| `dark-tokens.css` | 深色模式设计令牌 |
| `global.css` | 全局样式重置 |
| `typography.css` | 排版样式 |

#### 2.6.2 src/styles/sections/

| 文件 | 用途 |
|------|------|
| `article.css` | 文章页面样式 |
| `home-featured.css` | 首页精选区块样式 |
| `home-hero.css` | 首页英雄区样式 |

#### 2.6.3 src/styles/pages/

| 文件 | 用途 |
|------|------|
| `projects.css` | 项目页面样式 |

#### 2.6.4 src/styles/utilities/

| 文件 | 用途 |
|------|------|
| `code-blocks.css` | 代码块样式 |
| `scrollbar.css` | 滚动条样式 |

### 2.7 src/utils/

| 文件 | 用途 |
|------|------|
| `reading-time.ts` | 阅读时间计算工具 |

## 3. public/ 目录

| 文件/目录 | 用途 |
|-----------|------|
| `images/` | 图片资源 |
| `favicon.ico` | 网站图标（ICO） |
| `favicon.png` | 网站图标（PNG） |
| `favicon.svg` | 网站图标（SVG） |
| `og-default.png` | Open Graph 默认图片 |
| `robots.txt` | 搜索引擎爬虫规则 |
| `service-worker.js` | Service Worker |

## 4. scripts/ 目录

| 文件 | 用途 |
|------|------|
| `check-bundle-size.mjs` | 构建产物大小检查 |
| `lighthouse-audit.mjs` | Lighthouse 性能审计 |
| `playwright-lighthouse.mjs` | Playwright + Lighthouse 集成 |
| `resource-manager.js` | 资源管理器 |
| `resource-scanner.js` | 资源扫描器 |

## 5. e2e/ 目录

| 文件 | 用途 |
|------|------|
| `comprehensive-audit.spec.ts` | 综合审计测试 |
| `responsive-layout.spec.ts` | 响应式布局测试 |
| `visual-regression.spec.ts` | 视觉回归测试 |
| `navigation.spec.ts` | 导航功能测试 |

## 6. 关键配置文件说明

### 6.1 astro.config.mjs

- **用途**: Astro 框架核心配置
- **关键配置**:
  - 站点基础 URL
  - 集成插件（MDX、Sitemap、PWA、Tailwind）
  - 构建输出配置

### 6.2 tailwind.config.mjs

- **用途**: Tailwind CSS 配置
- **关键配置**:
  - 内容扫描路径
  - 自定义主题扩展
  - 设计令牌集成

### 6.3 tsconfig.json

- **用途**: TypeScript 配置
- **关键配置**:
  - 路径别名
  - 严格模式设置
  - Astro 类型集成

### 6.4 package.json

- **用途**: 项目依赖和脚本定义
- **关键脚本**:
  - `dev`: 开发服务器
  - `build`: 生产构建
  - `lint`: ESLint 检查
  - `test`: Vitest 单元测试
  - `test:e2e`: Playwright 端到端测试
  - `size-check`: 构建产物大小检查
  - `lighthouse`: Lighthouse 审计

---

**文档版本**: v1.0  
**创建日期**: 2026-04-28  
**适用项目**: qi-lab-site