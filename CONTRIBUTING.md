# 贡献指南

欢迎为祈研所 (Qi-Lab) 项目做出贡献！本指南将帮助你了解如何参与项目开发，包括代码贡献、问题报告、功能请求等。

## 目录

- [贡献指南](#贡献指南)
  - [目录](#目录)
  - [行为准则](#行为准则)
  - [如何贡献](#如何贡献)
    - [报告问题](#报告问题)
    - [提出功能请求](#提出功能请求)
    - [代码贡献](#代码贡献)
  - [开发环境设置](#开发环境设置)
  - [代码风格](#代码风格)
  - [提交规范](#提交规范)
  - [测试](#测试)
  - [文档](#文档)
  - [发布流程](#发布流程)
  - [许可证](#许可证)

## 行为准则

参与本项目的所有贡献者都应遵守以下行为准则：

- 尊重其他贡献者，避免使用冒犯性语言或行为
- 接受建设性批评，保持开放心态
- 关注社区最佳利益，而非个人或公司利益
- 对新贡献者保持友好和包容的态度

## 如何贡献

### 报告问题

如果你发现了 bug 或其他问题，请在 GitHub Issues 中报告。报告问题时，请提供以下信息：

1. 问题的详细描述
2. 重现步骤
3. 预期行为
4. 实际行为
5. 环境信息（浏览器、操作系统等）
6. 相关截图或错误信息

### 提出功能请求

如果你有新功能的想法，请在 GitHub Issues 中提出功能请求。提出功能请求时，请提供以下信息：

1. 功能的详细描述
2. 功能的使用场景
3. 功能的预期行为
4. 相关设计或实现建议

### 代码贡献

1. **Fork 仓库**：在 GitHub 上 fork 本项目到你的个人账号
2. **克隆仓库**：将 fork 后的仓库克隆到本地
   ```bash
   git clone https://github.com/你的用户名/matthewhemhgz-dev.github.io.git
   cd matthewhemhgz-dev.github.io
   ```
3. **创建分支**：从 `main` 分支创建一个新的分支
   ```bash
   git checkout -b feature/你的功能名称
   ```
4. **安装依赖**：
   ```bash
   npm install
   ```
5. **开发**：实现你的功能或修复 bug
6. **测试**：确保你的代码通过所有测试
   ```bash
   npm test
   ```
7. **提交代码**：使用规范的提交信息
   ```bash
   git add .
   git commit -m "feat: 功能描述"  # 或 fix: 修复描述
   ```
8. **推送代码**：将你的分支推送到 GitHub
   ```bash
   git push origin feature/你的功能名称
   ```
9. **创建 Pull Request**：在 GitHub 上创建一个新的 Pull Request，描述你的更改

## 开发环境设置

### 前置要求

- Node.js >= 20.0.0
- npm >= 10.0.0

### 安装

```bash
git clone https://github.com/matthewhemhgz-dev/matthewhemhgz-dev.github.io.git
cd matthewhemhgz-dev.github.io
npm install
```

### 开发命令

- `npm run dev` - 启动开发服务器 (localhost:4321)
- `npm run build` - 生产构建
- `npm run preview` - 预览构建产物
- `npm run lint` - ESLint 检查
- `npm run format` - Prettier 格式化
- `npm run test` - Vitest 单元测试
- `npm run size-check` - 构建产物大小检查
- `npm run lighthouse` - Lighthouse 性能审计

## 代码风格

- **JavaScript/TypeScript**：使用 ESLint 和 Prettier 保持代码风格一致
- **CSS**：使用设计令牌系统，遵循项目的样式规范
- **Astro 组件**：遵循 Astro 的最佳实践，保持组件简洁明了

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范提交信息：

- `feat: 新功能`
- `fix: 修复 bug`
- `docs: 文档更新`
- `style: 代码风格调整`
- `refactor: 代码重构`
- `test: 测试相关`
- `chore: 构建或依赖更新`

## 测试

- **单元测试**：使用 Vitest 编写单元测试，确保代码质量
- **端到端测试**：使用 Playwright 进行端到端测试，确保功能正常
- **性能测试**：使用 Lighthouse 进行性能测试，确保网站性能良好

## 文档

- **代码注释**：为关键组件和函数添加清晰的 JSDoc 注释
- **项目文档**：更新 README.md 和其他项目文档，确保信息准确
- **架构文档**：参考 ARCHITECTURE.md 了解项目架构

## 发布流程

1. 确保所有测试通过
2. 更新 CHANGELOG.md，记录版本变更
3. 运行 `npm run build`，确保构建成功
4. 部署到 GitHub Pages

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](./LICENSE) 文件。