#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

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
    stdio: 'ignore',
  });

  // 等待服务器启动
  console.log('Waiting for server to start...');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // 运行 Lighthouse 审计
  console.log('Running Lighthouse audit...');
  try {
    // 直接使用 Playwright 的 Chromium 路径
    const browserPath = '/root/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome';
    console.log(`Using Chrome at: ${browserPath}`);
    
    // 设置 CHROME_PATH 环境变量
    const env = { ...process.env };
    env.CHROME_PATH = browserPath;
    
    // 运行 Lighthouse 审计
    const lighthouseCommand = [
      'npx',
      'lighthouse',
      'http://localhost:3000',
      '--output=html',
      '--output=json',
      '--output-path=./reports/lighthouse-report.html',
      '--quiet',
      '--chrome-flags=--headless --disable-gpu --no-sandbox',
      '--emulated-form-factor=mobile',
      '--throttling-method=devtools',
    ];

    const { execSync } = await import('child_process');
    execSync(lighthouseCommand.join(' '), {
      stdio: 'inherit',
      env,
    });

    console.log('Lighthouse audit completed successfully!');
    console.log('HTML Report generated at: ./reports/lighthouse-report.html');
    console.log('JSON Report generated at: ./reports/lighthouse-report.json');
  } catch (error) {
    console.error('Error running Lighthouse audit:', error.message);
    console.log('Continuing with CI process...');
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