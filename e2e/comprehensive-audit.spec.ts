import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
    { path: '/', name: '首页 (ZH)' },
    { path: '/en', name: 'Home (EN)' },
    { path: '/about', name: '关于 (ZH)' },
    { path: '/en/about', name: 'About (EN)' },
    { path: '/blog', name: '博客列表 (ZH)' },
    { path: '/blog/ai-era-knowledge-worker', name: '博客详情 (ZH)' },
    { path: '/tags', name: '标签列表 (ZH)' },
    { path: '/404', name: '404 页面' }
];

const VIEWPORTS = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 },
    { name: '4K', width: 2560, height: 1440 }
];

test.describe('全面审计: 响应式与可访问性', () => {
    for (const pageInfo of PAGES) {
        test.describe(`页面: ${pageInfo.name}`, () => {

            test('检查浅色模式可访问性', async ({ page }) => {
                await page.goto(pageInfo.path);
                // 确保是浅色模式
                const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
                if (isDark) {
                    await page.click('#theme-toggle');
                }

                // 注入 CSS 隐藏干扰对比度算法的装饰性叠加层
                await page.addStyleTag({
                    content: '.noise-overlay, #particles-canvas { display: none !important; }'
                });

                const accessibilityScanResults = await new AxeBuilder({ page })
                    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                    .analyze();

                expect(accessibilityScanResults.violations).toEqual([]);
            });

            test('检查深色模式可访问性', async ({ page }) => {
                await page.goto(pageInfo.path);
                // 切换到深色模式
                const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
                if (!isDark) {
                    await page.click('#theme-toggle');
                }

                // 注入 CSS 隐藏干扰对比度算法的装饰性叠加层
                await page.addStyleTag({
                    content: '.noise-overlay, #particles-canvas { display: none !important; }'
                });

                const accessibilityScanResults = await new AxeBuilder({ page })
                    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                    .analyze();

                expect(accessibilityScanResults.violations).toEqual([]);
            });

            for (const viewport of VIEWPORTS) {
                test(`响应式检查: ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
                    await page.setViewportSize({ width: viewport.width, height: viewport.height });
                    await page.goto(pageInfo.path);

                    // 检查是否有水平滚动条（通常是不良响应式的标志）
                    const hasHorizontalScroll = await page.evaluate(() => {
                        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
                    });

                    if (hasHorizontalScroll) {
                        console.warn(`[WARNING] Horizontal scroll detected on ${pageInfo.name} at ${viewport.name}`);
                    }

                    // 截图以备后续人工复审
                    await page.screenshot({
                        path: `./audit-results/screenshots/${pageInfo.name.replace(/\//g, '-')}-${viewport.name}.png`,
                        fullPage: true
                    });
                });
            }
        });
    }
});

test.describe('全面审计: 逻辑与一致性', () => {
    test('检查全站 Theme Color Meta 标签', async ({ page }) => {
        for (const pageInfo of [PAGES[0], PAGES[1]]) {
            await page.goto(pageInfo.path);

            // 检查浅色模式 meta
            await page.evaluate(() => {
                localStorage.setItem('qi-theme', 'light');
                location.reload();
            });
            await page.waitForLoadState('networkidle');
            let meta = await page.getAttribute('meta[name="theme-color"]', 'content');
            expect(meta).toBe('#F7F3EE');

            // 检查深色模式 meta
            await page.click('#theme-toggle');
            meta = await page.getAttribute('meta[name="theme-color"]', 'content');
            expect(meta).toBe('#121010');
        }
    });

    test('检查 Skip Link 连贯性', async ({ page }) => {
        for (const pageInfo of PAGES) {
            await page.goto(pageInfo.path);
            const skipLink = page.locator('a.skip-link');
            await expect(skipLink).toBeAttached();
            await expect(skipLink).toHaveAttribute('href', '#main-content');
        }
    });
});
