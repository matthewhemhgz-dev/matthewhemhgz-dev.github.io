/**
 * MinimalParticles — 增强版粒子系统 (v3 性能优化)
 * - 鼠标交互：粒子被鼠标排斥/吸引
 * - 光晕效果：预渲染离屏纹理，避免每帧创建渐变
 * - 鼠标附近粒子连线高亮
 * - DPR 适配、FPS 自动降级
 */

// 工具函数：将 hex 颜色转换为带 alpha 的 rgba
function colorWithAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 预渲染光晕纹理到离屏 Canvas
function createGlowTexture(color, radius) {
  const size = Math.ceil(radius * 2);
  const offscreen = document.createElement('canvas');
  offscreen.width = size;
  offscreen.height = size;
  const octx = offscreen.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const gradient = octx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.2, colorWithAlpha(color, 0.6));
  gradient.addColorStop(0.5, colorWithAlpha(color, 0.2));
  gradient.addColorStop(1, 'transparent');
  octx.fillStyle = gradient;
  octx.fillRect(0, 0, size, size);
  return offscreen;
}

export class MinimalParticles {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`Canvas element with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.warn(`Failed to get 2D context for canvas "${canvasId}"`);
      return;
    }

    this.particles = [];
    this.isRunning = false;
    this.animationId = null;
    this.mouse = { x: -9999, y: -9999, active: false };
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;
    this.reducedMode = false;
    this.glowTextures = {}; // 预渲染光晕纹理缓存
    this.glowFrameSkip = 0; // 光晕降频计数器

    const defaults = {
      count: 60,
      colors: [
        getComputedStyle(document.documentElement).getPropertyValue('--qi-brand-emerald').trim() ||
          '#2E7D5C',
        getComputedStyle(document.documentElement).getPropertyValue('--qi-brand-mint').trim() ||
          '#78B4A0',
        getComputedStyle(document.documentElement).getPropertyValue('--qi-brand-amber').trim() ||
          '#E5A93C',
        getComputedStyle(document.documentElement).getPropertyValue('--qi-bg-base').trim() ||
          '#F7F3EE',
      ],
      maxSize: 3,
      speed: 0.25,
      linkDistance: 120,
      linkOpacity: 0.08,
      mouseRadius: 150, // 鼠标影响半径
      mouseForce: 0.02, // 鼠标排斥力度
      glowSize: 8, // 光晕大小倍数
      glowOpacity: 0.15, // 光晕透明度
    };

    this.options = { ...defaults, ...options };
    this._parseColors();
    this._prerenderGlowTextures();
    this.resize();
    this.init();
    this._bindEvents();
    // 自动启动粒子系统
    this.resume();
  }

  /**
   * 解析颜色为 RGB 对象缓存，供连线绘制使用
   */
  _parseColors() {
    this.colorRGB = {};
    for (const color of this.options.colors) {
      if (color && color.startsWith('#') && color.length >= 7) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        this.colorRGB[color] = { r, g, b };
      }
    }
  }

  /**
   * 预渲染各颜色的光晕纹理到离屏 Canvas
   * 避免每帧创建 createRadialGradient 的开销
   */
  _prerenderGlowTextures() {
    const { colors, glowSize, maxSize } = this.options;
    const maxGlowRadius = Math.ceil(maxSize * 1.6 * glowSize * 1.3); // 明星粒子最大光晕
    for (const color of colors) {
      this.glowTextures[color] = createGlowTexture(color, maxGlowRadius);
    }
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
    const width = document.documentElement.clientWidth;
    const height = window.innerHeight; // Keep innerHeight for full viewport height

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.ctx.scale(dpr, dpr);
    this.width = width;
    this.height = height;
  }

  init() {
    this.particles = [];
    const count =
      window.innerWidth < 768 ? Math.floor(this.options.count * 0.5) : this.options.count;
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

  /**
   * 使用网格分区优化连线计算
   */
  _createGrid() {
    const { linkDistance } = this.options;
    const cellSize = linkDistance;
    const cols = Math.ceil(this.width / cellSize);
    const rows = Math.ceil(this.height / cellSize);
    const grid = new Array(cols).fill(null).map(() => new Array(rows).fill(null).map(() => []));

    for (const particle of this.particles) {
      const col = Math.min(Math.floor(particle.x / cellSize), cols - 1);
      const row = Math.min(Math.floor(particle.y / cellSize), rows - 1);
      grid[col][row].push(particle);
    }

    return { grid, cellSize, cols, rows };
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

    const { mouseRadius, mouseForce, linkDistance, linkOpacity, glowSize, glowOpacity } =
      this.options;

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
      if (p.x < 0) {
        p.x = 0;
        p.vx *= -1;
      }
      if (p.x > this.width) {
        p.x = this.width;
        p.vx *= -1;
      }
      if (p.y < 0) {
        p.y = 0;
        p.vy *= -1;
      }
      if (p.y > this.height) {
        p.y = this.height;
        p.vy *= -1;
      }

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

      // 绘制光晕 — 使用预渲染纹理（每 2 帧更新一次，降低开销）
      this.glowFrameSkip++;
      const shouldDrawGlow = this.glowFrameSkip % 2 === 0;
      if (shouldDrawGlow && currentSize > 1.5) {
        const texture = this.glowTextures[p.color];
        if (texture) {
          const glowRadius = Math.max(0.1, currentSize * glowSize * (p.isStar ? 1.3 : 1));
          const glowAlpha = (currentOpacity + highlight) * glowOpacity;
          ctx.globalAlpha = glowAlpha;
          // drawImage 使用目标尺寸缩放预渲染纹理
          const drawSize = glowRadius * 2;
          ctx.drawImage(texture, p.x - glowRadius, p.y - glowRadius, drawSize, drawSize);
        }
      }

      // 绘制粒子核心
      ctx.globalAlpha = currentOpacity + highlight;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
      ctx.fill();
    }

    // 绘制连线 — 使用网格分区优化
    ctx.lineWidth = 0.5;
    const linkDistSq = linkDistance * linkDistance;
    const { grid, cols, rows } = this._createGrid();

    // 遍历所有网格细胞
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const particlesInCell = grid[col][row];
        if (particlesInCell.length === 0) continue;

        // 检查当前细胞和相邻细胞的粒子
        for (let dCol = -1; dCol <= 1; dCol++) {
          for (let dRow = -1; dRow <= 1; dRow++) {
            const neighborCol = col + dCol;
            const neighborRow = row + dRow;

            // 检查边界
            if (neighborCol < 0 || neighborCol >= cols || neighborRow < 0 || neighborRow >= rows) {
              continue;
            }

            const neighborParticles = grid[neighborCol][neighborRow];

            // 计算当前细胞和相邻细胞之间的粒子连线
            for (let i = 0; i < particlesInCell.length; i++) {
              for (let j = 0; j < neighborParticles.length; j++) {
                // 避免重复计算
                if (particlesInCell[i] === neighborParticles[j]) continue;

                const dx = particlesInCell[i].x - neighborParticles[j].x;
                const dy = particlesInCell[i].y - neighborParticles[j].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < linkDistSq) {
                  const dist = Math.sqrt(distSq);
                  const baseAlpha = linkOpacity * (1 - dist / linkDistance);

                  // 鼠标附近连线高亮
                  let lineHighlight = 0;
                  if (this.mouse.active) {
                    const midX = (particlesInCell[i].x + neighborParticles[j].x) / 2;
                    const midY = (particlesInCell[i].y + neighborParticles[j].y) / 2;
                    const mdx = midX - this.mouse.x;
                    const mdy = midY - this.mouse.y;
                    const mdistSq = mdx * mdx + mdy * mdy;
                    const mouseRadSq = mouseRadius * mouseRadius;
                    if (mdistSq < mouseRadSq) {
                      lineHighlight = (1 - Math.sqrt(mdistSq) / mouseRadius) * 0.15;
                    }
                  }

                  ctx.globalAlpha = baseAlpha + lineHighlight;
                  const emeraldRGB = this.colorRGB[this.options.colors[0]] || {
                    r: 46,
                    g: 125,
                    b: 92,
                  };
                  const amberRGB = this.colorRGB[this.options.colors[2]] || {
                    r: 229,
                    g: 169,
                    b: 60,
                  };
                  ctx.strokeStyle =
                    lineHighlight > 0.03
                      ? `rgba(${amberRGB.r}, ${amberRGB.g}, ${amberRGB.b}, ${baseAlpha + lineHighlight})`
                      : `rgba(${emeraldRGB.r}, ${emeraldRGB.g}, ${emeraldRGB.b}, ${baseAlpha})`;
                  ctx.beginPath();
                  ctx.moveTo(particlesInCell[i].x, particlesInCell[i].y);
                  ctx.lineTo(neighborParticles[j].x, neighborParticles[j].y);
                  ctx.stroke();
                }
              }
            }
          }
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
          const amberRGB = this.colorRGB[this.options.colors[2]] || { r: 229, g: 169, b: 60 };
          ctx.strokeStyle = `rgba(${amberRGB.r}, ${amberRGB.g}, ${amberRGB.b}, 1)`;
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
    if (this._onVisibilityChange)
      document.removeEventListener('visibilitychange', this._onVisibilityChange);
    if (this._onMouseMove) document.removeEventListener('mousemove', this._onMouseMove);
    if (this._onMouseLeave) document.removeEventListener('mouseleave', this._onMouseLeave);
    if (this._onTouchStart) window.removeEventListener('touchstart', this._onTouchStart);

    // 清空 canvas 内容（不移除 DOM 元素，保留给下次重建使用）
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 清空粒子数据和状态
    this.particles = [];
    this.mouse = { x: -9999, y: -9999, active: false };
    this.reducedMode = false;
    this.fps = 60;
    this.frameCount = 0;
  }

  /**
   * 重建粒子系统 — 复用已有 canvas 元素
   * 在 View Transitions 页面切换后调用，替代 destroy + new
   */
  rebuild(newOptions = {}) {
    this.destroy();
    if (newOptions) Object.assign(this.options, newOptions);
    this._prerenderGlowTextures();
    this.resize();
    this.init();
    this._bindEvents();
    this.resume();
  }
}
