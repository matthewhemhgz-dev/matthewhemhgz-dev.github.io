let revealObserver = null;

export function initScrollReveal() {
  if (revealObserver) { revealObserver.disconnect(); }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver?.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('[data-reveal], .data-bar-fill, .stagger-container').forEach(el => {
    revealObserver.observe(el);
  });
}

export function initScrollHandler(particles) {
  const nav = document.querySelector('.nav-wrapper');
  const backToTopBtn = document.getElementById('back-to-top');
  let ticking = false;
  let scrollTimeout;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
        if (backToTopBtn) backToTopBtn.classList.toggle('visible', window.scrollY > 600);
        ticking = false;
      });
      ticking = true;
    }
    if (particles) {
      particles.pause();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => particles.resume(), 150);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
