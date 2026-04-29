# 项目资源管理最佳实践和规范

## 1. 资源命名规范

### 1.1 一般原则
- **清晰明了**：文件名应清晰表达文件的内容和用途
- **一致性**：在整个项目中使用一致的命名风格
- **避免特殊字符**：不要使用空格、特殊字符或中文字符
- **使用小写**：文件名应使用小写字母
- **使用连字符**：单词之间使用连字符 `-` 分隔
- **简短但描述性**：文件名应简短但足够描述文件内容

### 1.2 具体命名规范

#### 代码文件
- **组件文件**：`component-name.astro` 或 `component-name.js`
- **脚本文件**：`script-name.js` 或 `script-name.ts`
- **样式文件**：`style-name.css` 或 `style-name.scss`
- **配置文件**：`config-name.json` 或 `config-name.js`

#### 文档文件
- **技术文档**：`technical-topic.md`
- **设计文档**：`design-topic.md`
- **计划文档**：`plan-topic.md`
- **报告文档**：`report-topic.md`

#### 媒体资源
- **图片文件**：`image-description.png` 或 `image-description.jpg`
- **图标文件**：`icon-name.svg`
- **视频文件**：`video-description.mp4`

#### 测试文件
- **单元测试**：`component-name.test.js` 或 `component-name.spec.ts`
- **端到端测试**：`feature-name.e2e.js`

## 2. 资源分类标准

### 2.1 资源类型分类

| 类型 | 描述 | 示例文件 |
|------|------|----------|
| code | 代码文件 | .js, .ts, .astro, .css |
| documentation | 文档文件 | .md, .txt, .pdf |
| test | 测试文件 | .test.js, .spec.ts |
| script | 脚本文件 | .mjs, .sh, .bat |
| config | 配置文件 | .json, .yaml, .env |
| asset | 媒体资源 | .png, .jpg, .svg |
| other | 其他文件 | .editorconfig, .htaccess |

### 2.2 目录结构规范

#### 代码目录
- `src/components/` - 组件文件
- `src/scripts/` - 脚本文件
- `src/styles/` - 样式文件
- `src/pages/` - 页面文件
- `src/layouts/` - 布局文件
- `src/utils/` - 工具函数
- `src/data/` - 数据文件

#### 文档目录
- `docs/` - 项目文档
- `.trae/documents/` - 流程和计划文档
- `.trae/specs/` - 规范和规格文档

#### 测试目录
- `e2e/` - 端到端测试
- `src/test/` - 单元测试

#### 资源目录
- `public/images/` - 图片资源
- `public/icons/` - 图标资源
- `public/social/` - 社交媒体资源

## 3. 标签使用规范

### 3.1 标签分类

#### 功能标签
- `frontend` - 前端相关
- `backend` - 后端相关
- `ui` - 用户界面
- `ux` - 用户体验
- `animation` - 动画效果
- `performance` - 性能优化
- `accessibility` - 可访问性

#### 状态标签
- `development` - 开发中
- `completed` - 已完成
- `deprecated` - 已废弃
- `archived` - 已归档

#### 优先级标签
- `high-priority` - 高优先级
- `medium-priority` - 中优先级
- `low-priority` - 低优先级

#### 项目阶段标签
- `planning` - 规划阶段
- `implementation` - 实现阶段
- `testing` - 测试阶段
- `deployment` - 部署阶段

### 3.2 标签使用指南
- **使用小写**：标签应使用小写字母
- **使用连字符**：单词之间使用连字符 `-` 分隔
- **保持简洁**：标签应简短明了
- **避免重复**：不要使用重复或重叠的标签
- **使用有意义的标签**：标签应能够准确描述资源的特性

### 3.3 标签管理流程
1. **添加标签**：使用 `resource-manager.js add-tag` 命令添加标签
2. **移除标签**：使用 `resource-manager.js remove-tag` 命令移除标签
3. **列出标签**：使用 `resource-manager.js list-tags` 命令查看文件的标签
4. **搜索标签**：使用 `resource-manager.js search` 命令按标签搜索资源

## 4. 资源管理流程

### 4.1 资源创建流程
1. **规划**：确定资源的用途和类型
2. **命名**：根据命名规范为资源命名
3. **分类**：确定资源的分类
4. **创建**：创建资源文件
5. **索引**：运行资源扫描工具更新索引
6. **标签**：为资源添加适当的标签
7. **状态**：设置资源的初始状态

### 4.2 资源更新流程
1. **修改**：更新资源内容
2. **版本控制**：使用 Git 提交更改
3. **状态更新**：根据需要更新资源状态
4. **标签更新**：根据需要添加或移除标签
5. **索引更新**：运行资源扫描工具更新索引

