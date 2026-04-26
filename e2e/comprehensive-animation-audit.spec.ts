import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('全面动效和光效检查', () => {
  test.setTimeout(120000);
  const auditReport = {
    timestamp: new Date().toISOString(),
    pages: {},
    issues: []
  };

  const pagesToTest = [
    { url: 'http://localhost:4325/', name: '首页 (Home)' },
    { url: 'http://localhost:4325/about', name: '关于页 (About)' },
    { url: 'http://localhost:4325/blog', name: '博客列表 (Blog)' },
    { url: 'http://localhost:4325/tags', name: '标签页 (Tags)' }
  ];

  test('所有页面动效和光效检查', async ({ page, browserName }) => {
    for (const pageConfig of pagesToTest) {
      await test.step(`检查页面: ${pageConfig.name}`, async () => {
        console.log(`\n🔍 检查 ${pageConfig.name}...`);
        
        const pageAudit = {
          url: pageConfig.url,
          name: pageConfig.name,
          effects: {},
          consoleErrors: [],
          screenshots: []
        };

        // 导航到页面
        await page.goto(pageConfig.url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        await checkConsoleErrors(page, pageAudit, '初始加载');

        // 截图 - 初始状态
        const screenshot1 = await page.screenshot({ fullPage: true });
        const screenshotPath1 = `audit-report/${pageConfig.name.replace(/\s/g, '-')}-initial.png`;
        await fs.promises.mkdir('audit-report', { recursive: true });
        await fs.promises.writeFile(screenshotPath1, screenshot1);
        pageAudit.screenshots.push(screenshotPath1);
        console.log(`📸 初始状态截图: ${screenshotPath1}`);

        // 检查粒子效果
        await test.step('检查粒子效果', async () => {
          const particlesCanvas = page.locator('#particles-canvas');
          const backgroundArtCanvas = page.locator('#background-art-canvas');
          
          pageAudit.effects.particles = {
            particlesCanvas: await particlesCanvas.isVisible().catch(() => false),
            backgroundArtCanvas: await backgroundArtCanvas.isVisible().catch(() => false)
          };
          
          console.log(`  ✨ 粒子效果:`, pageAudit.effects.particles);
        });

        // 检查光标光效 (鼠标移动)
        await test.step('检查光标光效', async () => {
          await page.mouse.move(100, 100);
          await page.waitForTimeout(500);
          await page.mouse.move(200, 200);
          await page.waitForTimeout(500);
          await page.mouse.move(page.viewportSize()?.width / 2 || 500, 
                              page.viewportSize()?.height / 2 || 300);
          await page.waitForTimeout(500);
          
          const screenshot2 = await page.screenshot({ fullPage: true });
          const screenshotPath2 = `audit-report/${pageConfig.name.replace(/\s/g, '-')}-cursor-glow.png`;
          await fs.promises.writeFile(screenshotPath2, screenshot2);
          pageAudit.screenshots.push(screenshotPath2);
          
          await checkConsoleErrors(page, pageAudit, '光标光效测试');
          console.log(`  ✨ 光标光效测试完成`);
        });

        // 检查滚动效果和滚动显示动画
        await test.step('检查滚动动效', async () => {
          const viewportHeight = page.viewportSize()?.height || 600;
          
          // 逐步滚动
          for (let i = 0; i < 5; i++) {
            await page.mouse.wheel(0, viewportHeight * 0.6);
            await page.waitForTimeout(600);
            await checkConsoleErrors(page, pageAudit, `滚动 ${i + 1}`);
          }
          
          const screenshot3 = await page.screenshot({ fullPage: true });
          const screenshotPath3 = `audit-report/${pageConfig.name.replace(/\s/g, '-')}-scrolled.png`;
          await fs.promises.writeFile(screenshotPath3, screenshot3);
          pageAudit.screenshots.push(screenshotPath3);
          console.log(`  ✨ 滚动动效测试完成`);
        });

        // 检查卡片悬停效果
        await test.step('检查卡片悬停效果', async () => {
          const bentoCards = page.locator('.bento-card');
          const platformCards = page.locator('.platform-card');
          const testimonialCards = page.locator('.testimonial-card');
          const toolCategories = page.locator('.toolbox-category');
          
          pageAudit.effects.cards = {
            bentoCards: await bentoCards.count(),
            platformCards: await platformCards.count(),
            testimonialCards: await testimonialCards.count(),
            toolCategories: await toolCategories.count()
          };

          // 测试卡片悬停
          const allCards = [
            { locator: bentoCards, name: 'bento-card' },
            { locator: platformCards, name: 'platform-card' },
            { locator: testimonialCards, name: 'testimonial-card' },
            { locator: toolCategories, name: 'toolbox-category' }
          ];

          for (const cardGroup of allCards) {
            const count = await cardGroup.locator.count();
            if (count > 0) {
              const firstCard = cardGroup.locator.first();
              await firstCard.scrollIntoViewIfNeeded();
              await page.waitForTimeout(300);
              await firstCard.hover();
              await page.waitForTimeout(500);
              console.log(`  ✨ ${cardGroup.name} 悬停效果测试完成`);
            }
          }
          
          await checkConsoleErrors(page, pageAudit, '卡片悬停测试');
        });

        // 滚动回顶部并检查导航效果
        await test.step('检查导航栏和滚动回顶部', async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(1000);
          
          const nav = page.locator('.nav-wrapper');
          pageAudit.effects.navigation = {
            navVisible: await nav.isVisible(),
            scrolled: await nav.evaluate(el => el.classList.contains('scrolled'))
          };
          
          // 滚动然后检查
          await page.mouse.wheel(0, 300);
          await page.waitForTimeout(800);
          pageAudit.effects.navigation.scrolledAfterScroll = 
            await nav.evaluate(el => el.classList.contains('scrolled'));
          
          await checkConsoleErrors(page, pageAudit, '导航测试');
          console.log(`  ✨ 导航栏效果测试完成:`, pageAudit.effects.navigation);
        });

        // 检查按钮和链接交互
        await test.step('检查按钮和链接交互反馈', async () => {
          const buttons = page.locator('button, [role="button"]');
          const links = page.locator('a[href^="/"]');
          
          const buttonCount = await buttons.count();
          const linkCount = await links.count();
          
          pageAudit.effects.interactions = { buttonCount, linkCount };
          
          // 测试第一个按钮（如果有）
          if (buttonCount > 0) {
            const firstButton = buttons.first();
            await firstButton.scrollIntoViewIfNeeded();
            await firstButton.hover();
            await page.waitForTimeout(300);
            console.log(`  ✨ 按钮悬停效果测试完成`);
          }
          
          await checkConsoleErrors(page, pageAudit, '交互测试');
        });

        auditReport.pages[pageConfig.name] = pageAudit;
      });
    }

    // 生成审计报告
    const reportPath = 'audit-report/comprehensive-animation-audit.json';
    await fs.promises.writeFile(reportPath, JSON.stringify(auditReport, null, 2));
    console.log(`\n📄 审计报告已保存到: ${reportPath}`);

    // 检查是否有问题
    for (const [pageName, pageData] of Object.entries(auditReport.pages)) {
      if (pageData.consoleErrors.length > 0) {
        console.log(`\n⚠️  ${pageName} 发现 ${pageData.consoleErrors.length} 个问题:`);
        for (const error of pageData.consoleErrors) {
          console.log(`   - [${error.context}] ${error.message}`);
          auditReport.issues.push({ page: pageName, ...error });
        }
      }
    }
  });

  async function checkConsoleErrors(page, audit, context) {
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        audit.consoleErrors.push({
          context,
          type: msg.type(),
          message: msg.text(),
          location: msg.location()
        });
      }
    });
    page.on('pageerror', err => {
      audit.consoleErrors.push({
        context,
        type: 'pageerror',
        message: err.message,
        stack: err.stack
      });
    });
  }
});

