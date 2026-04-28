# 祈研所（Qi-Lab）设计系统规范

## 概述

本设计系统为祈研所网站提供统一的设计令牌（Design Tokens）规范，确保全站视觉一致性和可维护性。

---

## 1. 颜色系统

### 1.1 设计原则

- **语义化命名**：颜色令牌应反映其用途而非具体值
- **主题适配**：所有颜色应支持亮色/暗色主题
- **对比度合规**：确保符合 WCAG AA 标准

### 1.2 颜色分类

| 分类 | 前缀 | 用途 |
|------|------|------|
| 背景 | `qi-bg-*` | 页面背景、卡片背景等 |
| 表面 | `qi-surface-*` | 容器表面、可交互区域 |
| 品牌 | `qi-brand-*` | 品牌主色调（emerald、amber、mint） |
| 语义 | `qi-color-*` | 功能色（primary、secondary、accent） |
| 状态 | `qi-color-{success/warning/error/info}` | 状态指示 |
| 文本 | `qi-text-*` | 文本颜色 |
| 边框 | `qi-border-*` | 边框和分隔线 |
| 中性 | `qi-neutral-*` | 中性色阶（50-900） |

### 1.3 品牌颜色

```css
/* 主色调 - Emerald */
--qi-brand-emerald      /* 品牌主色 */
--qi-brand-emerald-light  /* 亮色变体 */
--qi-brand-emerald-dark   /* 暗色变体 */

/* 辅助色 - Amber */
--qi-brand-amber        /* 品牌辅助色 */
--qi-brand-amber-light
--qi-brand-amber-dark

/* 强调色 - Mint */
--qi-brand-mint         /* 品牌强调色 */
--qi-brand-mint-light
--qi-brand-mint-dark
```

### 1.4 状态颜色使用规范

| 状态 | 使用场景 |
|------|----------|
| `qi-color-success` | 成功操作、完成状态、积极反馈 |
| `qi-color-warning` | 警告提示、需要注意、待处理 |
| `qi-color-error` | 错误状态、失败操作、危险提示 |
| `qi-color-info` | 信息提示、帮助文本、说明 |

---

## 2. 排版系统

### 2.1 字体家族

| 令牌 | 字体栈 | 用途 |
|------|--------|------|
| `qi-font-sans` | 无衬线字体 | 正文、UI元素 |
| `qi-font-serif` | 衬线字体 | 标题、引用、强调文本 |
| `qi-font-mono` | 等宽字体 | 代码、数据展示 |

### 2.2 字体粗细

```css
--qi-font-extralight: 200
--qi-font-light: 300
--qi-font-normal: 400      /* 正文 */
--qi-font-medium: 500      /* 按钮、标签 */
--qi-font-semibold: 600    /* 标题、强调 */
--qi-font-bold: 700        /* 重要标题 */
--qi-font-extrabold: 800   /* 最大标题 */
```

### 2.3 字体大小比例

| 令牌 | 大小 | 用途 |
|------|------|------|
| `qi-text-2xs` | 10px | 极小号文本、状态栏 |
| `qi-text-xs` | 12px | 标签、辅助文字 |
| `qi-text-sm` | 14px | 小号正文、表单 |
| `qi-text-base` | 16px | 正文基准 |
| `qi-text-lg` | 18px | 大号正文 |
| `qi-text-xl` | 20px | 小标题 |
| `qi-text-2xl` | 24px | H6 |
| `qi-text-3xl` | 30px | H5 |
| `qi-text-4xl` | 36px | H4 |
| `qi-text-5xl` | 48px | H3 |
| `qi-text-6xl` | 60px | H2 |
| `qi-text-7xl` | 72px | H1 |
| `qi-text-8xl` | 88px | 展示性标题 |
| `qi-text-9xl` | 104px | 超大展示标题 |

### 2.4 行高规范

| 令牌 | 值 | 用途 |
|------|-----|------|
| `qi-leading-tight` | 1.1 | 大标题、紧凑文本 |
| `qi-leading-snug` | 1.25 | 小标题、标签 |
| `qi-leading-normal` | 1.5 | 正文、段落 |
| `qi-leading-relaxed` | 1.625 | 长文本、阅读内容 |
| `qi-leading-loose` | 2 | 宽松文本、表单 |

### 2.5 字间距规范

| 令牌 | 值 | 用途 |
|------|-----|------|
| `qi-tracking-tightest` | -0.05em | 紧凑标题 |
| `qi-tracking-tight` | -0.03em | 小标题 |
| `qi-tracking-normal` | 0 | 正文 |
| `qi-tracking-wide` | 0.02em | 大号文本 |
| `qi-tracking-wider` | 0.04em | 标签、按钮 |
| `qi-tracking-widest` | 0.1em | 装饰性文本 |

