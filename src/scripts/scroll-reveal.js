/**
 * Scroll Reveal Animation
 * 滚动显示动画，使内容在滚动时优雅地显示
 */

class ScrollReveal {
  constructor() {
    this.elements = [];
    this.init();
  }

  init() {
    this.observeElements();
  }

  observeElements() {
    // 选择所有带有 qi-anim-scroll-reveal 类的元素
    const elements = document.querySelectorAll('.qi-anim-scroll-reveal');
    
    if (!elements.length) return;

    // 创建 Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 当元素进入视口时，添加 visible 类
            entry.target.classList.add('visible');
            // 停止观察该元素
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // 当元素的 10% 进入视口时触发
        threshold: 0.1,
        // 添加一些根边距，使元素在进入视口前就开始动画
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // 观察所有元素
    elements.forEach((element) => {
      observer.observe(element);
    });
  }
}

// 当 DOM 加载完成后初始化
if (typeof window !== 'undefined') {
  document.addEventListener('astro:page-load', () => {
    new ScrollReveal();
  });
}

export default ScrollReveal;
