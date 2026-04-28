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
  if (screenWidth < 768) return 25;
  if (screenWidth < 1440) return 40;
  if (screenWidth < 2560) return 50;
  return 60;
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
    maxSize: 3,
    speed: 0.2,
    linkDistance: 100,
    linkOpacity: 0.08,
    mouseRadius: 120,
    mouseForce: 0.02,
    glowSize: 8,
    glowOpacity: 0.15,
  };
}

function isSlowConnection() {
  if (!navigator.connection) return false;
  const effectiveType = navigator.connection.effectiveType;
  return effectiveType === 'slow-2g' || effectiveType === '2g';
}

function getLoadDelay() {
  if (isSlowConnection()) {
    return { priority1: 0, priority2: 500, priority3: 2000, priority4: 3000 };
  }
  return { priority1: 0, priority2: 150, priority3: 600, priority4: 1000 };
}

function cleanup() {
  cleanupFns.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.warn('[QiLab] Cleanup error:', err);
    }
  });
  cleanupFns.length = 0;

  if (cursorGlow) {
    try {
      cursorGlow.destroy();
    } catch (err) {
      console.warn('[QiLab] CursorGlow cleanup error:', err);
    }
    cursorGlow = null;
  }

  if (particles) {
    try {
      particles.destroy();
    } catch (err) {
      console.warn('[QiLab] Particles cleanup error:', err);
    }
    particles = null;
  }

  initialized = false;
}

function initQiLab() {
  if (initialized) return;
  initialized = true;

  const homePage = isHomePage();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const delays = getLoadDelay();

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
    if (!homePage || prefersReducedMotion || isSlowConnection()) return;
    
    try {
      const { MinimalParticles } = await import('./particles.js');
      const particleOptions = getParticleOptions();
      const canvas = document.getElementById('particles-canvas');
      
      if (canvas) {
        particles = new MinimalParticles('particles-canvas', particleOptions);
        cleanupFns.push(() => {
          if (particles) {
            particles.destroy();
            particles = null;
          }
        });
      }
    } catch (err) {
      console.error('[QiLab] Failed to initialize particles:', err);
    }
  };

  const loadPriority4 = async () => {
    if (!homePage || prefersReducedMotion || isMobile || isSlowConnection()) return;
    
    try {
      const { CursorGlow } = await import('./cursor-glow.js');
      const cs = getComputedStyle(document.documentElement);
      cursorGlow = new CursorGlow({
        size: parseInt(cs.getPropertyValue('--qi-glow-size').trim()) || 300,
        speed: parseFloat(cs.getPropertyValue('--qi-glow-speed').trim()) || 0.05,
        blend: 'screen',
      });
      cleanupFns.push(() => {
        if (cursorGlow) {
          cursorGlow.destroy();
          cursorGlow = null;
        }
      });
    } catch (err) {
      console.error('[QiLab] Failed to initialize cursor glow:', err);
    }
  };

  loadPriority1();
  
  setTimeout(loadPriority2, delays.priority2);
  
  setTimeout(loadPriority3, delays.priority3);
  
  setTimeout(loadPriority4, delays.priority4);
}

function handleThemeChange() {
  if (!particles) return;
  
  try {
    const colors = getThemeColors();
    particles.options.colors = [colors.emerald, colors.mint, colors.amber, colors.bgBase];
    particles._parseColors();
    particles._prerenderGlowTextures();
  } catch (err) {
    console.warn('[QiLab] Theme change error:', err);
  }
  
  const event = new Event('themechange');
  document.dispatchEvent(event);
}

document.addEventListener('themechange', handleThemeChange);

document.addEventListener('astro:page-load', () => {
  cleanup();
  initQiLab();
});

document.addEventListener('astro:before-preparation', () => {
  cleanup();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQiLab);
} else {
  initQiLab();
}

export { particles, isHomePage };
