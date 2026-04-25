import { test, expect } from '@playwright/test';

test.describe('视觉效果测试', () => {
  test('首页粒子效果和光效', async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:4321/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 检查粒子画布元素是否存在
    const particlesCanvas = page.locator('#particles-canvas');
    await expect(particlesCanvas).toBeVisible();
    
    // 检查背景艺术画布元素是否存在
    const backgroundArtCanvas = page.locator('#background-art-canvas');
    await expect(backgroundArtCanvas).toBeVisible();
    
    // 测试鼠标移动时的光效
    await page.mouse.move(100, 100);
    await page.waitForTimeout(500);
    await page.mouse.move(200, 200);
    await page.waitForTimeout(500);
    
    // 测试滚动效果
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(1000);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(1000);
  });

  test('博客卡片悬停效果', async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:4321/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 找到博客卡片
    const blogCards = page.locator('.bento-card');
    await expect(blogCards).toHaveCount(4);
    
    // 测试第一个卡片的悬停效果
    const firstCard = blogCards.first();
    await firstCard.hover();
    await page.waitForTimeout(500);
    
    // 测试第二个卡片的悬停效果
    const secondCard = blogCards.nth(1);
    await secondCard.hover();
    await page.waitForTimeout(500);
  });

  test('导航栏滚动效果', async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:4321/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 检查导航栏初始状态
    const nav = page.locator('.nav-wrapper');
    await expect(nav).not.toHaveClass(/scrolled/);
    await expect(nav).not.toHaveClass(/nav-collapsed/);
    
    // 滚动页面
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(500);
    
    // 检查导航栏滚动状态
    await expect(nav).toHaveClass(/scrolled/);
    await expect(nav).toHaveClass(/nav-collapsed/);
    
    // 滚动回顶部
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(500);
    
    // 检查导航栏回到初始状态
    await expect(nav).not.toHaveClass(/nav-collapsed/);
  });

  test('页面加载动画效果', async ({ page }) => {
    // 访问关于页面
    await page.goto('http://localhost:4321/about');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 检查主内容元素是否存在
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
    
    // 测试页面切换动画
    await page.goto('http://localhost:4321/blog');
    await page.waitForLoadState('networkidle');
    
    // 检查博客列表页面是否加载完成
    const blogContent = page.locator('#main-content');
    await expect(blogContent).toBeVisible();
  });

  test('二维码模态框动画效果', async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:4321/');
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 找到平台矩阵区域的微信公众号链接
    const wechatLink = page.locator('.platform-card[data-platform="微信公众号"]');
    await expect(wechatLink).toBeVisible();
    
    // 点击微信公众号链接打开模态框
    await wechatLink.click();
    await page.waitForTimeout(500);
    
    // 检查模态框是否打开
    const qrModal = page.locator('#social-qr-modal');
    await expect(qrModal).toHaveAttribute('aria-hidden', 'false');
    
    // 关闭模态框
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // 检查模态框是否关闭
    await expect(qrModal).toHaveAttribute('aria-hidden', 'true');
  });
});
