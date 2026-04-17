import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';

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
    locales: ['zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap({
    filter: (page) => !page.includes('/404'),
    i18n: {
      defaultLocale: 'zh',
      locales: {
        zh: 'zh-CN',
      },
    },
  }), markdoc()],
  vite: {
    build: {
      cssMinify: true,
      assetsInlineLimit: 0,
    },
  },
});
