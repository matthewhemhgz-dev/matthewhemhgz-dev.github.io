# 祈研所 Qi-Lab — 项目总结与迭代路线图

> 生成时间：2026-04-18 | 基于 Round 16–22 共 7 轮迭代 + 30+ 次提交的完整审计

---

## 一、项目现状总览

### 1.1 技术架构

| 维度 | 现状 |
|------|------|
| **框架** | Astro 6.1.6，纯静态输出 (SSG) |
| **部署** | GitHub Pages (`matthewhemhgz-dev.github.io`) |
| **样式系统** | 原生 CSS，20 个文件 / 4423 行，设计令牌 (`--qi-*`) 驱动 |
| **交互脚本** | 原生 JS，6 个文件 / 980 行，`astro:page-load` 事件驱动 |
| **内容管理** | Astro Content Layer (glob loader)，2 篇中文博客 |
| **CI/CD** | GitHub Actions 自动构建 + 部署 + Dependabot |
| **代码质量** | ESLint 9 (flat config) + Prettier 3 + TypeScript strict |

### 1.2 项目规模

| 类别 | 数量 | 总行数 |
|------|------|--------|
| 组件 (.astro) | 18 个 | 1,431 |
| 页面文件 | 8 个 | — |
| CSS 样式 | 20 个 | 4,423 |
| JS 脚本 | 6 个 | 980 |
| 博客文章 | 2 篇 | — |
| **源码总计** | **54 个文件** | **~6,834** |

### 1.3 已完成的核心能力

| 能力域 | 状态 | 详情 |
|--------|------|------|
| **设计令牌系统** | ✅ 成熟 | 315 行 tokens.css，色彩/字体/间距/阴影/层级全覆盖 |
| **响应式适配** | ✅ 成熟 | 7 断点 (480–3440px)，`--qi-font-scaled-*` 2K/4K 字体缩放 |
| **View Transitions** | ✅ 成熟 | ClientRouter + 自定义过渡动画 |
| **SEO 基础** | ✅ 成熟 | meta/OG/Twitter Card/canonical/sitemap/robots.txt/RSS |
| **可访问性** | ✅ 成熟 | skip-link / h1 层级 / alt / aria / reduced-motion |
| **3D 交互** | ✅ 成熟 | tilt-card (动态 perspective) / cursor-glow / particles |
| **滚动动效** | ✅ 成熟 | parallax / scroll-triggered / nav collapse / back-to-top |
| **全局约束合规** | ✅ 18/18 PASS | CSS ≤500 行 / 组件 ≤300 行 / 令牌覆盖率 / 无孤立资源 |

---

## 二、能力缺口矩阵

### 2.1 关键缺失（影响生产可靠性）

| # | 缺失项 | 影响 | 严重度 |
|---|--------|------|--------|
| G1 | **零自动化测试** | 无法防止回归，重构风险高 | 🔴 高 |
| G2 | **CI Lint 不阻塞部署** | `continue-on-error: true`，代码质量无强制保障 | 🔴 高 |
| G3 | **无 README.md** | 新贡献者无法快速上手 | 🟡 中 |
| G4 | **无 CHANGELOG.md** | 版本变更无记录，运维不透明 | 🟡 中 |

### 2.2 功能缺失（影响用户体验）

| # | 缺失项 | 影响 | 严重度 |
|---|--------|------|--------|
| F1 | **无搜索功能** | 内容增多后用户无法快速定位文章 | 🟡 中 |
| F2 | **无暗色模式** | 夜间阅读体验差，不符合现代 Web 期望 | 🟡 中 |
| F3 | **无评论系统** | 博客缺少互动能力 | 🟢 低 |
| F4 | **无联系表单** | 仅有 mailto 链接，转化率低 | 🟢 低 |
| F5 | **无 Newsletter 订阅** | 缺少读者留存机制 | 🟢 低 |

### 2.3 SEO / 性能缺失（影响流量与排名）

| # | 缺失项 | 影响 | 严重度 |
|---|--------|------|--------|
| S1 | **无 JSON-LD 结构化数据** | 搜索引擎无法理解内容语义 | 🟡 中 |
| S2 | **文章页缺少 article:published_time 等 OG 标签** | 社交分享展示不完整 | 🟡 中 |
| S3 | **图片无 WebP/AVIF 格式** | 页面加载速度非最优 | 🟡 中 |
| S4 | **图片无 width/height** | 可能导致 CLS 布局偏移 | 🟡 中 |
| S5 | **无 Web Vitals 监控** | 无法量化性能表现 | 🟢 低 |
| S6 | **无流量分析** | 无法了解用户行为 | 🟢 低 |

