# P1 重要问题修复规格

## Why
根据全站多专家审计结果，仍有 16 个 P1 级重要问题需要修复。本次选择优先处理影响较大的 4 个问题：
1. 缺少 x-default hreflang - SEO 问题
2. Article schema 不完整 - SEO 问题
3. Logo 图片未优化 - 性能问题
4. 搜索过滤器缺少状态指示 - 可访问性问题

## What Changes
- 添加 x-default hreflang 标签
- 完善 Article schema 结构化数据
- 优化 Logo 图片格式和尺寸
- 添加筛选按钮的 aria-pressed 状态

## Impact
- Affected specs: SEO、性能、可访问性
- Affected code: 
  - `src/layouts/BaseLayout.astro`
  - `src/pages/blog/[slug].astro`
  - `public/images/logo.png`
  - 项目页、博客标签页的筛选按钮

## ADDED Requirements

### Requirement: hreflang 标签完整性
系统 SHALL 包含 x-default hreflang 标签以支持国际搜索引擎识别。

#### Scenario: 搜索引擎索引
- **WHEN** 搜索引擎爬虫访问网站
- **THEN** 能正确识别默认语言版本

### Requirement: Article Schema 完整性
系统 SHALL 提供完整的 Article schema 结构化数据。

#### Scenario: 搜索结果展示
- **WHEN** 博客文章出现在搜索结果中
- **THEN** 显示完整的结构化信息

### Requirement: Logo 图片优化
系统 SHALL 使用优化的 Logo 图片格式。

#### Scenario: 首屏加载
- **WHEN** 用户访问网站
- **THEN** Logo 快速加载显示

### Requirement: 筛选按钮可访问性
系统 SHALL 为筛选按钮添加 aria-pressed 状态。

#### Scenario: 屏幕阅读器导航
- **WHEN** 屏幕阅读器用户使用筛选功能
- **THEN** 能正确识别选中状态

## 安全与质量要求

### Requirement: 全局影响分析
每次修改 SHALL 进行全局影响分析，确保不引入新问题。

### Requirement: 测试验证
所有修改 SHALL 经过完整测试验证才能推送。

### Requirement: 生产环境安全
所有修改 SHALL 确保生产环境安全，不破坏现有功能。
