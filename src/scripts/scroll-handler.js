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
  let lastScrollY = window.scrollY;
  let scrollTicking = false;
  let scrollTimeout;

  function handleScroll() {
    if (!nav) return;

    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;

    // Toggle .scrolled for subtle border/shadow (keep existing behavior)
    nav.classList.toggle('scrolled', currentScrollY > 50);

    // Back to top button visibility
    if (backToTopBtn) backToTopBtn.classList.toggle('visible', currentScrollY > 600);

    // Collapse/expand pill navigation (desktop only)
    if (window.innerWidth > 768) {
      if (currentScrollY > 100 && scrollDelta > 0) {
        // Scrolling down past 100px → collapse
        nav.classList.add('nav-collapsed');
      } else if (scrollDelta < -5 || currentScrollY <= 100) {
        // Scrolling up or near top → expand
        nav.classList.remove('nav-collapsed');
      }
    }

    lastScrollY = currentScrollY;
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(handleScroll);
      scrollTicking = true;
    }
    if (particles) {
      particles.pause();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => particles.resume(), 150);
    }
  }, { passive: true });

  handleScroll(); // Initial call
}

export function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
