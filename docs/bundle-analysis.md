# 构建产物分析

本文档介绍了如何使用构建产物分析工具来优化项目的性能。

## 概述

为了确保项目的构建产物大小可控，我们集成了 `rollup-plugin-visualizer` 插件，它可以帮助我们：
- 可视化分析构建产物的组成
- 识别不必要的依赖和代码
- 优化模块拆分策略
- 监控性能指标

## 使用方法

### 1. 运行构建分析

使用以下命令运行构建并生成分析报告：

```bash
npm run analyze
```

该命令会执行构建并自动打开分析报告页面。

### 2. 查看分析报告

分析报告将生成在 `reports/bundle-visualizer.html` 文件中，你可以随时在浏览器中打开它查看。

## 分析报告说明

### 可视化图表

报告提供了多种可视化图表类型：
- **Treemap**: 显示模块大小占比，使用颜色区分不同依赖
- **Sunburst**: 环形图表，展示层级关系
- **Network**: 节点连接图，显示模块之间的依赖关系

### 关键指标

分析报告包含以下关键指标：
- **原始大小 (Original)**: 模块未压缩的大小
- **Gzip 大小 (Gzipped)**: 经过 gzip 压缩后的大小
- **Brotli 大小 (Brotlied)**: 经过 brotli 压缩后的大小

## 优化建议

### 1. 识别大模块

当你在图表中看到很大的模块时，考虑：
- 是否可以将该模块拆分成更小的 chunk
- 是否有重复依赖
- 是否可以使用更轻量的替代库

### 2. 清理未使用的依赖

定期检查并移除项目中未使用的依赖。

### 3. 优化代码拆分

在 `astro.config.mjs` 中的 `manualChunks` 配置可以帮助你将代码拆分成更合理的块。

## 配置说明

当前的可视化分析配置在 `astro.config.mjs` 中：

```javascript
plugins: process.env.ANALYZE ? [
  visualizer({
    filename: 'reports/bundle-visualizer.html',
    open: true,
    gzipSize: true,
    brotliSize: true,
  }),
] : []
```

## 最佳实践

1. **定期分析**: 建议在每次重大功能更新或依赖更新后运行分析
2. **记录变化**: 跟踪分析报告的变化，确保不会引入不必要的膨胀
3. **设置阈值**: 为关键模块设置大小阈值，防止超出限制

## 其他工具

除了 rollup-plugin-visualizer，项目还提供了以下相关工具：

- `npm run size-check`: 检查 bundle 大小
- `npm run lighthouse`: 运行 Lighthouse 审计
