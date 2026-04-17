/**
 * CursorGlow — 鼠标追踪光效 (v2 美学升级版)
 * 三层渐变光晕：外层环境光 → 中层品牌光 → 内层聚焦点
 * 页面加载即半透明可见，首次鼠标移动增强到满亮度
 * 支持呼吸动画、移动端自动禁用、reduced-motion 媒体查询
 */
export class CursorGlow {
  constructor(options = {}) {
    this.el = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.isVisible = false;
    this.hasInteracted = false;
    this.rafId = null;
    this.isTouchDevice = false;
    this.lastTime = performance.now();
    this.breathePhase = 0;

    const defaults = {
      size: 350,
      blend: 'screen',
      speed: 0.06,
    };
    this.options = { ...defaults, ...options };

    this._create();
    this._bindEvents();
  }

  _create() {
    this.el = document.createElement('div');
    this.el.className = 'cursor-glow';
    this.el.setAttribute('aria-hidden', 'true');
    this.el.innerHTML = `
      <div class="cursor-glow__outer"></div>
      <div class="cursor-glow__main"></div>
      <div class="cursor-glow__accent"></div>
    `;

    // 初始定位在页面中心，半透明可见
    this.currentX = window.innerWidth / 2;
    this.currentY = window.innerHeight / 2;
    this.mouseX = this.currentX;
    this.mouseY = this.currentY;

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
        opacity: 0.4;
        will-change: transform, opacity;
        transition: opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
      }
      .cursor-glow.is-active {
        opacity: 1;
      }
      .cursor-glow.is-leaving {
        opacity: 0;
        transition: opacity 0.6s ease;
      }

      /* 外层：大范围柔和环境光 — 薄荷蓝 */
      .cursor-glow__outer {
        position: absolute;
        inset: -35%;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(120, 180, 160, 0.05) 0%,
          rgba(120, 180, 160, 0.02) 40%,
          transparent 70%
        );
        filter: blur(30px);
        animation: glow-breathe-outer 6s ease-in-out infinite;
      }

      /* 中层：翡翠绿主光 — 柔和扩散 */
      .cursor-glow__main {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(46, 125, 92, 0.14) 0%,
          rgba(46, 125, 92, 0.04) 35%,
          transparent 65%
        );
        filter: blur(2px);
        animation: glow-breathe-main 4s ease-in-out infinite;
      }

      /* 内层：琥珀金聚焦点 — 小而精致 */
      .cursor-glow__accent {
        position: absolute;
        top: 28%;
        left: 28%;
        width: 44%;
        height: 44%;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(229, 169, 60, 0.10) 0%,
          rgba(229, 169, 60, 0.03) 45%,
          transparent 60%
        );
        transform: translate(12%, 12%);
        filter: blur(1px);
        animation: glow-breathe-accent 5s ease-in-out infinite;
      }

      @keyframes glow-breathe-outer {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
      }
      @keyframes glow-breathe-main {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.85; transform: scale(1.03); }
      }
      @keyframes glow-breathe-accent {
        0%, 100% { opacity: 1; transform: translate(12%, 12%) scale(1); }
        50% { opacity: 0.75; transform: translate(14%, 14%) scale(1.08); }
      }

      @media (max-width: 768px) {
        .cursor-glow { display: none; }
      }
      @media (prefers-reduced-motion: reduce) {
        .cursor-glow { display: none; }
        .cursor-glow__outer,
        .cursor-glow__main,
        .cursor-glow__accent { animation: none; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(this.el);
  }

  _bindEvents() {
    this._onTouchStart = () => {
      this.isTouchDevice = true;
      if (this.el) this.el.style.display = 'none';
    };
    window.addEventListener('touchstart', this._onTouchStart, { once: true, passive: true });

    this._onMouseMove = (e) => {
      if (this.isTouchDevice) return;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.hasInteracted) {
        this.hasInteracted = true;
        this.currentX = this.mouseX;
        this.currentY = this.mouseY;
        this.el.classList.add('is-active');
      }
    };
    document.addEventListener('mousemove', this._onMouseMove, { passive: true });

    this._onMouseLeave = () => {
      if (this.el) this.el.classList.add('is-leaving');
    };
    document.addEventListener('mouseleave', this._onMouseLeave);

    this._onMouseEnter = () => {
      if (this.el && this.hasInteracted) {
        this.el.classList.remove('is-leaving');
      }
    };
    document.addEventListener('mouseenter', this._onMouseEnter);

    this._animate();
  }

  _animate() {
    if (document.hidden) {
      this.rafId = requestAnimationFrame(() => this._animate());
      return;
    }
    if (!this.isTouchDevice && this.el) {
      const now = performance.now();
      const deltaTime = Math.min((now - this.lastTime) / 16.67, 3);
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
    // 移除事件监听器
    if (this._onTouchStart) window.removeEventListener('touchstart', this._onTouchStart);
    if (this._onMouseMove) document.removeEventListener('mousemove', this._onMouseMove);
    if (this._onMouseLeave) document.removeEventListener('mouseleave', this._onMouseLeave);
    if (this._onMouseEnter) document.removeEventListener('mouseenter', this._onMouseEnter);
    // 移除注入的样式和 DOM 元素
    const styleId = 'cursor-glow-style';
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();
    if (this.el) this.el.remove();
    this.el = null;
  }
}
