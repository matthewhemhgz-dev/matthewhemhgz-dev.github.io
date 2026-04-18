/// <reference types="vitest/config" />

import { getViteConfig } from 'astro/config';

export default getViteConfig({
  // 传递 Astro 配置的覆盖项
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,js}'],
    setupFiles: ['./src/test/setup.ts'],
  },
});