### 2.4 内容缺失（影响站点价值）

| # | 缺失项 | 影响 | 严重度 |
|---|--------|------|--------|
| C1 | **仅 2 篇博客** | 站点内容单薄，SEO 权重低 | 🟡 中 |
| C2 | **无英文版本** | 国际受众无法访问 | 🟢 低 |
| C3 | **i18n 框架已搭建但未启用** | 多语言基础设施闲置 | 🟢 低 |

---

## 三、迭代路线图

### Phase 1：工程基础加固（优先级最高）

> 目标：建立质量门禁，防止回归，提升协作效率

#### 1.1 测试体系搭建

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| 引入 Vitest | `npm i -D vitest @astrojs/test-utils`，配置 `vitest.config.ts` | 小 |
| 编写组件单元测试 | 优先覆盖：BrandLogo / SectionHeader / DashCard / Navigation | 中 |
| 编写工具函数测试 | card-tilt.js 的 destroy() / perspective 计算 | 小 |
| 添加 `npm test` 脚本 | `package.json` 中添加 `"test": "vitest run"` | 小 |
| CI 集成测试 | GitHub Actions 中添加 test 步骤 | 小 |

#### 1.2 CI/CD 强化

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| Lint 强制执行 | 移除 `continue-on-error: true`，确保 ESLint 失败阻止部署 | 小 |
| 添加 Lighthouse CI | 集成 `@lhci/cli`，设定性能预算 (Performance ≥ 90, LCP ≤ 2.5s) | 中 |
| 构建产物大小检查 | 添加 `bundlesize` 或自定义脚本，监控 JS/CSS 总大小 | 小 |

#### 1.3 项目文档

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| 创建 README.md | 项目介绍 / 技术栈 / 开发指南 / 部署流程 / 目录结构 | 中 |
| 创建 CHANGELOG.md | 回填 Round 16–22 的变更记录 | 中 |

---

### Phase 2：内容与 SEO 增强

> 目标：提升搜索引擎可见性，增加站点内容深度

#### 2.1 SEO 结构化数据

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| 添加 JSON-LD | 首页 → `WebSite` + `Organization` schema；文章页 → `Article` schema；关于页 → `Person` schema | 中 |
| 文章 OG 标签增强 | 添加 `og:type=article`、`article:published_time`、`article:tag`、`article:section` | 小 |
| 添加 `<meta name="author">` | BaseLayout 中添加 | 小 |

#### 2.2 图片优化

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| 创建 `<Picture>` 工具组件 | 封装 Astro 内置 `<Picture>`，支持 WebP/AVIF 自动降级 | 中 |
| 为现有图片添加 width/height | FeaturedSection 中的封面图 | 小 |
| 博客文章 heroImage 支持 | 在 `[slug].astro` 中渲染文章头图 | 小 |

#### 2.3 内容扩充

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| 新增 3–5 篇博客 | 覆盖不同分类（深度研析 / 实用干货 / 随思随想），丰富标签体系 | 大（内容创作） |
| 添加阅读时间计算 | 自动根据字数生成 `readingTime`，显示在文章列表和详情页 | 小 |
| 添加文章系列/专栏 | Content schema 扩展 `series` 字段，UI 上展示系列导航 | 中 |

---

### Phase 3：用户体验升级

> 目标：提升交互体验，增加用户粘性

#### 3.1 搜索功能

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| 集成 Pagefind | Astro 生态首选静态搜索方案，零配置支持中文分词 | 中 |
| 搜索 UI 组件 | 导航栏添加搜索图标 + 弹出搜索面板 (Cmd+K 快捷键) | 中 |
| 搜索结果高亮 | 匹配关键词高亮显示 | 小 |

#### 3.2 暗色模式

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| tokens.css 暗色变量 | 定义 `@media (prefers-color-scheme: dark)` 或 `.dark` 类下的颜色覆盖 | 中 |
| 主题切换组件 | 导航栏添加太阳/月亮图标切换按钮，`localStorage` 持久化 | 中 |
| 图片适配 | Logo / 装饰元素在暗色模式下的可见性调整 | 小 |
| Mermaid 主题同步 | 根据当前主题动态切换 Mermaid 渲染主题 | 小 |

