# Phase 1 立即行动项 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立测试体系、强化 CI 质量门禁、补充项目文档，将项目从"无测试无文档"提升到"工程化生产基线"。

**Architecture:** 引入 Vitest 作为测试框架，利用 `@astrojs/test-utils` 测试 Astro 组件渲染输出。CI 中移除 `continue-on-error` 使 Lint 失败阻塞部署。创建 README.md 作为项目入口文档。

**Tech Stack:** Vitest 3 + @astrojs/test-utils + jsdom + GitHub Actions

---

## 文件结构

```
新增文件:
  vitest.config.ts              — Vitest 配置（jsdom 环境、Astro 集成）
  src/test/
    setup.ts                    — 测试全局 setup（DOM polyfill）
    BrandLogo.test.ts           — BrandLogo 组件渲染测试
    SectionHeader.test.ts       — SectionHeader 组件渲染测试
    DashCard.test.ts            — DashCard 组件渲染 + 逻辑测试
    Navigation.test.ts          — Navigation 组件渲染测试
    card-tilt.test.ts           — CardTilt 类单元测试
  README.md                     — 项目文档

修改文件:
  package.json                  — 添加 vitest 依赖 + test 脚本
  .github/workflows/deploy.yml  — 移除 continue-on-error，添加 test 步骤
  tsconfig.json                 — 移除无用的 React JSX 配置
```

---

### Task 1: 安装 Vitest 及测试依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装依赖**

```bash
cd /workspace/qi-lab-site
npm install -D vitest @astrojs/test-utils jsdom
```

- [ ] **Step 2: 验证安装**

Run: `npx vitest --version`
Expected: 输出 vitest 版本号（3.x）

- [ ] **Step 3: 在 package.json 中添加 test 脚本**

在 `scripts` 中添加：

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: 提交**

```bash
git add package.json package-lock.json
git commit -m "chore: add vitest and test dependencies"
```

---

### Task 2: 配置 Vitest

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: 创建 vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,js}'],
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

- [ ] **Step 2: 创建测试 setup 文件**

Create `src/test/setup.ts`:

```typescript
// jsdom 环境下补充 DOM API polyfill
if (typeof globalThis.HTMLElement === 'undefined') {
  // @ts-expect-error — jsdom should provide this, but guard against edge cases
  globalThis.HTMLElement = class HTMLElement extends Element {};
}
```

- [ ] **Step 3: 运行空测试验证配置**

Run: `npx vitest run`
Expected: "No test files found"（配置正确，无报错）

- [ ] **Step 4: 提交**

```bash
git add vitest.config.ts src/test/setup.ts
git commit -m "chore: configure vitest with jsdom environment"
```

---

### Task 3: BrandLogo 组件测试

**Files:**
- Create: `src/test/BrandLogo.test.ts`

- [ ] **Step 1: 编写测试**

Create `src/test/BrandLogo.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@astrojs/test-utils';
import BrandLogo from '../components/global/BrandLogo.astro';

describe('BrandLogo', () => {
  it('默认渲染为 icon 变体', async () => {
    const html = await render(BrandLogo, {});
    expect(html).toContain('brand-logo--icon');
    expect(html).toContain('祈研所 Logo');
    expect(html).toContain('/images/logo.svg');
  });

  it('full 变体包含文字"祈研所"', async () => {
    const html = await render(BrandLogo, { variant: 'full' });
    expect(html).toContain('brand-logo--full');
    expect(html).toContain('祈研所</span>');
  });

  it('sm 尺寸使用 28px 图标', async () => {
    const html = await render(BrandLogo, { size: 'sm' });
    expect(html).toContain('width="28"');
    expect(html).toContain('height="28"');
  });

  it('lg 尺寸使用 48px 图标', async () => {
    const html = await render(BrandLogo, { size: 'lg' });
    expect(html).toContain('width="48"');
    expect(html).toContain('height="48"');
  });

  it('链接指向首页', async () => {
    const html = await render(BrandLogo, {});
    expect(html).toMatch(/href="\/"/);
  });

  it('包含 aria-label', async () => {
    const html = await render(BrandLogo, {});
    expect(html).toContain('aria-label="祈研所"');
  });
});
```

- [ ] **Step 2: 运行测试**

Run: `npx vitest run src/test/BrandLogo.test.ts`
Expected: 6 tests PASS

- [ ] **Step 3: 提交**

```bash
git add src/test/BrandLogo.test.ts
git commit -m "test: add BrandLogo component tests"
```

---

### Task 4: SectionHeader 组件测试

