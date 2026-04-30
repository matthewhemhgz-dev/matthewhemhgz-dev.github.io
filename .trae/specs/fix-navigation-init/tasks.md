# 任务列表：修复文章导航组件初始化问题

## 任务总览
- [ ] 任务 1: 修复 TableOfContents 组件初始化
- [ ] 任务 2: 修复 ReadingProgress 组件初始化
- [ ] 任务 3: 修复 OnPageNav 组件初始化
- [ ] 任务 4: 运行测试验证
- [ ] 任务 5: 构建并推送代码

## 详细任务

### 任务 1: 修复 TableOfContents 组件初始化
- [ ] 1.1: 添加 scrollHandler 变量和 ticking 状态
- [ ] 1.2: 创建 cleanupTableOfContents 清理函数
- [ ] 1.3: 修改事件监听器为 astro:page-load + astro:before-swap
- [ ] 1.4: 添加 setTimeout 延迟初始化

### 任务 2: 修复 ReadingProgress 组件初始化
- [ ] 2.1: 确保 cleanupReadingProgress 函数完整
- [ ] 2.2: 修改事件监听器为 astro:page-load + astro:before-swap
- [ ] 2.3: 添加 setTimeout 延迟初始化

### 任务 3: 修复 OnPageNav 组件初始化
- [ ] 3.1: 添加 scrollHandler 变量
- [ ] 3.2: 创建 cleanupOnPageNav 清理函数
- [ ] 3.3: 修改事件监听器为 astro:page-load + astro:before-swap
- [ ] 3.4: 添加 setTimeout 延迟初始化

### 任务 4: 运行测试验证
- [ ] 4.1: 运行 npm run lint 检查代码质量
- [ ] 4.2: 运行 npm run test 验证测试通过
- [ ] 4.3: 运行 npm run build 验证构建成功

### 任务 5: 构建并推送代码
- [ ] 5.1: Git add 和 commit
- [ ] 5.2: Git push 到 main 分支
