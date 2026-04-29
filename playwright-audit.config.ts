import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  timeout: 180000,
  use: {
    baseURL: 'http://localhost:4325/',
    trace: 'on-first-retry',
    navigationTimeout: 45000,
    actionTimeout: 20000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', viewport: { width: 1920, height: 1080 } },
    },
  ],
  // 注意：我们不再自动启动服务器，因为它已经在运行
});
