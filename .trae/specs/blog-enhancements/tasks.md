# 博客功能增强 - 实施计划（分解并优先化的任务列表）

## [x] Task 1: 统一并升级 Mermaid 库版本

- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 在 MermaidInit.astro 组件中统一 Mermaid 库版本
  - 确保使用稳定且功能完善的 Mermaid 版本（如 11.4.1 或更新到最新稳定版）
  - 将版本号定义为常量或配置项，便于后续更新
- **Acceptance Criteria Addressed**: AC-1, AC-6
- **Test Requirements**:
  - `programmatic` TR-1.1: 检查构建后的代码中 Mermaid 版本号一致性
  - `human-judgment` TR-1.2: 检查所有包含 Mermaid 图表的页面，验证图表正常加载
- **Notes**: 考虑使用最新的稳定版 Mermaid，但需要验证兼容性

## [x] Task 2: 全面排查并修复 Mermaid 语法错误

- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 检查所有博客文章（位于 src/data/blog/zh/ 目录）中的 Mermaid 代码
  - 修复发现的语法错误，确保所有图表都能正确渲染
  - 特别检查已发现的 notion-obsidian-dual-track.md 文件
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgment` TR-2.1: 逐一访问包含 Mermaid 图表的页面，验证所有图表正常渲染，无错误提示
  - `programmatic` TR-2.2: 检查浏览器控制台，确保没有 Mermaid 相关的错误信息
- **Notes**: 重点检查箭头标签语法，如 `-->`| 可能需要调整

## [x] Task 3: 集成 Google Analytics 4 跟踪代码

- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 在 BaseLayout.astro 的 head 部分添加 Google Analytics 4 跟踪代码
  - 使用用户提供的跟踪 ID: G-CNGRXTNXF5
  - 确保代码正确嵌入且不影响其他功能
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-3.1: 检查页面源代码，确认 GA4 代码存在且 ID 正确
  - `programmatic` TR-3.2: 使用浏览器开发者工具验证网络请求，确认数据能正常发送到 GA4
- **Notes**: 将 GA 代码放在 head 部分的适当位置，避免阻塞渲染

## [x] Task 4: 实现 SPA 导航的 GA4 页面浏览跟踪

- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 监听 Astro 的页面加载事件（astro:page-load）
  - 在页面切换时手动发送页面浏览事件到 GA4
  - 确保正确更新页面路径和标题
- **Acceptance Criteria Addressed**: AC-3, AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: 使用浏览器开发者工具验证页面切换时会发送新的 page_view 事件
  - `programmatic` TR-4.2: 验证发送的页面路径和标题与实际页面一致
- **Notes**: 需要正确处理 Astro 的 View Transitions 机制

## [x] Task 5: 实现阅读次数统计功能

- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 设计阅读次数存储方案（使用客户端本地存储或轻量级第三方服务）
  - 实现阅读次数的增加和获取逻辑
  - 考虑到是静态网站，选择适合的方案
  - 建议使用：Firebase、Supabase 或其他轻量级 BaaS
- **Acceptance Criteria Addressed**: AC-4, AC-6
- **Test Requirements**:
  - `programmatic` TR-5.1: 验证访问文章时阅读次数能正确增加
  - `human-judgment` TR-5.2: 验证阅读次数能在页面上正确显示
  - `programmatic` TR-5.3: 验证构建产物大小在可接受范围内
- **Notes**: 如果用户没有指定服务，先实现一个基于 localStorage 的简单版本作为演示

## [x] Task 6: 在博客文章页面显示阅读次数

- **Priority**: P1
- **Depends On**: Task 5
- **Description**:
  - 在 blog/[slug].astro 的文章元数据区域添加阅读次数显示
  - 样式与现有 UI 保持一致
  - 在深色/浅色模式下都能正常显示
- **Acceptance Criteria Addressed**: AC-4, AC-6
- **Test Requirements**:
  - `human-judgment` TR-6.1: 验证阅读次数在文章页面正确显示
  - `human-judgment` TR-6.2: 验证在深色/浅色模式下显示效果良好
  - `human-judgment` TR-6.3: 验证阅读次数 UI 与现有设计风格一致
- **Notes**: 建议在阅读时间旁边显示，使用类似的样式

## [x] Task 7: 全面测试与优化

- **Priority**: P2
- **Depends On**: Tasks 1-6
- **Description**:
  - 进行全面的功能测试
  - 检查构建产物大小
  - 优化性能，确保不影响用户体验
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `programmatic` TR-7.1: 运行构建命令，验证构建产物大小符合预算
  - `programmatic` TR-7.2: 运行 lint 命令，确保没有代码质量问题
  - `human-judgment` TR-7.3: 手动测试所有功能在不同设备和浏览器上的表现
- **Notes**: 特别关注性能，确保新功能不会显著影响加载时间
