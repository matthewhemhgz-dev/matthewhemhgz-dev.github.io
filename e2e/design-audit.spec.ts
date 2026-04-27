import { test, expect } from '@playwright/test';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const PAGES = [
  { path: '/', name: '首页 (ZH)' },
  { path: '/en', name: 'Home (EN)' },
  { path: '/about', name: '关于 (ZH)' },
  { path: '/en/about', name: 'About (EN)' },
  { path: '/blog', name: '博客列表 (ZH)' },
  { path: '/en/blog', name: 'Blog List (EN)' },
  { path: '/tags', name: '标签列表 (ZH)' },
  { path: '/en/tags', name: 'Tags List (EN)' },
  { path: '/404', name: '404 页面' },
];

const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1440, height: 900 },
];

// 确保截图目录存在
const SCREENSHOT_DIR = join(process.cwd(), 'audit_report', 'screenshots');
if (!existsSync(SCREENSHOT_DIR)) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

interface DesignAuditResult {
  page: string;
  viewport: string;
  colors: string[];
  fonts: string[];
  images: Array<{
    index: number;
    src: string;
    alt: string;
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
  }>;
  links: Array<{
    index: number;
    href: string;
    text: string;
  }>;
  visualHierarchy: Array<{
    tag: string;
    text: string;
    fontSize: string;
  }>;
  screenshotPath: string;
}

const auditResults: DesignAuditResult[] = [];

