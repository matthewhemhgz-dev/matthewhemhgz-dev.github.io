#!/usr/bin/env node

/**
 * 资源状态管理工具
 * 用于跟踪资源的状态，如开发中、已完成、已废弃等
 */

import fs from 'fs';
import path from 'path';

// 资源状态文件路径
const STATUS_PATH = path.join(process.cwd(), '.trae', 'resources', 'status.json');

/**
 * 加载资源状态
 */
function loadStatus() {
  if (!fs.existsSync(STATUS_PATH)) {
    return {};
  }
  
  const data = fs.readFileSync(STATUS_PATH, 'utf8');
  return JSON.parse(data);
}

/**
 * 保存资源状态
 */
function saveStatus(status) {
  // 创建目录
  fs.mkdirSync(path.dirname(STATUS_PATH), { recursive: true });
  
  // 写入状态文件
  fs.writeFileSync(STATUS_PATH, JSON.stringify(status, null, 2));
}

/**
 * 设置资源状态
 */
function setStatus(filePath, status, description = '') {
  const statusData = loadStatus();
  
  statusData[filePath] = {
    status,
    description,
    updatedAt: new Date().toISOString()
  };
  
  saveStatus(statusData);
  console.log(`成功设置文件状态为 "${status}": ${filePath}`);
  if (description) {
    console.log(`描述: ${description}`);
  }
}

/**
 * 获取资源状态
 */
function getStatus(filePath) {
  const statusData = loadStatus();
  
  if (statusData[filePath]) {
    const { status, description, updatedAt } = statusData[filePath];
    console.log(`文件 "${filePath}" 的状态:`);
    console.log(`  状态: ${status}`);
    if (description) {
      console.log(`  描述: ${description}`);
    }
    console.log(`  更新时间: ${updatedAt}`);
  } else {
    console.log(`文件 "${filePath}" 没有设置状态`);
  }
}

/**
 * 列出所有资源状态
 */
function listStatus() {
  const statusData = loadStatus();
  
  if (Object.keys(statusData).length === 0) {
    console.log('没有设置任何资源状态');
    return;
  }
  
  console.log('资源状态列表:');
  Object.entries(statusData).forEach(([filePath, data]) => {
    console.log(`- ${filePath}`);
    console.log(`  状态: ${data.status}`);
    if (data.description) {
      console.log(`  描述: ${data.description}`);
    }
    console.log(`  更新时间: ${data.updatedAt}`);
  });
}

/**
 * 按状态过滤资源
 */
function filterByStatus(status) {
  const statusData = loadStatus();
  const filtered = Object.entries(statusData).filter(([, data]) => data.status === status);
  
  if (filtered.length === 0) {
    console.log(`没有状态为 "${status}" 的资源`);
    return;
  }
  
  console.log(`状态为 "${status}" 的资源:`);
  filtered.forEach(([filePath, data]) => {
    console.log(`- ${filePath}`);
    if (data.description) {
      console.log(`  描述: ${data.description}`);
    }
    console.log(`  更新时间: ${data.updatedAt}`);
  });
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('资源状态管理工具');
    console.log('用法:');
    console.log('  node scripts/resource-status.js set <file> <status> [description] - 设置资源状态');
    console.log('  node scripts/resource-status.js get <file> - 获取资源状态');
    console.log('  node scripts/resource-status.js list - 列出所有资源状态');
    console.log('  node scripts/resource-status.js filter <status> - 按状态过滤资源');
    console.log('');
    console.log('可用状态:');
    console.log('  development - 开发中');
    console.log('  completed - 已完成');
    console.log('  deprecated - 已废弃');
    console.log('  archived - 已归档');
    return;
  }
  
  const command = args[0];
  
  switch (command) {
    case 'set':
      if (args.length < 3) {
        console.error('请提供文件路径和状态');
        return;
      }
      const filePath = args[1];
      const status = args[2];
      const description = args.slice(3).join(' ');
      setStatus(filePath, status, description);
      break;
    case 'get':
      if (args.length < 2) {
        console.error('请提供文件路径');
        return;
      }
      getStatus(args[1]);
      break;
    case 'list':
      listStatus();
      break;
    case 'filter':
      if (args.length < 2) {
        console.error('请提供状态');
        return;
      }
      filterByStatus(args[1]);
      break;
    default:
      console.error('未知命令');
  }
}

// 执行主函数
main();