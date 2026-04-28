/**
 * 构建产物大小检查
 *
 * 检查 dist/ 目录下各类文件的总大小，超出预算则报错
 * 用于 CI 质量门禁
 *
 * 预算配置（单位：KB）：
 * - JS 总计: 600 KB（含 Pagefind wasm + worker）
 * - CSS 总计: 200 KB（含 Pagefind UI CSS）
 * - HTML 总计: 1000 KB（含 30 页面）
 * - 图片总计: 4000 KB（含 favicon + og-image + 6 张博客封面）
 * - 其他总计: 600 KB（含 Pagefind 索引 + 字体）
 * - 全部总计: 6000 KB
 */

import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const DIST_DIR = 'dist';

const BUDGETS = {
  js: 650, // 增加 JS 预算以容纳 PWA 相关文件
  css: 300, // 增加 CSS 预算以容纳设计令牌系统和组件样式
  html: 7000, // 大幅增加 HTML 预算以容纳大量博客文章和标签页面（116页）
  image: 4000,
  other: 650, // 增加其他预算以容纳 PWA 图标和 service worker
  total: 12000, // 大幅增加总预算以容纳所有新增功能和博客文章
};

function getCategory(file) {
  const ext = extname(file).toLowerCase();
  if (ext === '.js' || ext === '.mjs') return 'js';
  if (ext === '.css') return 'css';
  if (ext === '.html' || ext === '.xml') return 'html';
  if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif', '.ico'].includes(ext))
    return 'image';
  return 'other';
}

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function main() {
  const files = walkDir(DIST_DIR);
  const sizes = { js: 0, css: 0, html: 0, image: 0, other: 0, total: 0 };
  let hasError = false;

  for (const file of files) {
    const stat = statSync(file);
    const cat = getCategory(file);
    sizes[cat] += stat.size;
    sizes.total += stat.size;
  }

  console.log('\n📦 构建产物大小报告\n');
  console.log('─'.repeat(40));

  for (const cat of ['js', 'css', 'html', 'image', 'other']) {
    const budget = BUDGETS[cat];
    const actual = sizes[cat];
    const status = actual > budget * 1024 ? '❌ FAIL' : '✅ PASS';
    if (actual > budget * 1024) hasError = true;
    console.log(`  ${cat.padEnd(8)} ${formatKB(actual).padStart(10)} / ${budget} KB  ${status}`);
  }

  console.log('─'.repeat(40));
  const totalBudget = BUDGETS.total;
  const totalStatus = sizes.total > totalBudget * 1024 ? '❌ FAIL' : '✅ PASS';
  if (sizes.total > totalBudget * 1024) hasError = true;
  console.log(
    `  ${'total'.padEnd(8)} ${formatKB(sizes.total).padStart(10)} / ${totalBudget} KB  ${totalStatus}`,
  );
  console.log('');

  if (hasError) {
    console.error('❌ 构建产物超出预算限制！');
    process.exit(1);
  } else {
    console.log('✅ 构建产物大小在预算范围内。');
  }
}

main();
