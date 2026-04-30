# 验证清单：修复文章导航组件初始化问题

## 代码实现检查

- [ ] TableOfContents.astro 包含 scrollHandler 变量声明
- [ ] TableOfContents.astro 包含 cleanupTableOfContents 函数
- [ ] TableOfContents.astro 监听 astro:page-load 事件
- [ ] TableOfContents.astro 监听 astro:before-swap 事件
- [ ] TableOfContents.astro 使用 setTimeout 延迟初始化

- [ ] ReadingProgress.astro 包含 cleanupReadingProgress 函数
- [ ] ReadingProgress.astro 监听 astro:page-load 事件
- [ ] ReadingProgress.astro 监听 astro:before-swap 事件
- [ ] ReadingProgress.astro 使用 setTimeout 延迟初始化

- [ ] OnPageNav.astro 包含 scrollHandler 变量声明
- [ ] OnPageNav.astro 包含 cleanupOnPageNav 函数
- [ ] OnPageNav.astro 监听 astro:page-load 事件
- [ ] OnPageNav.astro 监听 astro:before-swap 事件
- [ ] OnPageNav.astro 使用 setTimeout 延迟初始化

## 功能验证检查

- [ ] 无刷新页面跳转后目录导航正常工作
- [ ] 无刷新页面跳转后阅读进度条正常工作
- [ ] 点击目录项能平滑滚动到对应章节
- [ ] 滚动时目录项正确高亮当前章节
- [ ] 没有 JavaScript 控制台错误
- [ ] 没有事件监听器泄漏

## 测试检查

- [ ] npm run lint 通过
- [ ] npm run test 通过（70个测试）
- [ ] npm run build 成功（117个页面）

## 部署检查

- [ ] 代码已提交到 Git
- [ ] 代码已推送到 main 分支
- [ ] GitHub Actions 构建成功
