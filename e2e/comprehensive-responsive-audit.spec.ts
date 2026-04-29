import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const AUDIT_REPORTS_DIR = path.join(process.cwd(), 'audit_report');
const SCREENSHOTS_DIR = path.join(AUDIT_REPORTS_DIR, 'responsive-screenshots');

if (!fs.existsSync(AUDIT_REPORTS_DIR)) {
  fs.mkdirSync(AUDIT_REPORTS_DIR, { recursive: true });
}
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'Mobile (375x812)', width: 375, height: 812 },
  { name: 'Tablet Portrait (768x1024)', width: 768, height: 1024 },
  { name: 'Tablet Landscape (1024x768)', width: 1024, height: 768 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
  { name: 'Large Desktop (1920x1080)', width: 1920, height: 1080 },
];

const PAGES = [
  { path: '/', name: '首页' },
  { path: '/about', name: '关于' },
  { path: '/blog', name: '博客' },
  { path: '/tags', name: '标签' },
  { path: '/404', name: '404' },
];

interface LayoutIssue {
  page: string;
  viewport: string;
  module: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  rootCause?: string;
  screenshotPath?: string;
  elementInfo?: Record<string, unknown>;
}

let allIssues: LayoutIssue[] = [];

test.describe('全面响应式布局审计', () => {
  test.beforeAll(() => {
    allIssues = [];
  });

  for (const pageInfo of PAGES) {
    test.describe(`页面: ${pageInfo.name}`, () => {
      for (const viewport of VIEWPORTS) {
        test.describe(`视口: ${viewport.name}`, () => {
          test(`完整页面检查和截图`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto(pageInfo.path);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);

            const screenshotPath = path.join(
              SCREENSHOTS_DIR,
              `${pageInfo.name.toLowerCase().replace(/[/\s]/g, '-')}-${viewport.name.toLowerCase().replace(/[() ]/g, '-')}-fullpage.png`,
            );
            await page.screenshot({ path: screenshotPath, fullPage: true });

            const pageIssues = await checkPageLayout(page, pageInfo.name, viewport.name, screenshotPath);
            allIssues.push(...pageIssues);
          });
        });
      }
    });
  }

  test.afterAll(async () => {
    await generateReport();
  });
});

async function checkPageLayout(page: import('@playwright/test').Page, pageName: string, viewportName: string, screenshotPath: string): Promise<LayoutIssue[]> {
  const issues: LayoutIssue[] = [];

  const pageData = await page.evaluate((vp) => {
    const results: {
      hasHorizontalScroll: boolean;
      scrollWidth: number;
      clientWidth: number;
      elements: Array<{
        tag: string;
        className: string;
        id: string;
        left: number;
        right: number;
        top: number;
        bottom: number;
        width: number;
        height: number;
        overflow: string;
        overflowX: string;
        overflowY: string;
        position: string;
        display: string;
        visibility: string;
        opacity: string;
        zIndex: string;
        fontSize: string;
        lineHeight: string;
      }>;
      viewport: string;
    } = {
      hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      elements: [],
      viewport: vp,
    };

    const allElements = document.querySelectorAll('*');
    allElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      results.elements.push({
        tag: el.tagName,
        className: el.className,
        id: el.id,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        overflow: style.overflow,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        position: style.position,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        zIndex: style.zIndex,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
      });
    });

    return results;
  }, viewportName);

  if (pageData.hasHorizontalScroll) {
    issues.push({
      page: pageName,
      viewport: viewportName,
      module: '页面',
      description: '存在横向滚动条，页面宽度超出视口',
      severity: 'high',
      rootCause: '可能存在元素宽度设置不当、负边距或绝对定位导致溢出',
      screenshotPath,
      elementInfo: { scrollWidth: pageData.scrollWidth, clientWidth: pageData.clientWidth },
    });
  }

  const overflowingElements = pageData.elements.filter((el) => {
    return el.right > pageData.clientWidth + 1 && el.visibility !== 'hidden' && el.opacity !== '0' && el.display !== 'none';
  });

  for (const el of overflowingElements.slice(0, 5)) {
    issues.push({
      page: pageName,
      viewport: viewportName,
      module: el.tagName,
      description: `元素溢出视口右边界 ${el.right - pageData.clientWidth}px`,
      severity: 'medium',
      rootCause: '元素宽度设置不当或缺少响应式调整',
      screenshotPath,
      elementInfo: el,
    });
  }

  const tinyText = pageData.elements.filter((el) => {
    const fontSize = parseFloat(el.fontSize);
    return fontSize > 0 && fontSize < 12 && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE';
  });

  for (const el of tinyText.slice(0, 3)) {
    issues.push({
      page: pageName,
      viewport: viewportName,
      module: el.tagName,
      description: `文字尺寸过小: ${el.fontSize}，可能影响可读性`,
      severity: 'low',
      rootCause: '响应式字体大小调整不足',
      screenshotPath,
      elementInfo: el,
    });
  }

  const negativePosition = pageData.elements.filter((el) => {
    return el.left < -10 && el.position === 'absolute';
  });

  for (const el of negativePosition.slice(0, 3)) {
    issues.push({
      page: pageName,
      viewport: viewportName,
      module: el.tagName,
      description: `绝对定位元素位置负向偏移: ${el.left}px`,
      severity: 'medium',
      rootCause: '响应式定位调整不足',
      screenshotPath,
      elementInfo: el,
    });
  }

  return issues;
}