#### 3.3 互动功能

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| 集成 Giscus 评论 | 基于 GitHub Discussions，免费、无广告、支持中文 | 中 |
| 联系表单 | 使用 Formspree / Getform 等第三方服务，无需后端 | 中 |
| 文章分享按钮 | 微信 / 微博 / Twitter 一键分享 | 小 |
| 代码块复制按钮 | 文章页代码块右上角添加复制功能 | 小 |

---

### Phase 4：国际化与进阶

> 目标：拓展受众范围，提升技术深度

#### 4.1 英文版本

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| 启用 i18n 路由 | 配置 `en` locale，`prefixDefaultLocale: false` | 小 |
| 创建翻译文件 | `src/i18n/zh.ts` + `src/i18n/en.ts`，提取所有 UI 文案 | 大 |
| 语言切换组件 | 导航栏添加语言切换下拉 | 中 |
| 博客英文翻译 | 2 篇现有文章的英文版本 | 大（翻译工作） |

#### 4.2 性能监控

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| 集成 Umami / Plausible | 隐私友好的自托管分析方案 | 中 |
| Web Vitals 上报 | 自建或使用 `@astrojs/web-vitals` | 中 |
| 构建 CI 性能基线 | Lighthouse CI 历史趋势追踪 | 小 |

#### 4.3 进阶功能（可选）

| 任务 | 说明 | 预估工作量 |
|------|------|-----------|
| Newsletter 订阅 | Buttondown / Revue 等服务集成 | 中 |
| 项目展示页 | 独立的 Projects/Works 页面，展示开源项目和个人作品 | 大 |
| RSS 全文输出 | 当前 RSS 仅包含 description，改为包含全文内容 | 小 |
| PWA 支持 | 添加 manifest.json + Service Worker，支持离线访问 | 中 |
| 动画性能优化 | 使用 `will-change` / `content-visibility` 减少重排 | 中 |

---

## 四、技术债务清单

| # | 债务项 | 位置 | 说明 |
|---|--------|------|------|
| T1 | tsconfig JSX 配置冗余 | `tsconfig.json` | `jsx: "react-jsx"` + `jsxImportSource: "react"` 但项目无 React 依赖，应移除 |
| T2 | Mermaid 主题硬编码 | `MermaidInit.astro:17` | 固定 `theme: 'dark'`，与浅色设计不一致 |
| T3 | 微装饰元素硬编码间距 | `article.css` / `home-toolbox.css` 等 | tag badge (2–4px)、inline code (2px 7px) 等精细 px 值未使用令牌（可接受但需记录） |
| T4 | particles.js 体积较大 | `src/scripts/particles.js` (386 行) | Canvas 粒子效果较重，考虑按需加载或简化 |
| T5 | cursor-glow.js 体积较大 | `src/scripts/cursor-glow.js` (211 行) | 鼠标光效在移动端无意义，应添加平台检测跳过初始化 |

---

## 五、质量基线（当前）

| 指标 | 值 |
|------|-----|
| 全局约束合规 | 18/18 PASS |
| CSS 最大文件 | 487 行 (home-hero.css) |
| 组件最大文件 | 158 行 (DashCard.astro) |
| 构建时间 | ~3.4s |
| 构建产物 | 14 个静态页面 |
| 自动化测试覆盖 | 0% |
| Lighthouse CI | 未配置 |
| 博客文章数 | 2 篇 |

---

## 六、建议的迭代优先级

```
Phase 1 (工程基础) ────→ Phase 2 (内容/SEO) ────→ Phase 3 (体验) ────→ Phase 4 (国际化)
   1–2 周                    2–3 周                  2–3 周                  3–4 周
```

**立即行动（本周）**：
1. 引入 Vitest + 编写 3–5 个核心组件测试
2. CI Lint 强制执行
3. 创建 README.md

**短期目标（2 周内）**：
4. JSON-LD 结构化数据
5. Pagefind 搜索集成
6. 新增 2–3 篇博客

**中期目标（1 月内）**：
7. 暗色模式
8. 图片优化 (Picture 组件)
9. Giscus 评论集成
