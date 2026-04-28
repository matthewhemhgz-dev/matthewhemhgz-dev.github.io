import 'astro:transitions/client';
import {
  initScrollReveal,
  initScrollHandler,
  initBackToTop,
  cleanupScrollHandler,
} from './scroll-handler.js';

let initialized = false;
let cursorGlow = null;
let particles = null;
const cleanupFns = [];

function isHomePage() {
  const pathname = location.pathname;
  return pathname === '/' || pathname === '' || pathname === '/en/' || pathname === '/en';
}

function getParticleCount() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) return 30;
  if (screenWidth < 1440) return 50;
  if (screenWidth < 2560) return 60;
  return 80;
}

function getThemeColors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    emerald: cs.getPropertyValue('--qi-brand-emerald').trim() || '#2E7D5C',
    mint: cs.getPropertyValue('--qi-brand-mint').trim() || '#78B4A0',
    amber: cs.getPropertyValue('--qi-brand-amber').trim() || '#E5A93C',
    bgBase: cs.getPropertyValue('--qi-bg-base').trim() || '#F7F3EE',
  };
}

function getParticleOptions() {
  const colors = getThemeColors();
  return {
    count: getParticleCount(),
    colors: [colors.emerald, colors.mint, colors.amber, colors.bgBase],
    maxSize: 4,
    speed: 0.3,
    linkDistance: 120,
    linkOpacity: 0.1,
    mouseRadius: 150,
    mouseForce: 0.03,
    glowSize: 10,
    glowOpacity: 0.2,
  };
}

function initQiLab() {
  if (initialized) return;
  initialized = true;

  const homePage = isHomePage();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loadPriority1 = async () => {
    try {
      const { CardTilt } = await import('./card-tilt.js');
      const cardTilt = new CardTilt(
        '.bento-card, .testimonial-card, .platform-card, .dash-card, .toolbox-category',
      );
      cleanupFns.push(() => cardTilt.destroy());
    } catch (err) {
      console.error('[QiLab] Failed to initialize card tilt:', err);
    }
  };

  const loadPriority2 = async () => {
    if (!prefersReducedMotion) {
      try {
        const { initScrollParallax, cleanupScrollParallax } = await import('./scroll-parallax.js');
        initScrollParallax();
        cleanupFns.push(cleanupScrollParallax);
      } catch (err) {
        console.error('[QiLab] Failed to initialize scroll parallax:', err);
      }
    }
    
    initScrollReveal();
    initScrollHandler(particles);
    cleanupFns.push(cleanupScrollHandler);
    initBackToTop();
  };

  const loadPriority3 = async () => {
    if (!homePage || prefersReducedMotion) return;
    
    try {
      const { MinimalParticles } = await import('./particles.js');
      const particleOptions = getParticleOptions();
      const canvas = document.getElementById('particles-canvas');
      
      if (canvas) {
        particles = new MinimalParticles('particles-canvas', particleOptions);
        cleanupFns.push(() => particles.destroy());
      }
    } catch (err) {
      console.error('[QiLab] Failed to initialize particles:', err);
    }
  };

  const loadPriority4 = async () => {
    if (!homePage || prefersReducedMotion) return;
    
    try {
      const { CursorGlow } = await import('./cursor-glow.js');
      const cs = getComputedStyle(document.documentElement);
      cursorGlow = new CursorGlow({
        size: parseInt(cs.getPropertyValue('--qi-glow-size').trim()) || 300,
        speed: parseFloat(cs.getPropertyValue('--qi-glow-speed').trim()) || 0.05,
        blend: 'screen',
      });
      cleanupFns.push(() => cursorGlow.destroy());
    } catch (err) {
      console.error('[QiLab] Failed to initialize cursor glow:', err);
    }
  };

  loadPriority1();
  
  setTimeout(loadPriority2, 100);
  
  setTimeout(loadPriority3, 500);
  
  setTimeout(loadPriority4, 800);
}

function handleThemeChange() {
  if (!particles) return;
  
  const colors = getThemeColors();
  particles.options.colors = [colors.emerald, colors.mint, colors.amber, colors.bgBase];
  particles._parseColors();
  particles._prerenderGlowTextures();
  
  const event = new Event('themechange');
  document.dispatchEvent(event);
}

document.addEventListener('themechange', handleThemeChange);

document.addEventListener('astro:page-load', () => {
  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;

  initialized = false;
  cursorGlow = null;
  particles = null;
  initQiLab();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQiLab);
} else {
  initQiLab();
}

export { particles, isHomePage };
