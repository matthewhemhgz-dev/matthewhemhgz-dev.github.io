# 祈研所视觉层次设计规范

## 概述

本规范定义了祈研所网站的系统化页面层次设计体系，确保全站视觉一致性和良好的用户体验。

---

## 1. 间距系统

### 1.1 设计原则

基于 **8px 倍数** 的间距体系，确保视觉节奏的一致性和代码的可维护性。

### 1.2 间距令牌

| 令牌 | 值 | 等效像素 | 用途 |
|------|-----|----------|------|
| `--qi-space-0` | 0 | 0px | 无间距 |
| `--qi-space-1` | 0.125rem | 2px | 极细微间距 |
| `--qi-space-2` | 0.25rem | 4px | 微小间距 |
| `--qi-space-3` | 0.375rem | 6px | 微间距 |
| `--qi-space-4` | 0.5rem | 8px | 基础间距 |
| `--qi-space-5` | 0.625rem | 10px | 基础+间距 |
| `--qi-space-6` | 0.75rem | 12px | 中等间距 |
| `--qi-space-8` | 1rem | 16px | 标准间距 |
| `--qi-space-10` | 1.25rem | 20px | 中等+间距 |
| `--qi-space-12` | 1.5rem | 24px | 大间距 |
| `--qi-space-14` | 1.75rem | 28px | 大+间距 |
| `--qi-space-16` | 2rem | 32px | 超大间距 |
| `--qi-space-20` | 2.5rem | 40px | 巨型间距 |
| `--qi-space-24` | 3rem | 48px | 模块间距 |
| `--qi-space-32` | 4rem | 64px | 区块间距 |
| `--qi-space-48` | 6rem | 96px | 大区块间距 |
| `--qi-space-64` | 8rem | 128px | 超大区块间距 |

### 1.3 使用规范

- **内边距**：使用 `--qi-space-4` 至 `--qi-space-12`
- **外边距**：使用 `--qi-space-8` 至 `--qi-space-24`
- **模块间距**：使用 `--qi-space-24` 至 `--qi-space-48`
- **卡片间距**：使用 `--qi-space-6` 至 `--qi-space-12`

---

## 2. 字体层级规范

### 2.1 字体家族

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--qi-font-serif` | Noto Serif SC, Georgia, serif | 标题、装饰性文字 |
| `--qi-font-sans` | PingFang SC, Helvetica Neue, sans-serif | 正文、UI文字 |
| `--qi-font-mono` | Fira Code, Consolas, monospace | 代码、等宽文字 |

### 2.2 字号层级

| 层级 | 令牌 | 值 | 等效像素 | 用途 |
|------|------|-----|----------|------|
| H1 | `--qi-text-6xl` | 3.75rem | 60px | 页面主标题 |
| H2 | `--qi-text-5xl` | 3rem | 48px | 区块标题 |
| H3 | `--qi-text-4xl` | 2.25rem | 36px | 子区块标题 |
| H4 | `--qi-text-3xl` | 1.875rem | 30px | 卡片标题 |
| H5 | `--qi-text-2xl` | 1.5rem | 24px | 小节标题 |
| H6 | `--qi-text-xl` | 1.25rem | 20px | 内容标题 |
| 正文 | `--qi-text-base` | 1rem | 16px | 主要内容 |
| 正文+ | `--qi-text-lg` | 1.125rem | 18px | 强调正文 |
| 辅助 | `--qi-text-sm` | 0.875rem | 14px | 辅助文字 |
| 小字 | `--qi-text-xs` | 0.75rem | 12px | 提示、标签 |

### 2.3 字重规范

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--qi-weight-normal` | 400 (浅色) / 350 (深色) | 正文 |
| `--qi-weight-medium` | 500 (浅色) / 450 (深色) | 次要标题 |
| `--qi-weight-semibold` | 600 (浅色) / 550 (深色) | 主要标题 |
| `--qi-weight-bold` | 700 (浅色) / 650 (深色) | 强调文字 |

> **设计说明**：深色模式下字重稍减，避免"发光"模糊效果

