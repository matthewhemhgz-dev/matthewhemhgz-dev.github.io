import { test, expect } from '@playwright/test';

/**
 * Senior Level Deep Audit: Round 3
 * Focus: User Experience, Functional Logic, i18n Gaps, Semantic Integrity
 */
test.describe('Senior Level Site Audit (Round 3)', () => {

    test('Audit: Semantic Integrity (Single <main>)', async ({ page }) => {
        const pages = ['/', '/en', '/blog', '/blog/ai-era-knowledge-worker', '/tags', '/404'];
        for (const p of pages) {
            await page.goto(p);
            const mainCount = await page.locator('main').count();
            // Critical Check: Exactly one <main> per page
            if (mainCount > 1) {
                console.warn(`[SEO/Semantics] Page ${p} has multiple <main> elements: ${mainCount}`);
            }
            expect(mainCount).toBe(1);
        }
    });

    test('Audit: i18n Logical Gaps (Missing Pages)', async ({ page }) => {
        // Checking for English equivalent of major sections
        const enPages = ['/en', '/en/about', '/en/blog', '/en/tags'];
        for (const p of enPages) {
            const response = await page.goto(p);
            expect(response?.status(), `Page ${p} should exist (not 404)`).toBe(200);
        }
    });

    test('Audit: Scroll Logic & Persistence', async ({ page }) => {
        await page.goto('/blog/ai-era-knowledge-worker');

        // Scroll down
        await page.evaluate(() => window.scrollTo(0, 500));
        await page.waitForTimeout(100);

        // Check Scroll Progress
        const progress = await page.locator('.progress-bar');
        const transform = await progress.evaluate(el => window.getComputedStyle(el).transform);
        expect(transform).not.toBe('none');
        expect(transform).toContain('matrix');

        // Check BackToTop appearance
        const btt = page.locator('.back-to-top');
        await expect(btt).toBeVisible();
    });

    test('Audit: Post Navigation UX (Previous/Next)', async ({ page }) => {
        await page.goto('/blog');
        const firstPost = page.locator('.blog-card-link').first();
        await firstPost.click();

        // Check for Pagination links (if implemented)
        const prevNext = page.locator('.post-navigation, .pagination');
        if (await prevNext.isVisible()) {
            console.log('[UX] Post navigation links found.');
        } else {
            console.warn('[UX/Logic] No Previous/Next post links found in blog detail.');
        }
    });

    test('Audit: Search Modal Performance (Empty Query)', async ({ page }) => {
        await page.goto('/');
        await page.keyboard.press('Control+k');

        const results = page.locator('#search-results');
        const hint = await results.innerText();

        // Default hint should be present
        expect(hint.length).toBeGreaterThan(5);

        // Type 1 char - should start search or show loading
        await page.locator('#search-input').type('A');
        await page.waitForTimeout(300);
        // Expect some status text or results
        const status = await results.innerText();
        expect(status).not.toEqual(hint);
    });
});
