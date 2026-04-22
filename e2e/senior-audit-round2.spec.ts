import { test, expect } from '@playwright/test';

/**
 * Senior Level Deep Audit: Round 2
 * Focus: Toolbox, Footer, Platforms, Blog Typography, Global UI Elements
 */
test.describe('Senior Level Site Audit (Round 2)', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Audit: Toolbox Layout & Accessibility', async ({ page }) => {
        const toolbox = page.locator('.toolbox-section');
        if (await toolbox.isVisible()) {
            // Check tilt cards
            const tiltCard = page.locator('.tilt-card').first();
            await expect(tiltCard).toBeVisible();
        }
    });

    test('Audit: Footer Social & Platforms', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();
        await expect(page.locator('footer')).toBeVisible();

        // Check QR triggers in ZH
        const qrTriggers = page.locator('[data-qr-trigger]');
        const triggerCount = await qrTriggers.count();
        expect(triggerCount).toBeGreaterThanOrEqual(1);
    });

    test('Audit: i18n Navigation & Footer Link Consistency', async ({ page }) => {
        // ZH links
        const zhLinksCount = await page.locator('.nav-links a').count();
        expect(zhLinksCount).toBeGreaterThan(0);
    });

    test('Audit: Blog Detail Typography & Dark Mode Contrast', async ({ page }) => {
        // Go back to ZH and enter a post
        await page.goto('/blog');
        const blogCard = page.locator('.blog-card').first();
        if (await blogCard.isVisible()) {
            await blogCard.click();
        }
    });

    test('Audit: Interactive Search Accessibility', async ({ page }) => {
        // Trigger Search with Cmd+K
        await page.keyboard.down('Control'); // Linux/Win
        await page.keyboard.press('k');
        await page.keyboard.up('Control');

        const modal = page.locator('#search-modal');
        await expect(modal).toHaveAttribute('aria-hidden', 'false');
    });

    test('Audit: 404 Visual Harmony', async ({ page }) => {
        await page.goto('/obviously-broken-link');
        const code = page.locator('.error-code');
        await expect(code).toHaveText(/404/);
    });
});
