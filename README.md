# 祈研所 Qi-Lab

> 探索技术、设计与创意的交汇之处 — 一个用代码构建、用设计表达的创意实验室。

## 技术栈

- **框架**: [Astro 6](https://astro.build) — 静态站点生成 (SSG)，Islands Architecture
- **样式**: 原生 CSS + 设计令牌系统 (`--qi-*` variables, 338 行 tokens)，支持玻璃态设计
- **交互**: 原生 JavaScript (View Transitions / Canvas / 3D Tilt / Pagefind / 微动画)
- **搜索**: [Pagefind](https://pagefind.app) — 静态全文搜索，支持中英双语分词，搜索建议和历史
- **部署**: GitHub Pages
- **质量保障**: 历经 7 轮深度的高级 UI/UX 审计 + 端到端测试 (94/94 测试通过) + WCAG 2 AA 可访问性标准
- **CI/CD**: GitHub Actions (Lint + Test + Build + Size Check + Performance Test + Deploy)
- **性能监控**: Lighthouse 审计集成，提供关键性能指标分析
- **PWA 支持**: 离线访问、安装到主屏幕、Service Worker
- **Newsletter**: 邮件订阅功能，支持用户订阅网站更新
- **相关文章推荐**: 基于标签相似度、类别匹配和日期接近度的智能推荐算法
- **物理化动效系统**: 基于真实物理规律的弹簧动画，包括阻尼效果和重力加速度
- **动态光影效果**: 基于鼠标位置的动态光影变化，提升视觉深度和真实感
- **增强的玻璃态效果**: 具有反光特性和折射效果的玻璃态设计，支持亮色和暗色模式
- **流体背景效果**: 动态流体背景，响应鼠标交互，提升沉浸感
- **生成式艺术系统**: 基于数学模式的生成式艺术，实现几何形状的和谐运动和色彩映射
- **粒子共振系统**: 优化的粒子系统，支持鼠标交互和响应式参数调整
- **品牌视觉元素**: 基于品牌色彩的视觉组件，支持 logo、pattern 和 abstract 三种类型
- **文档封面模板**: 统一的文档封面设计，支持 modern、minimal 和 artistic 三种风格
- **算法艺术交互**: 所有算法艺术元素都支持鼠标交互，粒子和形状会跟随鼠标互动
- **品牌内核**: 专注于"思维架构与知识工程"，每一处视觉与文案均经过微观逻辑校准
- **设计趋势**: Bento 网格布局、玻璃态设计、微动画和交互效果、算法艺术

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
npm run build      # 生产构建 (114 页面, ~8.5s)
npm run preview    # 预览构建产物
```

### 代码质量

```bash
npm run lint           # ESLint 检查
npm run format         # Prettier 格式化
npm run format:check   # Prettier 检查（不修改文件）
npm test               # Vitest 单元测试 (15 tests)
npm run size-check     # 构建产物大小检查 (10MB 预算)
npm run lighthouse     # Lighthouse 性能审计
```

## 项目结构

```
src/
├── components/        # Astro 组件 (30 个)
│   ├── decorations/   # 装饰性组件 (SectionDivider)
│   ├── global/        # 全局组件 (Navigation, Footer, SearchModal, BackToTop...)
│   ├── sections/      # 首页区块组件 (Hero, About, Featured, Toolbox, Platforms, Testimonials...)
│   └── ui/            # 通用 UI 组件 (DashCard, SectionHeader, OptimizedImage, GenerativeArt, BrandVisual, DocumentCover)
├── data/blog/         # 博客文章
│   ├── zh/            # 中文文章 (17 篇 Markdown, 140,000+ 字)
│   └── en/            # 英文文章 (17 篇 Markdown, 全量翻译完成)
├── layouts/           # 页面布局 (BaseLayout)
├── pages/             # 路由页面
│   ├── [zh]/          # 中文主站 (首页/博客/标签/关于)
│   └── en/            # 英文分站 (全量 Feature Parity)
├── scripts/           # 交互脚本 (card-tilt, particles, cursor-glow, copy-code, generative-harmony, background-art, brand-visuals, document-cover, fluid-harmonics, particle-resonance...)
├── styles/            # CSS 样式 (40 个文件, 设计令牌驱动)
│   ├── base/               # 基础样式 (tokens, dark-tokens, reset, global)
│   ├── components/         # 组件样式
│   ├── sections/           # 区块样式
│   ├── pages/              # 页面样式
│   └── utilities/          # 工具类样式 (animations, glass)
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

博客文章使用 Astro Content Layer，Markdown 文件位于 `src/data/blog/zh/` 和 `src/data/blog/en/`。

支持的 frontmatter 字段：`title` / `description` / `pubDate` / `updatedDate` / `heroImage` / `tags` / `category` / `author` / `draft` / `lang`。

### 内容体系

项目已建立完整的技术内容体系，包括：

- **知识管理体系系列**：深入探讨知识管理的核心概念、工具和实践方法
  - 《知识管理体系基础：构建你的第二大脑》
  - 《知识管理工具与实践：从理论到落地》

## 国际化 (i18n)

项目支持全量的中英双语切换：

- **路由**: `/` (中文) 和 `/en/` (英文)
- **内容同步**: 博客文章与标签系统在不同语境下保持功能对等。
- **英文内容**: 全量完成 17 篇博客文章的英文翻译，包括知识管理、技术架构和设计系统相关内容。
- **SEO**: 自动注入对应的 `hreflang` 与各语种 JSON-LD 结构化数据。

## GitHub Pages 项目调研

基于对同类 GitHub Pages 项目的调研，我们识别了以下改进机会：

### 优秀项目参考

- **Astrofy**: 个人作品集模板，包含博客、CV、项目展示等功能
- **Astrowind**: 高性能博客模板，支持响应式设计
- **astro-erudite**: 技术博客模板，注重内容可读性
- **ensribe.dev**: 信息安全博客，设计现代简洁
- **astro-bento-portfolio**: 极简风格的单页作品集，采用 bento 布局

### 迭代计划

#### 短期计划（1-2 个月）

- 扩展内容体系，继续创建技术系列文章
- 优化用户体验，增强微动画效果
- 确保技术稳定性，定期更新依赖
- 进一步优化性能，提升加载速度
- 完善 SEO，添加更多结构化数据

#### 中期计划（3-6 个月）

- 集成 GitHub API，自动拉取项目数据
- 扩充内容，覆盖更多技术主题
- 完善设计系统，确保品牌一致性
- 增强 PWA 功能，提升用户体验
- 优化国际化支持，添加更多语言

#### 长期计划（6-12 个月）

- 实现 AI 辅助功能，生成内容摘要和推荐
- 开发交互式代码示例，提升技术内容质量
- 实现个性化内容推荐，基于用户行为
- 探索社区功能，增强用户互动
- 升级技术栈，保持网站技术的先进性

## 质量基线

| 指标          | 值                                            |
| ------------- | --------------------------------------------- |
| 静态页面      | 114 页                                        |
| 博客文章      | 34 篇 (140,000+ 字)                           |
| 单元测试      | 38 passing                                    |
| 端到端测试    | 94 passing                                    |
| 构建时间      | ~12s                                          |
| 构建产物      | ~7.8 MB / 10 MB 预算                          |
| CSS 文件      | 40 个 (均 ≤500 行)                            |
| 组件文件      | 30 个 (均 ≤300 行)                            |
| JS 脚本文件   | 18 个                                         |
| Pagefind 索引 | 114 页                                        |
| 可访问性      | WCAG 2 AA 标准                                |
| 微动画效果    | 16+ 种                                        |
| 设计趋势      | Bento 网格布局、玻璃态设计、算法艺术          |
| 内容系列      | 1 个 (知识管理体系)                           |
| 算法艺术系统  | 5 个 (生成式、粒子、流体、品牌视觉、文档封面) |

## 最新更新 (2026-04-25)

### 新增功能

- **环境感知系统**：基于时间、季节、设备性能、电池状态等因素动态调整应用行为
- **多模态反馈系统**：支持视觉、听觉和触觉反馈，提供沉浸式用户体验
- **流体谐波系统**：基于粒子的流体模拟效果，支持多种流体类型
- **粒子共振系统**：优化的粒子系统，支持鼠标交互和响应式参数调整
- **文档封面模板**：统一的文档封面设计，支持 modern、minimal 和 artistic 三种风格
- **环境感知交互组件**：根据用户设备和偏好自动调整界面行为
- **资源管理系统**：自动化的资源识别、分类、索引和管理系统，包括资源扫描、标签管理和状态跟踪

### 资源管理系统

项目新增了完整的资源管理系统，用于管理和组织项目资源：

**核心工具**：
- `scripts/resource-scanner.js` - 扫描项目资源并生成索引
- `scripts/resource-manager.js` - 管理资源标签、搜索资源、生成报告
- `scripts/resource-status.js` - 跟踪和管理资源的开发状态
- `scripts/resource-integration.js` - 集成和测试资源管理系统

**使用方法**：
```bash
# 扫描项目资源
node scripts/resource-scanner.js

# 生成资源报告
node scripts/resource-manager.js report

# 搜索资源
node scripts/resource-manager.js search <关键词>

# 设置资源状态
node scripts/resource-status.js set <文件路径> <状态> [描述]

# 集成和测试资源管理系统
node scripts/resource-integration.js
```

**文档**：
- `.trae/documents/resource-management-best-practices.md` - 资源管理最佳实践
- `.trae/documents/resource-management-training.md` - 资源管理系统培训指南

### 代码质量改进

- 完善了 TypeScript 类型定义，添加了全面的 JSDoc 注释
- 新增了环境感知和多模态反馈系统的单元测试
- 优化了 ESLint 配置，解决了所有错误
- 保持了代码风格一致性，通过 Prettier 格式化

### 性能优化

- 进一步优化了粒子系统性能，减少了内存占用
- 优化了流体模拟算法，提升了渲染效率
- 添加了响应式调整机制，根据设备性能动态调整参数

### 部署状态

- ✅ 构建成功
- ✅ 所有测试通过
- ✅ 预览服务器正常运行
- ✅ 网站功能完整可用
- ✅ 准备好部署到 GitHub Pages

## 许可证

[MIT](./LICENSE)
