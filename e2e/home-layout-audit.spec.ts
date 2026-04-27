import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const AUDIT_REPORTS_DIR = path.join(process.cwd(), 'audit_report');
const SCREENSHOTS_DIR = path.join(AUDIT_REPORTS_DIR, 'screenshots');

// 创建目录（如果不存在）
if (!fs.existsSync(AUDIT_REPORTS_DIR)) {
  fs.mkdirSync(AUDIT_REPORTS_DIR, { recursive: true });
}
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'Desktop (1920x1080)', width: 1920, height: 1080 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Mobile (375x667)', width: 375, height: 667 },
];

interface LayoutIssue {
  module: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  screenshotPath?: string;
}

let allIssues: LayoutIssue[] = [];

test.describe('首页布局全面检查', () => {
  test.beforeAll(() => {
    allIssues = [];
  });

  for (const viewport of VIEWPORTS) {
    test.describe(`视口: ${viewport.name}`, () => {
      test('导航栏布局检查', async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('http://localhost:4323/');
        await page.waitForLoadState('networkidle');

        // 导航栏截图
        const navScreenshotPath = path.join(
          SCREENSHOTS_DIR,
          `home-navigation-${viewport.name.toLowerCase().replace(/[() ]/g, '-')}.png`,
        );
        const navElement = page.locator('nav, [role="navigation"]').first();
        await navElement.screenshot({ path: navScreenshotPath });

        // 检查导航栏是否可见
        await expect(navElement).toBeVisible();

        // 检查导航栏高度
        const navBoundingBox = await navElement.boundingBox();
        if (navBoundingBox) {
          if (navBoundingBox.height < 40 || navBoundingBox.height > 120) {
            allIssues.push({
              module: '导航栏',
              description: `导航栏高度异常: ${navBoundingBox.height}px`,
              severity: 'medium',
              screenshotPath: navScreenshotPath,
            });
          }
        }

        // 检查水平滚动
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        if (hasHorizontalScroll) {
          allIssues.push({
            module: '导航栏',
            description: '存在横向滚动条，可能是布局宽度设置不当',
            severity: 'high',
          });
        }
      });

      test('英雄区域布局检查', async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('http://localhost:4323/');
        await page.waitForLoadState('networkidle');

        // 英雄区域截图
        const heroScreenshotPath = path.join(
          SCREENSHOTS_DIR,
          `home-hero-${viewport.name.toLowerCase().replace(/[() ]/g, '-')}.png`,
        );
        const heroElement = page.locator('section, div').filter({ hasText: /在信息过载的时代|系统化的知识管理|祈研所/i }).first();
        if (await heroElement.count() > 0) {
          await heroElement.screenshot({ path: heroScreenshotPath });

          // 检查英雄区域是否可见
          await expect(heroElement).toBeVisible();

          // 检查英雄区域的内边距
          const heroPadding = await heroElement.evaluate(el => {
            const style = window.getComputedStyle(el);
            return {
              paddingTop: parseInt(style.paddingTop),
              paddingBottom: parseInt(style.paddingBottom),
              paddingLeft: parseInt(style.paddingLeft),
              paddingRight: parseInt(style.paddingRight),
            };
          });

          if (heroPadding.paddingTop < 40) {
            allIssues.push({
              module: '英雄区域',
              description: `英雄区域顶部内边距过小: ${heroPadding.paddingTop}px`,
              severity: 'medium',
              screenshotPath: heroScreenshotPath,
            });
          }
          if (heroPadding.paddingBottom < 40) {
            allIssues.push({
              module: '英雄区域',
              description: `英雄区域底部内边距过小: ${heroPadding.paddingBottom}px`,
              severity: 'medium',
              screenshotPath: heroScreenshotPath,
            });
          }
        }
      });

      test('功能介绍区域布局检查', async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('http://localhost:4323/');
        await page.waitForLoadState('networkidle');

        // 滚动到 About 区域
        const aboutSection = page.locator('section, div').filter({ hasText: /关于祈研所|ABOUT/i }).first();
        if (await aboutSection.count() > 0) {
          await aboutSection.scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);

          const aboutScreenshotPath = path.join(
            SCREENSHOTS_DIR,
            `home-about-${viewport.name.toLowerCase().replace(/[() ]/g, '-')}.png`,
          );
          await aboutSection.screenshot({ path: aboutScreenshotPath });

          await expect(aboutSection).toBeVisible();
        }
      });

      test('博客预览区域布局检查', async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('http://localhost:4323/');
        await page.waitForLoadState('networkidle');

        // 滚动到 Featured 区域
        const featuredSection = page.locator('section, div').filter({ hasText: /精选内容|FEATURED/i }).first();
        if (await featuredSection.count() > 0) {
          await featuredSection.scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);

          const featuredScreenshotPath = path.join(
            SCREENSHOTS_DIR,
            `home-featured-${viewport.name.toLowerCase().replace(/[() ]/g, '-')}.png`,
          );
          await featuredSection.screenshot({ path: featuredScreenshotPath });

          await expect(featuredSection).toBeVisible();

          // 检查博客卡片布局
          const blogCards = featuredSection.locator('[class*="card"], [class*="Card"], article').filter({ hasText: /阅读全文/i });
          const cardCount = await blogCards.count();
          
          if (cardCount > 0) {
            for (let i = 0; i < Math.min(cardCount, 2); i++) {
              const card = blogCards.nth(i);
              await expect(card).toBeVisible();
            }
          }
        }
      });

      test('完整页面截图', async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('http://localhost:4323/');
        await page.waitForLoadState('networkidle');

        const fullPageScreenshotPath = path.join(
          SCREENSHOTS_DIR,
          `home-fullpage-${viewport.name.toLowerCase().replace(/[() ]/g, '-')}.png`,
        );
        await page.screenshot({ path: fullPageScreenshotPath, fullPage: true });
      });
    });
  }

  test.afterAll(async () => {
    // 生成报告
    const reportContent = {
      timestamp: new Date().toISOString(),
      viewports: VIEWPORTS,
      issues: allIssues,
      summary: {
        totalIssues: allIssues.length,
        highSeverity: allIssues.filter(i => i.severity === 'high').length,
        mediumSeverity: allIssues.filter(i => i.severity === 'medium').length,
        lowSeverity: allIssues.filter(i => i.severity === 'low').length,
      }
    };

    const reportPath = path.join(AUDIT_REPORTS_DIR, 'home-layout-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportContent, null, 2));

    // 生成 Markdown 报告
    let markdownReport = `# 首页布局检查报告\n\n`;
    markdownReport += `生成时间: ${new Date().toLocaleString()}\n\n`;
    markdownReport += `## 问题摘要\n\n`;
    markdownReport += `- 总问题数: ${allIssues.length}\n`;
    markdownReport += `- 严重: ${allIssues.filter(i => i.severity === 'high').length}\n`;
    markdownReport += `- 中等: ${allIssues.filter(i => i.severity === 'medium').length}\n`;
    markdownReport += `- 轻微: ${allIssues.filter(i => i.severity === 'low').length}\n\n`;

    if (allIssues.length > 0) {
      markdownReport += `## 详细问题\n\n`;
      allIssues.forEach((issue, index) => {
        markdownReport += `### ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.module}\n\n`;
        markdownReport += `- 描述: ${issue.description}\n`;
        if (issue.screenshotPath) {
          markdownReport += `- 截图: ${issue.screenshotPath}\n`;
        }
        markdownReport += '\n';
      });
    } else {
      markdownReport += `## ✅ 没有发现布局问题\n\n`;
    }

    markdownReport += `## 截图目录\n\n`;
    markdownReport += `所有截图保存在: ${SCREENSHOTS_DIR}\n`;

    const markdownReportPath = path.join(AUDIT_REPORTS_DIR, 'home-layout-audit-report.md');
    fs.writeFileSync(markdownReportPath, markdownReport);

    console.log('✅ 布局检查完成！');
    console.log(`报告已保存到: ${reportPath}`);
    console.log(`Markdown 报告: ${markdownReportPath}`);
  });
});
