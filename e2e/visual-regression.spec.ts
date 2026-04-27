import { test, expect } from '@playwright/test';

test.describe('视觉回归测试', () => {
  // 测试首页
  test('首页视觉回归', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  // 测试博客页
  test('博客页视觉回归', async ({ page }) => {
    await page.goto('/blog/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('blog-page.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  // 测试关于页
  test('关于页视觉回归', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('about-page.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  // 测试标签页
  test('标签页视觉回归', async ({ page }) => {
    await page.goto('/tags/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('tags-page.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });
});
