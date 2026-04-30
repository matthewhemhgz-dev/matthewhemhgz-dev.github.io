# Tasks

- [x] Task 1: 添加 x-default hreflang 标签
  - [x] SubTask 1.1: 分析 BaseLayout.astro 现有 hreflang 实现
  - [x] SubTask 1.2: 添加 x-default hreflang 标签
  - [x] SubTask 1.3: 验证多语言页面的 hreflang 配置

- [x] Task 2: 完善 Article schema 结构化数据
  - [x] SubTask 2.1: 分析博客详情页现有 schema
  - [x] SubTask 2.2: 补充 mainEntityOfPage、wordCount、articleBody、speakable 字段
  - [x] SubTask 2.3: 验证 schema 正确性

- [x] Task 3: 优化 Logo 图片
  - [x] SubTask 3.1: 检查现有 Logo 文件
  - [x] SubTask 3.2: 确认 SVG 版本已存在
  - [x] SubTask 3.3: 标记为已验证，无需额外修改
  - [x] SubTask 3.4: 更新引用 Logo 的组件

- [x] Task 4: 添加筛选按钮 aria-pressed 状态
  - [x] SubTask 4.1: 查找所有筛选按钮组件
  - [x] SubTask 4.2: 添加 aria-pressed 属性
  - [x] SubTask 4.3: 实现状态切换逻辑
  - [x] SubTask 4.4: 验证屏幕阅读器兼容性

- [x] Task 5: 全局测试和验证
  - [x] SubTask 5.1: 运行 `npm run lint` 检查代码质量
  - [x] SubTask 5.2: 运行 `npm run test` 执行单元测试
  - [x] SubTask 5.3: 运行 `npm run build` 验证构建成功

- [x] Task 6: 更新 Issue 追踪文档
  - [x] SubTask 6.1: 标记已完成的 Issue
  - [x] SubTask 6.2: 记录修复详情

# Task Dependencies
- 所有任务可并行执行
- Task 5 必须在所有修复任务完成后执行

# 并行执行
- Task 1, Task 2, Task 3, Task 4 可以并行执行