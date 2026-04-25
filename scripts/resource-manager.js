#!/usr/bin/env node

/**
 * 资源管理工具
 * 用于管理和搜索项目资源
 */

import fs from 'fs';
import path from 'path';

// 资源索引文件路径
const INDEX_PATH = path.join(process.cwd(), '.trae', 'resources', 'index.json');
const TAGS_PATH = path.join(process.cwd(), '.trae', 'resources', 'tags.json');

/**
 * 加载资源索引
 */
function loadIndex() {
  if (!fs.existsSync(INDEX_PATH)) {
    console.error('资源索引文件不存在，请先运行资源扫描工具');
    process.exit(1);
  }
  
  const data = fs.readFileSync(INDEX_PATH, 'utf8');
  return JSON.parse(data);
}

/**
 * 加载标签数据
 */
function loadTags() {
  if (!fs.existsSync(TAGS_PATH)) {
    return {};
  }
  
  const data = fs.readFileSync(TAGS_PATH, 'utf8');
  return JSON.parse(data);
}

/**
 * 保存标签数据
 */
function saveTags(tags) {
  // 创建目录
  fs.mkdirSync(path.dirname(TAGS_PATH), { recursive: true });
  
  // 写入标签文件
  fs.writeFileSync(TAGS_PATH, JSON.stringify(tags, null, 2));
}

/**
 * 搜索资源
 */
function searchResources(query, options = {}) {
  const index = loadIndex();
  const { type } = options;
  
  let results = [];
  
  // 遍历所有资源类型
  for (const [resourceType, resourceData] of Object.entries(index.resources)) {
    // 按类型过滤
    if (type && resourceType !== type) {
      continue;
    }
    
    // 搜索文件
    const matchedFiles = resourceData.files.filter(file => {
      // 按关键词搜索
      if (query && !file.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    });
    
    if (matchedFiles.length > 0) {
      results.push({
        type: resourceType,
        description: resourceData.description,
        files: matchedFiles
      });
    }
  }
  
  return results;
}

/**
 * 生成资源报告
 */
function generateReport() {
  const index = loadIndex();
  const tags = loadTags();
  
  console.log('========================================');
  console.log('项目资源管理报告');
  console.log('========================================');
  console.log(`生成时间: ${new Date().toISOString()}`);
  console.log(`总文件数: ${index.totalFiles}`);
  console.log('');
  
  // 资源类型分布
  console.log('资源类型分布:');
  for (const [type, data] of Object.entries(index.resources)) {
    console.log(`  ${data.description} (${type}): ${data.count} 个文件`);
  }
  console.log('');
  
  // 标签统计
  const tagCount = Object.keys(tags).length;
  console.log(`标签数量: ${tagCount}`);
  if (tagCount > 0) {
    console.log('标签列表:');
    Object.keys(tags).slice(0, 10).forEach(tag => {
      console.log(`  - ${tag}: ${tags[tag].length} 个文件`);
    });
    if (tagCount > 10) {
      console.log(`  ... 等 ${tagCount - 10} 个标签`);
    }
  }
  console.log('');
  
  console.log('========================================');
}

/**
 * 添加标签
 */
function addTag(filePath, tag) {
  const tags = loadTags();
  
  if (!tags[tag]) {
    tags[tag] = [];
  }
  
  if (!tags[tag].includes(filePath)) {
    tags[tag].push(filePath);
    saveTags(tags);
    console.log(`成功为文件添加标签 "${tag}": ${filePath}`);
  } else {
    console.log(`文件已经有标签 "${tag}": ${filePath}`);
  }
}

/**
 * 移除标签
 */
function removeTag(filePath, tag) {
  const tags = loadTags();
  
  if (tags[tag]) {
    const index = tags[tag].indexOf(filePath);
    if (index > -1) {
      tags[tag].splice(index, 1);
      if (tags[tag].length === 0) {
        delete tags[tag];
      }
      saveTags(tags);
      console.log(`成功移除文件的标签 "${tag}": ${filePath}`);
    } else {
      console.log(`文件没有标签 "${tag}": ${filePath}`);
    }
  } else {
    console.log(`标签 "${tag}" 不存在`);
  }
}

/**
 * 列出文件的标签
 */
function listTags(filePath) {
  const tags = loadTags();
  const fileTags = [];
  
  for (const [tag, files] of Object.entries(tags)) {
    if (files.includes(filePath)) {
      fileTags.push(tag);
    }
  }
  
  if (fileTags.length > 0) {
    console.log(`文件 "${filePath}" 的标签:`);
    fileTags.forEach(tag => {
      console.log(`  - ${tag}`);
    });
  } else {
    console.log(`文件 "${filePath}" 没有标签`);
  }
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('资源管理工具');
    console.log('用法:');
    console.log('  node scripts/resource-manager.js report          - 生成资源报告');
    console.log('  node scripts/resource-manager.js search <query> - 搜索资源');
    console.log('  node scripts/resource-manager.js add-tag <file> <tag> - 为文件添加标签');
    console.log('  node scripts/resource-manager.js remove-tag <file> <tag> - 移除文件标签');
    console.log('  node scripts/resource-manager.js list-tags <file> - 列出文件标签');
    return;
  }
  
  const command = args[0];
  
  switch (command) {
    case 'report':
      generateReport();
      break;
    case 'search':
      if (args.length < 2) {
        console.error('请提供搜索关键词');
        return;
      }
      const query = args[1];
      const results = searchResources(query);
      console.log(`搜索结果 for "${query}":`);
      results.forEach(result => {
        console.log(`${result.description} (${result.type}): ${result.files.length} 个文件`);
        result.files.forEach(file => {
          console.log(`  - ${file}`);
        });
      });
      break;
    case 'add-tag':
      if (args.length < 3) {
        console.error('请提供文件路径和标签');
        return;
      }
      addTag(args[1], args[2]);
      break;
    case 'remove-tag':
      if (args.length < 3) {
        console.error('请提供文件路径和标签');
        return;
      }
      removeTag(args[1], args[2]);
      break;
    case 'list-tags':
      if (args.length < 2) {
        console.error('请提供文件路径');
        return;
      }
      listTags(args[1]);
      break;
    default:
      console.error('未知命令');
  }
}

// 执行主函数
main();