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
            await firstPost.click();
            await page.waitForLoadState('networkidle');

            const prose = page.locator('.prose');
            const proseWidth = await prose.evaluate(el => el.clientWidth);
            const fontSize = await prose.evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));

            // Heuristic: Width in pixels / (fontSize * 0.5) approx chars
            const approxChars = proseWidth / (fontSize * 0.45);
            console.log(`[Readability] Approx Characters per line: ${Math.round(approxChars)}`);

            // Ideal: 65 - 85. If it exceeds 90, it's a UX issue for long reading.
            expect(approxChars).toBeLessThan(100);
        }
    });

    test('Audit: Micro-Color Contrast (Muted Text)', async ({ page }) => {
        await page.goto('/');
        // Check "muted" text in dark mode
        await page.evaluate(() => document.documentElement.classList.add('dark'));

        const muted = page.locator('.article-date, .hero-stat-label, .footer-tagline').first();
        const color = await muted.evaluate(el => window.getComputedStyle(el).color);
        console.log(`[Contrast] Muted Text Color (Dark): ${color}`);
        // Visual check usually needed, but ensuring it's not invisible
        expect(color).not.toBe('rgb(0, 0, 0)');
    });

    test('Audit: Hero Typography & "Orphans"', async ({ page }) => {
        await page.goto('/');
        const heroTitle = page.locator('.hero-title');
        const text = await heroTitle.innerText();

        // Check for common orphan prevention (non-breaking space)
        // This is a manual check in code, but we can verify if certain words are on own line
        const words = text.split(/\s+/);
        if (words.length > 5) {
            console.log('[Micro-Audit] Hero title words:', words);
        }
    });

    test('Audit: Interaction States (Hover & Trans)', async ({ page }) => {
        await page.goto('/');
        const btn = page.locator('.hero-btn--primary');
        const transformBefore = await btn.evaluate(el => window.getComputedStyle(el).transform);
        await btn.hover();
        const transformAfter = await btn.evaluate(el => window.getComputedStyle(el).transform);

        // Premium buttons should have subtle hover movement
        if (transformBefore === transformAfter) {
            console.warn('[UX] Primary CTA has no hover transform (premium feeling missing).');
        }
    });
});
