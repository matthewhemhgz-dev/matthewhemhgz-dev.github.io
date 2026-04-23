# 祈研所网站 - 渐进式重构计划

## 📅 总体计划

- **总周期**: 3 个迭代
- **预计完成时间**: 逐步推进
- **风险等级**: 中低风险

---

## 🔄 迭代 1: 提取内联样式（低风险）

### 目标

将所有组件和页面中的内联 `<style>` 标签提取到外部 CSS 文件中。

### 任务清单

- [ ] 创建 `styles/page-home.css` - 提取首页内联样式
- [ ] 创建 `styles/component-dash-card.css` - 提取 DashCard 样式
- [ ] 创建 `styles/component-theme-toggle.css` - 提取 ThemeToggle 样式
- [ ] 创建 `styles/component-language-toggle.css` - 提取 LanguageToggle 样式
- [ ] 更新相应的组件引用新的 CSS 文件
- [ ] 构建测试确保无问题

### 验收标准

- ✅ 所有内联 `<style>` 标签都已移到外部文件
- ✅ 构建成功，无样式错误
- ✅ 视觉效果保持一致

---

## 🔄 迭代 2: Tailwind 集成优化（中风险）

### 目标

优化 Tailwind 配置，开始将简单样式迁移到 Tailwind 工具类。

### 任务清单

- [ ] 扩展 `tailwind.config.mjs` - 添加更多自定义配置
- [ ] 创建基础 Tailwind 组件类
- [ ] 迁移简单 UI 组件（ThemeToggle, LanguageToggle）
- [ ] 迁移 DashCard 组件到 Tailwind
- [ ] 更新首页部分样式使用 Tailwind
- [ ] 构建测试和视觉回归测试

### 验收标准

- ✅ 简单组件完全使用 Tailwind
- ✅ 视觉效果保持一致
- ✅ Tailwind 配置完善且实用

---

## 🔄 迭代 3: CSS 文件结构重组（中风险）

### 目标

重新组织 CSS 文件结构，建立更清晰的架构。

### 任务清单

- [ ] 创建新的目录结构
- [ ] 移动和合并现有 CSS 文件
- [ ] 更新所有导入引用
- [ ] 清理冗余样式
- [ ] 全面构建和测试
- [ ] 最终验证和文档更新

### 新的文件结构

```
src/styles/
├── base/
│   ├── reset.css
│   ├── tokens.css
│   └── global.css
├── components/
│   ├── button.css
│   ├── card.css
│   └── navigation.css
├── sections/
│   ├── hero.css
│   ├── about.css
│   └── cta.css
└── utilities/
    ├── animations.css
    └── helpers.css
```

### 验收标准

- ✅ 新的 CSS 结构完整
- ✅ 所有引用正确更新
- ✅ 构建成功
- ✅ 无样式回归问题

---

## 📋 注意事项

### 风险控制

1. 每个迭代后必须完整构建测试
2. 使用 Git 分支管理重构过程
3. 保持样式的视觉一致性
4. 优先保证功能正常，再优化代码结构

### 测试要点

- 亮色/深色模式切换
- 响应式布局（移动/平板/桌面）
- 动画和交互效果
- 所有页面的视觉一致性

---

## 🎯 长期目标

重构完成后，网站将具备：

- ✅ 更清晰的代码结构
- ✅ 更好的可维护性
- ✅ 更高效的开发体验
- ✅ 一致的设计语言
- ✅ 充分利用 Tailwind CSS 优势
