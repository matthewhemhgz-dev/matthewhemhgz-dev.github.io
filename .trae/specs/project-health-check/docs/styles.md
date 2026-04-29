# 祈研所 Qi-Lab 样式规范文档

## 1. 样式系统概览

| 分类 | 说明 | 文件位置 |
|------|------|----------|
| 设计令牌 | CSS 变量定义 | `src/styles/base/tokens.css` |
| 深色令牌 | 深色模式变量 | `src/styles/base/dark-tokens.css` |
| 全局样式 | 基础样式重置 | `src/styles/base/global.css` |
| 排版样式 | 字体、字号、行高 | `src/styles/base/typography.css` |
| 组件样式 | 组件特定样式 | `src/styles/components/` |
| 区块样式 | 页面区块样式 | `src/styles/sections/` |
| 工具类 | 工具类样式 | `src/styles/utilities/` |

## 2. 设计令牌系统

### 2.1 命名规范

```
--qi-{category}-{name}[--{variant}]
```

**示例**:
- `--qi-bg-base` - 基础背景色
- `--qi-text-primary` - 主要文字色
- `--qi-brand-emerald` - 品牌翠绿色
- `--qi-space-xl` - 超大间距

### 2.2 颜色系统

#### 2.2.1 基础颜色

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-bg-base` | #f7f3ee | 页面背景色 |
| `--qi-bg-surface` | #ffffff | 卡片/表面背景 |
| `--qi-bg-overlay` | rgba(0,0,0,0.5) | 遮罩层 |
| `--qi-surface-main` | #2a2a2a | 深色表面 |
| `--qi-surface-sub` | #e8e3dd | 次级表面 |

#### 2.2.2 文字颜色

| 变量名 | 值 | 用途 | 对比度 |
|--------|-----|------|--------|
| `--qi-text-primary` | #1e1b18 | 主要文字 | 15.3:1 |
| `--qi-text-secondary` | #3d3832 | 次要文字 | 9.1:1 |
| `--qi-text-tertiary` | #4a453f | 三级文字 | 7.5:1 |
| `--qi-text-muted` | #6b655e | 弱化文字 | 5.3:1 |
| `--qi-text-inverse` | #f7f3ee | 反向文字 | - |

#### 2.2.3 品牌颜色

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-brand-emerald` | #22c55e | 主品牌色 |
| `--qi-brand-emerald-light` | #4ade80 | 浅翠绿色 |
| `--qi-brand-emerald-dark` | #16a34a | 深翠绿色 |
| `--qi-brand-mint` | #34d399 | 薄荷绿 |
| `--qi-brand-amber` | #f59e0b | 琥珀色 |
| `--qi-brand-amber-dark` | #d97706 | 深琥珀色 |

#### 2.2.4 功能颜色

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-color-success` | #16a34a | 成功状态 |
| `--qi-color-warning` | #d97706 | 警告状态 |
| `--qi-color-error` | #ef4444 | 错误状态 |
| `--qi-color-info` | #3b82f6 | 信息提示 |

#### 2.2.5 中性颜色

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-neutral-50` | #f8fafc | 最浅灰 |
| `--qi-neutral-100` | #f1f5f9 | 浅灰 |
| `--qi-neutral-200` | #e2e8f0 | 中浅灰 |
| `--qi-neutral-300` | #cbd5e1 | 中灰 |
| `--qi-neutral-400` | #94a3b8 | 中深灰 |
| `--qi-neutral-500` | #64748b | 深灰 |

### 2.3 间距系统

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-space-xs` | 0.25rem (4px) | 极小间距 |
| `--qi-space-sm` | 0.5rem (8px) | 小间距 |
| `--qi-space-md` | 1rem (16px) | 中等间距 |
| `--qi-space-lg` | 1.5rem (24px) | 大间距 |
| `--qi-space-xl` | 2rem (32px) | 超大间距 |
| `--qi-space-2xl` | 3rem (48px) | 2倍超大间距 |
| `--qi-space-3xl` | 4rem (64px) | 3倍超大间距 |
| `--qi-space-4xl` | 5rem (80px) | 4倍超大间距 |
| `--qi-space-5xl` | 6rem (96px) | 5倍超大间距 |

### 2.4 圆角系统

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-radius-sm` | 0.25rem (4px) | 小圆角 |
| `--qi-radius-md` | 0.5rem (8px) | 中等圆角 |
| `--qi-radius-lg` | 0.75rem (12px) | 大圆角 |
| `--qi-radius-xl` | 1rem (16px) | 超大圆角 |
| `--qi-radius-button` | 0.5rem (8px) | 按钮圆角 |
| `--qi-radius-card` | 1rem (16px) | 卡片圆角 |
| `--qi-radius-full` | 9999px | 完全圆角 |