### 4.3 资源维护流程
1. **定期检查**：定期检查资源的状态和使用情况
2. **清理**：清理不再使用的资源
3. **归档**：归档已完成但需要保留的资源
4. **更新**：更新过时的资源
5. **备份**：定期备份重要资源

### 4.4 资源搜索和发现流程
1. **使用搜索工具**：使用 `resource-manager.js search` 命令搜索资源
2. **按类型过滤**：使用类型参数过滤资源
3. **按标签过滤**：使用标签参数过滤资源
4. **按状态过滤**：使用 `resource-status.js filter` 命令按状态过滤资源
5. **使用报告**：使用 `resource-manager.js report` 命令生成资源报告

## 5. 版本控制最佳实践

### 5.1 Git 工作流程
- **分支管理**：使用 feature 分支开发新功能
- **提交规范**：使用语义化提交消息
- **代码审查**：通过 Pull Request 进行代码审查
- **版本标签**：使用版本标签标记重要版本

### 5.2 提交消息规范
- **格式**：`<type>(<scope>): <description>`
- **类型**：feat, fix, docs, style, refactor, test, chore
- **范围**：可选，指定修改的模块
- **描述**：简短描述修改内容

### 5.3 版本号规范
- **格式**：`MAJOR.MINOR.PATCH`
- **MAJOR**：不兼容的 API 更改
- **MINOR**：向后兼容的功能添加
- **PATCH**：向后兼容的 bug 修复

## 6. 资源管理工具使用指南

### 6.1 资源扫描工具
```bash
# 扫描项目资源并生成索引
node scripts/resource-scanner.js
```

### 6.2 资源管理工具
```bash
# 生成资源报告
node scripts/resource-manager.js report

# 搜索资源
node scripts/resource-manager.js search <query>

# 为文件添加标签
node scripts/resource-manager.js add-tag <file> <tag>

# 移除文件标签
node scripts/resource-manager.js remove-tag <file> <tag>

# 列出文件标签
node scripts/resource-manager.js list-tags <file>
```

### 6.3 资源状态管理工具
```bash
# 设置资源状态
node scripts/resource-status.js set <file> <status> [description]

# 获取资源状态
node scripts/resource-status.js get <file>

# 列出所有资源状态
node scripts/resource-status.js list

# 按状态过滤资源
node scripts/resource-status.js filter <status>
```

## 7. 团队协作指南

### 7.1 资源共享
- **使用共享目录**：将共享资源放在公共目录中
- **文档化**：为共享资源创建文档
- **版本控制**：使用 Git 管理共享资源

### 7.2 资源审查
- **定期审查**：定期审查资源的使用情况
- **反馈机制**：建立资源使用反馈机制
- **优化建议**：根据反馈优化资源管理流程

### 7.3 培训和文档
- **新成员培训**：为新成员提供资源管理培训
- **文档更新**：定期更新资源管理文档
- **最佳实践分享**：分享资源管理的最佳实践

## 8. 资源管理检查清单

### 8.1 资源创建检查
- [ ] 资源命名是否符合规范？
- [ ] 资源分类是否正确？
- [ ] 资源是否添加了适当的标签？
- [ ] 资源状态是否设置？
- [ ] 资源是否已添加到版本控制？

### 8.2 资源更新检查
- [ ] 资源修改是否已提交到版本控制？
- [ ] 资源状态是否已更新？
- [ ] 资源标签是否需要更新？
- [ ] 资源索引是否已更新？

### 8.3 资源维护检查
- [ ] 资源是否仍然需要？
- [ ] 资源是否已过时？
- [ ] 资源是否需要归档？
- [ ] 资源是否需要备份？

## 9. 常见问题解答

### 9.1 如何处理大型资源文件？
- 使用 Git LFS 管理大型文件
- 考虑使用外部存储服务
- 确保大型资源文件有适当的压缩

### 9.2 如何处理敏感资源？
- 不要将敏感资源提交到版本控制
- 使用环境变量或配置文件管理敏感信息
- 建立敏感资源的访问控制

### 9.3 如何处理跨项目共享资源？
- 创建共享资源库
- 使用包管理器管理共享资源
- 建立资源共享的最佳实践

### 9.4 如何确保资源管理的一致性？
- 定期审查资源管理实践
- 建立资源管理的自动化工具
- 提供资源管理的培训和文档

## 10. 结论

有效的资源管理是项目成功的关键因素之一。通过遵循本规范，团队可以更有效地管理项目资源，提高开发效率，减少维护成本，确保项目的可持续发展。

资源管理是一个持续改进的过程，团队应定期评估和优化资源管理实践，以适应项目的不断变化和发展。