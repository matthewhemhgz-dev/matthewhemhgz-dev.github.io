#!/usr/bin/env node

import { chromium } from 'playwright';

async function runPerformanceAnalysis() {
  console.log('Starting performance analysis...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-gpu', '--no-sandbox']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 导航到本地服务器
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle'
    });
    
    // 收集性能指标
    const performanceMetrics = await page.evaluate(() => {
      
      const metrics = performance.getEntriesByType('measure');
      const navigationMetric = metrics.find(m => m.name === 'navigation');
      
      // 获取关键性能指标
      const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
      const fcp = performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint');
      const cls = performance.getEntriesByType('layout-shift').reduce((sum, entry) => sum + entry.value, 0);
      
      return {
        navigationTime: navigationMetric ? navigationMetric.duration : null,
        firstContentfulPaint: fcp ? fcp.startTime : null,
        largestContentfulPaint: lcp ? lcp.startTime : null,
        cumulativeLayoutShift: cls,
        resourceCount: performance.getEntriesByType('resource').length,
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        loadEvent: performance.timing.loadEventEnd - performance.timing.navigationStart
      };
    });
    
    console.log('Performance Analysis Results:');
    console.log('================================');
    console.log(`Navigation Time: ${performanceMetrics.navigationTime}ms`);
    console.log(`First Contentful Paint: ${performanceMetrics.firstContentfulPaint}ms`);
    console.log(`Largest Contentful Paint: ${performanceMetrics.largestContentfulPaint}ms`);
    console.log(`Cumulative Layout Shift: ${performanceMetrics.cumulativeLayoutShift}`);
    console.log(`Resource Count: ${performanceMetrics.resourceCount}`);
    console.log(`DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`Load Event: ${performanceMetrics.loadEvent}ms`);
    console.log('================================');
    
    // 分析可访问性
    console.log('\nAccessibility Analysis:');
    console.log('======================');
    
    // 检查基本可访问性
    const accessibilityIssues = await page.evaluate(() => {
      const issues = [];
      
      // 检查图片是否有 alt 属性
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.hasAttribute('alt')) {
          issues.push(`Image ${index + 1} missing alt attribute`);
        }
      });
      
      // 检查链接是否有文本
      const links = document.querySelectorAll('a');
      links.forEach((link, index) => {
        if (!link.textContent.trim()) {
          issues.push(`Link ${index + 1} missing text content`);
        }
      });
      
      // 检查表单元素是否有标签
      const formElements = document.querySelectorAll('input, select, textarea');
      formElements.forEach((element, index) => {
        if (!element.hasAttribute('id') || !document.querySelector(`label[for="${element.id}"]`)) {
          issues.push(`Form element ${index + 1} missing label`);
        }
      });
      
      // 检查页面标题
      if (!document.title) {
        issues.push('Page missing title');
      }
      
      return issues;
    });
    
    if (accessibilityIssues.length === 0) {
      console.log('No accessibility issues found');
    } else {
      console.log(`Found ${accessibilityIssues.length} accessibility issues:`);
      accessibilityIssues.forEach(issue => console.log(`- ${issue}`));
    }
    
    // 分析 SEO
    console.log('\nSEO Analysis:');
    console.log('=============');
    
    const seoIssues = await page.evaluate(() => {
      const issues = [];
      
      // 检查页面标题
      if (!document.title) {
        issues.push('Page missing title');
      } else if (document.title.length > 60) {
        issues.push('Page title too long (over 60 characters)');
      }
      
      // 检查 meta 描述
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        issues.push('Page missing meta description');
      } else if (metaDescription.content.length > 160) {
        issues.push('Meta description too long (over 160 characters)');
      }
      
      // 检查 h1 标签
      const h1Tags = document.querySelectorAll('h1');
      if (h1Tags.length === 0) {
        issues.push('Page missing h1 tag');
      } else if (h1Tags.length > 1) {
        issues.push('Page has multiple h1 tags');
      }
      
      // 检查 robots.txt
      // 注意：这只是一个简单的检查，实际应该检查服务器根目录的 robots.txt
      
      return issues;
    });
    
    if (seoIssues.length === 0) {
      console.log('No SEO issues found');
    } else {
      console.log(`Found ${seoIssues.length} SEO issues:`);
      seoIssues.forEach(issue => console.log(`- ${issue}`));
    }
    
  } catch (error) {
    console.error('Error during performance analysis:', error);
  } finally {
    await browser.close();
    console.log('\nPerformance analysis completed!');
  }
}

runPerformanceAnalysis();