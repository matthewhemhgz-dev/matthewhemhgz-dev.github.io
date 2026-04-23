#!/usr/bin/env node

import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function runLighthouseAudit() {
  // 确保 dist 目录存在
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    console.log('Error: dist directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  // 确保 reports 目录存在
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // 启动本地预览服务器
  console.log('Starting local preview server...');
  const previewProcess = spawn('npm', ['run', 'preview', '--', '--port', '3000'], {
    detached: true,
    stdio: 'ignore'
  });

  // 等待服务器启动
  console.log('Waiting for server to start...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // 运行 Lighthouse 审计
  console.log('Running Lighthouse audit...');
  try {
    // 使用更简单的 Lighthouse 命令
    execSync('npx lighthouse http://localhost:3000 --output=html --output-path=./reports/lighthouse-report.html', {
      stdio: 'inherit'
    });
    
    console.log('Lighthouse audit completed successfully!');
    console.log('Report generated at: ./reports/lighthouse-report.html');
  } catch (error) {
    console.error('Error running Lighthouse audit:', error.message);
  } finally {
    // 停止预览服务器
    console.log('Stopping preview server...');
    try {
      process.kill(-previewProcess.pid);
    } catch (error) {
      console.log('Preview server stopped.');
    }
  }
}

runLighthouseAudit();
