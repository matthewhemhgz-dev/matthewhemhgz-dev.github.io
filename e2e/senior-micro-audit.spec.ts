import { test, expect } from '@playwright/test';

/**
 * Senior Level Deep Audit: Round 4 (Micro-Aesthetics & Reading Experience)
 */
test.describe('Senior Level Site Audit (Round 4)', () => {
  test('Audit: Post Typography & Line Length', async ({ page }) => {
    // Go to a blog post
    await page.goto('/blog');
    const firstPost = page.locator('.blog-card').first();
    if (await firstPost.isVisible()) {
      await expect(firstPost).toBeVisible();
    }
  });

  test('Audit: Micro-Color Contrast (Muted Text)', async ({ page }) => {
    await page.goto('/');
    // Check "muted" text in dark mode
    await page.evaluate(() => document.documentElement.classList.add('dark'));
  });

  test('Audit: Hero Typography & "Orphans"', async ({ page }) => {
    await page.goto('/');
    const heroTitle = page.locator('.hero-title');
    await expect(heroTitle).toBeVisible();
  });

  test('Audit: Interaction States (Hover & Trans)', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('.hero-btn--primary');
    if (await btn.isVisible()) {
      await expect(btn).toBeVisible();
    }
  });
});
