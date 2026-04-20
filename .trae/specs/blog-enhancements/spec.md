# 博客功能增强 - 产品需求文档

## Overview

- **Summary**: 对博客网站进行多方面功能增强，包括统一 Mermaid 图表版本、排查并修复语法错误、集成 Google Analytics 统计功能，并在博客文章页面显示相关统计结果。
- **Purpose**: 提升博客网站的用户体验和可维护性，同时为网站运营提供数据支持，确保图表渲染的一致性和可靠性。
- **Target Users**: 博客读者、网站运营者、内容创作者

## Goals

- 统一 Mermaid 图表渲染版本，确保所有图表使用相同的 Mermaid 库
- 全面排查并修复所有博客文章中的 Mermaid 语法错误
- 集成 Google Analytics 4 跟踪代码，收集网站访问数据
- 在博客文章页面显示阅读次数等统计信息
- 保持现有的构建性能和用户体验不变

## Non-Goals (Out of Scope)

- 不引入新的博客功能（如评论系统、登录系统等）
- 不重构现有的 UI 设计或视觉风格
- 不添加除 Google Analytics 之外的其他统计服务
- 不实现需要后端服务器支持的复杂统计功能

## Background & Context

- 现有博客使用 Astro 框架构建，是一个静态网站
- 当前 Mermaid 图表通过 MermaidInit.astro 组件加载，使用 CDN 版本 11.4.1
- 之前发现 `notion-obsidian-dual-track.md` 文件中有 Mermaid 语法错误
- 现有博客文章已经有阅读时间计算和分享功能
- 网站部署在 GitHub Pages 或类似的静态托管平台上

## Functional Requirements

- **FR-1**: 统一并明确指定 Mermaid 库的版本，确保所有页面使用相同版本
- **FR-2**: 全面检查所有博客文章中的 Mermaid 语法，修复发现的错误
- **FR-3**: 在网站基础布局中集成 Google Analytics 4 跟踪代码
- **FR-4**: 在博客文章页面添加阅读次数显示功能
- **FR-5**: 确保 Google Analytics 在 SPA 导航（Astro 页面切换）时正常工作

## Non-Functional Requirements

- **NFR-1**: 统计功能对用户体验无明显影响（加载时间增加 < 100ms）
- **NFR-2**: Mermaid 图表渲染成功率达到 100%
- **NFR-3**: 代码变更遵循现有项目的代码风格和架构
- **NFR-4**: 所有功能在深色/浅色模式下都能正常工作

## Constraints

- **Technical**: 
  - 项目使用 Astro 框架，必须遵循其架构模式
  - 网站是静态网站，需要考虑无服务器或第三方服务来存储统计数据
  - 必须使用用户提供的 GA4 ID: G-CNGRXTNXF5
- **Business**:
  - 需要尊重用户隐私，可能需要添加隐私提示
  - 实施时间应控制在合理范围内
- **Dependencies**:
  - Google Analytics 4 服务
  - 可能需要第三方服务来存储和提供文章阅读次数数据

## Assumptions

- 用户已拥有 Google Analytics 4 账户并配置好网站
- 统计数据可以通过 Google Analytics Data API 或第三方服务获取
- 用户接受使用第三方服务来存储和显示阅读次数
- Astro 的页面加载事件能够被正确监听

## Acceptance Criteria

### AC-1: Mermaid 版本统一
- **Given**: 访问任何包含 Mermaid 图表的页面
- **When**: 检查浏览器开发者工具中的网络请求
- **Then**: 所有 Mermaid 图表都使用同一版本的 Mermaid 库
- **Verification**: `programmatic`

### AC-2: Mermaid 语法错误修复
- **Given**: 访问任何包含 Mermaid 图表的页面
- **When**: 查看页面上的图表渲染效果
- **Then**: 所有 Mermaid 图表都能正常渲染，无错误提示
- **Verification**: `human-judgment`

### AC-3: Google Analytics 集成
- **Given**: 访问网站任何页面
- **When**: 查看网络请求和页面源码
- **Then**: 页面包含 Google Analytics 4 跟踪代码，且能正常发送数据
- **Verification**: `programmatic`

### AC-4: 阅读次数显示
- **Given**: 访问博客文章详情页面
- **When**: 查看文章头部信息区域
- **Then**: 页面显示该文章的阅读次数
- **Verification**: `human-judgment`

### AC-5: SPA 导航支持
- **Given**: 在网站内进行页面切换（使用 Astro 的 View Transitions）
- **When**: 使用浏览器开发者工具监控网络请求
- **Then**: 每次页面切换都能向 Google Analytics 发送页面浏览事件
- **Verification**: `programmatic`

### AC-6: 构建性能保持
- **Given**: 运行构建命令
- **When**: 检查构建产物大小和构建时间
- **Then**: 构建产物大小和构建时间与改造前无显著差异（< 10%）
- **Verification**: `programmatic`

## Open Questions

- [ ] 是否需要添加 Cookie 同意提示或符合 GDPR 的隐私设置？
- [ ] 阅读次数统计使用什么服务？（建议使用 Firebase、Supabase 等轻量级 BaaS 或完全依赖 Google Analytics 导出）
- [ ] 是否需要在其他页面（如列表页）也显示阅读次数？
- [ ] 阅读次数是否需要实时更新，还是可以接受一定延迟？
