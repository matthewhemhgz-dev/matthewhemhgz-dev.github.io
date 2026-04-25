#!/usr/bin/env node

/**
 * 资源扫描工具
 * 用于识别和分类项目中的所有资源和文档
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 忽略的目录和文件
const ignorePatterns = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  'test-results',
  'playwright-report',
  '*.log',
  '*.tmp',
  '*.temp'
];

// 资源类型定义
const resourceTypes = {
  code: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.astro', '.vue', '.svelte', '.html', '.css', '.scss', '.less'],
    description: '代码文件'
  },
  documentation: {
    extensions: ['.md', '.mdx', '.rst', '.txt', '.docx', '.pdf'],
    description: '文档文件'
  },
  test: {
    extensions: ['.spec.js', '.spec.ts', '.test.js', '.test.ts'],
    description: '测试文件'
  },
  script: {
    extensions: ['.mjs', '.cjs', '.sh', '.bat', '.ps1'],
    description: '脚本文件'
  },
  config: {
    extensions: ['.json', '.yaml', '.yml', '.toml', '.ini', '.env', '.config.js', '.config.ts'],
    description: '配置文件'
  },
  asset: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.mp4', '.mp3', '.wav'],
    description: '媒体资源'
  },
  other: {
    extensions: [],
    description: '其他文件'
  }
};

/**
 * 检查文件是否应该被忽略
 */
function shouldIgnore(filePath) {
  return ignorePatterns.some(pattern => {
    if (pattern.startsWith('*.')) {
      return filePath.endsWith(pattern.substring(1));
    }
    return filePath.includes(pattern);
  });
}

/**
 * 确定文件类型
 */
function getFileType(filePath) {
  const extension = path.extname(filePath);
  
  for (const [type, config] of Object.entries(resourceTypes)) {
    if (config.extensions.some(ext => filePath.endsWith(ext))) {
      return type;
    }
  }
  
  return 'other';
}

/**
 * 扫描目录
 */
function scanDirectory(dir, result = {}) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (shouldIgnore(filePath)) {
      return;
    }
    
    if (stat.isDirectory()) {
      scanDirectory(filePath, result);
    } else {
      const fileType = getFileType(filePath);
      if (!result[fileType]) {
        result[fileType] = [];
      }
      result[fileType].push(path.relative(process.cwd(), filePath));
    }
  });
  
  return result;
}

/**
 * 生成资源分类报告
 */
function generateReport(scanResult) {
  console.log('========================================');
  console.log('项目资源分类报告');
  console.log('========================================');
  
  let totalFiles = 0;
  
  for (const [type, files] of Object.entries(scanResult)) {
    const count = files.length;
    totalFiles += count;
    console.log(`${resourceTypes[type].description} (${type}): ${count} 个文件`);
    if (count > 0) {
      console.log('  示例文件:');
      files.slice(0, 5).forEach(file => {
        console.log(`    - ${file}`);
      });
      if (count > 5) {
        console.log(`    ... 等 ${count - 5} 个文件`);
      }
    }
    console.log('');
  }
  
  console.log(`总计: ${totalFiles} 个文件`);
  console.log('========================================');
}

/**
 * 生成资源索引文件
 */
function generateIndex(scanResult) {
  const index = {
    generatedAt: new Date().toISOString(),
    totalFiles: Object.values(scanResult).reduce((sum, files) => sum + files.length, 0),
    resources: {}
  };
  
  for (const [type, files] of Object.entries(scanResult)) {
    index.resources[type] = {
      type: type,
      description: resourceTypes[type].description,
      count: files.length,
      files: files
    };
  }
  
  const indexPath = path.join(process.cwd(), '.trae', 'resources', 'index.json');
  
  // 创建目录
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  
  // 写入索引文件
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  
  console.log(`资源索引已生成: ${indexPath}`);
}

// 主函数
function main() {
  console.log('开始扫描项目资源...');
  const scanResult = scanDirectory(process.cwd());
  generateReport(scanResult);
  generateIndex(scanResult);
  console.log('资源扫描完成!');
}

// 执行主函数
main();