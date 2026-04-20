import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const EN_PAGES = [
    { path: '/en/', name: 'Home (EN)' },
    { path: '/en/about', name: 'About (EN)' },
    { path: '/en/blog', name: 'Blog List (EN)' },
];

test.describe('English Version Deep Audit', () => {

    for (const pageInfo of EN_PAGES) {
        test(`Audit: ${pageInfo.name}`, async ({ page }) => {
            const response = await page.goto(pageInfo.path);

            // Check for 404 (important since we suspect /en/blog is missing)
            if (response?.status() === 404) {
                console.error(`[CRITICAL] English page ${pageInfo.path} is MISSING (404)`);
                return;
            }

            // 1. Accessibility Scan
            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze();

            if (results.violations.length > 0) {
                console.log(`[A11Y] Violations on ${pageInfo.name}:`);
                results.violations.forEach(v => console.log(` - ${v.id}: ${v.help}`));
            }

            // 2. Translation Leakage Check
            // Search for Chinese characters (simplified/traditional range)
            const chineseContent = await page.evaluate(() => {
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
                const findings: string[] = [];
                let node;
                while (node = walker.nextNode()) {
                    if (/[\u4e00-\u9fa5]/.test(node.textContent || '')) {
                        // Ignore some common false positives or decorations if any
                        findings.push(node.textContent?.trim() || '');
                    }
                }
                return findings;
            });

            if (chineseContent.length > 0) {
                console.log(`[TRANS] Potential Chinese leakage on ${pageInfo.name}:`);
                chineseContent.slice(0, 10).forEach(text => console.log(` - "${text}"`));
            }

            // 3. Responsive Check at Mobile
            await page.setViewportSize({ width: 375, height: 667 });
            const hasHorizontalScroll = await page.evaluate(() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });
            if (hasHorizontalScroll) {
                console.warn(`[UX] Horizontal scroll on mobile for ${pageInfo.name}`);
            }
        });
    }

    test('English specific Typography', async ({ page }) => {
        await page.goto('/en/');
        // Check if font-family for English is serif for titles as per philosophy
        const titleFont = await page.locator('.page-title, h1').first().evaluate(el => getComputedStyle(el).fontFamily);
        console.log(`[TYPO] Title font family: ${titleFont}`);
    });
});
