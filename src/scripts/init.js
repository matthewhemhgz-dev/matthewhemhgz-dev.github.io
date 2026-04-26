import 'astro:transitions/client';
import {
  initScrollReveal,
  initScrollHandler,
  initBackToTop,
  cleanupScrollHandler,
} from './scroll-handler.js';
import { InteractionEnhancements } from './interaction-enhancements.js';
import { effectsManager } from './effects-manager.js';
import { EnvironmentAware } from './environment-aware.js';
import { MultiModalFeedback } from './multi-modal-feedback.js';
import { kinematics } from './kinematics-engine.js';

let initialized = false;
let particles = null;
let envAware = null;
let mmFeedback = null;
const cleanupFns = [];

function initQiLab() {
  if (initialized) return;
  initialized = true;

  const isHomePage = location.pathname === '/' || location.pathname === '';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 初始化动效管理器
  effectsManager.initialize();

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
        // 注册粒子系统到动效管理器
        effectsManager.registerEffect('particles', particles, {
          group: 'background',
          priority: 10,
          active: true,
        });
      }
      cleanupFns.push(() => particles.destroy());
    });
  }

  // 2. 鼠标追踪光效（仅首页启用）
  if (isHomePage && !prefersReducedMotion) {
    import('./cursor-glow.js').then(({ CursorGlow }) => {
      const cs = getComputedStyle(document.documentElement);
      const cursorGlow = new CursorGlow({
        size: parseInt(cs.getPropertyValue('--qi-glow-size').trim()) || 350,
        speed: parseFloat(cs.getPropertyValue('--qi-glow-speed').trim()) || 0.06,
        blend: 'screen',
      });
      // 注册鼠标光效到动效管理器
      effectsManager.registerEffect('cursor-glow', cursorGlow, {
        group: 'cursor',
        priority: 20,
        active: true,
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

      const backgroundArt = new BackgroundArt('background-art-canvas', {
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
      // 背景艺术系统内部已经使用了动效管理器
      cleanupFns.push(() => backgroundArt.destroy());
    });
  }

  // 2.5 卡片 3D 倾斜 + 光泽效果
  import('./card-tilt.js').then(({ CardTilt }) => {
    const cardTilt = new CardTilt(
      '.bento-card, .testimonial-card, .platform-card, .dash-card, .toolbox-category',
    );
    // 注册卡片倾斜效果到动效管理器
    effectsManager.registerEffect('card-tilt', cardTilt, {
      group: 'interaction',
      priority: 15,
      active: true,
    });
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
    const interactionEnhancements = new InteractionEnhancements();
    // 注册交互增强效果到动效管理器
    effectsManager.registerEffect('interaction-enhancements', interactionEnhancements, {
      group: 'interaction',
      priority: 5,
      active: true,
    });
    cleanupFns.push(() => {
      // 清理交互增强效果的相关资源
    });
  }

  // 8. 物理环境与多模态感知系统 (V2 Iteration)
  if (!envAware) {
    envAware = new EnvironmentAware();
    envAware.startUpdates();

    // 热力学闭环: 将能量场持续注入运动学引擎
    kinematics.setGlobalEnergy(envAware.globalEnergy);
    envAware.onUpdate(() => {
      kinematics.setGlobalEnergy(envAware.globalEnergy);
    });

    cleanupFns.push(() => {
      envAware.stopUpdates();
      envAware = null;
    });
  }

  if (!mmFeedback && !prefersReducedMotion) {
    mmFeedback = new MultiModalFeedback();

    // 初始化时开启音频和震动反馈 (需用户交互后生效)
    mmFeedback.setEnabled(['audio', 'haptic'], true);
    document.addEventListener(
      'click',
      () => {
        // Browsers require a gesture to start AudioContext
        if (mmFeedback.audioContext && mmFeedback.audioContext.state === 'suspended') {
          mmFeedback.audioContext.resume();
        }
      },
      { once: true },
    );

    // 绑定所有的可交互元素，进行物理与声学映射
    const targetSelector = 'a, button, .bento-card, .float-card, .testimonial-card, .platform-card, .toolbox-category, h1, h2, h3, .article-tag, .search-result-item';

    const interactiveElements = document.querySelectorAll(targetSelector);
    mmFeedback.addFeedbackToElements(Array.from(interactiveElements));

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const elements = node.querySelectorAll(targetSelector);
              if (node.matches && node.matches(targetSelector)) mmFeedback.addFeedbackToElement(node);
              elements.forEach(el => mmFeedback.addFeedbackToElement(el));
            }
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    cleanupFns.push(() => {
      observer.disconnect();
      mmFeedback.destroy();
      mmFeedback = null;
    });
  }
}

document.addEventListener('astro:page-load', () => {
  // 清理所有旧的事件监听器和资源
  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;

  // 销毁所有动效
  effectsManager.destroy();

  // 重置状态，重新初始化
  initialized = false;
  particles = null;
  initQiLab();
});