test.describe('设计评估与内容检查', () => {
  for (const pageInfo of PAGES) {
    test.describe(`页面: ${pageInfo.name}`, () => {
      for (const viewport of VIEWPORTS) {
        test(`设计评估 - ${viewport.name}`, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle');

          // 截图
          const screenshotPath = join(
            SCREENSHOT_DIR,
            `${pageInfo.name.replace(/[/\s]/g, '-')}-${viewport.name}.png`,
          );
          await page.screenshot({ path: screenshotPath, fullPage: true });

          // 收集设计信息
          const designData = await page.evaluate(() => {
            const results: {
              colors: string[];
              fonts: string[];
              images: Array<{
                index: number;
                src: string;
                alt: string;
                width: number;
                height: number;
                naturalWidth: number;
                naturalHeight: number;
              }>;
              links: Array<{
                index: number;
                href: string;
                text: string;
              }>;
              visualHierarchy: Array<{
                tag: string;
                text: string;
                fontSize: string;
              }>;
            } = {
              colors: [],
              fonts: [],
              images: [],
              links: [],
              visualHierarchy: [],
            };

            // 收集颜色
            const allElements = document.querySelectorAll('*');
            const colorSet = new Set();
            allElements.forEach((el) => {
              const style = window.getComputedStyle(el);
              if (style.color) colorSet.add(style.color);
              if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                colorSet.add(style.backgroundColor);
              }
            });
            results.colors = Array.from(colorSet).slice(0, 20);

            // 收集字体
            const fontSet = new Set();
            allElements.forEach((el) => {
              const style = window.getComputedStyle(el);
              if (style.fontFamily) fontSet.add(style.fontFamily);
            });
            results.fonts = Array.from(fontSet);

            // 收集图片
            const images = document.querySelectorAll('img');
            images.forEach((img, index) => {
              results.images.push({
                index,
                src: img.src,
                alt: img.alt,
                width: img.width,
                height: img.height,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
              });
            });

            // 收集链接
            const links = document.querySelectorAll('a');
            links.forEach((link, index) => {
              results.links.push({
                index,
                href: link.href,
                text: link.textContent?.trim() || '',
              });
            });

            // 视觉层次分析
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach((h) => {
              results.visualHierarchy.push({
                tag: h.tagName,
                text: h.textContent?.trim() || '',
                fontSize: window.getComputedStyle(h).fontSize,
              });
            });

            return results;
          });

          auditResults.push({
            page: pageInfo.name,
            viewport: viewport.name,
            ...designData,
            screenshotPath,
          });
        });
      }
    });
  }

  test.afterAll(async () => {
    // 生成报告
    const reportPath = join(process.cwd(), 'audit_report', 'design-audit-report.md');
    let report = '# 网站设计评估与内容完整性检查报告\n\n';
    report += `**生成时间：** ${new Date().toLocaleString('zh-CN')}\n\n`;
    report += '---\n\n';

    report += '## 一、检查概述\n\n';
    report += '本次检查涵盖以下方面：\n';
    report += '1. 设计感评估 - 颜色搭配、字体使用、视觉层次\n';
    report += '2. 内容完整性 - 图片、文本、链接检查\n';
    report += '3. 响应式表现 - 不同屏幕尺寸下的布局\n\n';

    report += '---\n\n';

    report += '## 二、各页面详细检查\n\n';

    for (const result of auditResults) {
      report += `### ${result.page} - ${result.viewport}\n\n`;

      // 颜色分析
      report += '#### 颜色使用\n';
      report += '使用的主要颜色：\n';
      result.colors.forEach((color: string) => {
        report += `- ${color}\n`;
      });
      report += '\n';

      // 字体分析
      report += '#### 字体使用\n';
      result.fonts.forEach((font: string) => {
        report += `- ${font}\n`;
      });
      report += '\n';

      // 图片分析
      report += '#### 图片检查\n';
      const imagesWithoutAlt = result.images.filter((img) => !img.alt);
      const brokenImages = result.images.filter((img) => img.naturalWidth === 0);
      if (imagesWithoutAlt.length > 0) {
        report += `⚠️ **警告**: ${imagesWithoutAlt.length} 张图片缺少 alt 属性\n\n`;
      }
      if (brokenImages.length > 0) {
        report += `❌ **错误**: ${brokenImages.length} 张图片可能加载失败\n\n`;
      }
      report += `总计 ${result.images.length} 张图片\n\n`;

      // 链接分析
      report += '#### 链接检查\n';
      const externalLinks = result.links.filter((link) =>
        link.href.startsWith('http'),
      );
      const internalLinks = result.links.filter((link) =>
        !link.href.startsWith('http') && link.href,
      );
      const emptyLinks = result.links.filter((link) => !link.href || link.href === '#');
      report += `- 外部链接: ${externalLinks.length}\n`;
      report += `- 内部链接: ${internalLinks.length}\n`;
      if (emptyLinks.length > 0) {
        report += `⚠️ **警告**: ${emptyLinks.length} 个链接可能为空或无效\n\n`;
      }
      report += '\n';

      // 视觉层次
      report += '#### 视觉层次\n';
      const h1Count = result.visualHierarchy.filter((h) => h.tag === 'H1').length;
      if (h1Count > 1) {
        report += `⚠️ **警告**: 页面有 ${h1Count} 个 H1 标签（建议 1 个）\n\n`;
      }
      const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
      headingTags.forEach((tag) => {
        const count = result.visualHierarchy.filter((h) => h.tag === tag).length;
        if (count > 0) {
          report += `- ${tag}: ${count} 个\n`;
        }
      });
      report += '\n';

      report += `**截图**: ${result.screenshotPath}\n\n`;
      report += '---\n\n';
    }

    // 设计感问题汇总
    report += '## 三、设计感问题汇总\n\n';
    report += '### 颜色搭配\n';
    report += '- 建议统一颜色系统，确保对比度符合 WCAG AA 标准\n';
    report += '- 检查装饰性元素颜色与内容颜色的一致性\n\n';

    report += '### 字体使用\n';
    report += '- 建议限制字体族数量（理想情况下 2-3 种）\n';
    report += '- 确保字体大小层次清晰，可读性良好\n\n';

    report += '### 视觉层次\n';
    report += '- 确保 H1 标签唯一性\n';
    report += '- 保持标题层级的一致性\n\n';

    report += '## 四、内容完整性问题\n\n';
    report += '- 检查所有图片的 alt 属性\n';
    report += '- 验证所有链接的有效性\n';
    report += '- 确保响应式布局在所有设备上正常\n\n';

    report += '## 五、改进建议\n\n';
    report += '1. **设计系统优化** - 统一颜色 tokens 和字体 scale\n';
    report += '2. **可访问性提升** - 确保所有交互元素有适当的标签\n';
    report += '3. **响应式完善** - 增加更多断点测试\n';
    report += '4. **性能优化** - 压缩图片资源\n\n';

    writeFileSync(reportPath, report, 'utf-8');
    console.log(`报告已生成: ${reportPath}`);
  });
});
