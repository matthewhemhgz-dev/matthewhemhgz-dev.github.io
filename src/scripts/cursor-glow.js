/**
 * CursorGlow — 鼠标追踪光效
 * 在鼠标位置生成柔和的径向渐变光晕，跟随鼠标移动
 * 支持移动端自动禁用、reduced-motion 媒体查询
 */
export class CursorGlow {
  constructor(options = {}) {
    this.el = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.isVisible = false;
    this.rafId = null;
    this.isTouchDevice = false;
    this.lastTime = performance.now();

    const defaults = {
      size: 400,
      color: 'rgba(46, 125, 92, 0.06)',
      colorAmber: 'rgba(229, 169, 60, 0.04)',
      blend: 'screen',
      speed: 0.12,
    };
    this.options = { ...defaults, ...options };

    this._create();
    this._bindEvents();
  }

  _create() {
    // 创建两层光晕：主光 + 琥珀辅光
    this.el = document.createElement('div');
    this.el.className = 'cursor-glow';
    this.el.setAttribute('aria-hidden', 'true');
    this.el.innerHTML = `
      <div class="cursor-glow__main"></div>
      <div class="cursor-glow__amber"></div>
    `;

    // 注入样式
    const style = document.createElement('style');
    style.id = 'cursor-glow-style';
    style.textContent = `
      .cursor-glow {
        position: fixed;
        top: 0;
        left: 0;
        width: ${this.options.size}px;
        height: ${this.options.size}px;
        pointer-events: none;
        z-index: var(--qi-z-overlay);
        mix-blend-mode: ${this.options.blend};
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.4s ease;
        will-change: transform;
      }
      .cursor-glow.is-visible {
        opacity: 1;
      }
      .cursor-glow__main {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          ${this.options.color} 0%,
          rgba(46, 125, 92, 0.02) 40%,
          transparent 70%
        );
      }
      .cursor-glow__amber {
        position: absolute;
        top: 25%;
        left: 25%;
        width: 50%;
        height: 50%;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          ${this.options.colorAmber} 0%,
          transparent 60%
        );
        transform: translate(20%, 20%);
      }
      @media (max-width: 768px) {
        .cursor-glow { display: none; }
      }
      @media (prefers-reduced-motion: reduce) {
        .cursor-glow { display: none; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(this.el);
  }

  _bindEvents() {
    // 检测触屏设备
    window.addEventListener('touchstart', () => {
      this.isTouchDevice = true;
      if (this.el) this.el.style.display = 'none';
    }, { once: true, passive: true });

    document.addEventListener('mousemove', (e) => {
      if (this.isTouchDevice) return;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      if (!this.isVisible) {
        this.isVisible = true;
        this.currentX = this.mouseX;
        this.currentY = this.mouseY;
        this.el.classList.add('is-visible');
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
      if (this.el) this.el.classList.remove('is-visible');
    });

    this._animate();
  }

  _animate() {
    if (document.hidden) {
      this.rafId = requestAnimationFrame(() => this._animate());
      return;
    }
    if (!this.isTouchDevice && this.el) {
      const now = performance.now();
      const deltaTime = Math.min((now - this.lastTime) / 16.67, 3); // 归一化到 60fps，上限 3 帧补偿
      this.lastTime = now;
      const factor = 1 - Math.pow(1 - this.options.speed, deltaTime);
      this.currentX += (this.mouseX - this.currentX) * factor;
      this.currentY += (this.mouseY - this.currentY) * factor;
      this.el.style.transform = `translate(${this.currentX - this.options.size / 2}px, ${this.currentY - this.options.size / 2}px)`;
    }
    this.rafId = requestAnimationFrame(() => this._animate());
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    const styleId = 'cursor-glow-style';
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();
    if (this.el) this.el.remove();
  }
}