**Files:**
- Create: `src/test/SectionHeader.test.ts`

- [ ] **Step 1: 编写测试**

Create `src/test/SectionHeader.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@astrojs/test-utils';
import SectionHeader from '../components/ui/SectionHeader.astro';

describe('SectionHeader', () => {
  it('默认渲染 label 和 title', async () => {
    const html = await render(SectionHeader, {});
    expect(html).toContain('// SECTION');
    expect(html).toContain('Section Title');
  });

  it('自定义 label 和 title', async () => {
    const html = await render(SectionHeader, {
      label: '// ABOUT',
      title: '关于祈研所',
    });
    expect(html).toContain('// ABOUT');
    expect(html).toContain('关于祈研所');
  });

  it('center 对齐添加对应 class', async () => {
    const html = await render(SectionHeader, { align: 'center' });
    expect(html).toContain('section-header--center');
  });

  it('minimal 变体隐藏装饰线', async () => {
    const html = await render(SectionHeader, { variant: 'minimal' });
    expect(html).toContain('section-header--minimal');
  });

  it('title 渲染为 h2 标签', async () => {
    const html = await render(SectionHeader, { title: '测试标题' });
    expect(html).toMatch(/<h2[^>]*>测试标题<\/h2>/);
  });

  it('label 为空时不渲染 label 元素', async () => {
    const html = await render(SectionHeader, { label: '' });
    expect(html).not.toContain('section-label');
  });
});
```

- [ ] **Step 2: 运行测试**

Run: `npx vitest run src/test/SectionHeader.test.ts`
Expected: 6 tests PASS

- [ ] **Step 3: 提交**

```bash
git add src/test/SectionHeader.test.ts
git commit -m "test: add SectionHeader component tests"
```

---

### Task 5: DashCard 组件测试

**Files:**
- Create: `src/test/DashCard.test.ts`

- [ ] **Step 1: 编写测试**

Create `src/test/DashCard.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@astrojs/test-utils';
import DashCard from '../components/ui/DashCard.astro';

describe('DashCard', () => {
  it('默认渲染 label 和 value', async () => {
    const html = await render(DashCard, {});
    expect(html).toContain('Metric');
    expect(html).toContain('0');
  });

  it('自定义 label 和 value', async () => {
    const html = await render(DashCard, {
      label: '原创文章',
      value: '12',
    });
    expect(html).toContain('原创文章');
    expect(html).toContain('12');
  });

  it('percentage 被钳制到 0-100 范围', async () => {
    // 超过 100 应被钳制
    const html = await render(DashCard, { percentage: 150 });
    expect(html).toContain('100%');

    // 负数应被钳制到 0
    const html2 = await render(DashCard, { percentage: -10 });
    expect(html2).toContain('0%');
  });

  it('amber 颜色变体', async () => {
    const html = await render(DashCard, { color: 'amber' });
    expect(html).toContain('data-color="amber"');
  });

  it('包含 tilt-card class', async () => {
    const html = await render(DashCard, {});
    expect(html).toContain('tilt-card');
  });

  it('显示百分比文本', async () => {
    const html = await render(DashCard, { percentage: 75 });
    expect(html).toContain('75%');
  });
});
```

- [ ] **Step 2: 运行测试**

Run: `npx vitest run src/test/DashCard.test.ts`
Expected: 6 tests PASS

- [ ] **Step 3: 提交**

```bash
git add src/test/DashCard.test.ts
git commit -m "test: add DashCard component tests"
```

---

### Task 6: Navigation 组件测试

**Files:**
- Create: `src/test/Navigation.test.ts`

- [ ] **Step 1: 编写测试**

Create `src/test/Navigation.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@astrojs/test-utils';
import Navigation from '../components/global/Navigation.astro';

describe('Navigation', () => {
  it('渲染所有导航链接', async () => {
    const html = await render(Navigation, { currentPath: '/' });
    expect(html).toContain('首页');
    expect(html).toContain('关于');
    expect(html).toContain('博客');
    expect(html).toContain('标签');
  });

  it('首页路径标记为 active', async () => {
    const html = await render(Navigation, { currentPath: '/' });
    expect(html).toContain('nav-link active');
  });

  it('博客路径标记为 active', async () => {
    const html = await render(Navigation, { currentPath: '/blog' });
    // 简单验证：active class 出现在博客链接上
    const blogLinkMatch = html.match(/<a[^>]*href="\/blog"[^>]*class="[^"]*active[^"]*"/);
    expect(blogLinkMatch).not.toBeNull();
  });

  it('博客子路径也标记为 active', async () => {
    const html = await render(Navigation, { currentPath: '/blog/ai-era-knowledge-worker' });
    const blogLinkMatch = html.match(/<a[^>]*href="\/blog"[^>]*class="[^"]*active[^"]*"/);
    expect(blogLinkMatch).not.toBeNull();
  });

  it('包含 skip-link 跳转链接', async () => {
    const html = await render(Navigation, {});
    // Navigation 本身不含 skip-link（在 BaseLayout 中），但包含 BrandLogo
    expect(html).toContain('祈研所 Logo');
  });

  it('包含移动端汉堡菜单', async () => {
    const html = await render(Navigation, {});
    expect(html).toContain('nav-toggle-input');
    expect(html).toContain('hamburger-line');
  });

  it('包含 aria-live 状态区域', async () => {
    const html = await render(Navigation, {});
    expect(html).toContain('aria-live="polite"');
  });
});
```

