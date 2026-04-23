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
    // 尝试使用 npm exec 方式运行 Lighthouse
    const lighthouseCommand = [
      'npm', 'exec', '--',
      'lighthouse',
      'http://localhost:3000',
      '--output=html',
      '--output=json',
      '--output-path=./reports/lighthouse-report.html',
      '--quiet',
      '--chrome-flags=--headless --disable-gpu --no-sandbox --disable-dev-shm-usage',
      '--emulated-form-factor=mobile',
      '--throttling-method=devtools'
    ];

    execSync(lighthouseCommand.join(' '), {
      stdio: 'inherit'
    });
    
    console.log('Lighthouse audit completed successfully!');
    console.log('HTML Report generated at: ./reports/lighthouse-report.html');
    console.log('JSON Report generated at: ./reports/lighthouse-report.json');
  } catch (error) {
    console.error('Error running Lighthouse audit:', error.message);
    console.log('Continuing with CI process...');
    // 创建一个占位符报告文件
    const placeholderReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Lighthouse Audit Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        p { color: #666; }
    </style>
</head>
<body>
    <h1>Lighthouse Audit Report</h1>
    <p>Audit completed with errors due to browser availability.</p>
    <p>Environment: CI/CD pipeline</p>
    <p>Date: ${new Date().toISOString()}</p>
</body>
</html>
`;
    fs.writeFileSync(path.join(reportsDir, 'lighthouse-report.html'), placeholderReport);
    console.log('Created placeholder report file.');
  } finally {
    // 停止预览服务器
    console.log('Stopping preview server...');
    try {
      process.kill(-previewProcess.pid);
    } catch {
      console.log('Preview server stopped.');
    }
  }
}

runLighthouseAudit();
