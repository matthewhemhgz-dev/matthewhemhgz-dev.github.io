import { test, expect } from '@playwright/test';

/**
 * Senior Level Deep Audit for Qi-Lab
 * Focus: Visual Consistency, Content Sync, Layout Integrity, Design Token Logic
 */
test.describe('Senior Level Site Audit', () => {
  // --- content sync check ---
  test('i18n Sync: Verify English version availability and parity', async ({ page }) => {
    // 检查首页板块是否同步
    await page.goto('/');
    const zhSections = await page.locator('section').count();
    const zhArticleCount = await page.locator('.featured-card').count();

    await page.goto('/en');
    const enSections = await page.locator('section').count();
    const enArticleCount = await page.locator('.featured-card').count();

    console.log(`[Content Parity] Sections: ZH(${zhSections}) vs EN(${enSections})`);
    console.log(
      `[Content Parity] Featured Articles: ZH(${zhArticleCount}) vs EN(${enArticleCount})`,
    );

    // 如果文章数量不一致，发出警告（不计为 Failure 因为翻译可能滞后，但需要标记）
    if (zhArticleCount !== enArticleCount) {
      console.warn(
        `[WARNING] Content desync: ZH has ${zhArticleCount} featured articles, but EN has ${enArticleCount}`,
      );
    }

    // 关键板块不应缺失 (如 Hero, About, Methodology/Timeline, Cta)
    expect(enSections).toBeGreaterThanOrEqual(5);
  });

  // --- layout & visual audit ---
  test('Visual Integrity: Check for element collisions and clipping', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 1440, height: 900 }, // Desktop
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto('/');

      // 检查 Hero 卡片是否溢出容器
      const heroExtra = page.locator('.hero-extra');

      if (await heroExtra.isVisible()) {
        const extraBox = await heroExtra.boundingBox();
        const containerBox = await page.locator('.hero-section').boundingBox();

        if (extraBox && containerBox) {
          // 如果是桌面端，检查是否在视野内
          if (vp.width > 1024) {
            expect(extraBox.x + extraBox.width).toBeLessThanOrEqual(containerBox.width);
          }
        }
      }
    }
  });

  // --- thematic logic check ---
  test('Theme Logic: Contrast & Design Token Application', async ({ page }) => {
    await page.goto('/');

    // 检查主色调变量在两种模式下的计算值
    const themeStats = await page.evaluate(() => {
      const getVar = (name: string) =>
        getComputedStyle(document.documentElement).getPropertyValue(name).trim();

      // Light mode
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      const lightPrimary = getVar('--qi-text-primary');

      // Dark mode
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      const darkPrimary = getVar('--qi-text-primary');

      return { lightPrimary, darkPrimary };
    });

    console.log(
      `[Design Tokens] Text Primary: Light(${themeStats.lightPrimary}) | Dark(${themeStats.darkPrimary})`,
    );

    // 确保颜色有显著差异
    expect(themeStats.lightPrimary).not.toBe(themeStats.darkPrimary);
  });

  // --- interaction audit ---
  test('Interactions: Navigation and Search UI stability', async ({ page }) => {
    await page.goto('/');

    // 开启搜索框
    const searchBtn = page.locator('button[aria-label*="搜索"], button.search-toggle').first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      await expect(page.locator('role=dialog')).toBeVisible();

      // 检查 ESC 关闭逻辑
      await page.keyboard.press('Escape');
      await expect(page.locator('role=dialog')).not.toBeVisible();
    }
  });

  // --- blog detail audit ---
  test('Blog Detail: High-fidelity layout and typography', async ({ page }) => {
    // 进入第一篇文章
    await page.goto('/blog');
    const firstPost = page.locator('.blog-card-link, .featured-card-content a').first();
    if (await firstPost.isVisible()) {
      await firstPost.click();
      await page.waitForLoadState('networkidle');

      // 检查是否有 Mermaid 报错气泡
      const syntaxErrorText = page.locator('text=/Syntax error/i');

      await expect(syntaxErrorText).not.toBeVisible();

      // 检查侧边栏/浮动组件是否在宽屏展示
      await page.setViewportSize({ width: 1600, height: 900 });
      const progress = page.locator('.scroll-progress');
      await expect(progress).toBeVisible();
    }
  });
});