---

## 3. 间距系统

### 3.1 基准单位

所有间距基于 **8px** 基准单位，使用 `rem` 实现响应式缩放。

### 3.2 间距令牌

| 令牌 | 像素 | 用途 |
|------|------|------|
| `qi-space-1` | 4px | 极窄间距 |
| `qi-space-2` | 8px | 小间距 |
| `qi-space-3` | 12px | 较小间距 |
| `qi-space-4` | 16px | 基准间距 |
| `qi-space-5` | 20px | 中等间距 |
| `qi-space-6` | 24px | 较大间距 |
| `qi-space-8` | 32px | 大间距 |
| `qi-space-10` | 40px | 更大间距 |
| `qi-space-12` | 48px | 模块间距 |
| `qi-space-16` | 64px | 大模块间距 |
| `qi-space-20` | 80px | 超大间距 |
| `qi-space-24` | 96px | 页面级间距 |

### 3.3 间距别名

```css
--qi-space-xs: var(--qi-space-1)
--qi-space-sm: var(--qi-space-2)
--qi-space-md: var(--qi-space-4)
--qi-space-lg: var(--qi-space-6)
--qi-space-xl: var(--qi-space-8)
--qi-space-2xl: var(--qi-space-12)
--qi-space-3xl: var(--qi-space-16)
--qi-space-4xl: var(--qi-space-24)
```

---

## 4. 圆角系统

| 令牌 | 大小 | 用途 |
|------|------|------|
| `qi-radius-none` | 0 | 直角 |
| `qi-radius-sm` | 6px | 小元素（输入框、按钮） |
| `qi-radius-md` | 8px | 中等元素（卡片、弹窗） |
| `qi-radius-lg` | 12px | 较大元素（卡片、模态框） |
| `qi-radius-xl` | 16px | 大卡片、容器 |
| `qi-radius-2xl` | 24px | 大型容器 |
| `qi-radius-3xl` | 32px | 超大容器 |
| `qi-radius-full` | 9999px | 圆形 |

---

## 5. 阴影系统

### 5.1 阴影层级

| 令牌 | 用途 |
|------|------|
| `qi-shadow-xs` | 内联元素、轻微悬浮 |
| `qi-shadow-sm` | 卡片默认、按钮 |
| `qi-shadow-md` | 卡片悬停、下拉菜单 |
| `qi-shadow-lg` | 模态框、浮层 |
| `qi-shadow-xl` | 大型浮层、导航 |
| `qi-shadow-2xl` | 重要浮层 |
| `qi-shadow-3xl` | 最大浮层 |

### 5.2 交互阴影

```css
--qi-shadow-hover      /* 悬停状态 */
--qi-shadow-hover-warm /* 暖色悬停效果 */
--qi-shadow-inset      /* 内阴影 */
```

---

## 6. Z-Index 系统

| 令牌 | 值 | 用途 |
|------|-----|------|
| `qi-z-base` | 1 | 默认层级 |
| `qi-z-content` | 2 | 内容层级 |
| `qi-z-overlay` | 100 | 遮罩层 |
| `qi-z-modal` | 200 | 模态框 |
| `qi-z-nav` | 300 | 导航栏 |
| `qi-z-toast` | 400 | 提示框 |
| `qi-z-back-top` | 500 | 返回顶部 |
| `qi-z-skip-link` | 600 | 跳过链接 |
| `qi-z-progress` | 700 | 进度条 |
| `qi-z-noise` | 1000 | 噪点层 |

---

## 7. 组件令牌

### 7.1 卡片组件

```css
--qi-card-bg: var(--qi-bg-surface)
--qi-card-border: var(--qi-border-light)
--qi-card-shadow: var(--qi-shadow-md)
--qi-card-radius: var(--qi-radius-xl)
--qi-card-padding: var(--qi-space-6)
```

### 7.2 按钮组件

```css
/* 主按钮 */
--qi-btn-primary-bg: var(--qi-color-primary)
--qi-btn-primary-text: var(--qi-text-on-primary)
--qi-btn-primary-hover: var(--qi-color-primary-hover)

/* 次要按钮 */
--qi-btn-secondary-bg: var(--qi-bg-surface)
--qi-btn-secondary-text: var(--qi-text-primary)
--qi-btn-secondary-border: var(--qi-border-medium)

/* 轮廓按钮 */
--qi-btn-outline-bg: transparent
--qi-btn-outline-text: var(--qi-color-primary)
--qi-btn-outline-border: var(--qi-color-primary)

/* 通用 */
--qi-btn-radius: var(--qi-radius-lg)
--qi-btn-font-weight: var(--qi-font-medium)
```

### 7.3 输入组件

