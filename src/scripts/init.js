import 'astro:transitions/client';
import { MinimalParticles } from './particles.js';
import { CursorGlow } from './cursor-glow.js';
import { initScrollReveal, initScrollHandler, initBackToTop, cleanupScrollHandler } from './scroll-handler.js';
import { initScrollParallax, cleanupScrollParallax } from './scroll-parallax.js';

let initialized = false;
let cursorGlow = null;
let particles = null;
const cleanupFns = [];

function initQiLab() {
  if (initialized) return;
  initialized = true;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. 粒子系统（增强版：鼠标交互 + 光晕 + 连线高亮）
  particles = prefersReducedMotion ? null : new MinimalParticles('particles-canvas', {
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
  if (particles) cleanupFns.push(() => particles.destroy());

  // 2. 鼠标追踪光效
  if (!prefersReducedMotion) {
    cursorGlow = new CursorGlow({
      size: 400,
      color: 'rgba(46, 125, 92, 0.06)',
      colorAmber: 'rgba(229, 169, 60, 0.04)',
      blend: 'screen',
      speed: 0.12,
    });
    cleanupFns.push(() => cursorGlow.destroy());
  }

  // 3. 滚动视差光影
  if (!prefersReducedMotion) {
    initScrollParallax();
    cleanupFns.push(cleanupScrollParallax);
  }

  // 4. 滚动显示动画
  initScrollReveal();

  // 5. 滚动处理（导航、粒子暂停）
  initScrollHandler(particles);
  cleanupFns.push(cleanupScrollHandler);

  // 6. 回到顶部
  initBackToTop();
}

document.addEventListener('astro:page-load', () => {
  // 清理所有旧的事件监听器和资源
  cleanupFns.forEach(fn => fn());
  cleanupFns.length = 0;

  // 重置状态，重新初始化
  initialized = false;
  cursorGlow = null;
  particles = null;
  initQiLab();
});
