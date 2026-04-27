# Token 定义合并计划

## 问题描述
当前项目存在两个 tokens.css 文件，导致 token 定义重复，影响代码维护性：
- `/src/styles/tokens.css`
- `/src/styles/base/tokens.css`

## 合并策略

### 1. 分析两个文件的内容
- **`/src/styles/tokens.css`**: 包含完整的颜色、字体、间距、圆角、阴影等 token 定义，以及深色模式支持
- **`/src/styles/base/tokens.css`**: 包含更详细的设计系统 token，包括颜色缩放、玻璃拟态、动画等高级特性

### 2. 合并方案
- **保留 `base/tokens.css`** 作为主要的 token 定义文件，因为它包含更完整和现代的设计系统定义
- **删除 `tokens.css`** 文件，避免重复定义
- **更新引用**，确保所有组件和样式文件正确引用新的 token 定义

### 3. 具体步骤
1. 检查 `base/tokens.css` 是否包含 `tokens.css` 的所有必要定义
2. 确保 `base/tokens.css` 中的 token 命名与项目中使用的一致
3. 更新所有引用 `tokens.css` 的文件，改为引用 `base/tokens.css`
4. 删除 `tokens.css` 文件
5. 运行构建和测试，确保没有破坏任何功能
6. 更新相关文档和记录

## 预期结果
- 单一的 token 定义文件，提高代码维护性
- 统一的设计系统，避免 token 冲突
- 减少文件大小，提高构建性能
- 清晰的 token 管理流程
