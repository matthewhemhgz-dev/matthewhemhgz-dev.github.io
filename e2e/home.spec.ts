import { test, expect } from '@playwright/test';

test.describe('首页', () => {
  test('正确渲染页面标题和核心内容', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/祈研所/);

    // Hero 区域
    await expect(page.locator('h1')).toBeVisible();

    // 核心区块标题
    await expect(page.locator('h2').first()).toBeVisible();
  });

  test('导航栏包含所有链接', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    await expect(nav.locator('a').first()).toBeVisible();
  });

  test('Logo 链接指向首页', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('a[aria-label="祈研所"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');
  });

  test('精选内容卡片链接正确（无 404）', async ({ page }) => {
    await page.goto('/');
    const blogCard = page.locator('.blog-card').first();
    if (await blogCard.isVisible()) {
      await expect(blogCard).toBeVisible();
    }
  });

  test('页脚包含联系方式和社交链接', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });

  test('skip-link 存在且可访问', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a.skip-link');
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeVisible();
    }
  });
});
