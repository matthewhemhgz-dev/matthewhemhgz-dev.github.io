import { test, expect } from '@playwright/test';

/**
 * Senior Level Deep Audit: Round 3 (Final Verification)
 * Focus: User Experience, Functional Logic, i18n Gaps, Semantic Integrity
 */
test.describe('Senior Level Site Audit (Round 3)', () => {

    test('Audit: Semantic Integrity (Single <main>)', async ({ page }) => {
        const pages = ['/', '/en', '/blog', '/en/blog'];
        for (const p of pages) {
            await page.goto(p);
            // Search for main by role to be more robust
            const main = page.getByRole('main');
            await expect(main).toHaveCount(1);
        }
    });

    test('Audit: i18n Logical Gaps (Full Coverage)', async ({ page }) => {
        const routes = [
            { zh: '/', en: '/en' },
            { zh: '/blog', en: '/en/blog' },
            { zh: '/tags', en: '/en/tags' },
            { zh: '/about', en: '/en/about' },
        ];

        for (const route of routes) {
            const zhRes = await page.goto(route.zh);
            expect(zhRes?.status()).toBe(200);

            const enRes = await page.goto(route.en);
            expect(enRes?.status(), `EN equivalent ${route.en} should exist`).toBe(200);
        }
    });

    test('Audit: Scroll Logic & Persistence', async ({ page }) => {
        await page.goto('/blog'); // Or any scrollable page
        const firstPost = page.locator('.blog-card').first();
        if (await firstPost.isVisible()) {
            await firstPost.click();
            await page.waitForLoadState('networkidle');

            // Scroll down deep
            await page.evaluate(() => window.scrollTo(0, 1000));
            await page.waitForTimeout(200);

            // Check Scroll Progress
            const progress = page.locator('.progress-bar');
            const transform = await progress.evaluate(el => window.getComputedStyle(el).transform);
            expect(transform).not.toBe('none');

            // Check BackToTop
            const btt = page.locator('.back-to-top');
            await expect(btt).toBeVisible();
        }
    });

    test('Audit: Post Navigation UX (Class Sync)', async ({ page }) => {
        // Check ZH
        await page.goto('/blog');
        await page.locator('.blog-card').first().click();
        const zhNav = page.locator('.article-nav');
        await expect(zhNav).toBeVisible();

        // Check EN
        await page.goto('/en/blog');
        const enPost = page.locator('.blog-card').first();
        if (await enPost.isVisible()) {
            await enPost.click();
            const enNav = page.locator('.article-nav');
            await expect(enNav).toBeVisible();
        }
    });

    test('Audit: Search Modal (Extreme Inputs)', async ({ page }) => {
        await page.goto('/');
        await page.keyboard.press('Control+k');

        const input = page.locator('#search-input');
        const results = page.locator('#search-results');

        // Very long query (stress test)
        await input.fill('A'.repeat(100));
        await page.waitForTimeout(300);

        // Result status should show text
        const text = await results.innerText();
        expect(text.length).toBeGreaterThan(0);

        // Clear input
        await input.fill('');
        await page.waitForTimeout(100);
        const hintText = await results.innerText();
        expect(hintText.length).toBeGreaterThan(5);
    });
});
