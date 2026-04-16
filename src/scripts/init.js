import 'astro:transitions/client';
import { MinimalParticles } from './particles.js';
import { CursorGlow } from './cursor-glow.js';
import { initScrollReveal, initScrollHandler, initBackToTop } from './scroll-handler.js';
import { initScrollParallax } from './scroll-parallax.js';

let initialized = false;
let cursorGlow = null;

function initQiLab() {
  if (initialized) return;
  initialized = true;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. 粒子系统（增强版：鼠标交互 + 光晕 + 连线高亮）
  const particles = prefersReducedMotion ? null : new MinimalParticles('particles-canvas', {
    count: window.innerWidth < 768 ? 30 : 60,
    colors: ['#2E7D5C', '#E5A93C', '#F7F3EE'],
    maxSize: 3,
    speed: 0.25,
    linkDistance: 120,
    linkOpacity: 0.08,
    mouseRadius: 150,
    mouseForce: 0.02,
    glowSize: 8,
    glowOpacity: 0.15,
  });

  // 2. 鼠标追踪光效
  if (!prefersReducedMotion) {
    cursorGlow = new CursorGlow({
      size: 400,
      color: 'rgba(46, 125, 92, 0.06)',
      colorAmber: 'rgba(229, 169, 60, 0.04)',
      blend: 'screen',
      speed: 0.12,
    });
  }

  // 3. 滚动视差光影
  if (!prefersReducedMotion) {
    initScrollParallax();
  }

  // 4. 滚动显示动画
  initScrollReveal();

  // 5. 滚动处理（导航、粒子暂停）
  initScrollHandler(particles);

  // 6. 回到顶部
  initBackToTop();
}

document.addEventListener('astro:page-load', () => {
  if (cursorGlow) cursorGlow.destroy();
  initialized = false;
  initQiLab();
});

initQiLab();
