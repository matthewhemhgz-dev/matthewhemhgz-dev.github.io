import { test, expect } from '@playwright/test';

test.describe('视觉回归测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('首页视觉回归', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 50000,
    });
  });

  test('博客页视觉回归', async ({ page }) => {
    await page.goto('/blog/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('blog-page.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 50000,
    });
  });

  test('关于页视觉回归', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('about-page.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 50000,
    });
  });

  test('标签页视觉回归', async ({ page }) => {
    await page.goto('/tags/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('tags-page.png', {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 50000,
    });
  });
});
