# 祈研所网站迭代 - 任务执行计划

## 任务概述

根据 [site_architecture_analysis_plan.md](file:///workspace/.trae/documents/site_architecture_analysis_plan.md) 的分析框架，以下是可分配给多专家执行的详细任务。

---

## 任务 1: 博客详情页优化 - 字体、行高、阅读体验

| 属性 | 内容 |
|------|------|
| **优先级** | P0 |
| **专家类型** | 前端开发 + UI/UX 设计 |
| **预估时间** | 4-6 小时 |

### 任务描述
优化博客文章的阅读体验，提升整体文字可读性。

### 验收标准
- [ ] 字体层级清晰（标题、副标题、正文、代码块）
- [ ] 行高调整为 1.6-1.8 之间，适合中文阅读
- [ ] 段落间距优化（段落之间有足够的呼吸空间）
- [ ] 代码块可读性提升（字体、配色、语法高亮）
- [ ] 相关文章卡片样式优化（已修复对比度问题）

### 相关文件
- [article.css](file:///workspace/src/styles/sections/article.css)
- [base/tokens.css](file:///workspace/src/styles/base/tokens.css)
- [blog/[slug].astro](file:///workspace/src/pages/blog/[slug].astro)

### 优化要点
1. 正文字体大小：16-18px
2. 标题层级：H1-H6 要有明显的字号差异
3. 行高：正文 1.75，标题 1.3-1.4
4. 段落间距：1.5em-2em
5. 图片居中显示，有适当的边距

---

## 任务 2: 独立项目页面开发 - 完善项目展示功能

| 属性 | 内容 |
|------|------|
| **优先级** | P0 |
| **专家类型** | 前端开发 + 内容策略 |
| **预估时间** | 6-8 小时 |

### 任务描述
创建独立的项目展示页面，从首页完全分离项目模块。

### 验收标准
- [ ] `/projects` 路由页面（中英文版本）
- [ ] 项目筛选功能（按技术栈、类型）
- [ ] 项目详情页面（点击项目卡片跳转）
- [ ] 导航菜单更新（添加独立项目入口）
- [ ] 响应式设计（移动端适配）

### 相关文件
- [data/projects.ts](file:///workspace/src/data/projects.ts)（已存在）
- [components/sections/ProjectsSection.astro](file:///workspace/src/components/sections/ProjectsSection.astro)（已存在）
- 需要创建：`pages/projects.astro`
- 需要创建：`pages/en/projects.astro`

### 功能需求
1. 项目列表网格布局
2. 技术栈标签筛选
3. 项目详情模态页或独立页面
4. GitHub 链接和在线演示链接
5. 项目截图展示

---

## 任务 3: 关于页面丰富 - 添加品牌故事、团队介绍

| 属性 | 内容 |
|------|------|
| **优先级** | P1 |
| **专家类型** | 内容策略 + UI/UX 设计 |
| **预估时间** | 3-4 小时 |

### 任务描述
丰富关于页面内容，讲述祈研所的品牌故事和理念。

### 验收标准
- [ ] 品牌历史和愿景介绍
- [ ] 核心价值观展示
- [ ] 技术栈介绍
- [ ] 联系方式优化
- [ ] 页面视觉设计提升

### 相关文件
- [about.astro](file:///workspace/src/pages/about.astro)
- [en/about.astro](file:///workspace/src/pages/en/about.astro)

### 内容建议
1. 祈研所的起源故事
2. 设计理念和方法论
3. 使用的工具和技术栈
4. 联系方式和社交媒体链接
5. 贡献指南（如果有开源项目）

---

## 任务 4: 标签页面优化 - 改进信息层级和导航结构

| 属性 | 内容 |
|------|------|
| **优先级** | P1 |
| **专家类型** | 前端开发 + 信息架构 |
| **预估时间** | 3-4 小时 |

### 任务描述
优化标签页面的信息展示和导航体验。

### 验收标准
- [ ] 标签云可视化展示
- [ ] 文章数量统计显示
- [ ] 按使用频率排序功能
- [ ] 搜索和筛选功能
- [ ] 页面布局优化

### 相关文件
- [tags/index.astro](file:///workspace/src/pages/tags/index.astro)
- [tags/[tag].astro](file:///workspace/src/pages/tags/[tag].astro)
- [pages/tag.css](file:///workspace/src/styles/pages/tag.css)

### 优化要点
1. 标签大小根据文章数量动态变化
2. 热门标签高亮显示
3. 按字母和热度两种排序方式
4. 单个标签页面的文章列表优化

---

## 任务 5: 完整博客与项目分离实现 - 创建独立的项目路由

| 属性 | 内容 |
|------|------|
| **优先级** | P1 |
| **专家类型** | 前端架构 + 全栈开发 |
| **预估时间** | 5-6 小时 |

### 任务描述
完成博客与项目的完整分离，实现清晰的信息架构。

### 验收标准
- [ ] 独立的项目路由（/projects）
- [ ] 首页项目展示指向独立页面
- [ ] 导航菜单清晰区分博客和项目
- [ ] 面包屑导航优化
- [ ] sitemap 更新

### 相关文件
- [astro.config.mjs](file:///workspace/astro.config.mjs)
- [content.config.ts](file:///workspace/src/content.config.ts)
- 需要创建项目内容集合（可选）

### 实现要点
1. 创建项目内容集合（使用 Astro Content Collections）
2. 设计项目数据 schema
3. 更新导航逻辑
4. 确保 SEO 元数据正确配置

---

## 执行顺序建议

1. **第一阶段**：任务 1（博客详情页优化）和 任务 2（独立项目页面）
2. **第二阶段**：任务 5（完整分离实现）
3. **第三阶段**：任务 3（关于页面）和 任务 4（标签页面）

---

## 技术栈参考

| 技术 | 用途 |
|------|------|
| Astro 4.x | 静态站点生成 |
| TypeScript | 类型安全 |
| CSS Custom Properties | 设计令牌系统 |
| Preact | 交互组件（可选） |

---

## 提交要求

每个任务完成后：
1. 运行 `npm run build` 确保构建通过
2. 运行 `npm run test` 确保测试通过
3. 创建独立的 PR 或分支
4. 更新相关文档（如有必要）
5. 提交清晰的 commit 信息

---

**文档版本**: 1.0
**创建日期**: 2026-04-28
**关联文档**: [site_architecture_analysis_plan.md](file:///workspace/.trae/documents/site_architecture_analysis_plan.md)
