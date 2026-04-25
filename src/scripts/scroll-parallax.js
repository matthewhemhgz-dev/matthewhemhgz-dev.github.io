/**
 * ScrollParallax — 滚动视差光影效果
 * - 卡片在滚动时产生微妙的光影位移
 * - 装饰元素视差滚动
 * - 触屏设备支持卡片光效
 */

// 存储事件处理函数引用，以便后续清理
let _onScroll = null;
let _cardTouchHandlers = []; // { card, touchstart, touchmove, touchend }

export function initScrollParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // 为所有卡片添加滚动光影效果
  const cards = document.querySelectorAll(
    '.bento-card, .toolbox-category, .platform-card, .testimonial-card, .dash-card',
  );

  // 为装饰元素添加视差
  const orbs = document.querySelectorAll('.hero-gradient-orb');

  let ticking = false;
  const visibleCards = new Set();
  const visibleOrbs = new Set();

  // 使用 Intersection Observer 检测可见元素
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('hero-gradient-orb')) {
            visibleOrbs.add(entry.target);
          } else {
            visibleCards.add(entry.target);
          }
        } else {
          if (entry.target.classList.contains('hero-gradient-orb')) {
            visibleOrbs.delete(entry.target);
          } else {
            visibleCards.delete(entry.target);
          }
        }
      });
    },
    { threshold: 0.1, rootMargin: '50px' },
  );

  // 存储 observer 到 window 对象，以便后续清理
  window.scrollParallaxObserver = observer;

  // 观察所有卡片和装饰元素
  [...cards, ...orbs].forEach((el) => observer.observe(el));

  _onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // 只对可见卡片应用光影效果
        visibleCards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          const viewCenter = windowHeight / 2;
          const offset = (centerY - viewCenter) / windowHeight; // -1 ~ 1

          // 光照偏移：模拟光源从上方照射
          const lightX = 50 + offset * 10; // 40% ~ 60%
          const lightY = offset < 0 ? 0 : 100; // 上方或下方
          const intensity = Math.abs(offset) * 0.03;

          card.style.setProperty('--light-x', `${lightX}%`);
          card.style.setProperty('--light-y', `${lightY}%`);
          card.style.setProperty('--light-intensity', `${intensity}`);
        });

        // 只对可见装饰元素应用视差
        visibleOrbs.forEach((orb, i) => {
          const speed = 0.03 + i * 0.02;
          const y = scrollY * speed;
          orb.style.transform = `translateY(${y}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', _onScroll, { passive: true });

  // 初始调用
  _onScroll();

  // 触屏设备卡片光效支持
  if ('ontouchstart' in window) {
    let activeCard = null;

    function updateCardLight(card, touch) {
      const rect = card.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--light-x', `${x}%`);
      card.style.setProperty('--light-y', `${y}%`);
      card.style.setProperty('--light-intensity', '0.06');
    }

    cards.forEach((card) => {
      const onTouchStart = (e) => {
        activeCard = card;
        updateCardLight(card, e.touches[0]);
      };
      const onTouchMove = (e) => {
        if (activeCard === card) {
          updateCardLight(card, e.touches[0]);
        }
      };
      const onTouchEnd = () => {
        if (activeCard === card) {
          card.style.setProperty('--light-intensity', '0');
          activeCard = null;
        }
      };

      card.addEventListener('touchstart', onTouchStart, { passive: true });
      card.addEventListener('touchmove', onTouchMove, { passive: true });
      card.addEventListener('touchend', onTouchEnd, { passive: true });

      _cardTouchHandlers.push({ card, onTouchStart, onTouchMove, onTouchEnd });
    });
  }
}

export function cleanupScrollParallax() {
  // 移除 scroll 监听器
  if (_onScroll) {
    window.removeEventListener('scroll', _onScroll);
    _onScroll = null;
  }

  // 移除所有卡片的 touch 监听器
  for (const { card, onTouchStart, onTouchMove, onTouchEnd } of _cardTouchHandlers) {
    card.removeEventListener('touchstart', onTouchStart);
    card.removeEventListener('touchmove', onTouchMove);
    card.removeEventListener('touchend', onTouchEnd);
  }
  _cardTouchHandlers = [];

  // 清理 Intersection Observer
  if (window.scrollParallaxObserver) {
    window.scrollParallaxObserver.disconnect();
    window.scrollParallaxObserver = null;
  }
}
