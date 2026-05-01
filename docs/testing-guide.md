# 测试方案评估

## 现状评估

### ✅ 现有配置

项目已配置完整的测试框架：

| 框架 | 状态 | 配置文件 |
|------|------|---------|
| **Vitest** | ✅ 已配置 | [vitest.config.ts](../../vitest.config.ts) |
| **Playwright** | ✅ 已配置 | [playwright.config.ts](../../playwright.config.ts) |

### 📋 配置详情

#### Vitest 配置
- 测试环境: `happy-dom`
- 测试位置: `src/**/*.test.{ts,js}`
- 覆盖率报告: text, json, html
- 覆盖率包含: `src/**/*.{ts,js,astro}`

#### Playwright 配置
- 测试目录: `./e2e`
- 浏览器: Chromium
- 基础 URL: `http://localhost:4321`
- 超时: 90 秒

### ❌ 现状问题
- 暂无实际测试文件（`.test.ts`）
- 暂无 E2E 测试文件

---

## 测试方案建议

### 单元测试方案

#### 1. 工具函数测试
创建 `src/scripts/copy-code.test.ts`:
```typescript
import { copyToClipboard, sanitizeHTML } from './copy-code';

describe('copyToClipboard', () => {
  it('should copy text to clipboard', async () => {
    // 测试实现
  });
});
```

#### 2. 数据处理测试
创建 `src/data/test/projects.test.ts`:
```typescript
import { projects } from '../projects';

describe('projects data', () => {
  it('should have required fields', () => {
    // 测试项目数据结构
  });
});
```

#### 3. 组件测试
创建 `src/components/ui/Button.test.ts`:
```typescript
import { expect, test } from 'vitest';

test('button renders', () => {
  // 组件测试
});
```

---

### E2E 测试方案

#### 1. 基础导航测试
创建 `e2e/navigation.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/祈研所/);
});

test('can navigate to about page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /关于/ }).click();
  await expect(page).toHaveURL(/about/);
});
```

#### 2. 搜索功能测试
创建 `e2e/search.spec.ts`:
```typescript
test('search works', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /搜索/ }).click();
  await page.getByPlaceholder(/搜索/).fill('知识管理');
  // 测试搜索
});
```

#### 3. 博客阅读测试
创建 `e2e/blog.spec.ts`:
```typescript
test('can read blog post', async ({ page }) => {
  await page.goto('/blog/');
  await page.getByRole('link', { name: /知识管理/ }).first().click();
  // 测试阅读体验
});
```

---

### 运行测试

```bash
# 单元测试
npm run test
npm run test:watch

# E2E 测试
npm run test:e2e
```

---

## 优先级建议

| 优先级 | 测试类型 | 原因 |
|--------|---------|------|
| 🔴 高 | E2E 导航测试 | 确保核心流程正常 |
| 🟡 中 | 工具函数测试 | 验证关键功能 |
| 🟢 低 | 组件测试 | 增强代码质量 |
