import 'astro:transitions/client';
import {
  initScrollReveal,
  initScrollHandler,
  initBackToTop,
  cleanupScrollHandler,
} from './scroll-handler.js';
import { InteractionEnhancements } from './interaction-enhancements.js';

let initialized = false;
let cursorGlow = null;
let particles = null;
let backgroundArt = null;
const cleanupFns = [];

function initQiLab() {
  if (initialized) return;
  initialized = true;

  const isHomePage = location.pathname === '/' || location.pathname === '';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. 粒子系统（仅首页启用）
  if (isHomePage && !prefersReducedMotion) {
    import('./particles.js').then(({ MinimalParticles }) => {
      const screenWidth = window.innerWidth;
      const cs = getComputedStyle(document.documentElement);
      const particleCount =
        screenWidth < 768 ? 40 : screenWidth < 1440 ? 80 : screenWidth < 2560 ? 100 : 120;
      const particleOptions = {
        count: particleCount,
        colors: [
          cs.getPropertyValue('--qi-brand-emerald').trim(),
          cs.getPropertyValue('--qi-brand-mint').trim(),
          cs.getPropertyValue('--qi-brand-amber').trim(),
          cs.getPropertyValue('--qi-bg-base').trim(),
        ],
        maxSize: 4,
        speed: 0.4,
        linkDistance: 160,
        linkOpacity: 0.12,
        mouseRadius: 200,
        mouseForce: 0.04,
        glowSize: 12,
        glowOpacity: 0.25,
      };

      if (particles && particles.canvas) {
        particles.rebuild(particleOptions);
      } else {
        particles = new MinimalParticles('particles-canvas', particleOptions);
      }
      if (particles) cleanupFns.push(() => particles.destroy());
    });
  }

  // 2. 鼠标追踪光效（仅首页启用）
  if (isHomePage && !prefersReducedMotion) {
    import('./cursor-glow.js').then(({ CursorGlow }) => {
      const cs = getComputedStyle(document.documentElement);
      cursorGlow = new CursorGlow({
        size: parseInt(cs.getPropertyValue('--qi-glow-size').trim()) || 350,
        speed: parseFloat(cs.getPropertyValue('--qi-glow-speed').trim()) || 0.06,
        blend: 'screen',
      });
      cleanupFns.push(() => cursorGlow.destroy());
    });
  }

  // 3. 背景艺术系统（非首页启用）
  if (!isHomePage && !prefersReducedMotion) {
    import('./background-art.js').then(({ BackgroundArt }) => {
      const cs = getComputedStyle(document.documentElement);
      const screenWidth = window.innerWidth;
      const artType = screenWidth < 768 ? 'generative' : 'fluid';

      backgroundArt = new BackgroundArt('background-art-canvas', {
        type: artType,
        particleCount: screenWidth < 768 ? 50 : 100,
        speed: 0.3,
        colors: {
          emerald: cs.getPropertyValue('--qi-brand-emerald').trim(),
          amber: cs.getPropertyValue('--qi-brand-amber').trim(),
          mint: cs.getPropertyValue('--qi-brand-mint').trim(),
        },
      });

      backgroundArt.init();
      cleanupFns.push(() => backgroundArt.destroy());
    });
  }

  // 2.5 卡片 3D 倾斜 + 光泽效果
  import('./card-tilt.js').then(({ CardTilt }) => {
    const cardTilt = new CardTilt(
      '.bento-card, .testimonial-card, .platform-card, .dash-card, .toolbox-category',
    );
    cleanupFns.push(() => cardTilt.destroy());
  });

  // 3. 滚动视差光影
  if (!prefersReducedMotion) {
    import('./scroll-parallax.js').then(({ initScrollParallax, cleanupScrollParallax }) => {
      initScrollParallax();
      cleanupFns.push(cleanupScrollParallax);
    });
  }

  // 4. 滚动显示动画
  initScrollReveal();

  // 5. 滚动处理（导航、粒子暂停）
  initScrollHandler(particles);
  cleanupFns.push(cleanupScrollHandler);

  // 6. 回到顶部
  initBackToTop();

  // 7. 交互增强效果
  if (!prefersReducedMotion) {
    new InteractionEnhancements();
    cleanupFns.push(() => {
      // 清理交互增强效果的相关资源
    });
  }
}

document.addEventListener('astro:page-load', () => {
  // 清理所有旧的事件监听器和资源
  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;

  // 重置状态，重新初始化
  initialized = false;
  cursorGlow = null;
  backgroundArt = null;
  // 注意：不将 particles 设为 null，复用已有实例调用 rebuild()
  initQiLab();
});
