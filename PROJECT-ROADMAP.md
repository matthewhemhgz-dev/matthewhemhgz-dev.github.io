# 祈研所 Qi-Lab — 项目总结与迭代路线图

> 更新时间：2026-04-19 | 基于最新版本的完整审计状态

---

## 一、项目现状总览

### 1.1 技术架构

| 维度 | 现状 |
|------|------|
| **框架** | Astro 6.1.6，纯静态输出 (SSG) |
| **部署** | GitHub Pages (`matthewhemhgz-dev.github.io`) |
| **样式系统** | 原生 CSS，36 个文件，模块化架构 & 设计令牌驱动 |
| **交互脚本** | 原生 JS/TS，7 个文件，`astro:page-load` 事件驱动 |
| **搜索** | Pagefind 静态搜索，38 页索引，中文分词 |
| **内容管理** | Astro Content Layer (glob loader)，7 篇中文博客 |
| **CI/CD** | GitHub Actions (Lint + Test + Build + Size Check + Deploy) |
| **代码质量** | ESLint 9 + Prettier 3 + TypeScript strict + Vitest 15 tests |

### 1.2 项目规模

| 类别 | 数量 |
|------|------|
| 静态页面 | 38 个 |
| 组件 (.astro) | 25 个 |
| CSS 样式文件 | 36 个 |
| JS 脚本 | 7 个 |
| 博客文章 | 7 篇 (65,000+ 字) |
| 文章封面图 | 7 张 |
| 单元测试 | 15 个 |
| 设计令牌 | 338 行 (tokens.css) + 123 行 (dark-tokens.css) |

### 1.3 已完成的核心能力

| 能力域 | 状态 | 详情 |
|--------|------|------|
| **设计令牌系统** | ✅ 成熟 | 338 行 tokens，色彩/字体/间距/阴影/行高/字间距/display 字号全覆盖 |
| **暗色模式** | ✅ 完成 | 123 行 dark-tokens，主题切换，localStorage 持久化 |
| **静态搜索** | ✅ 完成 | Pagefind 30 页索引，Cmd+K 弹窗，中文分词 |
| **响应式适配** | ✅ 成熟 | 7 断点 (480–3440px)，`--qi-font-scaled-*` 2K/4K 字体缩放 |
| **View Transitions** | ✅ 成熟 | ClientRouter + 自定义过渡动画 |
| **SEO 基础** | ✅ 成熟 | meta/OG/Twitter Card/canonical/sitemap/robots.txt/RSS/JSON-LD |
| **可访问性** | ✅ 成熟 | skip-link / h1 层级 / alt / aria / reduced-motion (8 动画覆盖) |
| **3D 交互** | ✅ 成熟 | tilt-card / cursor-glow / particles |
| **滚动动效** | ✅ 成熟 | parallax / scroll-triggered / nav collapse / back-to-top |
| **代码质量** | ✅ 成熟 | 15 单元测试 + CI 质量门禁 + 构建产物预算检查 |
| **内容质量** | ✅ 良好 | 7 篇深度文章，Mermaid 图表，知识图谱网络 |
| **视觉设计** | ✅ 良好 | 聚光灯 Hero，浮动装饰卡片，杂志风格封面图，Testimonials 墙 |

---

## 二、迭代路线图 — 完成进度

### Phase 1：工程基础加固 ✅ 100%

| 任务 | 状态 | 说明 |
|------|------|------|
| Vitest 测试框架 | ✅ | 15 个单元测试 |
| Playwright E2E 测试 | ✅ | 14 个端到端测试 |
| CI Lint 强制执行 | ✅ | ESLint 失败阻止部署 |
| CI 测试步骤 | ✅ | GitHub Actions test 步骤 |
| 构建产物大小检查 | ✅ | 6 类别 6MB 预算 |
| README.md | ✅ | 项目介绍、技术栈、开发指南 |
| CHANGELOG.md | ✅ | 完整变更记录 |
| PROJECT-ROADMAP.md | ✅ | 路线图 + 能力缺口 |

### Phase 2：内容与 SEO 增强 ✅ 100%

| 任务 | 状态 | 说明 |
|------|------|------|
| JSON-LD 结构化数据 | ✅ | WebSite + Article schema |
| 文章 OG 标签增强 | ✅ | og:type/article:author 等 |
| OptimizedImage 组件 | ✅ | width/height 防止 CLS |
| 文章 heroImage | ✅ | 7 篇文章均有封面图 |
| 阅读时间计算 | ✅ | 中英文字数自动计算 |
| 博客内容扩充 | ✅ | 7 篇深度文章 (65,000+ 字) |

### Phase 3：用户体验升级 ✅ 85%

| 任务 | 状态 | 说明 |
|------|------|------|
| Pagefind 搜索 | ✅ | 38 页索引，Cmd+K，中文分词 |
| 暗色模式 | ✅ | 123 行暗色令牌，主题切换 |
| 代码块复制按钮 | ✅ | hover 显示，剪贴板 API |
| Giscus 评论 | ⏭️ 跳过 | 需启用 GitHub Discussions |
| 联系表单 | ⏭️ 待定 | 可用 Formspree/Getform |
| 文章分享按钮 | ⏭️ 待定 | 微信/微博/Twitter |

### Phase 4：国际化与进阶 🛠️ 实施中

| 任务 | 状态 | 说明 |
|------|------|------|
| 英文版本 | 🛠️ | 基础路由与核心页面 (Home/About) 已就绪 |
| 性能监控 | ⏭️ | 待集成 Umami/Plausible |
| PWA 支持 | ⏭️ | 待添加 manifest + Service Worker |
| Newsletter | ⏭️ | 待定 (Buttondown/Revue) |

---

## 三、质量基线（当前）

| 指标 | 值 |
|------|-----|
| 静态页面 | 38 个 |
| 博客文章 | 7 篇 (65,000+ 字) |
| 单元测试 | 15 passing |
| 构建时间 | ~6.0s |
| 构建产物 | 4.3 MB / 6 MB 预算 |
| Pagefind 索引 | 38 页 |
| 设计令牌 | 338 行 (亮色) + 123 行 (暗色) |
| CSS 文件 | 36 个 (均 ≤500 行) |
| 组件文件 | 25 个 (均 ≤300 行) |

---

## 四、后续建议

### 短期（持续）
1. **新增博客文章** — 每月 1-2 篇，持续丰富内容
2. **平台链接完善** — 将更多平台链接到实际内容

### 中期（1-2 月）
3. **联系表单** — 集成 Formspree 等静态表单服务
4. **性能监控** — 集成 Umami 或 Plausible 分析
5. **项目展示页** — 独立的 Projects/Works 页面

### 长期（3+ 月）
6. **英文版本** — i18n 路由 + 文章翻译
7. **PWA 支持** — 离线访问能力
