import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'design-audit.spec.ts',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 120000,
  use: {
    baseURL: 'http://localhost:4326',
    trace: 'on-first-retry',
    navigationTimeout: 60000,
    actionTimeout: 30000,
  },
});
