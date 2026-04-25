# 图片和粒子系统修复计划

## 问题分析

### 1. 图片缺失问题

- 经检查，发现以下图片文件缺失：
  - `/images/blog/ssg-best-practices.png`
  - `/images/blog/frontend-performance-optimization.png`
  - `/images/blog/zettelkasten-practical.png`
  - `/images/blog/knowledge-graph-visualization.png`
  - `/images/blog/personal-knowledge-system.png`
  - `/images/blog/design-system-from-scratch.png`
  - `/images/blog/design-tokens-best-practices.png`
  - `/images/blog/frontend-architecture-evolution.png`

### 2. 粒子系统不显示问题

- 代码结构完整，包括：
  - `ParticlesCanvas.astro` 提供 canvas 元素
  - `particles.js` 实现粒子系统核心逻辑
  - `init.js` 负责初始化粒子系统
  - `particles-canvas.css` 提供样式
- 可能的问题：
  - Canvas 元素样式问题
  - JavaScript 执行顺序问题
  - 浏览器控制台错误
  - 初始化条件不满足

## 修复方案

### 1. 图片缺失修复

#### 步骤 1：创建缺失的图片文件

- 为每个缺失的图片生成占位图片
- 使用 `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image` API 生成相关主题的图片
- 确保图片命名与引用一致
- 保存到 `public/images/blog/` 目录

#### 步骤 2：验证图片加载

- 启动开发服务器
- 访问所有博客文章，确认图片正常显示
- 检查开发服务器日志，确认没有 404 错误

### 2. 粒子系统修复

#### 步骤 1：检查 JavaScript 执行

- 启动开发服务器
- 访问首页
- 打开浏览器控制台，检查是否有 JavaScript 错误
- 确认粒子系统初始化代码是否执行

#### 步骤 2：验证 Canvas 元素

- 检查首页 HTML 中是否存在 `id="particles-canvas"` 的元素
- 确认 Canvas 元素是否有正确的样式和尺寸
- 检查 z-index 是否正确，确保粒子系统显示在背景

#### 步骤 3：调试初始化逻辑

- 检查 `init.js` 中的初始化条件
- 确认首页路径判断是否正确
- 检查用户动画偏好设置
- 添加调试日志，确认粒子系统是否被正确初始化

#### 步骤 4：优化粒子系统（如果需要）

- 检查粒子系统性能
- 确保在不同设备上都能正常运行
- 优化鼠标交互效果

## 实施步骤

### 第一阶段：图片修复

1. 生成所有缺失的图片文件
2. 保存到 `public/images/blog/` 目录
3. 测试图片加载情况

### 第二阶段：粒子系统修复

1. 启动开发服务器并检查浏览器控制台
2. 验证 Canvas 元素和样式
3. 调试初始化逻辑
4. 测试粒子系统显示效果
5. 优化性能和交互

## 验证计划

### 图片修复验证

- 访问所有博客文章，确认图片正常显示
- 检查开发服务器日志，确认没有 404 错误
- 运行 `npm run build`，确保构建过程没有错误

### 粒子系统验证

- 访问首页，确认粒子效果正常显示
- 检查浏览器控制台，确认没有 JavaScript 错误
- 测试鼠标交互效果
- 验证在不同设备和浏览器上的显示效果

## 预期成果

- 所有博客文章的图片正常显示
- 首页粒子系统正常工作，包括鼠标交互效果
- 代码结构清晰，性能优化到位
- 修复后在不同设备和浏览器上都能正常显示
