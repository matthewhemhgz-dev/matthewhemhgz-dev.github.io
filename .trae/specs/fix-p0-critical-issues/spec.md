# P0 紧急问题修复规格

## Why
根据全站多专家审计结果，发现 6 个 P0 级紧急问题需要立即修复，这些问题影响核心功能、SEO 和可访问性，必须在推送生产环境前解决。

## What Changes
- 修复博客文章 heroImage 路径格式错误（34篇文章）
- 完善移动端菜单可访问性（焦点管理）
- 验证并修复相关文章链接格式
- 完善搜索模态框可访问性测试
- **BREAKING**: 标签 URL slug 化需要重定向机制

## Impact
- Affected specs: 博客内容、导航组件、搜索组件
- Affected code: 
  - `src/data/blog/{zh,en}/*.md` (34个文件)
  - `src/components/global/Navigation.astro`
  - `src/components/sections/RelatedArticles.astro`
  - `src/components/global/SearchModal.astro`
  - `src/pages/tags/[tag].astro`

## ADDED Requirements

### Requirement: heroImage 路径修复
系统 SHALL 确保所有博客文章的 heroImage 使用正确的 URL 格式。

#### Scenario: heroImage 路径格式正确
- **WHEN** 博客文章定义 heroImage
- **THEN** 路径格式应为 `/blog/filename.png` 而非 `public\blog\filename.png`

#### Scenario: OG 图片正常显示
- **WHEN** 社交媒体分享博客文章
- **THEN** OG 图片能够正常加载和显示

### Requirement: 移动端菜单可访问性
系统 SHALL 确保移动端菜单完全符合 WCAG 2.1 可访问性标准。

#### Scenario: 焦点管理
- **WHEN** 用户打开移动端菜单
- **THEN** 焦点应移动到第一个菜单项

#### Scenario: 焦点陷阱
- **WHEN** 用户在移动端菜单中按 Tab 键
- **THEN** 焦点应在菜单项之间循环，不会跳出菜单

#### Scenario: ESC 键关闭
- **WHEN** 用户按 ESC 键
- **THEN** 菜单应关闭且焦点返回触发按钮

### Requirement: 相关文章链接正确
系统 SHALL 生成正确的相关文章链接。

#### Scenario: 中文博客相关文章链接
- **WHEN** 用户点击中文博客的相关文章
- **THEN** 链接应为 `/blog/post-slug/` 格式

#### Scenario: 英文博客相关文章链接
- **WHEN** 用户点击英文博客的相关文章
- **THEN** 链接应为 `/en/blog/post-slug/` 格式

### Requirement: 搜索模态框可访问性验证
系统 SHALL 确保搜索模态框完全符合 WCAG 2.1 可访问性标准。

#### Scenario: 焦点陷阱验证
- **WHEN** 搜索模态框打开
- **THEN** Tab 键应在模态框内循环焦点

#### Scenario: 焦点返回
- **WHEN** 搜索模态框关闭
- **THEN** 焦点应返回触发按钮

## MODIFIED Requirements

### Requirement: 标签 URL slug 化
系统 SHALL 使用英文 slug 作为标签 URL，同时保持中文显示名称。

#### Scenario: 标签 URL 格式
- **WHEN** 用户访问标签页面
- **THEN** URL 应为 `/tags/english-slug/` 格式

#### Scenario: 中文标签显示
- **WHEN** 标签页面渲染
- **THEN** 显示中文标签名称（如"知识管理"）

## 安全与质量要求

### Requirement: 全局影响分析
每次修改 SHALL 进行全局影响分析，确保不引入新问题。

#### Scenario: 修改前分析
- **WHEN** 修改任何代码
- **THEN** 必须分析对其他组件的影响

### Requirement: 测试验证
所有修改 SHALL 经过完整测试验证才能推送。

#### Scenario: 本地测试
- **WHEN** 代码修改完成
- **THEN** 必须在本地运行完整测试套件

#### Scenario: 构建验证
- **WHEN** 测试通过
- **THEN** 必须运行 `npm run build` 验证构建成功

### Requirement: 生产环境安全
所有修改 SHALL 确保生产环境安全。

#### Scenario: 无破坏性变更
- **WHEN** 推送代码
- **THEN** 确保不破坏现有功能

#### Scenario: 回滚准备
- **WHEN** 发现问题
- **THEN** 能够快速回滚到上一个稳定版本
