import 'astro:transitions/client';
import {
  initScrollReveal,
  initScrollHandler,
  initBackToTop,
  cleanupScrollHandler,
} from './scroll-handler.js';
import { effectsManager } from './effects-manager.js';

let initialized = false;
let particles = null;
let envAware = null;
let mmFeedback = null;
let interactionEnhancements = null;
const cleanupFns = [];

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function() {
    const args = arguments;
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  }
}

// 性能监测函数
function monitorPerformance() {
  if (performance && performance.measureUserAgentSpecificMemory) {
    performance.measureUserAgentSpecificMemory()
      .then(result => {
        console.log('Memory usage:', result);
      })
      .catch(err => {
        console.error('Memory measurement error:', err);
      });
  }
}

// 定期监测性能
setInterval(monitorPerformance, 30000); // 每30秒监测一次

function initQiLab() {
  if (initialized) return;
  initialized = true;

  const isHomePage = location.pathname === '/' || location.pathname === '';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // 初始化动效管理器
  effectsManager.initialize();

  // 1. 粒子系统（仅首页启用，非移动设备）
  if (isHomePage && !prefersReducedMotion && !isMobile) {
    import('./particles.js').then(({ MinimalParticles }) => {
      const screenWidth = window.innerWidth;
      const cs = getComputedStyle(document.documentElement);
      const particleCount = 
        screenWidth < 1440 ? 60 : screenWidth < 2560 ? 80 : 100;
      const particleOptions = {
        count: particleCount,
        colors: [
          cs.getPropertyValue('--qi-brand-emerald').trim() || '#2E7D5C',
          cs.getPropertyValue('--qi-brand-mint').trim() || '#78B4A0',
          cs.getPropertyValue('--qi-brand-amber').trim() || '#E5A93C',
          cs.getPropertyValue('--qi-bg-base').trim() || '#F7F3EE',
        ],
        maxSize: 4,
        speed: 0.3,
        linkDistance: 140,
        linkOpacity: 0.1,
        mouseRadius: 150,
        mouseForce: 0.03,
        glowSize: 10,
        glowOpacity: 0.2,
      };

      if (particles && particles.canvas) {
          particles.rebuild(particleOptions);
        } else {
          particles = new MinimalParticles('particles-canvas', particleOptions);
          // 检查粒子系统是否成功创建
          if (particles && particles.canvas && particles.ctx) {
            // 注册粒子系统到动效管理器
            effectsManager.registerEffect('particles', particles, {
              group: 'background',
              priority: 10,
              active: true,
            });
            // 手动启动粒子系统
            if (typeof particles.resume === 'function') {
              particles.resume();
            }
          } else {
            console.warn('Particles system failed to initialize');
          }
        }
      cleanupFns.push(() => {
        if (particles && typeof particles.destroy === 'function') {
          particles.destroy();
        }
      });
    });
  }

  // 2. 鼠标追踪光效（仅首页启用，非移动设备）
  if (isHomePage && !prefersReducedMotion && !isMobile) {
    import('./cursor-glow.js').then(({ CursorGlow }) => {
      const cs = getComputedStyle(document.documentElement);
      const cursorGlow = new CursorGlow({
        size: parseInt(cs.getPropertyValue('--qi-glow-size').trim()) || 300,
        speed: parseFloat(cs.getPropertyValue('--qi-glow-speed').trim()) || 0.05,
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

  // 3. 背景艺术系统（非首页启用，非移动设备）
  if (!isHomePage && !prefersReducedMotion && !isMobile) {
    import('./background-art.js').then(({ BackgroundArt }) => {
      const cs = getComputedStyle(document.documentElement);
      const screenWidth = window.innerWidth;
      const artType = screenWidth < 1440 ? 'generative' : 'fluid';

      const backgroundArt = new BackgroundArt('background-art-canvas', {
        type: artType,
        particleCount: screenWidth < 1440 ? 40 : 80,
        speed: 0.2,
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

  // 4. 卡片 3D 倾斜 + 光泽效果（非移动设备）
  if (!isMobile) {
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
  }

  // 5. 滚动视差光影（非移动设备）
  if (!prefersReducedMotion && !isMobile) {
    import('./scroll-parallax.js').then(({ initScrollParallax, cleanupScrollParallax }) => {
      initScrollParallax();
      cleanupFns.push(cleanupScrollParallax);
    });
  }

  // 6. 滚动显示动画
  initScrollReveal();

  // 7. 滚动处理（导航、粒子暂停）
  initScrollHandler(particles);
  cleanupFns.push(cleanupScrollHandler);

  // 8. 回到顶部
  initBackToTop();

  // 9. 交互增强效果（非移动设备）
  if (!prefersReducedMotion && !isMobile) {
    import('./interaction-enhancements.js').then(({ InteractionEnhancements }) => {
      interactionEnhancements = new InteractionEnhancements();
      // 注册交互增强效果到动效管理器
      effectsManager.registerEffect('interaction-enhancements', interactionEnhancements, {
        group: 'interaction',
        priority: 5,
        active: true,
      });
      cleanupFns.push(() => {
        // 清理交互增强效果的相关资源
      });
    });
  }

  // 10. 物理环境与多模态感知系统 (仅非移动设备)
  if (!isMobile) {
    import('./environment-aware.js').then(({ EnvironmentAware }) => {
      if (!envAware) {
        envAware = new EnvironmentAware();
        envAware.startUpdates();

        // 热力学闭环: 将能量场持续注入运动学引擎
        import('./kinematics-engine.js').then(({ kinematics }) => {
          kinematics.setGlobalEnergy(envAware.globalEnergy);
          envAware.onUpdate(() => {
            kinematics.setGlobalEnergy(envAware.globalEnergy);
          });
        });

        cleanupFns.push(() => {
          envAware.stopUpdates();
          envAware = null;
        });
      }
    });

    import('./multi-modal-feedback.js').then(({ MultiModalFeedback }) => {
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
    });
  }
}

// 使用防抖处理页面加载事件
const debouncedInit = debounce(initQiLab, 100);

document.addEventListener('astro:page-load', () => {
  // 清理所有旧的事件监听器和资源
  cleanupFns.forEach((fn) => fn());
  cleanupFns.length = 0;

  // 销毁所有动效
  effectsManager.destroy();

  // 重置状态，重新初始化
  initialized = false;
  particles = null;
  envAware = null;
  mmFeedback = null;
  interactionEnhancements = null;
  
  // 执行初始化
  debouncedInit();
});
