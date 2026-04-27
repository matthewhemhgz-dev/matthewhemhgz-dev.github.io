此次合并主要集中在网站的可访问性优化、动效增强和布局改进，包括导航栏的ARIA属性添加、英雄区域的动态光效引入以及响应式布局的完善。同时删除了冗余的审计报告文件，整理了项目文档结构。
| 文件 | 变更 |
|------|---------|
| src/components/global/Navigation.astro | - 添加ARIA属性(aria-labelledby, aria-hidden)提高可访问性<br>- 修复导航菜单的状态管理<br>- 禁用nav-collapsed避免布局混乱 |
| src/components/sections/HeroSection.astro | - 添加动态光效元素(hero-dynamic-light)增强视觉效果<br>- 优化标题行的class列表格式 |
| src/scripts/init.js | - 优化粒子系统初始化时序<br>- 改进滚动处理器的性能 |
| src/styles/base/tokens.css | - 统一设计令牌定义<br>- 修复token重复问题 |
| src/styles/components/navigation.css | - 优化移动端导航栏布局<br>- 修复导航栏冲突问题 |
| src/styles/sections/home-hero.css | - 完善英雄区域的响应式定位<br>- 优化浮动卡片的布局 |
| .github/dependabot.yml | - 更新依赖管理配置 |
| 祈研所网站第二轮视觉检查报告.md | - 删除冗余的审计报告文件 |