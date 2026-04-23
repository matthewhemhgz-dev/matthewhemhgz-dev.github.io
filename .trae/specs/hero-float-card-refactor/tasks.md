# Hero Float Card 重构与博客封面图关联部署 - 实现计划

## [ ] Task 1: 重构 HeroSection 组件，只保留一个 hero-float-card--insight 卡片
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 修改 HeroSection 组件，移除多余的 hero-float-card--insight 卡片，只保留一个
  - 确保卡片的位置和样式保持一致
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-1.1: 检查 Hero 部分是否只显示一个 hero-float-card--insight 卡片
  - `human-judgment` TR-1.2: 检查卡片的位置和样式是否保持一致
- **Notes**: 保留的卡片应该显示网站的核心标语，确保与网站主题一致

## [ ] Task 2: 为 HeroSection 组件添加语言支持
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 为 HeroSection 组件添加 lang 参数
  - 根据不同的语言显示不同的标语
  - 更新中英文首页，传递正确的 lang 参数
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgment` TR-2.1: 检查中文首页是否显示中文标语
  - `human-judgment` TR-2.2: 检查英文首页是否显示英文标语
- **Notes**: 确保标语的翻译准确，符合网站的整体风格

## [ ] Task 3: 修复博客封面图的关联问题
- **Priority**: P1
- **Depends On**: None
- **Description**:
  - 检查所有博客文章的 heroImage 字段
  - 确保所有文章都有对应的封面图
  - 修复损坏或缺失的图片
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment` TR-3.1: 检查所有博客文章是否都有 heroImage 字段
  - `human-judgment` TR-3.2: 检查所有引用的图片文件是否存在
  - `human-judgment` TR-3.3: 检查是否有重复使用的图片
- **Notes**: 对于缺失的图片，需要生成新的封面图，确保与文章主题匹配

## [ ] Task 4: 确保博客封面图在部署时能正确加载
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - 检查图片路径是否正确
  - 确保图片文件在部署时能正确复制到 dist 目录
  - 测试部署后的图片加载情况
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: 运行构建命令，确保没有图片相关的错误
  - `programmatic` TR-4.2: 检查 dist 目录中是否包含所有图片文件
  - `human-judgment` TR-4.3: 测试部署后的网站，确保所有图片都能正确加载
- **Notes**: 确保图片路径使用相对路径，避免硬编码的绝对路径

## [ ] Task 5: 验证卡片在白天和黑夜模式下的显示效果
- **Priority**: P2
- **Depends On**: Task 1, Task 2
- **Description**:
  - 测试卡片在白天模式下的显示效果
  - 测试卡片在黑夜模式下的显示效果
  - 确保卡片在两种模式下都有良好的可读性
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgment` TR-5.1: 检查卡片在白天模式下的背景色和文本颜色
  - `human-judgment` TR-5.2: 检查卡片在黑夜模式下的背景色和文本颜色
  - `human-judgment` TR-5.3: 检查卡片在两种模式下的可读性
- **Notes**: 使用设计令牌系统，确保卡片的样式与主题模式保持一致

## [ ] Task 6: 运行构建和测试，确保所有功能正常
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4, Task 5
- **Description**:
  - 运行 npm run build 命令，确保构建成功
  - 运行 npm test 命令，确保所有测试通过
  - 运行 npm run lint 命令，确保代码质量符合规范
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-6.1: 构建过程无错误
  - `programmatic` TR-6.2: 所有单元测试通过
  - `programmatic` TR-6.3: ESLint 检查无警告
- **Notes**: 确保构建产物大小在预算范围内