### 2.4 行高与字间距

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--qi-leading-tight` | 1.1 | 大标题 |
| `--qi-leading-snug` | 1.3 | 小标题 |
| `--qi-leading-normal` | 1.7 | 正文 |
| `--qi-leading-relaxed` | 1.9 | 长文本 |
| `--qi-leading-loose` | 2.1 | 极长文本 |

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--qi-tracking-tight` | -0.03em | 标题紧缩 |
| `--qi-tracking-normal` | 0.02em | 正文 |
| `--qi-tracking-wide` | 0.06em | 大写文字 |
| `--qi-tracking-wider` | 0.08em | 标签 |
| `--qi-tracking-widest` | 0.12em | 装饰性文字 |

---

## 3. 色彩系统

### 3.1 色彩架构

```
色彩系统
├── 主色 (Emerald)
├── 辅色 (Amber + Mint)
├── 中性色 (Neutral)
└── 功能色 (Success/Warning/Error/Info)
```

### 3.2 主色 - Emerald (翠绿色)

| 令牌 | 颜色 | 用途 |
|------|------|------|
| `--qi-emerald-50` | #f0fdf4 | 背景高亮 |
| `--qi-emerald-100` | #dcfce7 | 浅背景 |
| `--qi-emerald-200` | #bbf7d0 | 悬停状态 |
| `--qi-emerald-300` | #86efac | 按钮 |
| `--qi-emerald-400` | #4ade80 | 主要交互 |
| `--qi-emerald-500` | #22c55e | **品牌主色** |
| `--qi-emerald-600` | #16a34a | 深色按钮 |
| `--qi-emerald-700` | #15803d | 文字强调 |
| `--qi-emerald-800` | #166534 | 标题文字 |
| `--qi-emerald-900` | #14532d | 深色文字 |

### 3.3 辅色 - Amber (琥珀色)

| 令牌 | 颜色 | 用途 |
|------|------|------|
| `--qi-amber-400` | #fbbf24 | 强调、警告 |
| `--qi-amber-500` | #f59e0b | 主要强调 |

### 3.4 辅色 - Mint (薄荷色)

| 令牌 | 颜色 | 用途 |
|------|------|------|
| `--qi-mint-400` | #2dd4bf | 清新、次要强调 |
| `--qi-mint-500` | #14b8a6 | 次要品牌色 |

### 3.5 中性色体系

| 令牌 | 颜色 | 用途 |
|------|------|------|
| `--qi-neutral-50` | #fafaf9 | 页面背景 |
| `--qi-neutral-100` | #f5f5f4 | 卡片背景 |
| `--qi-neutral-200` | #e7e5e4 | 分隔线 |
| `--qi-neutral-300` | #d6d3d1 | 边框 |
| `--qi-neutral-400` | #a8a29e | 辅助文字 |
| `--qi-neutral-500` | #78716c | 次要文字 |
| `--qi-neutral-600` | #57534e | 正文 |
| `--qi-neutral-700` | #44403c | 主要文字 |
| `--qi-neutral-800` | #292524 | 标题文字 |
| `--qi-neutral-900` | #1c1917 | 深文字 |

### 3.6 功能色

| 类型 | 令牌 | 颜色 | 用途 |
|------|------|------|------|
| Success | `--qi-success-500` | #22c55e | 成功状态 |
| Warning | `--qi-warning-500` | #f59e0b | 警告提示 |
| Error | `--qi-error-500` | #ef4444 | 错误提示 |
| Info | `--qi-info-500` | #3b82f6 | 信息提示 |

### 3.7 文本颜色规范

| 令牌 | 浅色模式 | 深色模式 | 用途 |
|------|----------|----------|------|
| `--qi-text-primary` | #1e1b18 | #ffffff | 主要文字 |
| `--qi-text-secondary` | #3d3832 | #d4cdc3 | 次要文字 |
| `--qi-text-muted` | #6b655f | #9a9590 | 辅助文字 |
| `--qi-text-dim` | #9a9590 | #7a7570 | 禁用文字 |

### 3.8 背景与表面

| 令牌 | 浅色模式 | 深色模式 | 用途 |
|------|----------|----------|------|
| `--qi-bg-base` | #f7f3ee | #121010 | 页面背景 |
| `--qi-bg-canvas` | #ffffff | #1a1714 | 画布背景 |
| `--qi-surface-card` | #ffffff | #1e1b18 | 卡片背景 |
| `--qi-surface-hover` | #f0ebe5 | #2a2621 | 悬停背景 |
| `--qi-surface-active` | #e8e3dd | #35302b | 激活背景 |

