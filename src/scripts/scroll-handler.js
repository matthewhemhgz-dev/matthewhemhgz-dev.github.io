let revealObserver = null;

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

export function initScrollReveal() {
  if (revealObserver) {
    revealObserver.disconnect();
  }
  
  // 优化 Intersection Observer 配置
  revealObserver = new IntersectionObserver(
    (entries) => {
      // 批量处理 entries
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          const siblings = parent ? parent.querySelectorAll('[data-reveal]') : [];
          const siblingIndex = Array.from(siblings).indexOf(entry.target);
          const delay = siblingIndex * 60; // 减少延迟时间
          entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
          entry.target.classList.add('is-visible');
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    { 
      threshold: 0.1, // 降低阈值，更早触发
      rootMargin: '0px 0px -50px 0px' // 调整根边距
    },
  );
  
  // 只观察可见元素
  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });
}

// 存储事件处理函数引用，以便后续清理
let _scrollHandler = null;
let _backToTopHandler = null;
let _scrollTimeout = null;

export function initScrollHandler(particles) {
  const nav = document.querySelector('.nav-wrapper');
  const backToTopBtn = document.getElementById('back-to-top');
  let lastScrollY = window.scrollY;
  let scrollTicking = false;
  let localScrollTimeout;

  function handleScroll() {
    if (!nav) return;

    const currentScrollY = window.scrollY;
    
    // 避免不必要的计算
    if (Math.abs(currentScrollY - lastScrollY) < 5) {
      scrollTicking = false;
      return;
    }

    // Toggle .scrolled for subtle border/shadow (keep existing behavior)
    if (currentScrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      const isVisible = currentScrollY > 600;
      if (isVisible) {
        backToTopBtn.classList.add('visible');
        backToTopBtn.setAttribute('aria-hidden', 'false');
      } else {
        backToTopBtn.classList.remove('visible');
        backToTopBtn.setAttribute('aria-hidden', 'true');
      }
    }

    lastScrollY = currentScrollY;
    scrollTicking = false;
  }

  // 使用节流函数优化滚动事件
  _scrollHandler = throttle(() => {
    if (!scrollTicking) {
      requestAnimationFrame(handleScroll);
      scrollTicking = true;
    }
    if (particles) {
      particles.pause();
      clearTimeout(localScrollTimeout);
      _scrollTimeout = localScrollTimeout = setTimeout(() => particles.resume(), 200); // 增加延迟时间
    }
  }, 16); // 约 60fps
  
  window.addEventListener('scroll', _scrollHandler, { passive: true });

  handleScroll(); // Initial call
}

export function cleanupScrollHandler() {
  if (_scrollTimeout) {
    clearTimeout(_scrollTimeout);
    _scrollTimeout = null;
  }
  if (_scrollHandler) {
    window.removeEventListener('scroll', _scrollHandler);
    _scrollHandler = null;
  }
  if (_backToTopHandler) {
    const btn = document.getElementById('back-to-top');
    if (btn) btn.removeEventListener('click', _backToTopHandler);
    _backToTopHandler = null;
  }
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }
}

export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) {
    _backToTopHandler = () => {
      // 使用更平滑的滚动效果
      const scrollToTop = () => {
        const currentPosition = window.scrollY;
        if (currentPosition > 0) {
          window.scrollTo(0, currentPosition - currentPosition * 0.1);
          requestAnimationFrame(scrollToTop);
        }
      };
      scrollToTop();
    };
    btn.addEventListener('click', _backToTopHandler);
  }
}
