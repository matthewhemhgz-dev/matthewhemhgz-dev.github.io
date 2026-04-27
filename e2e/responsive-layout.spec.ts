import { test, expect, Page } from '@playwright/test';

const SCREEN_SIZES = [
  { name: 'iphone-SE', width: 375, height: 667 },
  { name: 'iphone-XR', width: 414, height: 896 },
  { name: 'ipad', width: 768, height: 1024 },
  { name: 'ipad-pro', width: 1024, height: 1366 },
  { name: 'laptop-14', width: 1440, height: 900 },
  { name: 'desktop-FHD', width: 1920, height: 1080 },
  { name: 'desktop-QHD', width: 2560, height: 1440 },
];

async function testPageResponsive(page: Page, url: string, pageName: string) {
  for (const size of SCREEN_SIZES) {
    await test.step(`${pageName} - ${size.name} (${size.width}x${size.height})`, async () => {
      // 设置视口大小
      await page.setViewportSize({ width: size.width, height: size.height });
      // 导航到页面
      await page.goto(url, { waitUntil: 'networkidle' });
      // 等待一下让页面稳定
      await page.waitForTimeout(500);

      // 测试导航栏
      const navWrapper = page.locator('.nav-wrapper');
      await expect(navWrapper).toBeVisible();

      // 测试移动端菜单
      if (size.width <= 768) {
        const hamburger = page.locator('.nav-toggle-label');
        await expect(hamburger).toBeVisible();
      }

      // 截图
      await page.screenshot({ 
        path: `audit_report/responsive/${pageName}-${size.name}.png`,
        fullPage: true 
      });
    });
  }
}

test.describe('响应式布局测试', () => {
  test('首页响应式布局', async ({ page }) => {
    await testPageResponsive(page, '/', 'home');
  });

  test('博客页面响应式布局', async ({ page }) => {
    await testPageResponsive(page, '/blog', 'blog');
  });

  test('关于页面响应式布局', async ({ page }) => {
    await testPageResponsive(page, '/about', 'about');
  });

  test('标签页面响应式布局', async ({ page }) => {
    await testPageResponsive(page, '/tags', 'tags');
  });

  test('移动端导航菜单功能测试', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'networkidle' });

    // 点击汉堡菜单
    await page.locator('.nav-toggle-label').click();
    await page.waitForTimeout(300);

    // 检查菜单是否打开
    const navLinks = page.locator('.nav-links');
    await expect(navLinks).toBeVisible();
    
    // 截图
    await page.screenshot({ 
      path: 'audit_report/responsive/mobile-menu-open.png' 
    });

    // 点击关闭按钮
    await page.locator('.nav-close-btn').click();
    await page.waitForTimeout(300);

    // 检查菜单是否关闭
    await expect(navLinks).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 315, 0)');
  });
});
