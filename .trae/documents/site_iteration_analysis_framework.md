# 祈研所网站后续迭代路线分析框架

## Research Overview
- **Research Subject**: 祈研所网站架构迭代分析 - 内容分离、视觉层次与模块设计
- **Scope**: 当前网站状态评估、用户体验分析、信息架构优化、视觉设计系统完善
- **Analysis Domain**: 品牌分析 + 用户体验 + 信息架构
- **Core Research Questions**:
  1. 博客与项目内容是否应该完全分离？当前架构存在哪些混淆点？
  2. 背景光效浮动粒子如何恢复并优化性能？
  3. 页面层次如何进行系统化设计以提升用户体验？
  4. 非首页模块（关于、标签、项目）的设计优化方向是什么？

## Framework Selection

| Chapter | Selected Framework(s) | Application |
|---------|----------------------|-------------|
| 现状评估与问题诊断 | SWOT Analysis | 分析当前网站的优势、劣势、机会和威胁 |
| 内容架构分析 | STP Analysis + 用户旅程地图 | 评估内容定位、用户细分和导航体验 |
| 视觉层次设计 | Gestalt Principles + 信息层级理论 | 分析视觉组织和信息优先级 |
| 迭代路线规划 | Ansoff Matrix + MoSCoW方法 | 确定功能优先级和实施路径 |

## Chapter Skeleton

### 1. 当前网站状态评估与问题诊断
- **Analysis Objective**: 全面评估网站当前状态，识别核心问题和痛点
- **Analysis Logic**: 功能完整性检查 → 用户体验评估 → 技术架构分析 → 问题优先级排序
- **Core Hypothesis**: 当前网站存在内容混淆、视觉层次不清晰、功能缺失等问题

#### Data Requirements

| # | Data Metric | Data Type | Suggested Sources | Search Keywords | Priority | Time Range |
|---|-------------|-----------|-------------------|-----------------|----------|------------|
| 1 | 页面加载性能指标 | Quantitative | Lighthouse/PageSpeed | "Astro site performance metrics" | P0 | Latest |
| 2 | 导航结构分析 | Qualitative | Site audit, user testing | "website navigation structure analysis" | P0 | Latest |
| 3 | 内容组织现状 | Qualitative | Content inventory | "content architecture blog projects" | P0 | Latest |
| 4 | 用户反馈收集 | Qualitative | Analytics, surveys | "user feedback site navigation" | P1 | Past 6 months |
| 5 | 竞品网站分析 | Qualitative | Competitive analysis | "personal blog portfolio site best practices" | P1 | Latest |

#### Visualization & Content Plan

**Chart 1**: Comparison Table — 网站功能现状评估
**Chart 2**: SWOT分析矩阵 — 网站当前状态

**Argument Structure**:
1. **Observation (What)**: 当前网站的功能完整性、用户体验和技术状况
2. **Attribution (Why)**: 问题产生的根本原因，如内容架构设计、视觉层次规划
3. **Implication (So What)**: 对用户体验和网站目标的影响

---

### 2. 博客与项目内容分离分析
- **Analysis Objective**: 评估博客与项目内容是否应该分离及如何分离
- **Analysis Logic**: 内容类型区分 → 用户需求分析 → 分离方案评估 → 实施建议
- **Core Hypothesis**: 博客与项目内容分离将提升用户体验和内容可发现性

#### Data Requirements

| # | Data Metric | Data Type | Suggested Sources | Search Keywords | Priority | Time Range |
|---|-------------|-----------|-------------------|-----------------|----------|------------|
| 1 | 博客文章分类统计 | Quantitative | Content inventory | "blog post categories count" | P0 | All time |
| 2 | 项目类型与数量 | Quantitative | Projects data | "projects types categories" | P0 | All time |
| 3 | 用户访问路径分析 | Quantitative | Analytics | "user navigation path blog projects" | P0 | Past 3 months |
| 4 | 内容混淆用户反馈 | Qualitative | Surveys, comments | "confusion blog projects separate" | P1 | Past 6 months |
| 5 | 行业最佳实践 | Qualitative | Case studies | "separate blog portfolio best practices" | P1 | Latest |

#### Visualization & Content Plan

