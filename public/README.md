# 📦 资源文件存储规划

本目录存放项目的所有静态资源文件，包括图片、视频、图标等。

## 📂 目录结构

```
public/
├── blog/                                    # 博客文章相关图片
│   ├── [文章ID].png                    # 博客封面图（1200x675)
│   └── ...
│
├── images/                                 # 图片素材
│   ├── logo/                              # 品牌 Logo
│   ├── social/                            # 社交媒体素材
│   │   ├── wechat-oa-qr.jpg            # 微信公众号二维码
│   │   ├── xhs-qr.jpg                  # 小红书二维码
│   │   └── douyin-qr.jpg               # 抖音二维码
│   │
│   ├── projects/                          # 项目相关素材
│   │   ├── [项目ID].png              # 项目封面图（推荐800x600)
│   │   ├── [项目ID]-preview.gif      # 项目预览动图
│   │   ├── [项目ID]-preview.mp4      # 项目预览视频
│   │   └── [项目ID]-screens/       # 项目截图文件夹
│   │       ├── screenshot-1.png
│   │       └── ...
│   │
│   ├── pages/                            # 页面专用素材
│   │   ├── hero/                        # Hero 区域素材
│   │   └── [页面名称]/
│   │
│   └── illustrations/                     # 插图素材
│       ├── abstract/
│       └── icons/
│
├── icons/                                  # 图标资源
│   ├── pwa/                               # PWA 图标
│   │   ├── pwa-192x192.svg
│   │   └── pwa-512x512.svg
│   │
│   └── social/                            # 社交媒体图标
│
├── videos/                                 # 视频素材
│   ├── hero/                               # Hero 视频背景
│   └── demos/                         # 演示视频
│
└── [其他根级资源文件
    ├── favicon.ico                          # 站点图标
    ├── og-default.png                    # 默认 Open Graph 图片
    ├── robots.txt                            # SEO 文件
    └── service-worker.js                   # PWA Service Worker
```

## 📋 文件命名规范

### 通用规则
- 使用 kebab-case（短横线命名）
- 文件名全部小写
- 单词间用短横线 `-` 分隔
- 使用有意义的描述性名称

### 图片文件命名格式

| 类型 | 格式 | 示例 |
|------|------|
| 项目封面图 | `[项目ID].png` | `qi-lab.png` |
| 项目预览图 | `[项目ID]-preview.[gif|mp4]` | `qi-lab-preview.gif` |
| 博客封面图 | `[博客文章ID].png` | `design-tokens-best-practices.png` |
| 截图 | `screenshot-[序号].png` | `screenshot-1.png` |

## 📐 图片尺寸规范

### 推荐尺寸

| 用途 | 推荐尺寸 | 格式 |
|------|---------|
| 博客封面图 | 1200x675px | PNG |
| 项目封面图 | 800x600px | PNG |
| Open Graph 图 | 1200x630px | PNG |
| PWA 图标 | 192x192px, 512x512px | SVG/PNG |
| Hero 视频 | 1920x1080px | MP4 |

## 🗂️ 项目素材示例

基于 `src/data/projects.ts` 中的项目列表，对应的素材路径规划：

### 祈研所 (qi-lab)
- 封面图: `/images/projects/qi-lab.png`
- 预览图: `/images/projects/qi-lab-preview.gif`

### 知识图谱 (knowledge-graph)
- 封面图: `/images/projects/knowledge-graph.png`

### 设计系统 (design-system)
- 封面图: `/images/projects/design-system.png`

### AI 助手 (ai-assistant)
- 封面图: `/images/projects/ai-assistant.png`

### 卡片盒笔记 (zettelkasten)
- 封面图: `/images/projects/zettelkasten.png`

### 性能优化 (performance)
- 封面图: `/images/projects/performance.png`

## 📝 注意事项

1. **图片优化**：使用 WebP 格式获得更好的压缩效果
2. **文件大小**：单张图片建议不超过 500KB，视频不超过 10MB
3. **Alt 占位**：确保所有图片都有相应的描述性 Alt 文本
4. **版本控制**：.gitkeep 文件用于确保空文件夹被 Git 跟踪
5. **响应式**：使用 OptimizedImage 组件来处理图片加载和优化

