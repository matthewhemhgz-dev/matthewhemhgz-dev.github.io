# 剩余 P0 问题修复规格

## Why
根据全站多专家审计结果，仍有 2 个 P0 级紧急问题需要修复：
1. 标签页面 URL 中文编码问题 - 影响 SEO 和用户体验
2. CSS 文件体积过大 - 影响首屏加载性能

## What Changes
- 实现标签 slug 映射机制，使用英文 slug 作为 URL
- 优化 CSS 文件体积，移除未使用样式

## Impact
- Affected specs: 标签页面、全站性能
- Affected code: 
  - `src/pages/tags/[tag].astro`
  - `src/styles/BaseLayout.css`
  - `src/styles/SectionDivider.css`
  - 需要创建 `src/data/tags.ts` 标签映射配置

## ADDED Requirements

### Requirement: 标签 URL slug 化
系统 SHALL 使用英文 slug 作为标签 URL，同时保持中文显示名称。

#### Scenario: 标签 URL 格式
- **WHEN** 用户访问标签页面
- **THEN** URL 应为 `/tags/english-slug/` 格式

#### Scenario: 中文标签显示
- **WHEN** 标签页面渲染
- **THEN** 显示中文标签名称（如"知识管理"）

#### Scenario: 中英文标签对应
- **WHEN** 中英文博客使用同一标签
- **THEN** 应跳转到相同的标签页面

### Requirement: CSS 体积优化
系统 SHALL 优化 CSS 文件体积，提升首屏加载性能。

#### Scenario: CSS Tree Shaking
- **WHEN** 构建项目
- **THEN** 自动移除未使用的 CSS 样式

#### Scenario: 按需加载动画
- **WHEN** 用户滚动到特定区域
- **THEN** 动态加载相关动画样式

## 安全与质量要求

### Requirement: 全局影响分析
每次修改 SHALL 进行全局影响分析，确保不引入新问题。

### Requirement: 测试验证
所有修改 SHALL 经过完整测试验证才能推送。

### Requirement: 生产环境安全
所有修改 SHALL 确保生产环境安全，不破坏现有功能。
