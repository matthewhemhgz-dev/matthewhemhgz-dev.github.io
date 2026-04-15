    // ============================================
    // 1. Minimal Particles System (v3.2: scroll-aware)
    // ============================================
    class MinimalParticles {
      constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 100 };
        this.isRunning = true;
        const isMobile = window.innerWidth < 768;
        this.options = {
          count: isMobile ? 30 : 50,
          colors: ['#2E7D5C', '#E5A93C', '#F7F3EE'],
          maxSize: 3,
          speed: 0.25,
          linkDistance: 100,
          linkOpacity: 0.08,
          ...options
        };
        this.resize();
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
          this.mouse.x = e.clientX;
          this.mouse.y = e.clientY;
        });
        // Pause when page hidden
        document.addEventListener('visibilitychange', () => {
          this.isRunning = !document.hidden;
          if (this.isRunning) this.animate();
        });
      }

      pause() { this.isRunning = false; }
      resume() { if (!this.isRunning) { this.isRunning = true; this.animate(); } }

      resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }

      init() {
        for (let i = 0; i < this.options.count; i++) {
          this.particles.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.options.speed,
            vy: (Math.random() - 0.5) * this.options.speed,
            size: Math.random() * this.options.maxSize + 1,
            color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)]
          });
        }
      }

      animate() {
        if (!this.isRunning) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {
          for (let j = i + 1; j < this.particles.length; j++) {
            const dx = this.particles[i].x - this.particles[j].x;
            const dy = this.particles[i].y - this.particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.options.linkDistance) {
              this.ctx.beginPath();
              this.ctx.strokeStyle = `rgba(46, 125, 92, ${this.options.linkOpacity * (1 - dist / this.options.linkDistance)})`;
              this.ctx.lineWidth = 0.5;
              this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
              this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
              this.ctx.stroke();
            }
          }
        }

        this.particles.forEach(p => {
          if (this.mouse.x && this.mouse.y) {
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.mouse.radius) {
              const force = (this.mouse.radius - dist) / this.mouse.radius;
              p.vx += dx * force * 0.01;
              p.vy += dy * force * 0.01;
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > this.options.speed * 2) {
            p.vx *= 0.95;
            p.vy *= 0.95;
          }

          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
      }
    }

    // ============================================
    // 2. Scroll Reveal
    // ============================================
    class ScrollReveal {
      constructor() {
        this.init();
      }

      init() {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('[data-reveal]').forEach(el => {
          observer.observe(el);
        });
      }
    }

    // ============================================
    // 3. Navigation
    // ============================================
    class Navigation {
      constructor() {
        this.nav = document.querySelector('.nav-fixed');
        this.links = document.querySelectorAll('.nav-links a');
        this.toggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.sections = document.querySelectorAll('section[id]');
      }

      update() {
        this.nav.classList.toggle('scrolled', window.scrollY > 50);
        const scrollPos = window.scrollY + 100;
        this.sections.forEach(section => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          const id = section.getAttribute('id');
          if (scrollPos >= top && scrollPos < top + height) {
            this.links.forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      }

      bindEvents() {
        this.links.forEach(link => {
          link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
              e.preventDefault();
              const target = document.querySelector(href);
              if (target) target.scrollIntoView();
              this.navLinks.classList.remove('active');
            }
          });
        });

        this.toggle?.addEventListener('click', () => {
          this.navLinks.classList.toggle('active');
        });
      }
    }

    // ============================================
    // 4. Scroll Progress
    // ============================================
    class ScrollProgress {
      constructor() {
        this.progressBar = document.querySelector('.scroll-progress');
      }

      update() {
        if (!this.progressBar) return;
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
        this.progressBar.style.transform = `scaleX(${scrollPercent})`;
      }
    }

    // ============================================
    // 5. Counter Animation (Dashboard Bars)
    // ============================================
    class CounterAnimation {
      constructor() {
        this.bars = document.querySelectorAll('.dash-bar-fill');
        if (!this.bars.length) return;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const bar = entry.target;
              const width = bar.getAttribute('data-width');
              bar.style.width = width + '%';
              observer.unobserve(bar);
            }
          });
        }, { threshold: 0.3 });
        this.bars.forEach(bar => observer.observe(bar));
      }
    }

    // ============================================
    // 6. Back to Top
    // ============================================
    class BackToTop {
      constructor() {
        this.btn = document.getElementById('backToTop');
      }

      update() {
        if (!this.btn) return;
        this.btn.classList.toggle('visible', window.scrollY > 600);
      }

      bindEvents() {
        if (!this.btn) return;
        this.btn.addEventListener('click', () => {
          window.scrollTo({ top: 0 });
        });
      }
    }

    // ============================================
    // Initialize (v3.2: unified scroll handler)
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
      const particles = new MinimalParticles('particles-canvas');
      new ScrollReveal();
      const nav = new Navigation();
      const progress = new ScrollProgress();
      new CounterAnimation();
      const backToTop = new BackToTop();

      nav.bindEvents();
      backToTop.bindEvents();

      // Unified scroll handler with rAF throttling
      let ticking = false;
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            nav.update();
            progress.update();
            backToTop.update();
            ticking = false;
          });
          ticking = true;
        }
        // Pause particles during scroll, resume after
        particles.pause();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => particles.resume(), 150);
      }, { passive: true });
    });
