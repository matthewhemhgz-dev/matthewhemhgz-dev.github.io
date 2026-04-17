# 祈研所 | Qi-Lab

> 探索技术、设计与创意的交汇之处

个人品牌网站，基于 Astro 构建，部署于 GitHub Pages。

## 技术栈

- **框架**: [Astro](https://astro.build) v5 (Static Site Generation)
- **样式**: CSS Custom Properties + Scoped Styles
- **动画**: CSS View Transitions + Canvas Particles + IntersectionObserver
- **部署**: GitHub Pages via GitHub Actions
- **内容**: Astro Content Layer API (Markdown)

## 项目结构

```
src/
├── components/       # 组件（global/ui）
├── content/          # Markdown 博客内容
├── i18n/             # 国际化配置
├── layouts/          # 页面布局
├── pages/            # 路由页面（zh + /en/）
├── scripts/          # 客户端脚本
└── styles/           # 全局样式 + 设计令牌
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 设计系统

基于 **Amber Geek** 设计语言，核心色彩：

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--qi-bg-base` | `#F7F3EE` | 燕麦灰背景 |
| `--qi-text-primary` | `#2A2A2A` | 炭黑文字 |
| `--qi-brand-emerald` | `#2E7D5C` | 祖母绿强调 |
| `--qi-brand-amber` | `#E5A93C` | 琥珀金点缀 |

## 许可

MIT
