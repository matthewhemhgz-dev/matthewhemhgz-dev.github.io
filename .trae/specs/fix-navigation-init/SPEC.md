# 文章导航组件初始化修复规格

## Why

文章详情页的目录导航（TableOfContents）和阅读进度条（ReadingProgress）在 Astro 的客户端导航场景下无法正常工作。问题表现为：
- 需要刷新页面才能显示和激活
- 在 Astro 客户端导航（无刷新页面跳转）后功能失效
- 这是因为 `DOMContentLoaded` 事件在客户端导航时不会再次触发

## What Changes

### 需要修复的组件

1. **TableOfContents.astro** - 目录侧边栏组件
   - 当前问题：`DOMContentLoaded` 事件仅在首次加载时触发
   - 修复方案：使用 `astro:page-load` 事件 + 清理机制

2. **ReadingProgress.astro** - 阅读进度条组件
   - 当前问题：客户端导航后进度条功能失效
   - 修复方案：使用 `astro:page-load` 事件 + 清理机制

3. **OnPageNav.astro** - 关于页面内导航组件
   - 当前问题：页面切换后导航功能失效
   - 修复方案：同上

### 关键修复策略

```javascript
// 1. 清理函数 - 移除旧的事件监听器
function cleanup() {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }
}

// 2. 初始化时先清理，再延迟初始化
document.addEventListener('astro:page-load', () => {
  cleanup();
  setTimeout(initTableOfContents, 50);
});

// 3. 页面离开前清理
document.addEventListener('astro:before-swap', cleanup);
```

## Impact

### 受影响的功能
- 博客详情页的目录导航
- 博客详情页的阅读进度条
- 关于页面的侧边导航

### 受影响的文件
- `src/components/global/TableOfContents.astro`
- `src/components/global/ReadingProgress.astro`
- `src/components/ui/OnPageNav.astro`

## ADDED Requirements

### Requirement: 导航组件必须在客户端导航后正常工作

#### Scenario: Astro 客户端导航后
- **WHEN** 用户从博客列表页点击文章链接（无刷新导航）
- **THEN** 目录导航和阅读进度条必须立即生效
- **AND** 滚动时目录项必须正确高亮
- **AND** 点击目录项必须平滑滚动到对应章节

#### Scenario: 连续客户端导航
- **WHEN** 用户在多个博客文章之间导航
- **THEN** 每个页面的导航组件必须独立工作
- **AND** 不能有事件监听器泄漏
- **AND** 内存使用保持稳定

## MODIFIED Requirements

### Requirement: TableOfContents 组件必须使用正确的初始化事件

**当前实现**:
```javascript
document.addEventListener('DOMContentLoaded', initTableOfContents);
```

**修改后**:
```javascript
document.addEventListener('astro:page-load', () => {
  cleanup();
  setTimeout(initTableOfContents, 50);
});
document.addEventListener('astro:before-swap', cleanup);
```

## REMOVED Requirements

无

## Technical Notes

### Astro 页面生命周期事件
- `astro:page-load`: 在每个页面加载时触发（包括首次加载和客户端导航后）
- `astro:before-swap`: 在页面内容切换前触发
- `DOMContentLoaded`: 仅在首次页面加载时触发

### 最佳实践
1. 使用 `astro:page-load` 替代 `DOMContentLoaded`
2. 在新初始化前清理旧的事件监听器
3. 使用 `setTimeout` 延迟初始化以确保 DOM 完全就绪
4. 在 `astro:before-swap` 时清理资源
