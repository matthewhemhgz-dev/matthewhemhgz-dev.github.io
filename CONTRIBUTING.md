# 贡献指南

感谢您对祈研所项目的关注！本指南将帮助您了解如何为项目做出贡献。

## 目录

- [代码贡献](#代码贡献)
- [内容贡献](#内容贡献)
- [提交变更](#提交变更)
- [开发流程](#开发流程)
- [代码规范](#代码规范)

## 代码贡献

### 开发环境设置

1. 首先 Fork 本仓库
2. 克隆您的 Fork 仓库

```bash
git clone https://github.com/[您的用户名]/matthewhemhgz-dev.github.io.git
cd matthewhemhgz-dev.github.io
```

3. 安装依赖

```bash
npm install
```

4. 启动开发服务器

```bash
npm run dev
```

### 添加新组件

项目使用 Astro 组件架构。所有组件位于 `src/components/` 目录下：

- `global/`: 全局组件（导航、页脚等）
- `sections/`: 页面区块组件
- `ui/`: 通用 UI 组件
- `decorations/`: 装饰性组件

**创建新组件的步骤**：

1. 在合适的目录下创建 `.astro` 文件
2. 使用设计令牌保持样式一致性
3. 遵循组件命名规范（PascalCase）
4. 添加类型定义（如需要）
5. 编写相应的样式文件
6. 添加测试用例

### 修改样式

项目使用 CSS 自定义属性作为设计令牌：

- 主要样式文件位于 `src/styles/`
- 设计令牌定义在 `src/styles/base/tokens.css`
- 暗色模式令牌在 `src/styles/base/dark-tokens.css`

**样式修改原则**：
- 尽可能使用现有的设计令牌
- 如需新增令牌，先在 tokens.css 中定义
- 保持暗色模式的一致性

### 更新配置

- 项目主配置：`astro.config.mjs`
- TypeScript 配置：`tsconfig.json`
- ESLint 配置：`eslint.config.mjs`
- Prettier 配置：`.prettierrc`

## 内容贡献

### 添加新文章

1. 在 `src/data/blog/zh/` 创建中文文章
2. 在 `src/data/blog/en/` 创建对应英文翻译
3. 使用 Markdown 格式，遵循 Frontmatter 规范

**Frontmatter 示例**：

```markdown
---
title: "文章标题"
description: "文章描述"
pubDate: 2024-01-01
updatedDate: 2024-01-15
heroImage: "/images/article-cover.jpg"
tags: ["标签1", "标签2", "标签3"]
category: "文章分类"
author: "作者名称"
draft: false
lang: "zh"
---
```

### 文章写作规范

- 使用简洁明了的标题
- 文章开头添加摘要
- 使用小标题组织内容
- 代码块添加语言标识
- 图片使用优化后的格式
- 保持中英双语内容同步

### 添加标签

标签定义在 `src/data/tags.ts` 文件中。如需添加新标签，请更新该文件并确保：

- 标签名称清晰明了
- 提供中英文对应翻译
- 添加标签描述

### 添加项目信息

项目信息在 `src/data/projects.ts` 中管理。

## 提交变更

### 提交信息规范

使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**：
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**：
```
feat(blog): add new article about design tokens
fix(search): resolve search modal not closing issue
docs(readme): update contribution guide
```

### 提交前检查

确保在提交前运行以下检查：

```bash
npm run lint           # 代码检查
npm run format         # 代码格式化
npm test               # 运行单元测试
npm run build          # 构建测试
```

## 开发流程

### 分支策略

- `main`: 主分支，用于生产部署
- `feature/*`: 功能开发分支
- `fix/*`: Bug 修复分支
- `docs/*`: 文档更新分支

### Pull Request 流程

1. 从 main 分支创建新分支
2. 在新分支上进行开发
3. 提交并推送变更
4. 创建 Pull Request
5. 等待代码审查
6. 合并到 main 分支

### PR 描述模板

```markdown
## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化

## 变更描述
简要描述本次变更的内容...

## 相关 Issue
Closes #123

## 测试
- [ ] 单元测试已更新/添加
- [ ] 手动测试已完成
- [ ] 构建验证通过
```

## 代码规范

### TypeScript 规范

- 使用类型注解
- 避免使用 `any` 类型
- 使用接口定义对象结构
- 函数参数和返回值需要类型

### CSS 规范

- 使用 BEM 命名约定
- 优先使用设计令牌
- 保持样式文件模块化
- 添加必要的注释

### Astro 组件规范

- 组件使用 PascalCase 命名
- Props 类型定义
- 使用 `class:list` 处理动态类名
- 保持组件简洁和可复用

## 测试

### 单元测试

使用 Vitest 进行单元测试，测试文件位于 `src/test/`。

运行测试：
```bash
npm test
```

### 端到端测试

使用 Playwright 进行 E2E 测试，测试文件位于 `e2e/`。

运行 E2E 测试：
```bash
npm run test:e2e
```

## 寻求帮助

如果您在贡献过程中有任何问题：

- 查看文档：[README.md](./README.md)
- 提交 Issue 讨论
- 参与 Discussions 交流

感谢您的贡献！
