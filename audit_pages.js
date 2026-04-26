import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const AUDIT_DIR = 'audit_report';

async function runE2E() {
    if (!fs.existsSync(AUDIT_DIR)) {
        fs.mkdirSync(AUDIT_DIR);
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2
    });

    const page = await context.newPage();
    const logs = [];

    page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => logs.push(`[ERROR] ${err.message}`));

    const targetUrl = 'http://localhost:4321';

    try {
        const routes = [
            { path: '/', name: 'home-v2-physics' },
            { path: '/about', name: 'about-v2-physics' },
            { path: '/blog', name: 'blog-v2-physics' },
            { path: '/tags', name: 'tags-v2-physics' },
        ];

        for (const route of routes) {
            console.log(`Auditing: ${route.path}...`);
            await page.goto(`${targetUrl}${route.path}`, { waitUntil: 'load' });
            await page.waitForTimeout(1000); // Wait for background and kinematics to prep

            // Attempt safe hover
            const interactables = await page.$$('a, button, .bento-card, .float-card');
            if (interactables.length > 0) {
                try {
                    // Just poke the 3rd interactable to trigger a physics delta if possible, bypassing safe checks
                    await interactables[Math.min(2, interactables.length - 1)].hover({ force: true });
                    await page.waitForTimeout(500);
                } catch (e) {
                    // Ignore hover fails
                }
            }

            await page.screenshot({ path: path.join(AUDIT_DIR, `${route.name}.png`), fullPage: true });
            console.log(`Saved screenshot: ${route.name}.png`);
        }

        fs.writeFileSync(path.join(AUDIT_DIR, 'console.log'), logs.join('\n'));
        console.log('E2E visual audit complete. Screenshots saved.');

    } catch (err) {
        console.error('Audit failed:', err);
    } finally {
        await browser.close();
    }
}

runE2E();
