# 修复图片及光效动态粒子 - 产品需求文档

## Overview
- **Summary**: 修复网站中的图片展示问题和光效动态粒子效果，确保图片正确加载、显示和优化，同时修复粒子系统的性能和视觉效果。
- **Purpose**: 提升网站的视觉体验和性能，确保图片和粒子效果能够正常工作，为用户提供流畅、美观的浏览体验。
- **Target Users**: 所有访问祈研所网站的用户。

## Goals
- 修复图片加载和显示问题，确保所有图片正确渲染
- 优化图片性能，提高加载速度
- 修复光效动态粒子系统的性能和视觉效果
- 确保在不同设备和浏览器上的兼容性
- 提升整体用户体验

## Non-Goals (Out of Scope)
- 不修改图片内容本身
- 不添加新的图片或粒子效果功能
- 不重构整个图片或粒子系统架构

## Background & Context
- 网站使用 Astro 6 作为静态站点生成框架
- 图片处理使用 Astro 内置的 Image 组件，封装在 OptimizedImage 组件中
- 粒子系统使用自定义的 MinimalParticles 类，实现了鼠标交互和光晕效果
- 光效系统包括粒子背景和鼠标追踪光效

## Functional Requirements
- **FR-1**: 修复所有图片的加载和显示问题
- **FR-2**: 确保图片响应式显示，适配不同屏幕尺寸
- **FR-3**: 修复粒子系统的性能问题，确保流畅运行
- **FR-4**: 修复粒子系统的视觉效果，包括光晕和鼠标交互
- **FR-5**: 确保粒子系统在移动端和桌面端都能正常工作

## Non-Functional Requirements
- **NFR-1**: 图片加载速度快，不影响页面加载性能
- **NFR-2**: 粒子系统运行流畅，不占用过多 CPU 资源
- **NFR-3**: 兼容性好，支持主流浏览器
- **NFR-4**: 代码质量高，易于维护

## Constraints
- **Technical**: 基于现有代码架构，不进行大规模重构
- **Dependencies**: 依赖 Astro 6 的图片处理能力和浏览器的 Canvas API

## Assumptions
- 图片文件本身是有效的，不存在损坏问题
- 浏览器支持 Canvas API 和现代 JavaScript 特性
- 网络连接正常，能够正常加载图片资源

## Acceptance Criteria

### AC-1: 图片加载修复
- **Given**: 用户访问网站
- **When**: 页面加载时
- **Then**: 所有图片都能正确加载和显示，没有损坏或丢失的图片
- **Verification**: `human-judgment`

### AC-2: 图片响应式显示
- **Given**: 用户在不同设备上访问网站
- **When**: 调整屏幕尺寸或在移动设备上查看
- **Then**: 图片能够自适应不同屏幕尺寸，保持良好的显示效果
- **Verification**: `human-judgment`

### AC-3: 粒子系统性能
- **Given**: 用户访问首页
- **When**: 粒子系统运行时
- **Then**: 粒子系统运行流畅，FPS 保持在 30 以上，不卡顿
- **Verification**: `programmatic`

### AC-4: 粒子系统视觉效果
- **Given**: 用户在首页移动鼠标
- **When**: 与粒子系统交互时
- **Then**: 粒子能够正确响应鼠标移动，显示光晕效果和连线效果
- **Verification**: `human-judgment`

### AC-5: 浏览器兼容性
- **Given**: 用户使用不同的浏览器访问网站
- **When**: 在 Chrome、Firefox、Safari 等浏览器中打开网站
- **Then**: 图片和粒子系统在所有主流浏览器中都能正常工作
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要对图片进行进一步的优化，如压缩或格式转换？
- [ ] 粒子系统的配置参数是否需要调整以适应不同设备？