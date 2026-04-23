import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import astroPWA from '@vite-pwa/astro';

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
    astroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{css,js,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.svg'],
      manifest: {
        name: '祈研所 (Qi-Lab)',
        short_name: 'Qi-Lab',
        description: '祈研所（Qi-Lab）— 个人品牌网站，分享前端技术、知识管理和设计系统相关内容',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'icons/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    }),
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
