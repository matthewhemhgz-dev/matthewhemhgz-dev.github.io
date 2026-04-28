# 祈研所 Qi-Lab 依赖清单

## 1. 依赖概览

| 分类 | 数量 | 说明 |
|------|------|------|
| dependencies | 7 | 生产环境依赖 |
| devDependencies | 18 | 开发环境依赖 |
| 总计 | 25 | 所有依赖 |

## 2. 生产环境依赖 (dependencies)

| 依赖名称 | 版本 | 用途 | 状态 |
|----------|------|------|------|
| `@astrojs/mdx` | ^5.0.3 | MDX 支持 | 活跃 |
| `@astrojs/rss` | ^4.0.18 | RSS 订阅生成 | 活跃 |
| `@astrojs/sitemap` | ^3.7.2 | 站点地图生成 | 活跃 |
| `astro` | ^6.1.6 | 核心框架 | 活跃 |
| `astro-pagefind` | ^1.8.6 | 静态全文搜索集成 | 活跃 |
| `pagefind` | ^1.5.2 | 静态搜索库 | 活跃 |
| `sharp` | ^0.34.5 | 图片处理 | 活跃 |

### 2.1 依赖详细说明

#### 2.1.1 Astro 核心及插件

- **astro** (^6.1.6)
  - Astro 6 静态站点生成框架
  - 支持 Islands Architecture
  - 零 JS 默认配置

- **@astrojs/mdx** (^5.0.3)
  - MDX 语法支持
  - 允许在 Markdown 中使用 JSX 组件

- **@astrojs/rss** (^4.0.18)
  - RSS 订阅源生成
  - 自动生成博客文章的 RSS feed

- **@astrojs/sitemap** (^3.7.2)
  - 站点地图自动生成
  - 支持多语言站点

#### 2.1.2 搜索功能

- **pagefind** (^1.5.2)
  - 静态全文搜索库
  - 支持中文分词
  - 客户端搜索，无需服务器

- **astro-pagefind** (^1.8.6)
  - Pagefind 的 Astro 集成插件
  - 构建时自动生成搜索索引

#### 2.1.3 图片处理

- **sharp** (^0.34.5)
  - 高性能图片处理库
  - 支持 WebP、AVIF 等现代格式
  - 自动图片优化

## 3. 开发环境依赖 (devDependencies)

| 依赖名称 | 版本 | 用途 | 状态 |
|----------|------|------|------|
| `@astrojs/tailwind` | ^5.1.0 | Tailwind CSS 集成 | 活跃 |
| `@axe-core/playwright` | ^4.11.2 | 可访问性测试 | 活跃 |
| `@eslint/js` | ^9.0.0 | ESLint 核心 | 活跃 |
| `@playwright/test` | ^1.59.1 | 端到端测试 | 活跃 |
| `@tailwindcss/postcss` | ^4.2.2 | Tailwind CSS 4.x 集成 | 活跃 |
| `@vite-pwa/astro` | ^1.2.0 | PWA 支持 | 活跃 |
| `eslint` | ^9.0.0 | 代码质量检查 | 活跃 |
| `eslint-plugin-astro` | ^1.0.0 | Astro ESLint 插件 | 活跃 |
| `happy-dom` | ^20.9.0 | DOM 模拟（测试） | 活跃 |
| `jsdom` | ^29.0.2 | DOM 模拟（测试） | 活跃 |
| `lighthouse` | ^13.1.0 | 性能审计 | 活跃 |
| `prettier` | ^3.0.0 | 代码格式化 | 活跃 |
| `prettier-plugin-astro` | ^0.14.0 | Astro 格式化插件 | 活跃 |
| `tailwindcss` | ^3.4.13 | Tailwind CSS 框架 | 活跃 |
| `typescript` | ^6.0.3 | TypeScript 支持 | 活跃 |
| `typescript-eslint` | ^8.0.0 | TypeScript ESLint | 活跃 |
| `vite-plugin-pwa` | ^1.2.0 | Vite PWA 插件 | 活跃 |
| `vitest` | ^3.2.4 | 单元测试框架 | 活跃 |
| `workbox-window` | ^7.4.0 | PWA 离线支持 | 活跃 |

