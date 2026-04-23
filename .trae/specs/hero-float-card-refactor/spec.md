# Hero Float Card 重构与博客封面图关联部署 - 产品需求文档

## Overview
- **Summary**: 重构 Hero 部分的 hero-float-card 组件，只保留一个 hero-float-card--insight 卡片，并确保博客封面图正确关联及部署。
- **Purpose**: 解决 Hero 部分卡片重复的问题，确保在不同语言和主题模式下都能正确显示网站标语，同时修复博客封面图的关联和部署问题。
- **Target Users**: 所有访问网站的用户，包括中文和英文用户。

## Goals
- 重构 Hero 部分，只保留一个 hero-float-card--insight 卡片
- 确保卡片在白天和黑夜模式下都能正确显示
- 确保卡片在中英文模式下都能正确显示对应语言的标语
- 修复博客封面图的关联问题，确保所有文章都有正确的封面图
- 确保博客封面图在部署时能正确加载

## Non-Goals (Out of Scope)
- 不修改其他 Hero 部分的组件和样式
- 不修改博客文章的内容
- 不修改其他页面的样式和结构

## Background & Context
- 当前 Hero 部分有两个 hero-float-card--insight 卡片，造成视觉重复
- 博客封面图存在关联问题，部分图片可能无法正确加载
- 部署时可能存在图片路径或文件问题

## Functional Requirements
- **FR-1**: 重构 HeroSection 组件，只保留一个 hero-float-card--insight 卡片
- **FR-2**: 为 HeroSection 组件添加语言支持，使其能根据不同语言显示不同的标语
- **FR-3**: 确保博客封面图正确关联，所有文章都有对应的封面图
- **FR-4**: 确保博客封面图在部署时能正确加载

## Non-Functional Requirements
- **NFR-1**: 卡片在白天和黑夜模式下都能清晰可见，符合设计规范
- **NFR-2**: 卡片在不同屏幕尺寸下都能正常显示，响应式设计
- **NFR-3**: 博客封面图加载性能良好，不影响页面加载速度
- **NFR-4**: 代码质量符合项目规范，通过 ESLint 检查

## Constraints
- **Technical**: 使用现有技术栈，不引入新的依赖
- **Business**: 保持网站的整体设计风格和用户体验
- **Dependencies**: 依赖现有的设计令牌系统和组件结构

## Assumptions
- 项目使用 Astro 6 静态网站生成框架
- 项目使用设计令牌系统进行样式管理
- 博客文章使用 Markdown 格式，包含 heroImage 字段

## Acceptance Criteria

### AC-1: Hero 部分只保留一个 hero-float-card--insight 卡片
- **Given**: 用户访问网站首页
- **When**: 页面加载完成
- **Then**: Hero 部分只显示一个 hero-float-card--insight 卡片
- **Verification**: `human-judgment`

### AC-2: 卡片在白天和黑夜模式下都能正确显示
- **Given**: 用户访问网站首页
- **When**: 用户切换主题模式（白天/黑夜）
- **Then**: 卡片的背景色和文本颜色会根据主题模式自动调整，保持良好的可读性
- **Verification**: `human-judgment`

### AC-3: 卡片在中英文模式下都能正确显示对应语言的标语
- **Given**: 用户访问中文或英文首页
- **When**: 页面加载完成
- **Then**: 卡片显示对应语言的标语（中文/英文）
- **Verification**: `human-judgment`

### AC-4: 所有博客文章都有正确的封面图
- **Given**: 用户访问博客列表页或博客文章页
- **When**: 页面加载完成
- **Then**: 所有文章都显示对应的封面图，无缺失或重复
- **Verification**: `human-judgment`

### AC-5: 博客封面图在部署时能正确加载
- **Given**: 项目部署到生产环境
- **When**: 用户访问部署后的网站
- **Then**: 所有博客封面图都能正确加载，无 404 错误
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要为所有博客文章重新生成封面图，还是只修复现有的图片关联问题？
- [ ] 部署时图片路径是否需要特殊处理？