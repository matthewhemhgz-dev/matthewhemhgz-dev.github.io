import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Homepage
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle', timeout: 30000 });
await page.screenshot({ path: 'C:/tmp/home_top.png', fullPage: false });
await page.evaluate(() => window.scrollTo(0, 1000));
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/tmp/home_mid1.png', fullPage: false });
await page.evaluate(() => window.scrollTo(0, 2500));
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/tmp/home_mid2.png', fullPage: false });
await page.evaluate(() => window.scrollTo(0, 4000));
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/tmp/home_mid3.png', fullPage: false });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/tmp/home_bottom.png', fullPage: false });

// Blog page
await page.goto('http://localhost:4321/blog/', { waitUntil: 'networkidle', timeout: 30000 });
await page.screenshot({ path: 'C:/tmp/blog_top.png', fullPage: false });
await page.evaluate(() => window.scrollTo(0, 800));
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/tmp/blog_bottom.png', fullPage: false });

// Tags page
await page.goto('http://localhost:4321/tags/', { waitUntil: 'networkidle', timeout: 30000 });
await page.screenshot({ path: 'C:/tmp/tags.png', fullPage: false });

await browser.close();
console.log('Screenshots saved to C:/tmp/');
