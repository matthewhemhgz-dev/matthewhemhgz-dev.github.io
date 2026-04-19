# 祈研所网站优化 - 实施计划

## [x] 任务 1: 修复社交媒体链接
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修复 Footer 组件中的社交媒体链接，确保它们指向真实的平台页面
  - 更新微信公众号、视频号、小红书和抖音的链接
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: 所有社交媒体链接都指向真实的平台页面
  - `human-judgment` TR-1.2: 链接在新窗口中打开，并且有适当的 aria-label
- **Notes**: 需要确保链接格式正确，并且在新窗口中打开

## [x] 任务 2: 模块化 hero-float-card 组件
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 将 hero-float-card 从 HeroSection 中提取为独立组件
  - 创建 HeroFloatCard.astro 组件，支持不同类型的卡片
  - 更新 HeroSection 以使用新的组件
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-2.1: HeroFloatCard 组件能够正常导入和使用
  - `programmatic` TR-2.2: 组件支持通过 props 自定义内容
  - `human-judgment` TR-2.3: 组件在页面上显示正确，视觉效果与原来一致
- **Notes**: 组件应该支持不同类型的卡片，如 insight、feature 等

## [x] 任务 3: 移除内联 CSS
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 移除 BaseLayout.astro 中的内联 CSS
  - 将样式迁移到 Tailwind 或单独的 CSS 文件
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-3.1: 代码库中没有内联 CSS
  - `human-judgment` TR-3.2: 页面样式保持不变
- **Notes**: 特别关注 BaseLayout.astro 文件中的 <style is:global> 块

## [x] 任务 4: 更新 Twitter 分享功能
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 将博客文章页面中的 Twitter 分享功能更新为 X 分享
  - 更新图标和文本
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-4.1: 点击分享按钮导航到 X 平台的分享页面
  - `human-judgment` TR-4.2: 图标和文本更新为 X
- **Notes**: 需要更新分享链接的 URL 结构

## [x] 任务 5: 改进微信分享功能
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 改进微信分享功能，确保在移动端正常显示
  - 为移动端添加适合的分享方式
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `human-judgment` TR-5.1: 在移动端点击微信分享按钮能够正常显示二维码
  - `human-judgment` TR-5.2: 移动端用户体验良好
- **Notes**: 可以考虑添加触摸事件支持

## [x] 任务 6: 确保多语言内容一致性
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 检查并确保所有页面的中英文内容一致
  - 特别检查首页、关于页面和博客列表页面
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgment` TR-6.1: 中英文内容结构一致
  - `human-judgment` TR-6.2: 翻译准确，没有明显错误
- **Notes**: 需要对比中英文页面的内容

## [x] 任务 7: 性能优化
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 优化图片资源，减少加载时间
  - 优化 JavaScript 代码分割
  - 优化缓存策略
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `programmatic` TR-7.1: 首屏加载时间不超过 2 秒
  - `programmatic` TR-7.2: 资源大小在预算范围内
- **Notes**: 使用性能分析工具进行测量

## [ ] 任务 8: 视觉设计优化
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 统一社交媒体图标，保持一致性
  - 优化动画效果，提高用户体验
  - 确保响应式设计在所有设备上表现优秀
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `human-judgment` TR-8.1: 视觉设计现代、一致
  - `human-judgment` TR-8.2: 动画效果流畅，提升用户体验
  - `human-judgment` TR-8.3: 响应式设计在所有设备上表现优秀
- **Notes**: 关注色彩、排版、间距和动画效果