**Chart 1**: Flow Chart — 当前内容访问路径
**Chart 2**: Comparison Table — 分离方案对比（完全分离/部分分离/保持现状）

**Argument Structure**:
1. **Observation (What)**: 博客与项目内容的当前状态和用户访问模式
2. **Attribution (Why)**: 内容混淆的原因，如导航设计、内容组织
3. **Implication (So What)**: 分离方案的优势、成本和实施建议

---

### 3. 背景光效浮动粒子效果恢复与优化
- **Analysis Objective**: 分析粒子效果丢失原因并制定恢复方案
- **Analysis Logic**: 现有代码审查 → 问题定位 → 性能评估 → 恢复方案设计
- **Core Hypothesis**: 粒子效果可通过优化实现，不影响页面性能

#### Data Requirements

| # | Data Metric | Data Type | Suggested Sources | Search Keywords | Priority | Time Range |
|---|-------------|-----------|-------------------|-----------------|----------|------------|
| 1 | 粒子效果代码状态 | Qualitative | Code review | "particle effect init.js canvas" | P0 | Latest |
| 2 | 浏览器兼容性测试 | Quantitative | Browser testing | "canvas particle animation compatibility" | P0 | Latest |
| 3 | 性能影响评估 | Quantitative | Performance metrics | "canvas animation performance impact" | P0 | Latest |
| 4 | 移动端适配需求 | Qualitative | Device testing | "mobile particle animation performance" | P1 | Latest |
| 5 | 视觉设计规范 | Qualitative | Design tokens | "brand color scheme particles" | P1 | Latest |

#### Visualization & Content Plan

**Chart 1**: Flow Chart — 粒子效果恢复实施路径
**Chart 2**: Comparison Table — 不同粒子方案性能对比

**Argument Structure**:
1. **Observation (What)**: 粒子效果当前状态、代码问题、性能影响
2. **Attribution (Why)**: 效果丢失的技术原因和兼容性问题
3. **Implication (So What)**: 恢复方案、性能优化策略、实施步骤

---

### 4. 页面层次系统化设计分析
- **Analysis Objective**: 设计系统化的页面层次结构
- **Analysis Logic**: 视觉层次理论 → 现有页面分析 → 层次优化方案 → 设计规范制定
- **Core Hypothesis**: 系统化的视觉层次设计将显著提升用户体验和内容可读性

#### Data Requirements

| # | Data Metric | Data Type | Suggested Sources | Search Keywords | Priority | Time Range |
|---|-------------|-----------|-------------------|-----------------|----------|------------|
| 1 | 当前页面视觉层次分析 | Qualitative | Visual audit | "visual hierarchy analysis typography" | P0 | Latest |
| 2 | 设计令牌系统状态 | Qualitative | CSS tokens review | "design tokens color typography spacing" | P0 | Latest |
| 3 | 响应式设计评估 | Qualitative | Device testing | "responsive design breakpoints" | P0 | Latest |
| 4 | WCAG可访问性检查 | Quantitative | Accessibility audit | "WCAG contrast ratio accessibility" | P1 | Latest |
| 5 | 行业视觉设计趋势 | Qualitative | Design research | "modern blog design trends 2024" | P1 | Latest |

#### Visualization & Content Plan

**Chart 1**: Diagram — 页面视觉层次结构图
**Chart 2**: Comparison Table — 页面层次设计规范

**Argument Structure**:
1. **Observation (What)**: 当前页面层次的问题和用户体验痛点
2. **Attribution (Why)**: 视觉层次混乱的原因，如缺乏设计规范、不一致的实现
3. **Implication (So What)**: 系统化设计方案、设计规范制定、实施路线

---

### 5. 非首页模块设计优化方向
- **Analysis Objective**: 确定关于、标签、项目等模块的设计优化方向
- **Analysis Logic**: 模块功能评估 → 用户需求分析 → 设计优化方案 → 优先级排序
- **Core Hypothesis**: 非首页模块的设计优化将提升网站完整性和用户粘性

#### Data Requirements

