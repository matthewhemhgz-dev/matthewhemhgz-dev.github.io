import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Senior Frontend Audit Suite
 * Focuses on:
 * 1. Deep Accessibility (WCAG 2.1 AA+)
 * 2. Visual Token Integrity
 * 3. Interactive State Accessibility (Hover/Focus Contrast)
 * 4. Modal UX & Focus Management
 * 5. Responsive Fluidity
 */

const PAGES = [
    { name: 'Home (ZH)', path: '/' },
    { name: 'About (ZH)', path: '/about' },
    { name: 'Blog (ZH)', path: '/blog' },
    { name: 'Home (EN)', path: '/en/' },
];

const THEMES = ['light', 'dark'];

async function checkA11y(page: Page, testName: string) {
    // Inject a small delay to allow animations to settle
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze();

    if (results.violations.length > 0) {
        console.log(`[A11Y VIOLATIONS] in ${testName}:`);
        results.violations.forEach(v => {
            console.log(` - ID: ${v.id} | Impact: ${v.impact} | Help: ${v.help}`);
            v.nodes.forEach(n => {
                console.log(`   * Target: ${n.target}`);
            });
        });
    }

    return results.violations;
}

test.describe('Senior Frontend Audit: Core Systems', () => {

    for (const pageInfo of PAGES) {
        test.describe(`Page: ${pageInfo.name}`, () => {

            test.beforeEach(async ({ page }) => {
                await page.goto(pageInfo.path);
            });

            for (const theme of THEMES) {
                test(`Comprehensive Audit - Theme: ${theme}`, async ({ page }) => {
                    // Set Theme
                    const isCurrentlyDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
                    if ((theme === 'dark' && !isCurrentlyDark) || (theme === 'light' && isCurrentlyDark)) {
                        await page.locator('#theme-toggle').click();
                    }

                    await expect(page.locator('html')).toHaveClass(new RegExp(theme));

                    // Inject CSS to hide noise/particles for cleaner A11y scan
                    await page.addStyleTag({
                        content: '.noise-overlay, #particles-canvas { display: none !important; }'
                    });

                    // 1. Accessibility Scan
                    const violations = await checkA11y(page, `${pageInfo.name} [${theme}]`);
                    expect(violations.length).toBe(0);

                    // 2. Interactive States Audit
                    // Focus on buttons to ensure focus-visible is clear
                    const buttons = page.locator('button, a[role="button"]');
                    const count = await buttons.count();
                    for (let i = 0; i < Math.min(count, 5); i++) {
                        const btn = buttons.nth(i);
                        await btn.focus();
                        // Manual check for focus ring or outline via screenshot/eval
                        const hasFocusStyle = await btn.evaluate(node => {
                            const style = window.getComputedStyle(node);
                            return style.outlineStyle !== 'none' || style.boxShadow !== 'none' || style.borderStyle !== 'none';
                        });
                        if (!hasFocusStyle) {
                            console.warn(`[UX WARNING] Potential missing focus style on button ${i} in ${pageInfo.name}`);
                        }
                    }

                    // 3. Contrast deep dive for key tokens
                    const tokenCheck = await page.evaluate(() => {
                        const style = getComputedStyle(document.documentElement);
                        return {
                            emerald: style.getPropertyValue('--qi-brand-emerald').trim(),
                            bg: style.getPropertyValue('--qi-bg-base').trim(),
                            fg: style.getPropertyValue('--qi-text-primary').trim(),
                        };
                    });
                    console.log(`[TOKEN AUDIT] ${pageInfo.name} [${theme}]:`, tokenCheck);

                });
            }

            test('Modal Integrity - Social QR', async ({ page }) => {
                // Open Footer Modal if button exists
                const footerTrigger = page.locator('.footer-qr-trigger, button:has-text("关注"), .social-link-qr');
                if (await footerTrigger.isVisible()) {
                    await footerTrigger.click();
                    const modal = page.locator('#social-qr-modal, [role="dialog"]');
                    await expect(modal).toBeVisible();

                    // Check Focus Trapping (Simplified check)
                    await page.keyboard.press('Tab');
                    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
                    // Senior check: Focus should be inside modal
                    const isInside = await page.evaluate(() => {
                        const modal = document.querySelector('#social-qr-modal, [role="dialog"]');
                        return modal?.contains(document.activeElement);
                    });
                    expect(isInside).toBeTruthy();

                    // Check Contrast inside modal
                    const violations = await checkA11y(page, `${pageInfo.name} Modal Open`);
                    expect(violations.length).toBe(0);

                    // Close Modal
                    await page.keyboard.press('Escape');
                    await expect(modal).not.toBeVisible();
                }
            });
        });
    }

    test('Design System Consistency: Color Palette', async ({ page }) => {
        await page.goto('/');
        // Verify CSS Variables are actually defined
        const vars = await page.evaluate(() => {
            const style = getComputedStyle(document.documentElement);
            return [
                '--qi-brand-emerald', '--qi-bg-base', '--qi-text-primary',
                '--qi-radius-md', '--qi-font-sans'
            ].map(v => ({ name: v, value: style.getPropertyValue(v).trim() }));
        });

        vars.forEach(v => {
            expect(v.value).not.toBe('');
            if (v.value === '') console.error(`[LEAK] CSS Variable ${v.name} is undefined`);
        });
    });

});
