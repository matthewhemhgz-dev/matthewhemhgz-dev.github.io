/**
 * ScrollParallax — 滚动视差光影效果
 * - 卡片在滚动时产生微妙的光影位移
 * - 装饰元素视差滚动
 * - 触屏设备支持卡片光效
 */
export function initScrollParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // 为所有卡片添加滚动光影效果
  const cards = document.querySelectorAll(
    '.category-card, .bento-card, .toolbox-category, .platform-card, .testimonial-card, .dash-card'
  );

  // 为装饰元素添加视差
  const orbs = document.querySelectorAll('.hero-gradient-orb');

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // 卡片光影效果：根据滚动位置计算光照角度
        cards.forEach((card) => {
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

        // 装饰元素视差
        orbs.forEach((orb, i) => {
          const speed = 0.03 + i * 0.02;
          const y = scrollY * speed;
          orb.style.transform = `translateY(${y}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // 初始调用
  onScroll();

  // 触屏设备卡片光效支持
  if ('ontouchstart' in window) {
    let activeCard = null;

    cards.forEach((card) => {
      card.addEventListener('touchstart', (e) => {
        activeCard = card;
        updateCardLight(card, e.touches[0]);
      }, { passive: true });

      card.addEventListener('touchmove', (e) => {
        if (activeCard === card) {
          updateCardLight(card, e.touches[0]);
        }
      }, { passive: true });

      card.addEventListener('touchend', () => {
        if (activeCard === card) {
          card.style.setProperty('--light-intensity', '0');
          activeCard = null;
        }
      }, { passive: true });
    });

    function updateCardLight(card, touch) {
      const rect = card.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--light-x', `${x}%`);
      card.style.setProperty('--light-y', `${y}%`);
      card.style.setProperty('--light-intensity', '0.06');
    }
  }
}
