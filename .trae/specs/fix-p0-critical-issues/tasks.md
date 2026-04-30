# Tasks

- [x] Task 1: 修复博客文章 heroImage 路径格式错误
  - [x] SubTask 1.1: 分析所有博客文章的 heroImage 路径格式
  - [x] SubTask 1.2: 创建批量修复脚本或手动修复所有文章
  - [x] SubTask 1.3: 验证修复后的路径格式正确
  - [x] SubTask 1.4: 测试 OG 图片加载是否正常

- [x] Task 2: 完善移动端菜单可访问性
  - [x] SubTask 2.1: 分析 Navigation.astro 现有代码
  - [x] SubTask 2.2: 添加菜单打开时聚焦第一个菜单项
  - [x] SubTask 2.3: 实现焦点陷阱 (focus trap)
  - [x] SubTask 2.4: 验证 ESC 键关闭功能
  - [x] SubTask 2.5: 验证关闭菜单时焦点返回触发按钮
  - [x] SubTask 2.6: 测试键盘导航完整性

- [x] Task 3: 验证并修复相关文章链接格式
  - [x] SubTask 3.1: 分析 RelatedArticles.astro 代码逻辑
  - [x] SubTask 3.2: 在开发环境验证链接生成是否正确
  - [x] SubTask 3.3: 如有问题，修复链接生成逻辑
  - [x] SubTask 3.4: 测试中英文博客的相关文章链接

- [x] Task 4: 验证搜索模态框可访问性
  - [x] SubTask 4.1: 分析 SearchModal.astro 现有代码
  - [x] SubTask 4.2: 测试焦点陷阱功能
  - [x] SubTask 4.3: 测试 ESC 键关闭功能
  - [x] SubTask 4.4: 测试焦点返回功能
  - [x] SubTask 4.5: 如有问题，进行修复

- [x] Task 5: 全局测试和验证
  - [x] SubTask 5.1: 运行 `npm run lint` 检查代码质量
  - [x] SubTask 5.2: 运行 `npm run test` 执行单元测试
  - [x] SubTask 5.3: 运行 `npm run build` 验证构建成功
  - [x] SubTask 5.4: 本地预览验证所有修改
  - [x] SubTask 5.5: 使用浏览器测试关键用户流程

- [x] Task 6: 更新 Issue 追踪文档
  - [x] SubTask 6.1: 标记已完成的 Issue
  - [x] SubTask 6.2: 记录修复详情和验证结果

# Task Dependencies
- [Task 2] depends on [Task 1] (先完成简单任务建立信心)
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1, Task 2, Task 3, Task 4]
- [Task 6] depends on [Task 5]

# 并行执行
- Task 1, Task 2, Task 3, Task 4 可以并行执行（无依赖关系）
- Task 5 必须在所有修复任务完成后执行