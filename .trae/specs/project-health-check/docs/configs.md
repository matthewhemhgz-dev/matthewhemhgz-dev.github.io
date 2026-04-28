# 祈研所 Qi-Lab 配置清单

## 1. 配置文件概览

| 文件 | 用途 | 类型 | 优先级 |
|------|------|------|--------|
| `astro.config.mjs` | Astro 框架配置 | 核心 | P0 |
| `tailwind.config.mjs` | Tailwind CSS 配置 | 样式 | P0 |
| `tsconfig.json` | TypeScript 配置 | 类型 | P0 |
| `package.json` | 依赖和脚本 | 依赖 | P0 |
| `eslint.config.mjs` | ESLint 配置 | 代码质量 | P1 |
| `playwright.config.ts` | Playwright 配置 | 测试 | P1 |
| `vitest.config.ts` | Vitest 配置 | 测试 | P1 |
| `.prettierrc` | Prettier 配置 | 格式化 | P2 |

## 2. 核心配置文件

### 2.1 astro.config.mjs

**用途**: Astro 框架核心配置

**关键配置项**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `site` | `https://matthewhemhgz-dev.github.io` | 站点基础 URL |
| `base` | `/` | 基础路径 |
| `output` | `static` | 输出模式 |
| `integrations` | `[mdx(), sitemap(), tailwind(), pagefind(), pwa()]` | 集成插件 |
| `build.format` | `'directory'` | 构建格式 |

**集成插件**:

| 插件 | 版本 | 用途 |
|------|------|------|
| `@astrojs/mdx` | ^5.0.3 | MDX 支持 |
| `@astrojs/sitemap` | ^3.7.2 | 站点地图 |
| `@astrojs/tailwind` | ^5.1.0 | Tailwind CSS |
| `astro-pagefind` | ^1.8.6 | 静态搜索 |
| `@vite-pwa/astro` | ^1.2.0 | PWA 支持 |

### 2.2 tailwind.config.mjs

**用途**: Tailwind CSS 配置

**关键配置项**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `content` | `['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']` | 内容扫描路径 |
| `theme.extend` | 自定义主题 | 扩展主题配置 |

**主题扩展**:

| 扩展项 | 说明 |
|--------|------|
| `colors` | 品牌颜色变量 |
| `fontFamily` | 自定义字体 |
| `spacing` | 自定义间距 |
| `boxShadow` | 自定义阴影 |

### 2.3 tsconfig.json

**用途**: TypeScript 配置

**关键配置项**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `compilerOptions.target` | `ESNext` | 目标 ES 版本 |
| `compilerOptions.module` | `ESNext` | 模块系统 |
| `compilerOptions.moduleResolution` | `bundler` | 模块解析方式 |
| `compilerOptions.baseUrl` | `./` | 基础路径 |
| `compilerOptions.paths` | `{ "@/*": ["src/*"] }` | 路径别名 |
| `compilerOptions.strict` | `true` | 严格模式 |

**路径别名**:

| 别名 | 路径 |
|------|------|
| `@/*` | `src/*` |

### 2.4 package.json

**用途**: 项目依赖和脚本定义

**关键脚本**:

| 脚本 | 命令 | 用途 |
|------|------|------|
| `dev` | `astro dev` | 开发服务器 |
| `build` | `astro build` | 生产构建 |
| `preview` | `astro preview` | 预览构建结果 |
| `lint` | `eslint .` | ESLint 检查 |
| `format` | `prettier --write .` | 代码格式化 |
| `test` | `vitest run` | 单元测试 |
| `test:e2e` | `playwright test` | 端到端测试 |
| `size-check` | `node scripts/check-bundle-size.mjs` | 构建产物大小检查 |
| `lighthouse` | `node scripts/lighthouse-audit.mjs` | Lighthouse 审计 |

## 3. 代码质量配置

### 3.1 eslint.config.mjs

**用途**: ESLint 代码检查配置

**关键配置项**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `plugins` | `['astro']` | Astro 插件 |
| `languageOptions.parserOptions.project` | `./tsconfig.json` | TS 配置路径 |
| `rules` | 自定义规则 | ESLint 规则 |