async function generateReport() {
  const reportContent = {
    timestamp: new Date().toISOString(),
    viewports: VIEWPORTS,
    pages: PAGES,
    issues: allIssues,
    summary: {
      totalIssues: allIssues.length,
      highSeverity: allIssues.filter(i => i.severity === 'high').length,
      mediumSeverity: allIssues.filter(i => i.severity === 'medium').length,
      lowSeverity: allIssues.filter(i => i.severity === 'low').length,
      issuesByPage: PAGES.reduce((acc, page) => {
        acc[page.name] = allIssues.filter(i => i.page === page.name).length;
        return acc;
      }, {} as Record<string, number>),
      issuesByViewport: VIEWPORTS.reduce((acc, vp) => {
        acc[vp.name] = allIssues.filter(i => i.viewport === vp.name).length;
        return acc;
      }, {} as Record<string, number>),
    },
  };

  const reportPath = path.join(AUDIT_REPORTS_DIR, 'comprehensive-responsive-audit.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportContent, null, 2));

  let markdownReport = `# 全面响应式布局审计报告\n\n`;
  markdownReport += `**生成时间:** ${new Date().toLocaleString('zh-CN')}\n\n`;
  markdownReport += `---\n\n`;

  markdownReport += `## 一、检查概述\n\n`;
  markdownReport += `### 检查的页面\n`;
  for (const page of PAGES) {
    markdownReport += `- ${page.name}\n`;
  }
  markdownReport += `\n`;

  markdownReport += `### 检查的视口尺寸\n`;
  for (const vp of VIEWPORTS) {
    markdownReport += `- ${vp.name}\n`;
  }
  markdownReport += `\n`;

  markdownReport += `---\n\n`;

  markdownReport += `## 二、问题摘要\n\n`;
  markdownReport += `- **总问题数:** ${allIssues.length}\n`;
  markdownReport += `- **严重问题:** ${reportContent.summary.highSeverity}\n`;
  markdownReport += `- **中等问题:** ${reportContent.summary.mediumSeverity}\n`;
  markdownReport += `- **轻微问题:** ${reportContent.summary.lowSeverity}\n`;
  markdownReport += `\n`;

  markdownReport += `### 各页面问题分布\n`;
  for (const pageName of Object.keys(reportContent.summary.issuesByPage)) {
    markdownReport += `- ${pageName}: ${reportContent.summary.issuesByPage[pageName]} 个问题\n`;
  }
  markdownReport += `\n`;

  markdownReport += `### 各视口问题分布\n`;
  for (const vpName of Object.keys(reportContent.summary.issuesByViewport)) {
    markdownReport += `- ${vpName}: ${reportContent.summary.issuesByViewport[vpName]} 个问题\n`;
  }
  markdownReport += `\n`;

  markdownReport += `---\n\n`;

  markdownReport += `## 三、详细问题\n\n`;

  if (allIssues.length > 0) {
    for (const [index, issue] of allIssues.entries()) {
      markdownReport += `### ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.page} - ${issue.viewport}\n\n`;
      markdownReport += `**模块:** ${issue.module}\n`;
      markdownReport += `**描述:** ${issue.description}\n`;
      if (issue.rootCause) {
        markdownReport += `**可能原因:** ${issue.rootCause}\n`;
      }
      if (issue.screenshotPath) {
        markdownReport += `**截图:** ${issue.screenshotPath}\n`;
      }
      markdownReport += `\n`;
      markdownReport += `---\n\n`;
    }
  } else {
    markdownReport += `✅ 没有发现布局问题\n\n`;
  }

  markdownReport += `## 四、改进建议\n\n`;
  markdownReport += `1. **横向滚动问题** - 检查宽度设置、使用 box-sizing: border-box、确保容器正确处理溢出\n`;
  markdownReport += `2. **元素溢出** - 使用 max-width 和 overflow 属性、添加响应式断点调整布局\n`;
  markdownReport += `3. **字体大小** - 使用相对单位(rem/em)、建立响应式字体缩放系统\n`;
  markdownReport += `4. **定位问题** - 避免固定像素定位、使用相对定位配合媒体查询\n`;
  markdownReport += `\n`;

  markdownReport += `## 五、截图目录\n\n`;
  markdownReport += `所有截图保存在: ${SCREENSHOTS_DIR}\n`;

  const markdownReportPath = path.join(AUDIT_REPORTS_DIR, 'comprehensive-responsive-audit.md');
  fs.writeFileSync(markdownReportPath, markdownReport, 'utf-8');

  console.log('✅ 响应式布局审计完成！');
  console.log(`JSON 报告: ${reportPath}`);
  console.log(`Markdown 报告: ${markdownReportPath}`);
}
