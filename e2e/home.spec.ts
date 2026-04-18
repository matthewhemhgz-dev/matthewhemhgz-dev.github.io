import { test, expect } from '@playwright/test';

test.describe('首页', () => {
  test('正确渲染页面标题和核心内容', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/祈研所/);

    // Hero 区域
    await expect(page.locator('h1')).toContainText('探索技术');
    await expect(page.locator('h1')).toContainText('设计与创意');

    // 核心区块标题
    await expect(page.locator('h2', { hasText: '关于祈研所' })).toBeVisible();
    await expect(page.locator('h2', { hasText: '精选内容' })).toBeVisible();
    await expect(page.locator('h2', { hasText: '工具箱' })).toBeVisible();
    await expect(page.locator('h2', { hasText: '平台矩阵' })).toBeVisible();
    await expect(page.locator('h2', { hasText: '读者评价' })).toBeVisible();
    await expect(page.locator('h2', { hasText: '一起探索技术的可能性' })).toBeVisible();
  });

  test('导航栏包含所有链接', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');

    await expect(nav.locator('a', { hasText: '首页' })).toBeVisible();
    await expect(nav.locator('a', { hasText: '关于' })).toBeVisible();
    await expect(nav.locator('a', { hasText: '博客' })).toBeVisible();
    await expect(nav.locator('a', { hasText: '标签' })).toBeVisible();
  });

  test('Logo 链接指向首页', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('a[aria-label="祈研所"]');
    await expect(logo).toHaveAttribute('href', '/');
  });

  test('精选内容卡片链接正确（无 404）', async ({ page }) => {
    await page.goto('/');
    const featuredLink = page.locator('a', { hasText: 'AI 时代知识工作者的生存指南' }).first();
    const href = await featuredLink.getAttribute('href');
    expect(href).toBe('/blog/ai-era-knowledge-worker');

    // 导航并验证不 404
    await featuredLink.click();
    await expect(page).toHaveTitle(/AI 时代知识工作者/);
    await expect(page.locator('h1')).toContainText('AI 时代知识工作者的生存指南');
  });

  test('页脚包含联系方式和社交链接', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');

    await expect(footer.locator('a', { hasText: 'hello@qi-lab.dev' })).toBeVisible();
    await expect(footer.locator('a', { hasText: 'GitHub' })).toBeVisible();
    await expect(footer.locator('a', { hasText: 'Twitter/X' })).toBeVisible();
  });

  test('skip-link 存在且可访问', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
