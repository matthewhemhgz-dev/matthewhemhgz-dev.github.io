import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://matthewhemhgz-dev.github.io',
  base: '/',
  output: 'static',
  outDir: './dist',
  compressHTML: true,
  build: {
    assets: '_astro',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    formats: ['avif', 'webp', 'jpeg'],
    quality: 80,
    placeholder: 'blur',
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
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: {
        defaultLocale: 'zh',
        locales: {
          zh: 'zh-CN',
          en: 'en-US',
        },
      },
    }),
    pagefind(),
    tailwind(),
    mdx(),
  ],
  vite: {
    build: {
      cssMinify: true,
      assetsInlineLimit: 0,
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
      chunkSizeWarningLimit: 100,
      cssCodeSplit: true,
      dynamicImportVars: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      include: [],
    },
    ssr: {
      noExternal: [],
    },
    server: {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  },
});
