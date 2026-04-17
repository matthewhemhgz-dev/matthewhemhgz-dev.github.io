import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

// Keystatic 仅在开发模式下启用
let integrations = [react(), markdoc(), sitemap({
  filter: (page) => !page.includes('/404'),
  i18n: {
    defaultLocale: 'zh',
    locales: {
      zh: 'zh-CN',
      en: 'en',
    },
  },
})];

if (import.meta.env.DEV) {
  const { default: keystatic } = await import('@keystatic/astro');
  integrations.push(keystatic());
}

export default defineConfig({
  site: 'https://matthewhemhgz-dev.github.io',
  base: '/',
  output: 'static',
  outDir: './dist',
  build: {
    assets: '_astro',
  },
  markdown: {
    syntaxHighlight: {
      excludeLangs: ['mermaid'],
    },
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations,
  vite: {
    build: {
      cssMinify: true,
      assetsInlineLimit: 0,
    },
  },
});