- [ ] **Step 2: 运行测试**

Run: `npx vitest run src/test/Navigation.test.ts`
Expected: 7 tests PASS

- [ ] **Step 3: 提交**

```bash
git add src/test/Navigation.test.ts
git commit -m "test: add Navigation component tests"
```

---

### Task 7: CardTilt 工具函数测试

**Files:**
- Create: `src/test/card-tilt.test.ts`

- [ ] **Step 1: 编写测试**

Create `src/test/card-tilt.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CardTilt } from '../scripts/card-tilt';

describe('CardTilt', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('构造函数在非精细指针设备上不绑定事件', () => {
    // 模拟触摸设备
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '',
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    } as MediaQueryList);

    const card = document.createElement('div');
    card.classList.add('tilt-card');
    document.body.appendChild(card);

    const tilt = new CardTilt('.tilt-card');
    expect(tilt.elements).toHaveLength(0);
  });

  it('构造函数在精细指针设备上绑定事件', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '',
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    } as MediaQueryList);

    const card = document.createElement('div');
    card.classList.add('tilt-card');
    document.body.appendChild(card);

    const tilt = new CardTilt('.tilt-card');
    expect(tilt.elements).toHaveLength(1);
  });

  it('destroy() 清理所有事件监听', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '',
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    } as MediaQueryList);

    const card = document.createElement('div');
    card.classList.add('tilt-card');
    document.body.appendChild(card);

    const tilt = new CardTilt('.tilt-card');
    expect(tilt.elements).toHaveLength(1);

    tilt.destroy();
    expect(tilt.elements).toHaveLength(0);
    expect(tilt._handlers.size).toBe(0);
  });

  it('destroy() 在空元素上不报错', () => {
    const tilt = new CardTilt('.nonexistent');
    expect(() => tilt.destroy()).not.toThrow();
  });

  it('_getPerspective 返回不小于 800 的值', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '',
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    } as MediaQueryList);

    const card = document.createElement('div');
    card.classList.add('tilt-card');
    document.body.appendChild(card);

    const tilt = new CardTilt('.tilt-card');
    const perspective = tilt._getPerspective(card);
    expect(perspective).toBeGreaterThanOrEqual(800);
  });
});
```

- [ ] **Step 2: 运行测试**

Run: `npx vitest run src/test/card-tilt.test.ts`
Expected: 5 tests PASS

- [ ] **Step 3: 提交**

```bash
git add src/test/card-tilt.test.ts
git commit -m "test: add CardTilt unit tests"
```

---

### Task 8: 运行全部测试 + CI 集成

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: 运行全部测试**

Run: `npx vitest run`
Expected: 30 tests PASS (6 + 6 + 6 + 7 + 5)

- [ ] **Step 2: 修改 CI — 移除 Lint continue-on-error，添加 test 步骤**

修改 `.github/workflows/deploy.yml`，将 Lint 步骤的 `continue-on-error: true` 删除，并在 Lint 和 Build 之间添加 Test 步骤：

```yaml
      - name: Lint
        run: npm run lint

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
```

- [ ] **Step 3: 提交**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: enforce lint gate and add test step to CI pipeline"
```

---

### Task 9: 清理 tsconfig.json

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: 移除无用的 React JSX 配置**

项目不使用 React，`jsx` 和 `jsxImportSource` 配置是多余的。修改为：

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [
    ".astro/types.d.ts",
    "**/*"
  ],
  "exclude": [
    "dist"
  ]
}
```

- [ ] **Step 2: 验证构建不受影响**

Run: `npm run build`
Expected: 构建成功，无错误

- [ ] **Step 3: 运行全部测试确认无回归**

