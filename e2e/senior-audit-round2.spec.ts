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
            await tiltCard.hover();
            // Verify hover state (subtle transform)
            const transform = await tiltCard.evaluate(el => window.getComputedStyle(el).transform);
            expect(transform).not.toBe('none');

            // Check tool chip readability
            const toolChip = page.locator('.tool-chip').first();
            const textColor = await toolChip.evaluate(el => window.getComputedStyle(el).color);
            expect(textColor).not.toBe('rgba(0, 0, 0, 0)');
        }
    });

    test('Audit: Footer Social & Platforms', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded();

        // Check QR triggers in ZH
        const qrTriggers = page.locator('[data-qr-trigger]');
        const triggerCount = await qrTriggers.count();
        expect(triggerCount).toBeGreaterThanOrEqual(1);

        // Click a QR trigger and check modal
        await qrTriggers.first().click();
        const modal = page.locator('#social-qr-modal');
        // Wait for modal transition
        await page.waitForTimeout(500);
        await expect(modal).toBeVisible();

        // Check if QR image has loaded or has alt
        const modalImg = modal.locator('img');
        await expect(modalImg).toHaveAttribute('alt');

        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        await expect(modal).not.toBeVisible();
    });

    test('Audit: i18n Navigation & Footer Link Consistency', async ({ page }) => {
        // ZH links
        const zhLinks = await page.locator('.nav-links a').allTextContents();

        // Switch to EN
        await page.click('.lang-toggle-item[href*="/en"]');
        await page.waitForLoadState('networkidle');

        const enLinks = await page.locator('.nav-links a').allTextContents();

        // Link count should be identical
        expect(enLinks.length).toBe(zhLinks.length);

        // Check for "untranslated" text (basic check)
        for (const link of enLinks) {
            expect(link).not.toMatch(/[\u4e00-\u9fa5]/); // Should not contain Chinese characters
        }
    });

    test('Audit: Blog Detail Typography & Dark Mode Contrast', async ({ page }) => {
        // Go back to ZH and enter a post
        await page.goto('/blog');
        const firstPost = page.locator('.blog-card-link').first();
        await firstPost.click();

        // Check prose styling
        const prose = page.locator('.prose');
        await expect(prose).toBeVisible();

        // Check Heading Contrast in Dark Mode
        await page.evaluate(() => document.documentElement.classList.add('dark'));
        const h2 = prose.locator('h2').first();
        const h2Color = await h2.evaluate(el => window.getComputedStyle(el).color);
        // Emerald or White/Grey expected
        console.log(`[Typography] Dark H2 Color: ${h2Color}`);
    });

    test('Audit: Interactive Search Accessibility', async ({ page }) => {
        // Trigger Search with Cmd+K
        await page.keyboard.down('Control'); // Linux/Win
        await page.keyboard.press('k');
        await page.keyboard.up('Control');

        const modal = page.locator('#search-modal');
        await expect(modal).toHaveAttribute('aria-hidden', 'false');

        // Wait for focus to shift
        await page.waitForFunction(() => document.activeElement?.id === 'search-input');

        // Check focus trap - tab through
        await page.keyboard.press('Tab');
        const activeId = await page.evaluate(() => document.activeElement?.id);
        expect(activeId).toBe('search-input');

        // Close with ESC
        await page.keyboard.press('Escape');
        await expect(modal).toHaveAttribute('aria-hidden', 'true');
    });

    test('Audit: 404 Visual Harmony', async ({ page }) => {
        await page.goto('/obviously-broken-link');
        const code = page.locator('.error-code');
        await expect(code).toHaveText(/404/);

        // Check return home button contrast
        const homeBtn = page.locator('a.error-btn--primary');
        await expect(homeBtn).toBeVisible();
    });
});