```css
--qi-input-bg: var(--qi-bg-surface)
--qi-input-border: var(--qi-border-medium)
--qi-input-border-focus: var(--qi-border-focus)
--qi-input-text: var(--qi-text-primary)
--qi-input-placeholder: var(--qi-text-dim)
--qi-input-radius: var(--qi-radius-md)
--qi-input-padding: var(--qi-space-3) var(--qi-space-4)
```

---

## 8. 动画系统

### 8.1 过渡时长

| 令牌 | 值 | 用途 |
|------|-----|------|
| `qi-transition-fast` | 0.15s | 快速交互（悬停、点击） |
| `qi-transition-normal` | 0.25s | 标准过渡 |
| `qi-transition-slow` | 0.35s | 较慢过渡 |

### 8.2 缓动函数

| 令牌 | 曲线 | 用途 |
|------|------|------|
| `qi-ease-linear` | linear | 匀速动画 |
| `qi-ease-ease` | ease | 默认 |
| `qi-ease-standard` | cubic-bezier(0.25, 0.1, 0.25, 1) | 标准缓动 |
| `qi-ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | 弹簧效果 |
| `qi-ease-physical` | cubic-bezier(0.25, 0.46, 0.18, 1.25) | 物理弹簧 |

---

## 9. 响应式断点

| 令牌 | 宽度 | 设备 |
|------|------|------|
| `qi-breakpoint-xs` | 360px | 超小屏 |
| `qi-breakpoint-sm` | 640px | 手机 |
| `qi-breakpoint-md` | 768px | 平板 |
| `qi-breakpoint-lg` | 1024px | 笔记本 |
| `qi-breakpoint-xl` | 1280px | 桌面 |
| `qi-breakpoint-2xl` | 1536px | 大屏 |
| `qi-breakpoint-3xl` | 1920px | 2K屏 |
| `qi-breakpoint-4xl` | 2560px | 4K屏 |
| `qi-breakpoint-5xl` | 3440px | 超宽屏 |

---

## 10. 命名规范

### 10.1 令牌命名模式

```
qi-{类别}-{名称}-{状态/变体}
```

**示例：**
- `qi-bg-base` - 背景基础色
- `qi-text-primary` - 文本主色
- `qi-color-success-light` - 成功状态亮色
- `qi-shadow-md` - 中等阴影

### 10.2 颜色色阶命名

使用数字 50-950 表示颜色深浅：
- 50：最浅
- 100-400：浅色范围
- 500：基准色
- 600-900：深色范围
- 950：最深

---

## 11. 使用指南

### 11.1 CSS 变量使用

```css
/* 正确：使用语义化令牌 */
.element {
  background-color: var(--qi-bg-surface);
  color: var(--qi-text-primary);
  padding: var(--qi-space-4);
  border-radius: var(--qi-radius-lg);
}

/* 错误：直接使用硬编码值 */
.element {
  background-color: #ffffff; /* 应使用 var(--qi-bg-surface) */
  padding: 16px; /* 应使用 var(--qi-space-4) */
}
```

### 11.2 主题适配

```css
/* 亮色主题默认值 */
:root {
  --qi-bg-base: #f7f3ee;
}

/* 暗色主题覆盖 */
.dark {
  --qi-bg-base: #121010;
}
```

### 11.3 响应式缩放

```css
.element {
  font-size: calc(var(--qi-text-base) * var(--qi-font-scale, 1));
  padding: calc(var(--qi-space-4) * var(--qi-spacing-scale, 1));
}
```

---

## 12. 中英文排版差异

### 12.1 字体栈

中文使用 `Noto Serif SC` 和 `PingFang SC`，英文使用系统无衬线字体。

### 12.2 行高差异

- **中文**：行高通常在 1.6-1.8 之间
- **英文**：行高通常在 1.4-1.6 之间

### 12.3 字间距

- 中文通常不需要额外字间距
- 英文标题可适当增加字间距提升可读性

---

## 附录：令牌完整清单

### 颜色令牌数量
- 品牌颜色：3 个主色 × 3 个变体 = 9 个
- 状态颜色：4 个状态 × 3 个变体 = 12 个
- 文本颜色：6 个基础 + 4 个 on-dark = 10 个
- 中性色：10 个（50-900）
- 扩展色：4 个色系 × 11 个色阶 = 44 个
- 边框颜色：7 个
- 透明度变体：20+ 个

### 排版令牌数量
- 字体家族：3 个
- 字体粗细：8 个
- 字体大小：13 个
- 行高：5 个
- 字间距：6 个
- 排版别名：11 个

### 布局令牌数量
- 间距：20 个
- 圆角：8 个
- 阴影：11 个
- Z-Index：10 个

---

**版本**: v1.0  
**更新日期**: 2024  
**维护者**: Qi-Lab Team