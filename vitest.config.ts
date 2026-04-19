/// <reference types="vitest/config" />

import { getViteConfig } from 'astro/config';

export default getViteConfig({
  // 传递 Astro 配置的覆盖项
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,js}'],
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,js,astro}'],
      exclude: ['src/test/**', 'src/**/*.test.{ts,js}'],
    },
  },
});