| # | Data Metric | Data Type | Suggested Sources | Search Keywords | Priority | Time Range |
|---|-------------|-----------|-------------------|-----------------|----------|------------|
| 1 | 各模块访问量统计 | Quantitative | Analytics | "page views about tags projects" | P0 | Past 3 months |
| 2 | 模块功能完整性评估 | Qualitative | Content audit | "about page content completeness" | P0 | Latest |
| 3 | 用户期望调研 | Qualitative | Surveys | "about page expectations features" | P1 | Past 6 months |
| 4 | 竞品模块设计分析 | Qualitative | Competitive analysis | "about page best practices design" | P1 | Latest |
| 5 | 内容更新频率 | Quantitative | Content audit | "content update frequency" | P2 | Past 1 year |

#### Visualization & Content Plan

**Chart 1**: Bar Chart — 各模块访问量对比
**Chart 2**: Priority Matrix — 模块优化优先级排序

**Argument Structure**:
1. **Observation (What)**: 各模块当前状态、访问量和用户反馈
2. **Attribution (Why)**: 模块设计问题的根本原因
3. **Implication (So What)**: 各模块的优化方向、设计建议、实施优先级

---

### 6. 迭代路线规划与实施建议
- **Analysis Objective**: 制定系统化的迭代路线和实施计划
- **Analysis Logic**: 需求优先级排序 → 实施阶段划分 → 资源评估 → 风险分析
- **Core Hypothesis**: 分阶段实施将最小化风险并确保迭代成功

#### Data Requirements

| # | Data Metric | Data Type | Suggested Sources | Search Keywords | Priority | Time Range |
|---|-------------|-----------|-------------------|-----------------|----------|------------|
| 1 | 功能需求优先级 | Qualitative | Stakeholder input | "feature priority ranking MoSCoW" | P0 | Current |
| 2 | 开发资源评估 | Quantitative | Team capacity | "development resource estimation" | P0 | Current |
| 3 | 技术复杂度评估 | Qualitative | Technical review | "technical complexity assessment" | P0 | Current |
| 4 | 风险识别与评估 | Qualitative | Risk analysis | "project risk assessment" | P1 | Current |
| 5 | 时间线规划 | Quantitative | Timeline estimation | "project timeline planning" | P1 | Current |

#### Visualization & Content Plan

**Chart 1**: Gantt Chart — 迭代实施时间线
**Chart 2**: Risk Matrix — 风险评估与应对策略

**Argument Structure**:
1. **Observation (What)**: 需求优先级、资源状况、技术复杂度
2. **Attribution (Why)**: 影响实施的关键因素和潜在风险
3. **Implication (So What)**: 分阶段实施路线、资源分配、风险应对策略

---

## Data Collection Task List

### P0 - 必须收集
1. 页面加载性能指标
2. 导航结构分析
3. 内容组织现状（博客和项目）
4. 用户访问路径分析
5. 粒子效果代码状态
6. 当前页面视觉层次分析
7. 设计令牌系统状态
8. 各模块访问量统计
9. 功能需求优先级
10. 开发资源评估
11. 技术复杂度评估

### P1 - 建议收集
1. 用户反馈收集
2. 竞品网站分析
3. 内容混淆用户反馈
4. 行业最佳实践
5. 浏览器兼容性测试
6. 性能影响评估
7. WCAG可访问性检查
8. 行业视觉设计趋势
9. 用户期望调研
10. 竞品模块设计分析
11. 风险识别与评估
12. 时间线规划

### P2 - 补充收集
1. 内容更新频率
2. 移动端适配需求
3. 视觉设计规范

---

## Framework Quality Checklist

- [ ] ✅ 框架覆盖了用户提出的所有核心问题
- [ ] ✅ 2-4个专业分析框架已选择并明确映射到章节
- [ ] ✅ 每个章节有清晰的分析目标、分析逻辑和核心假设
- [ ] ✅ 数据需求具体、可衡量，并包含搜索关键词
- [ ] ✅ 每个章节至少有一个可视化计划
- [ ] ✅ 数据优先级（P0/P1/P2）已合理分配
- [ ] ✅ 数据收集任务列表全面且无重复

---

**文档版本**: 1.0  
**创建日期**: 2026-04-28  
**分析领域**: 品牌分析 + 用户体验 + 信息架构  
**框架类型**: Phase 1 - 分析框架
