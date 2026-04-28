import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import astroPWA from '@vite-pwa/astro';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  content: {
    cache: true,
  },
  site: 'https://matthewhemhgz-dev.github.io',
  base: '/',
  output: 'static',
  outDir: './dist',
  compressHTML: true,
  build: {
    assets: '_astro',
    cache: true,
    format: 'directory',
    inlineStylesheets: 'never',
    assetsPrefix: '/',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    formats: ['avif', 'webp', 'jpeg'],
    quality: 80,
    placeholder: 'blur',
    minWidth: 64,
    maxWidth: 2048,
    minHeight: 64,
    maxHeight: 2048,
  },
  markdown: {
    syntaxHighlight: {
      excludeLangs: ['mermaid'],
    },
    gfm: true,
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
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
        globPatterns: ['**/*.{css,js,html,ico,png,svg,webp,avif,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-static-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.qrserver\.com\//i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'qr-code-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.svg', 'images/logo.png', 'images/logo.svg'],
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
      assetsInlineLimit: 4096,
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('sharp')) return 'vendor-sharp';
              if (id.includes('astro')) return 'vendor-astro';
              return 'vendor';
            }
            if (id.includes('/src/scripts/')) {
              if (id.includes('particles')) return 'chunk-particles';
              if (id.includes('cursor-glow')) return 'chunk-cursor-glow';
              if (id.includes('card-tilt')) return 'chunk-card-tilt';
            }
            if (id.includes('/src/components/global/')) {
              if (id.includes('SearchModal')) return 'chunk-search-modal';
              if (id.includes('ParticlesCanvas')) return 'chunk-particles-canvas';
            }
            return undefined;
          },
        },
      },
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,
      dynamicImportVars: true,
      minify: 'esbuild',
      target: ['es2020', 'chrome90', 'firefox90', 'safari15', 'edge90'],
      sourcemap: false,
      reportCompressedSize: true,
    },
    optimizeDeps: {
      include: [],
      exclude: ['pagefind'],
      esbuildOptions: {
        target: 'es2020',
        treeShaking: true,
      },
    },
    ssr: {
      noExternal: [],
    },
    server: {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      },
    },
    plugins: [],
  },
});
