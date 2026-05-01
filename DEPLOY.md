# 部署文档

本指南将帮助您了解如何部署祈研所项目。

## 目录

- [部署方式](#部署方式)
- [GitHub Pages 部署](#github-pages-部署)
- [本地构建](#本地构建)
- [部署前检查清单](#部署前检查清单)
- [常见问题](#常见问题)

## 部署方式

项目支持多种部署方式：

| 部署平台 | 推荐度 | 说明 |
|---------|--------|------|
| GitHub Pages | ⭐⭐⭐⭐⭐ | 项目默认部署方式，完全免费 |
| Vercel | ⭐⭐⭐⭐ | 简单快捷，性能优秀 |
| Netlify | ⭐⭐⭐⭐ | 功能丰富，CI/CD 强大 |
| 自建服务器 | ⭐⭐⭐ | 需要自己维护 |

## GitHub Pages 部署

### 自动部署（推荐）

项目已配置 GitHub Actions 自动部署流程：

1. 确保仓库设置中：
   - 在 Settings > Pages 中，Source 设置为 "Deploy from a branch"
   - Branch 设置为 `gh-pages`
   - Folder 设置为 `/ (root)`

2. 自动部署触发条件：
   - 推送到 main 分支时
   - 创建 Pull Request 时（预览部署）

3. 工作流程文件：`.github/workflows/deploy.yml`

### 手动部署

如需手动部署，按以下步骤：

1. 本地构建项目

```bash
npm run build
```

2. 确保构建产物在 `dist/` 目录

3. 使用 gh-pages 工具部署

```bash
npm install -g gh-pages
gh-pages -d dist
```

## 本地构建

### 生产构建

```bash
npm run build
```

构建完成后，产物将生成在 `dist/` 目录中。

### 预览构建

```bash
npm run preview
```

这将在本地启动一个服务器预览构建产物，默认地址为 http://localhost:4321

### 构建产物检查

构建完成后，您应该看到以下内容：

```
dist/
├── index.html
├── 404.html
├── favicon.ico
├── robots.txt
├── sitemap-index.xml
├── rss.xml
├── manifest.webmanifest
├── service-worker.js
├── registerSW.js
├── _astro/           # 编译后的资源文件
├── pagefind/         # 搜索索引
├── en/               # 英文站点
├── zh/               # 中文站点
└── images/           # 图片资源
```

## 其他平台部署

### Vercel 部署

1. 将项目推送到 GitHub
2. 在 Vercel 中导入仓库
3. Vercel 会自动检测 Astro 项目并配置部署
4. 等待部署完成

配置选项：
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Netlify 部署

1. 将项目推送到 GitHub
2. 在 Netlify 中添加新站点
3. 选择从 GitHub 导入
4. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`

### 自建服务器部署

1. 构建项目

```bash
npm run build
```

2. 将 `dist/` 目录内容上传到服务器

3. 使用任意静态文件服务器托管，例如：

**Nginx 配置示例**：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /404.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 部署前检查清单

部署前请确保：

- [ ] 所有测试通过
  ```bash
  npm test
  npm run test:e2e
  ```
- [ ] 代码检查通过
  ```bash
  npm run lint
  ```
- [ ] 本地构建成功
  ```bash
  npm run build
  ```
- [ ] 构建产物大小在预算范围内
  ```bash
  npm run size-check
  ```
- [ ] 所有链接可正常访问
- [ ] 图片资源已优化
- [ ] 中英文内容同步
- [ ] SEO 元数据完整

## 部署后验证

部署完成后，请验证：

- [ ] 站点可以正常访问
- [ ] 中英文切换功能正常
- [ ] 搜索功能正常工作
- [ ] 图片资源加载正常
- [ ] RSS 订阅正常
- [ ] PWA 功能可用
- [ ] 暗色/浅色模式切换正常
- [ ] 所有内部链接可访问

## 性能监控

### Lighthouse 审计

项目集成了 Lighthouse 审计：

```bash
npm run lighthouse
```

这将生成性能报告，包含：
- 性能评分
- 可访问性评分
- 最佳实践评分
- SEO 评分

### 性能优化建议

基于 Lighthouse 报告，可考虑以下优化：

- 图片格式优化（WebP/AVIF）
- 启用 Gzip/Brotli 压缩
- 配置 CDN 缓存
- 懒加载非关键资源
- 优化第三方脚本加载

## 回滚部署

如需回滚到之前的版本：

### GitHub Pages

1. 找到之前成功的 commit
2. 从该 commit 创建分支
3. 将该分支推送到 `gh-pages`

```bash
git checkout <commit-hash>
git checkout -b rollback
git push origin rollback:gh-pages --force
```

### 其他平台

多数托管平台都提供部署历史和回滚功能，直接在平台界面操作即可。

## 环境变量

项目不需要额外的环境变量配置，但如需自定义，可创建以下文件：

- `.env` - 本地开发环境
- `.env.production` - 生产环境

## 常见问题

### 构建失败

**问题**：构建过程中出现错误

**解决方案**：
1. 确保 Node.js 版本 >= 20.0.0
2. 删除 `node_modules` 并重新安装依赖
3. 清除缓存：`rm -rf .astro`
4. 检查代码是否有 TypeScript 错误

### 部署后页面 404

**问题**：部署后部分页面无法访问

**解决方案**：
1. 确认所有页面路由正确
2. 检查服务器配置是否支持 SPA 路由
3. 确认 `dist` 目录结构完整

### 搜索功能不工作

**问题**：部署后搜索功能无法使用

**解决方案**：
1. 确认 `dist/pagefind` 目录存在
2. 检查 pagefind 相关文件是否正确加载
3. 重新构建项目确保索引生成

### 图片资源不显示

**问题**：图片资源无法正常加载

**解决方案**：
1. 检查图片路径是否正确
2. 确认图片文件存在于 `public/` 目录
3. 检查服务器配置是否正确处理图片文件

### PWA 功能不工作

**问题**：PWA 相关功能异常

**解决方案**：
1. 确保使用 HTTPS 访问（本地开发除外）
2. 检查 `manifest.webmanifest` 文件
3. 验证 Service Worker 是否正确注册

## 获取帮助

部署过程中遇到问题？

- 查看项目 [README.md](./README.md)
- 查看项目 [Issues](../../issues)
- 提交新的 Issue 寻求帮助