test('页面切换和过渡动画检查', async ({ page }) => {
  console.log('\n🔄 检查页面切换和过渡动画...');
  
  const pages = ['http://localhost:4325/', 'http://localhost:4325/about', 
                'http://localhost:4325/blog', 'http://localhost:4325/tags'];
  
  for (let i = 0; i < pages.length; i++) {
    for (let j = 0; j < pages.length; j++) {
      if (i !== j) {
        await page.goto(pages[i], { waitUntil: 'networkidle' });
        await page.waitForTimeout(800);
        await page.goto(pages[j], { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        console.log(`  ✅ 切换: ${pages[i]} → ${pages[j]}`);
      }
    }
  }
  
  await page.screenshot({ path: 'audit-report/page-transition-final.png', fullPage: true });
  console.log('✨ 页面切换测试完成');
});

test('响应式视图动效检查', async ({ page }) => {
  console.log('\n📱 检查响应式视图动效...');
  
  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1920, height: 1080, name: 'Desktop' }
  ];
  
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('http://localhost:4325/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // 测试滚动和交互
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(600);
    await page.mouse.move(200, 200);
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: `audit-report/responsive-${viewport.name}.png`, 
      fullPage: true 
    });
    console.log(`  ✅ ${viewport.name} 视图测试完成`);
  }
});