### 3.1 依赖详细说明

#### 3.1.1 样式处理

- **tailwindcss** (^3.4.13)
  - Tailwind CSS 原子化框架
  - 支持自定义主题和设计令牌

- **@astrojs/tailwind** (^5.1.0)
  - Astro 与 Tailwind CSS 集成

- **@tailwindcss/postcss** (^4.2.2)
  - Tailwind CSS 4.x PostCSS 插件

#### 3.1.2 代码质量

- **eslint** (^9.0.0)
  - JavaScript/TypeScript 代码检查

- **@eslint/js** (^9.0.0)
  - ESLint 核心规则集

- **eslint-plugin-astro** (^1.0.0)
  - Astro 组件 ESLint 规则

- **typescript-eslint** (^8.0.0)
  - TypeScript ESLint 规则

- **prettier** (^3.0.0)
  - 代码格式化工具

- **prettier-plugin-astro** (^0.14.0)
  - Astro 文件格式化

#### 3.1.3 测试工具

- **vitest** (^3.2.4)
  - 单元测试框架
  - 支持 TypeScript

- **@playwright/test** (^1.59.1)
  - 端到端测试框架
  - 支持多浏览器

- **@axe-core/playwright** (^4.11.2)
  - 可访问性测试集成

- **happy-dom** (^20.9.0)
  - DOM 模拟环境

- **jsdom** (^29.0.2)
  - DOM 模拟环境

#### 3.1.4 性能与 PWA

- **lighthouse** (^13.1.0)
  - 性能审计工具

- **@vite-pwa/astro** (^1.2.0)
  - Astro PWA 集成

- **vite-plugin-pwa** (^1.2.0)
  - Vite PWA 插件

- **workbox-window** (^7.4.0)
  - Service Worker 管理

#### 3.1.5 类型支持

- **typescript** (^6.0.3)
  - TypeScript 编译器

## 4. 依赖关系图

```
astro
├── @astrojs/mdx
├── @astrojs/rss
├── @astrojs/sitemap
├── astro-pagefind → pagefind
└── sharp

devDependencies
├── @astrojs/tailwind → tailwindcss
├── @tailwindcss/postcss → tailwindcss
├── @vite-pwa/astro → vite-plugin-pwa → workbox-window
├── eslint
│   ├── @eslint/js
│   ├── eslint-plugin-astro
│   └── typescript-eslint
├── prettier → prettier-plugin-astro
├── @playwright/test → @axe-core/playwright
├── vitest → happy-dom / jsdom
└── lighthouse
```

## 5. 依赖更新策略

| 依赖类型 | 更新频率 | 策略 |
|----------|----------|------|
| Astro 核心 | 每季度 | 跟随主版本更新 |
| Tailwind CSS | 每季度 | 跟随主版本更新 |
| 测试工具 | 每月 | 定期更新 |
| 代码质量工具 | 每月 | 定期更新 |
| 性能工具 | 每月 | 定期更新 |

## 6. 潜在问题与风险

### 6.1 版本兼容性

| 依赖 | 潜在问题 | 风险等级 |
|------|----------|----------|
| `@tailwindcss/postcss` | 4.x 版本与旧版 Tailwind 不兼容 | 中 |
| `typescript-eslint` | 8.x 版本需要 ESLint 9.x | 低 |

### 6.2 安全风险

- 当前所有依赖均已通过 `npm audit` 检查
- 建议定期运行 `npm audit` 检查安全漏洞

## 7. 依赖优化建议

1. **移除未使用依赖**: 检查并清理未使用的开发依赖
2. **锁定版本**: 考虑使用 `package-lock.json` 锁定版本以确保构建一致性
3. **定期更新**: 建立定期依赖更新机制

---

**文档版本**: v1.0  
**创建日期**: 2026-04-28  
**适用项目**: qi-lab-site