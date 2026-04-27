#!/usr/bin/env node

import { chromium } from 'playwright';
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
    // 使用 Playwright 运行 Lighthouse
    const lighthouse = require('lighthouse');
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-gpu']
    });
    const page = await browser.newPage();
    
    // 导航到本地服务器
    await page.goto('http://localhost:3000');
    
    // 获取浏览器会话
    const session = await page.context().newCDPSession(page);
    
    // 运行 Lighthouse 审计
    const report = await lighthouse('http://localhost:3000', {
      port: (new URL(browser.wsEndpoint())).port,
      output: ['html', 'json'],
      emulatedFormFactor: 'mobile',
      throttlingMethod: 'devtools',
      disableStorageReset: true,
      logLevel: 'error'
    });
    
    // 保存报告
    fs.writeFileSync(
      path.join(reportsDir, 'lighthouse-report.html'),
      report.report.html
    );
    fs.writeFileSync(
      path.join(reportsDir, 'lighthouse-report.json'),
      JSON.stringify(report.report.json, null, 2)
    );
    
    console.log('Lighthouse audit completed successfully!');
    console.log('HTML Report generated at: ./reports/lighthouse-report.html');
    console.log('JSON Report generated at: ./reports/lighthouse-report.json');
    
    // 关闭浏览器
    await browser.close();
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