---

## 4. 阴影层级

### 4.1 5级阴影体系

| 层级 | 令牌 | 效果描述 | 用途 |
|------|------|----------|------|
| Level 1 | `--qi-shadow-1` | 微阴影，几乎不可见 | 卡片悬浮、按钮悬停 |
| Level 2 | `--qi-shadow-2` | 基础阴影，轻微凸起 | 卡片、模态框基础 |
| Level 3 | `--qi-shadow-3` | 中等阴影，明显凸起 | 下拉菜单、弹出层 |
| Level 4 | `--qi-shadow-4` | 深度阴影，强烈凸起 | 模态框、悬浮卡片 |
| Level 5 | `--qi-shadow-5` | 强烈阴影，显著分离 | 全屏模态框、重要弹窗 |

### 4.2 阴影规范

```css
/* Level 1 */
--qi-shadow-1: 0 1px 2px 0 rgba(42, 42, 42, 0.05), 0 1px 3px -1px rgba(42, 42, 42, 0.05);

/* Level 2 */
--qi-shadow-2: 0 4px 6px -1px rgba(42, 42, 42, 0.08), 0 2px 4px -2px rgba(42, 42, 42, 0.05);

/* Level 3 */
--qi-shadow-3: 0 10px 15px -3px rgba(42, 42, 42, 0.1), 0 4px 6px -4px rgba(42, 42, 42, 0.05);

/* Level 4 */
--qi-shadow-4: 0 20px 25px -5px rgba(42, 42, 42, 0.1), 0 8px 10px -6px rgba(42, 42, 42, 0.05);

/* Level 5 */
--qi-shadow-5: 0 25px 50px -12px rgba(42, 42, 42, 0.15), 0 12px 16px -8px rgba(42, 42, 42, 0.08);
```

---

## 5. 圆角规范

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--qi-radius-none` | 0 | 直角 |
| `--qi-radius-xs` | 4px | 小按钮、输入框 |
| `--qi-radius-sm` | 6px | 按钮、小卡片 |
| `--qi-radius-md` | 8px | 按钮、卡片 |
| `--qi-radius-lg` | 12px | 卡片、弹窗 |
| `--qi-radius-xl` | 16px | 大卡片、模态框 |
| `--qi-radius-2xl` | 20px | 大容器 |
| `--qi-radius-full` | 9999px | 圆形按钮、头像 |

---

## 6. Z-Index 层级

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--qi-z-base` | 1 | 基础内容 |
| `--qi-z-content` | 2 | 内容层 |
| `--qi-z-nav` | 1000 | 导航栏 |
| `--qi-z-noise` | 9995 | 噪点层 |
| `--qi-z-overlay` | 9998 | 遮罩层 |
| `--qi-z-back-top` | 9999 | 返回顶部 |
| `--qi-z-skip-link` | 10000 | 跳过链接 |
| `--qi-z-progress` | 10001 | 进度条 |

---

## 7. 玻璃拟态效果

| 令牌 | 浅色模式 | 深色模式 |
|------|----------|----------|
| `--qi-glass-bg` | rgba(255,255,255,0.7) | rgba(30,27,24,0.7) |
| `--qi-glass-border` | rgba(255,255,255,0.2) | rgba(255,255,255,0.1) |
| `--qi-glass-backdrop` | blur(10px) | blur(10px) |

---

## 8. 动画过渡

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--qi-transition-fast` | 0.15s ease | 快速交互 |
| `--qi-transition` | 0.25s ease | 标准过渡 |
| `--qi-transition-base` | 0.3s ease | 基础过渡 |
| `--qi-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | 弹性效果 |
| `--qi-spring-soft` | cubic-bezier(0.22, 1.2, 0.36, 1) | 柔和弹性 |

---

## 附录：设计令牌文件结构

```
src/styles/base/
├── tokens.css          # 浅色模式设计令牌
└── dark-tokens.css     # 深色模式设计令牌
```

---

**文档版本**: 1.0  
**创建日期**: 2026-04-28  
**关联文档**: [site_iteration_execution_plan.md](site_iteration_execution_plan.md)
