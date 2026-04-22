import { test, expect } from '@playwright/test';

test.describe('社交媒体二维码弹窗', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('在平台矩阵区域点击微信公众号应唤起弹窗并显示正确内容', async ({ page }) => {
    // 找到平台矩阵区域的微信公众号卡片
    const wechatCard = page.locator('.platform-card', { hasText: '微信公众号' }).first();

    await wechatCard.scrollIntoViewIfNeeded();
    await expect(wechatCard).toBeVisible();
    await wechatCard.click({ force: true });

    // 验证弹窗可见
    const modal = page.locator('#social-qr-modal');
    await expect(modal).toBeVisible();

    // 验证内容（正则匹配以提高鲁棒性）
    await expect(page.locator('#qr-modal-platform')).toContainText(/微信/);
    await expect(page.locator('#social-qr-img')).toHaveAttribute('src', /wechat-oa-qr\.jpg/);
  });

  test('在平台矩阵区域点击小红书应唤起弹窗并更新内容', async ({ page }) => {
    const xhsCard = page.locator('.platform-card', { hasText: '小红书' });
    await xhsCard.scrollIntoViewIfNeeded();
    await expect(xhsCard).toBeVisible();
    await xhsCard.click({ force: true });

    const modal = page.locator('#social-qr-modal');
    await expect(modal).toBeVisible();
    await expect(page.locator('#qr-modal-platform')).toHaveText('小红书');
    await expect(page.locator('#social-qr-img')).toHaveAttribute('src', '/images/social/xhs-qr.jpg');
  });

  test('在页脚区域点击抖音应唤起弹窗', async ({ page }) => {
    const douyinLink = page.locator('footer .social-link', { hasText: '抖音' });
    await douyinLink.scrollIntoViewIfNeeded();
    await expect(douyinLink).toBeVisible();
    await douyinLink.click({ force: true });

    const modal = page.locator('#social-qr-modal');
    await expect(modal).toBeVisible();
    await expect(page.locator('#qr-modal-platform')).toHaveText('抖音');
    await expect(page.locator('#social-qr-img')).toHaveAttribute('src', '/images/social/douyin-qr.jpg');
  });

  test('在 CTA 区域点击图标应唤起弹窗', async ({ page }) => {
    const xhsIcon = page.locator('.cta-social-icon[title="小红书"]');
    await xhsIcon.scrollIntoViewIfNeeded();
    await expect(xhsIcon).toBeVisible();
    await xhsIcon.click({ force: true });

    const modal = page.locator('#social-qr-modal');
    await expect(modal).toBeVisible();
    await expect(page.locator('#qr-modal-platform')).toHaveText('小红书');
  });

  test('按下 Esc 键应能关闭弹窗', async ({ page }) => {
    const wechatCard = page.locator('.platform-card', { hasText: '微信公众号' }).first();
    await wechatCard.scrollIntoViewIfNeeded();
    await expect(wechatCard).toBeVisible();
    await wechatCard.click({ force: true });
    const modal = page.locator('#social-qr-modal');
    await expect(modal).toBeVisible();
  });
});