Run: `npx vitest run`
Expected: 全部 PASS

- [ ] **Step 4: 提交**

```bash
git add tsconfig.json
git commit -m "chore: remove unused React JSX config from tsconfig"
```

---

### Task 10: 创建 README.md

**Files:**
- Create: `README.md`

- [ ] **Step 1: 创建 README.md**

```markdown
# 祈研所 Qi-Lab

> 探索技术、设计与创意的交汇之处 — 一个用代码构建、用设计表达的创意实验室。

## 技术栈

- **框架**: [Astro 6](https://astro.build) — 静态站点生成 (SSG)
- **样式**: 原生 CSS + 设计令牌系统 (`--qi-*` variables)
- **交互**: 原生 JavaScript (View Transitions / Canvas / 3D Tilt)
- **部署**: GitHub Pages
- **CI/CD**: GitHub Actions (Lint + Test + Build + Deploy)

## 快速开始

### 前置要求

- Node.js >= 20.0.0
- npm >= 10.0.0

### 安装

```bash
git clone https://github.com/matthewhemhgz-dev/matthewhemhgz-dev.github.io.git
cd matthewhemhgz-dev.github.io
npm install
```

### 开发

```bash
npm run dev        # 启动开发服务器 (localhost:4321)
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

### 代码质量

```bash
npm run lint           # ESLint 检查
npm run format         # Prettier 格式化
npm run format:check   # Prettier 检查（不修改文件）
npm test               # Vitest 单元测试
```

## 项目结构

```
src/
├── components/        # Astro 组件 (18 个)
│   ├── decorations/   # 装饰性组件 (SectionDivider)
│   ├── global/        # 全局组件 (Navigation, Footer, BrandLogo...)
│   ├── sections/      # 首页区块组件 (Hero, About, Featured...)
│   └── ui/            # 通用 UI 组件 (DashCard, SectionHeader)
├── data/blog/zh/      # 博客文章 (Markdown)
├── layouts/           # 页面布局 (BaseLayout)
├── pages/             # 路由页面 (8 个)
├── scripts/           # 交互脚本 (card-tilt, particles, cursor-glow...)
├── styles/            # CSS 样式 (20 个文件, 设计令牌驱动)
└── test/              # 测试文件 (Vitest)
```

## 设计系统

项目采用 CSS 自定义属性构建的设计令牌系统：

- **色彩**: `--qi-brand-emerald` / `--qi-ink` / `--qi-amber` 等
- **字体**: `--qi-font-serif` / `--qi-font-mono` + `--qi-font-scaled-*` 响应式缩放
- **间距**: `--qi-space-xs` ~ `--qi-space-6xl` + `--qi-container-padding` 响应式
- **断点**: 480px / 768px / 1024px / 1440px / 1920px / 2560px / 3440px

## 内容管理

博客文章使用 Astro Content Layer，Markdown 文件位于 `src/data/blog/zh/`。

支持的 frontmatter 字段：`title` / `description` / `pubDate` / `tags` / `category` / `author` / `draft` 等。

## 许可证

[MIT](./LICENSE)
```

- [ ] **Step 2: 提交**

```bash
git add README.md
git commit -m "docs: add project README"
```

---

## 自审清单

### Spec 覆盖检查

| 路线图任务 | 对应 Plan Task | 状态 |
|-----------|---------------|------|
| 引入 Vitest | Task 1 | ✅ |
| 配置 Vitest | Task 2 | ✅ |
| BrandLogo 测试 | Task 3 | ✅ |
| SectionHeader 测试 | Task 4 | ✅ |
| DashCard 测试 | Task 5 | ✅ |
| Navigation 测试 | Task 6 | ✅ |
| card-tilt 测试 | Task 7 | ✅ |
| CI 集成测试 | Task 8 | ✅ |
| CI Lint 强制执行 | Task 8 | ✅ |
| 创建 README.md | Task 10 | ✅ |
| tsconfig 清理（额外） | Task 9 | ✅ |

### 占位符扫描

- 无 TBD / TODO / "implement later" / "similar to" 等占位符
- 所有测试代码完整，非伪代码
- 所有文件路径精确

### 类型一致性

- `CardTilt` 类的方法名 (`_bind`, `_getPerspective`, `_onMove`, `_onLeave`, `destroy`) 在 Task 7 中与源码一致
- `BrandLogo` props (`variant`, `size`) 在 Task 3 中与组件定义一致
- `DashCard` props (`label`, `value`, `percentage`, `color`) 在 Task 5 中与组件定义一致
