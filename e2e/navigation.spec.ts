import { test, expect } from '@playwright/test';

test.describe('导航', () => {
  test('从首页导航到关于页面', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a', { hasText: '关于' }).click();
    await expect(page).toHaveTitle(/关于/);
    await expect(page.locator('h1')).toContainText('关于祈研所');
  });

  test('从首页导航到博客列表', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a', { hasText: '博客' }).click();
    await expect(page).toHaveTitle(/博客/);
    await expect(page.locator('h1')).toContainText('博客');
  });

  test('从首页导航到标签页', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav a', { hasText: '标签' }).click();
    await expect(page).toHaveTitle(/标签/);
    await expect(page.locator('h1')).toContainText('标签');
  });

  test('从博客列表导航到文章详情', async ({ page }) => {
    await page.goto('/blog/');
    await page.locator('a', { hasText: 'AI 时代知识工作者的生存指南' }).click();
    await expect(page).toHaveTitle(/AI 时代知识工作者/);
    await expect(page.locator('h1')).toContainText('AI 时代知识工作者的生存指南');
  });

  test('从文章详情返回列表', async ({ page }) => {
    await page.goto('/blog/ai-era-knowledge-worker/');
    await page.locator('a', { hasText: '返回列表' }).click();
    await expect(page).toHaveTitle(/博客/);
  });

  test('从标签页点击标签筛选文章', async ({ page }) => {
    await page.goto('/tags/');
    await page.locator('a', { hasText: '#AI' }).click();
    await expect(page).toHaveTitle(/AI/);
    // 应只显示 AI 相关文章
    await expect(page.locator('a', { hasText: 'AI 时代知识工作者的生存指南' })).toBeVisible();
  });

  test('404 页面正确渲染', async ({ page }) => {
    await page.goto('/nonexistent-page-404');
    await expect(page).toHaveTitle(/404/);
    await expect(page.locator('h1')).toContainText('页面未找到');
    await expect(page.locator('a', { hasText: '返回首页' })).toBeVisible();
  });

  test('所有导航链接无 404', async ({ page }) => {
    // 收集首页所有内部链接
    await page.goto('/');
    const links = await page.locator('a[href^="/"]').all();
    const hrefs = new Set<string>();

    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.includes('mailto:') && !href.includes('http')) {
        hrefs.add(href);
      }
    }

    // 验证每个链接返回 200
    for (const href of hrefs) {
      const response = await page.goto(href);
      expect(response?.status()).toBeLessThan(400);
    }
  });
});