### 2.5 阴影系统

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | 小阴影 |
| `--qi-shadow-md` | 0 4px 6px -1px rgba(0,0,0,0.1) | 中等阴影 |
| `--qi-shadow-lg` | 0 10px 15px -3px rgba(0,0,0,0.1) | 大阴影 |
| `--qi-shadow-xl` | 0 20px 25px -5px rgba(0,0,0,0.1) | 超大阴影 |
| `--qi-shadow-hover-warm` | 0 20px 40px -12px rgba(34, 197, 94, 0.2) | 悬停暖阴影 |

### 2.6 字体系统

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-font-sans` | 'Inter', system-ui, sans-serif | 无衬线字体 |
| `--qi-font-serif` | 'Noto Serif SC', Georgia, serif | 衬线字体 |
| `--qi-font-mono` | 'JetBrains Mono', monospace | 等宽字体 |

### 2.7 字号系统

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-text-xs` | 0.75rem (12px) | 极小文字 |
| `--qi-text-sm` | 0.875rem (14px) | 小文字 |
| `--qi-text-base` | 1rem (16px) | 基础文字 |
| `--qi-text-lg` | 1.125rem (18px) | 大文字 |
| `--qi-text-xl` | 1.25rem (20px) | 超大文字 |
| `--qi-text-2xl` | 1.5rem (24px) | 2倍超大 |
| `--qi-text-3xl` | 1.875rem (30px) | 3倍超大 |
| `--qi-text-4xl` | 2.25rem (36px) | 4倍超大 |

### 2.8 过渡动画

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-transition` | 0.3s ease | 默认过渡 |
| `--qi-transition-fast` | 0.15s ease | 快速过渡 |
| `--qi-transition-base` | 0.4s ease | 基础过渡 |

## 3. 深色模式

### 3.1 深色模式颜色对比

| 变量名 | 浅色模式 | 深色模式 |
|--------|----------|----------|
| `--qi-bg-base` | #f7f3ee | #121010 |
| `--qi-bg-surface` | #ffffff | #1a1816 |
| `--qi-surface-main` | #2a2a2a | #2a2621 |
| `--qi-surface-sub` | #e8e3dd | #1e1b18 |
| `--qi-text-primary` | #1e1b18 | #f7f3ee |
| `--qi-text-secondary` | #3d3832 | #c8c3bd |
| `--qi-text-muted` | #6b655e | #8a847e |
| `--qi-brand-emerald` | #22c55e | #6ee7b7 |
| `--qi-border-default` | #d6d0c8 | #3a3530 |

### 3.2 深色模式激活方式

1. **自动检测**: 通过 `prefers-color-scheme` 媒体查询
2. **手动切换**: 通过 `ThemeToggle` 组件切换
3. **状态存储**: localStorage 存储用户偏好

## 4. 响应式断点

| 断点 | 值 | 用途 |
|------|-----|------|
| `--qi-breakpoint-sm` | 640px | 移动端 |
| `--qi-breakpoint-md` | 768px | 平板端 |
| `--qi-breakpoint-lg` | 1024px | 桌面端 |
| `--qi-breakpoint-xl` | 1440px | 大屏幕 |

## 5. 布局系统

### 5.1 容器

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-container-max-width` | 1440px | 最大宽度 |
| `--qi-container-padding` | 1.5rem | 内边距 |

### 5.2 网格间距

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--qi-gap-bento` | 1.75rem (28px) | Bento 网格间距 |

## 6. 组件样式规范

### 6.1 按钮样式

| 状态 | 背景色 | 文字色 | 边框 |
|------|--------|--------|------|
| 默认 | 透明 | `--qi-text-primary` | `--qi-border-default` |
| 悬停 | `--qi-brand-emerald` | #fff | `--qi-brand-emerald` |
| 禁用 | `--qi-base-06` | `--qi-text-muted` | `--qi-border-subtle` |

### 6.2 卡片样式

| 属性 | 值 |
|------|-----|
| 背景 | `--qi-bg-surface` |
| 边框 | `--qi-border-default` |
| 圆角 | `--qi-radius-card` |
| 阴影 | `--qi-shadow-md` (悬停时 `--qi-shadow-lg`) |

### 6.3 输入框样式

| 属性 | 值 |
|------|-----|
| 背景 | `--qi-bg-surface` |
| 边框 | `--qi-border-default` |
| 聚焦边框 | `--qi-brand-emerald` |
| 圆角 | `--qi-radius-button` |

## 7. 样式文件组织

```
src/styles/
├── base/
│   ├── tokens.css          # 设计令牌
│   ├── dark-tokens.css     # 深色模式令牌
│   ├── global.css          # 全局样式重置
│   └── typography.css      # 排版样式
├── components/             # 组件样式
├── sections/               # 区块样式
│   ├── article.css         # 文章页面样式
│   ├── home-featured.css   # 精选区块样式
│   └── home-hero.css       # 英雄区样式
├── pages/                  # 页面样式
│   └── projects.css        # 项目页面样式
└── utilities/              # 工具类样式
    ├── code-blocks.css     # 代码块样式
    └── scrollbar.css       # 滚动条样式
```

---

**文档版本**: v1.0  
**创建日期**: 2026-04-28  
**适用项目**: qi-lab-site