# Changelog

本文件记录祈研所 Qi-Lab 网站的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [Unreleased]

### 新增
- **阅读时间计算** — 自动根据中英文字数计算文章阅读时间，显示在文章详情页和博客列表
- **阅读时间单元测试** — 10 个测试覆盖空内容、中文、英文、混合、代码块、图片等边界情况

## [2026-04-18] — Phase 1 工程基础 + Phase 2 SEO

### 新增
- **Vitest 测试框架** — 引入 Vitest + happy-dom，配置 `getViteConfig()` 集成
- **CardTilt 单元测试** — 5 个测试覆盖指针检测、事件绑定、销毁清理
- **Playwright E2E 测试** — 14 个端到端测试覆盖首页渲染、导航流程、404 页面、链接完整性
- **CI 测试步骤** — GitHub Actions 中添加 `npm run test` 步骤，Lint 失败阻止部署
- **README.md** — 项目介绍、技术栈、快速开始、目录结构、设计系统说明
- **PROJECT-ROADMAP.md** — 4 阶段路线图、16 个能力缺口、5 项技术债务
- **JSON-LD 结构化数据** — 首页 WebSite + Organization schema，文章页 Article schema
- **文章 OG 标签增强** — `og:type=article`、`article:author` meta 标签

### 修复
- **E2E 标签筛选选择器** — 使用 `.tag-link` 类精确选择，避免匹配文章卡片
- **tsconfig 冗余配置** — 移除无用的 `jsx: "react-jsx"` 和 `jsxImportSource: "react"`

### 变更
- **CI Lint 强制执行** — 移除 `continue-on-error: true`，ESLint 失败现在阻止部署

## [2026-04-17] — Round 23: 生产质量加固

### 新增
- **全局约束系统** — 18 项检查（CSS ≤500 行、组件 ≤300 行、令牌覆盖率、无孤立资源等）

### 重构
- **CSS 文件拆分** — `home-hero.css` 拆出 `home-hero-decorations.css`（143 行）
- **Navigation.astro 样式外提** — 340→67 行，样式移至 `navigation.css`（279 行）
- **Footer.astro 样式外提** — 314→81 行，样式移至 `footer.css`（240 行）

### 修复
- **硬编码间距替换** — `reset.css`、`about.css`、`home-cta.css` 中的硬编码 px 值替换为 `var(--qi-space-*)`
- **标签页 h1 缺失** — `/tags/index.astro` 添加 `<h1 class="sr-only">标签</h1>`
- **孤立资源清理** — 删除未使用的 `hero-placeholder.svg`

## [2026-04-16] — Round 22: 全面审计收尾

### 修复
- 12 项审计修复（响应式断点、令牌覆盖率、可访问性、代码质量等）

## [2026-04-15] — Round 21: 令牌系统完善 + 大屏交互优化

### 新增
- `--qi-font-scaled-*` 响应式字体缩放令牌（2K/4K 显示器适配）
- 大屏交互优化（cursor-glow、particles 性能提升）

## [2026-04-14] — Round 20: 多视口响应式修复

### 修复
- 375px 小屏、1920px 标准、2560px 2K 视口响应式适配
- CTA 颜色过渡、Footer 分隔线视觉修复

## [2026-04-13] — Round 19: 遗留任务收尾 + 令牌系统完善

### 新增
- 设计令牌系统扩展（色彩、字体、间距、阴影、层级）

## [2026-04-12] — Round 18: 全局标准合规 + Logo 替换

### 变更
- Logo 替换为 SVG 版本
- 全局 CSS 标准合规审查

## [2026-04-11] — Round 17: 动效系统升级

### 新增
- 动画系统升级（滚动触发、视差效果、导航折叠）
- 截图 Bug 修复

## [2026-04-10] — Round 16: 视觉系统重构

### 变更
- 色阶扩展、光效增强、暖墨棕引入
- 纸质纹理背景系统

---

## 早期版本 (Round 1–15)

> 以下为项目初期迭代的简要记录，详细变更请查看 Git 历史。

- **Round 15**: 导航栏重叠修复、纸质纹理增强、光效优化
- **Round 14**: 导航栏和 Footer 完整样式恢复、Logo 内联 SVG
- **Round 13**: 多专家审查修复、视觉升级（Logo/光效/装饰）
- **Round 12**: SVG Logo、粒子系统修复、背景特效优化、全面质量审计
- **Round 11**: Logo 升级、纸张纹理、Keystatic CMS（后移除）
- **Round 10**: 粒子系统修复、SVG Logo、全站响应式设计重建
- **Round 9**: 全局一致性审计修复（30+ 问题）
- **Round 8**: 视觉设计系统级优化（光效美学、品牌冲击力）
- **Round 7**: 背景动效增强、全站大屏适配、Mermaid 集成
- **Round 6**: 融合顶级网站设计精髓
- **Round 5**: Creative fusion + micro-bug fixes
- **Round 4**: Design tokens、布局重构、大屏适配、工程化
- **Round 3**: 浮动导航、大屏适配、文件拆分
- **Round 2**: CSS/JS 拆分、scroll-snap 全屏翻页
- **v4.0**: Astro 重构 + 两轮多专家审查（78 项改进）
- **v3.x**: 多专家评审高密度重构、动效系统、粒子背景
- **v2.x**: 高密度布局、PPT 式翻页、Cloudflare/CodeBuddy 最佳实践
- **v1.0**: 祈研所 Qi-Lab 个人站点初始版本（Amber Geek 模板）