**规则示例**:

| 规则 | 值 | 说明 |
|------|-----|------|
| `astro/no-unused-define-vars-in-content` | `error` | 禁止未使用的变量 |
| `astro/prefer-split-class-list` | `warn` | 推荐拆分类列表 |

### 3.2 .prettierrc

**用途**: Prettier 代码格式化配置

**关键配置项**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `semi` | `true` | 语句末尾加分号 |
| `singleQuote` | `true` | 使用单引号 |
| `printWidth` | `100` | 每行最大字符数 |
| `tabWidth` | `2` | Tab 宽度 |
| `plugins` | `['prettier-plugin-astro']` | Astro 插件 |

## 4. 测试配置

### 4.1 playwright.config.ts

**用途**: Playwright 端到端测试配置

**关键配置项**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `testDir` | `./e2e` | 测试目录 |
| `timeout` | `30000` | 超时时间 |
| `fullyParallel` | `true` | 并行执行 |
| `reporter` | `['html', 'json']` | 报告格式 |
| `use.baseURL` | `http://localhost:4321` | 测试基础 URL |

### 4.2 vitest.config.ts

**用途**: Vitest 单元测试配置

**关键配置项**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `test.environment` | `happy-dom` | 测试环境 |
| `resolve.alias` | `{ "@": "./src" }` | 路径别名 |

## 5. GitHub 配置

### 5.1 .github/workflows/deploy.yml

**用途**: GitHub Actions CI/CD 配置

**工作流程**:

| 步骤 | 说明 |
|------|------|
| `Checkout` | 检出代码 |
| `Set up Node.js` | 设置 Node 环境 |
| `Install dependencies` | 安装依赖 |
| `Lint` | ESLint 检查 |
| `Build` | 构建项目 |
| `Size check` | 构建产物大小检查 |
| `Deploy` | 部署到 GitHub Pages |

### 5.2 .github/dependabot.yml

**用途**: Dependabot 自动更新配置

**配置项**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `package-ecosystem` | `npm` | 包生态系统 |
| `schedule.interval` | `weekly` | 更新频率 |

## 6. 编辑器配置

### 6.1 .vscode/extensions.json

**推荐扩展**:

| 扩展 | 用途 |
|------|------|
| `astro-build.astro-vscode` | Astro 支持 |
| `bradlc.vscode-tailwindcss` | Tailwind CSS |
| `dbaeumer.vscode-eslint` | ESLint |
| `esbenp.prettier-vscode` | Prettier |

### 6.2 .vscode/launch.json

**调试配置**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `type` | `node` | 调试类型 |
| `request` | `launch` | 启动方式 |
| `name` | `Astro Dev` | 配置名称 |
| `program` | `node_modules/astro/dist/cli/index.js` | 入口文件 |
| `args` | `['dev']` | 参数 |

## 7. 其他配置

### 7.1 .gitignore

**忽略规则**:

| 模式 | 说明 |
|------|------|
| `node_modules/` | Node 依赖 |
| `.astro/` | Astro 缓存 |
| `dist/` | 构建产物 |
| `.env` | 环境变量 |
| `*.log` | 日志文件 |

### 7.2 .editorconfig

**编辑器配置**:

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `charset` | `utf-8` | 字符编码 |
| `indent_style` | `space` | 缩进方式 |
| `indent_size` | `2` | 缩进大小 |
| `end_of_line` | `lf` | 行尾符 |
| `trim_trailing_whitespace` | `true` | 去除尾部空格 |

## 8. 配置依赖关系图

```
astro.config.mjs
├── @astrojs/mdx
├── @astrojs/sitemap
├── @astrojs/tailwind ──→ tailwind.config.mjs
├── astro-pagefind ──→ pagefind
└── @vite-pwa/astro ──→ vite-plugin-pwa

tsconfig.json
├── @/* → src/*

eslint.config.mjs
├── eslint-plugin-astro
└── typescript-eslint

playwright.config.ts
└── @playwright/test

vitest.config.ts
├── happy-dom
└── jsdom
```

---

**文档版本**: v1.0  
**创建日期**: 2026-04-28  
**适用项目**: qi-lab-site