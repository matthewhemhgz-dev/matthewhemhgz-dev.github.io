# 祈研所设计模式检查清单

> 本文档记录项目的设计规范和开发约定，确保长期维护的一致性。每次修改代码前应参考此清单。

## 1. 颜色使用规范

- **所有颜色必须使用 `var(--qi-*)` 设计令牌**，禁止硬编码 `rgba()` 或 `#hex` 值
- 品牌色：`var(--qi-brand-emerald)` / `var(--qi-brand-amber)`
- 透明度：使用 `var(--qi-brand-emerald-10)` 等预定义令牌，或 `color-mix()` 函数
- 深色背景文字：使用 `var(--qi-inverse-70)` 等反转色令牌
- 基础色透明度：使用 `var(--qi-base-06)` 等基础色令牌
- **例外**：JS Canvas API 中的颜色值暂不替换（Canvas 不支持 CSS 变量）

## 2. 间距使用规范

- **所有间距必须使用 `var(--qi-space-*)` 令牌**
- 可用令牌：`xs`(4px), `sm`(8px), `md`(12px), `lg`(16px), `xl`(24px), `2xl`(32px), `3xl`(48px), `4xl`(64px), `5xl`(96px), `6xl`(128px)
- 禁止硬编码 `px` 值作为间距（如 `padding: 16px` → `padding: var(--qi-space-lg)`）

## 3. 圆角使用规范

- 使用 `var(--qi-radius-full)` 替代 `border-radius: 9999px`
- 可用令牌：`sm`(6px), `md`(8px), `lg`(12px), `xl`(16px), `card`, `button`, `full`

## 4. 组件规范

- 新组件必须包含 scoped CSS（`<style>` 块），不依赖外部 CSS 文件
- 组件 props 必须有 TypeScript 类型定义
- 图标使用 `src/data/icons.ts` 中的共享 SVG 图标映射
- Section 组件的 label 使用 `.section-label` 共享类

## 5. 无障碍规范

- 所有交互元素必须有 `aria-label`
- 外部链接（`target="_blank"`）必须标注 `(opens in new window)`
- 语言切换链接必须有 `lang` 属性
- 进度条等自定义组件必须有 `role` 和 `aria-valuenow`
- 页面只能有一个 `<main>` 元素（BaseLayout 已包含）

## 6. JavaScript 规范

- **所有事件监听器必须提供清理函数**
- 页面切换时（`astro:page-load`）必须先清理旧监听器再重新初始化
- 类组件（如 MinimalParticles）必须实现 `destroy()` 方法
- 使用 `cleanupFns` 数组模式管理多个清理函数
- 尊重 `prefers-reduced-motion` 媒体查询

## 7. i18n 规范

- zh/en 页面必须保持视觉对等（布局、样式、组件结构一致）
- 文案差异除外（翻译内容可以不同）
- 404 页面、blog 页面、tags 页面都必须有对等的 zh/en 版本
- 首页 Section 数量和顺序必须一致

## 8. CSS 架构规范

- 设计令牌定义在 `src/styles/tokens.css`
- 页面级 CSS 按需导入（不在 BaseLayout 全局导入）
- `home.css` 仅导入首页使用的子 CSS 文件
- `about.css` 仅导入关于页使用的子 CSS 文件
- blog、tags、404 页面的样式使用 scoped CSS

## 9. 文件大小规范

- 单个文件不超过 500 行
- 超过 300 行的组件应考虑拆分
- CSS 文件按功能模块拆分（如 home-hero.css, home-featured.css）

## 10. 新增 Section 检查清单

添加新的首页 Section 时，确保：

- [ ] 组件文件在 `src/components/sections/` 下
- [ ] 样式文件在 `src/styles/home-{name}.css` 下
- [ ] 在 `home.css` 中添加 `@import`
- [ ] 在 `index.astro` 和 `en/index.astro` 中同步添加
- [ ] 使用 `.section-label` 作为 label 样式
- [ ] 使用设计令牌而非硬编码值
- [ ] 添加 `data-reveal` 属性以启用滚动显示动画
- [ ] 响应式适配（mobile + tablet + desktop）
