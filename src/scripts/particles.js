/**
 * MinimalParticles — 增强版粒子系统
 * - 鼠标交互：粒子被鼠标排斥/吸引
 * - 光晕效果：粒子带有柔和发光
 * - 鼠标附近粒子连线高亮
 * - DPR 适配、性能优化
 */
export class MinimalParticles {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isRunning = false;
    this.animationId = null;
    this.mouse = { x: -9999, y: -9999, active: false };
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;
    this.reducedMode = false;

    const defaults = {
      count: 60,
      colors: ['#2E7D5C', '#78B4A0', '#E5A93C', '#F7F3EE'],
      maxSize: 3,
      speed: 0.25,
      linkDistance: 120,
      linkOpacity: 0.08,
      mouseRadius: 150,      // 鼠标影响半径
      mouseForce: 0.02,      // 鼠标排斥力度
      glowSize: 8,           // 光晕大小倍数
      glowOpacity: 0.15,     // 光晕透明度
    };

    this.options = { ...defaults, ...options };
    this.resize();
    this.init();
    this._bindEvents();
  }

  _bindEvents() {
    let resizeTimer;

    this._onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.resize();
        this.init();
      }, 200);
    };
    window.addEventListener('resize', this._onResize);

    this._onVisibilityChange = () => {
      if (document.hidden) this.pause();
      else this.resume();
    };
    document.addEventListener('visibilitychange', this._onVisibilityChange);

    // 鼠标交互
    this._onMouseMove = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    };
    document.addEventListener('mousemove', this._onMouseMove, { passive: true });

    this._onMouseLeave = () => {
      this.mouse.active = false;
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    };
    document.addEventListener('mouseleave', this._onMouseLeave);

    // 触屏设备不启用鼠标交互
    this._onTouchStart = () => {
      this.mouse.active = false;
    };
    window.addEventListener('touchstart', this._onTouchStart, { once: true, passive: true });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(dpr, dpr);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const count = window.innerWidth < 768
      ? Math.floor(this.options.count * 0.5)
      : this.options.count;
    for (let i = 0; i < count; i++) {
      const isStar = Math.random() < 0.08; // 8% 概率成为明星粒子
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.options.speed * 2,
        vy: (Math.random() - 0.5) * this.options.speed * 2,
        size: isStar ? this.options.maxSize * 1.6 : Math.random() * this.options.maxSize + 0.8,
        color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
        opacity: isStar ? Math.random() * 0.3 + 0.5 : Math.random() * 0.5 + 0.25,
        baseOpacity: 0, // 将在下面设置
        pulsePhase: Math.random() * Math.PI * 2, // 脉冲相位
        pulseSpeed: 0.008 + Math.random() * 0.004,
        isStar: isStar,
      });
      this.particles[i].baseOpacity = this.particles[i].opacity;
    }
  }

  animate() {
    if (!this.isRunning) return;

    // FPS 监控：每秒检测一次，低于 30fps 自动降级
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFrameTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFrameTime = now;
      if (this.fps < 30 && !this.reducedMode && this.particles.length > 30) {
        this.reducedMode = true;
        this.particles.splice(30);
      }
    }

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const { mouseRadius, mouseForce, linkDistance, linkOpacity, glowSize, glowOpacity } = this.options;

    for (const p of this.particles) {
      // 鼠标排斥力
      if (this.mouse.active) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * mouseForce;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // 速度衰减（防止粒子越跑越快）
      p.vx *= 0.998;
      p.vy *= 0.998;

      // 位移
      p.x += p.vx;
      p.y += p.vy;

      // 边界反弹
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > this.width) { p.x = this.width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > this.height) { p.y = this.height; p.vy *= -1; }

      // 脉冲呼吸效果
      p.pulsePhase += p.pulseSpeed;
      const pulse = Math.sin(p.pulsePhase) * 0.15 + 1;
      const currentSize = p.size * pulse;
      const currentOpacity = p.baseOpacity * (0.85 + Math.sin(p.pulsePhase) * 0.15);

      // 鼠标附近粒子增亮
      let highlight = 0;
      if (this.mouse.active) {
        const mdx = p.x - this.mouse.x;
        const mdy = p.y - this.mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouseRadius) {
          highlight = (1 - mdist / mouseRadius) * 0.4;
        }
      }

      // 绘制光晕 — 柔化边缘渐变
      if (currentSize > 1.5) {
        const glowRadius = Math.max(0.1, currentSize * glowSize * (p.isStar ? 1.3 : 1));
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        const glowAlpha = (currentOpacity + highlight) * glowOpacity;
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.25, p.color);
        gradient.addColorStop(0.5, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.globalAlpha = glowAlpha;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 绘制粒子核心
      ctx.globalAlpha = currentOpacity + highlight;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
      ctx.fill();
    }

    // 绘制连线 — 使用距离平方优化
    ctx.lineWidth = 0.5;
    const linkDistSq = linkDistance * linkDistance;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < linkDistSq) {
          const dist = Math.sqrt(distSq);
          const baseAlpha = linkOpacity * (1 - dist / linkDistance);

          // 鼠标附近连线高亮
          let lineHighlight = 0;
          if (this.mouse.active) {
            const midX = (this.particles[i].x + this.particles[j].x) / 2;
            const midY = (this.particles[i].y + this.particles[j].y) / 2;
            const mdx = midX - this.mouse.x;
            const mdy = midY - this.mouse.y;
            const mdistSq = mdx * mdx + mdy * mdy;
            const mouseRadSq = mouseRadius * mouseRadius;
            if (mdistSq < mouseRadSq) {
              lineHighlight = (1 - Math.sqrt(mdistSq) / mouseRadius) * 0.15;
            }
          }

          ctx.globalAlpha = baseAlpha + lineHighlight;
          ctx.strokeStyle = lineHighlight > 0.03
            ? `rgba(229, 169, 60, ${baseAlpha + lineHighlight})`
            : `rgba(46, 125, 92, ${baseAlpha})`;
          ctx.beginPath();
          ctx.moveTo(this.particles[i].x, this.particles[i].y);
          ctx.lineTo(this.particles[j].x, this.particles[j].y);
          ctx.stroke();
        }
      }
    }

    // 鼠标与附近粒子的连线
    if (this.mouse.active) {
      for (const p of this.particles) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius * 0.8) {
          const alpha = (1 - dist / (mouseRadius * 0.8)) * 0.12;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = 'rgba(229, 169, 60, 1)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(this.mouse.x, this.mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  pause() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  destroy() {
    // 停止动画循环
    this.pause();

    // 移除所有事件监听器
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this._onVisibilityChange) document.removeEventListener('visibilitychange', this._onVisibilityChange);
    if (this._onMouseMove) document.removeEventListener('mousemove', this._onMouseMove);
    if (this._onMouseLeave) document.removeEventListener('mouseleave', this._onMouseLeave);
    if (this._onTouchStart) window.removeEventListener('touchstart', this._onTouchStart);

    // 移除 canvas 元素
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
    }

    // 清空粒子数据
    this.particles = [];
  }
}
