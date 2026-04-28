/**
 * MinimalParticles — 增强版粒子系统 (v4 性能优化)
 * - 鼠标交互：粒子被鼠标排斥/吸引
 * - 光晕效果：预渲染离屏纹理，避免每帧创建渐变
 * - 鼠标附近粒子连线高亮
 * - DPR 适配、FPS 自动降级
 * - 深色/浅色模式适配
 * - 移动端自动降级
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

// 检测是否为移动端
function isMobile() {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth < 768);
}

// 检测是否为深色模式
function isDarkMode() {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark') ||
         window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export class MinimalParticles {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn('[MinimalParticles] Canvas element not found:', canvasId);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isRunning = false;
    this.animationId = null;
    this.mouse = { x: -9999, y: -9999, active: false };
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;
    this.reducedMode = false;
    this.mobileMode = false;
    this.glowTextures = {};
    this.glowFrameSkip = 0;
    this.darkMode = isDarkMode();
    this.qualityLevel = 1;

    const defaults = {
      count: 60,
      colors: this._getThemeColors(),
      maxSize: 3,
      speed: 0.25,
      linkDistance: 120,
      linkOpacity: 0.08,
      mouseRadius: 150,
      mouseForce: 0.02,
      glowSize: 8,
      glowOpacity: 0.15,
      enableGlow: true,
      enableLinks: true,
      enableMouseInteraction: true,
    };

    this.options = { ...defaults, ...options };
    
    // 根据设备和性能设置质量级别
    this._setQualityLevel();
    
    this._parseColors();
    this._prerenderGlowTextures();
    this.resize();
    this.init();
    this._bindEvents();
  }

  /**
   * 根据主题模式获取颜色
   */
  _getThemeColors() {
    const cs = getComputedStyle(document.documentElement);
    const emerald = cs.getPropertyValue('--qi-brand-emerald').trim() || '#2E7D5C';
    const mint = cs.getPropertyValue('--qi-brand-mint').trim() || '#78B4A0';
    const amber = cs.getPropertyValue('--qi-brand-amber').trim() || '#E5A93C';
    const bgBase = cs.getPropertyValue('--qi-bg-base').trim() || '#F7F3EE';
    return [emerald, mint, amber, bgBase];
  }

  /**
   * 根据设备性能设置质量级别
   */
  _setQualityLevel() {
    if (isMobile()) {
      this.mobileMode = true;
      this.qualityLevel = 0.4;
      this.options.enableGlow = false;
      this.options.enableLinks = false;
      this.options.enableMouseInteraction = false;
      console.info('[MinimalParticles] Mobile device detected, enabling reduced quality mode');
    } else {
      // 根据 CPU 核心数和内存估计设置质量
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      if (hardwareConcurrency <= 4) {
        this.qualityLevel = 0.7;
        console.info('[MinimalParticles] Low-end device detected, enabling medium quality mode');
      } else {
        this.qualityLevel = 1;
      }
    }
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
   */
  _prerenderGlowTextures() {
    if (!this.options.enableGlow) return;
    
    const { colors, glowSize, maxSize } = this.options;
    const maxGlowRadius = Math.ceil(maxSize * 1.6 * glowSize * 1.3);
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

    // 主题切换监听
    this._onThemeChange = () => {
      const newDarkMode = isDarkMode();
      if (newDarkMode !== this.darkMode) {
        this.darkMode = newDarkMode;
        this.options.colors = this._getThemeColors();
        this._parseColors();
        this._prerenderGlowTextures();
        this.init();
      }
    };
    document.addEventListener('themechange', this._onThemeChange);

    // 鼠标交互（非移动端）
    if (this.options.enableMouseInteraction && !this.mobileMode) {
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
    }

    // 触屏设备禁用鼠标交互
    this._onTouchStart = () => {
      this.mouse.active = false;
    };
    window.addEventListener('touchstart', this._onTouchStart, { once: true, passive: true });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, this.mobileMode ? 1 : 2);
    const width = document.documentElement.clientWidth;
    const height = window.innerHeight;

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
    const baseCount = this.options.count;
    const adjustedCount = Math.floor(baseCount * this.qualityLevel);
    const count = Math.max(15, adjustedCount);
    
    for (let i = 0; i < count; i++) {
      const isStar = !this.mobileMode && Math.random() < 0.08;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.options.speed * 2,
        vy: (Math.random() - 0.5) * this.options.speed * 2,
        size: isStar ? this.options.maxSize * 1.6 : Math.random() * this.options.maxSize + 0.8,
        color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
        opacity: isStar ? Math.random() * 0.3 + 0.5 : Math.random() * 0.5 + 0.25,
        baseOpacity: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.004,
        isStar: isStar,
      });
      this.particles[i].baseOpacity = this.particles[i].opacity;
    }
  }

  animate() {
    if (!this.isRunning) return;

    // FPS 监控：每 500ms 检测一次
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFrameTime >= 500) {
      this.fps = Math.round(this.frameCount * 2);
      this.frameCount = 0;
      this.lastFrameTime = now;
      
      // 动态性能调整
      this._adjustQuality();
    }

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const { mouseRadius, mouseForce, linkDistance, linkOpacity, glowSize, glowOpacity } = this.options;

    // 使用对象池减少 GC 压力
    const renderData = [];
    
    for (const p of this.particles) {
      // 鼠标排斥力
      if (this.mouse.active && this.options.enableMouseInteraction) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius && dist > 0) {
          const force = (1 - dist / mouseRadius) * mouseForce;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // 速度衰减
      p.vx *= 0.998;
      p.vy *= 0.998;

      // 位移
      p.x += p.vx;
      p.y += p.vy;

      // 边界反弹（简化版本）
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;
      p.x = Math.max(0, Math.min(this.width, p.x));
      p.y = Math.max(0, Math.min(this.height, p.y));

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

      renderData.push({
        x: p.x,
        y: p.y,
        size: currentSize,
        opacity: currentOpacity + highlight,
        color: p.color,
        isStar: p.isStar,
        shouldDrawGlow: this.options.enableGlow && currentSize > 1.5,
        highlight: highlight,
      });
    }

    // 绘制光晕（使用预渲染纹理）
    if (this.options.enableGlow) {
      this.glowFrameSkip++;
      const shouldDrawGlow = this.glowFrameSkip % (this.reducedMode ? 3 : 2) === 0;
      
      if (shouldDrawGlow) {
        for (const data of renderData) {
          if (data.shouldDrawGlow) {
            const texture = this.glowTextures[data.color];
            if (texture) {
              const glowRadius = Math.max(0.1, data.size * glowSize * (data.isStar ? 1.3 : 1));
              const glowAlpha = data.opacity * glowOpacity;
              ctx.globalAlpha = glowAlpha;
              const drawSize = glowRadius * 2;
              ctx.drawImage(texture, data.x - glowRadius, data.y - glowRadius, drawSize, drawSize);
            }
          }
        }
      }
    }

    // 绘制粒子核心（批量绘制）
    ctx.globalAlpha = 1;
    for (const data of renderData) {
      ctx.globalAlpha = data.opacity;
      ctx.fillStyle = data.color;
      ctx.beginPath();
      ctx.arc(data.x, data.y, Math.max(0.5, data.size), 0, Math.PI * 2);
      ctx.fill();
    }

    // 绘制连线（优化版本）
    if (this.options.enableLinks && !this.reducedMode) {
      ctx.lineWidth = 0.5;
      const linkDistSq = linkDistance * linkDistance;
      
      // 空间分区优化：减少连线计算
      const gridSize = linkDistance;
      const grid = {};
      
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const gridX = Math.floor(p.x / gridSize);
        const gridY = Math.floor(p.y / gridSize);
        const key = `${gridX},${gridY}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(i);
      }

      // 只检查相邻格子的粒子
      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        const gridX = Math.floor(p1.x / gridSize);
        const gridY = Math.floor(p1.y / gridSize);
        
        // 检查当前格子和周围8个格子
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const neighbors = grid[`${gridX + dx},${gridY + dy}`];
            if (!neighbors) continue;
            
            for (const j of neighbors) {
              if (j <= i) continue; // 避免重复计算
              const p2 = this.particles[j];
              
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const distSq = dx * dx + dy * dy;
              
              if (distSq < linkDistSq) {
                const dist = Math.sqrt(distSq);
                const baseAlpha = linkOpacity * (1 - dist / linkDistance);
                
                // 鼠标附近连线高亮
                let lineHighlight = 0;
                if (this.mouse.active) {
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;
                  const mdx = midX - this.mouse.x;
                  const mdy = midY - this.mouse.y;
                  const mdistSq = mdx * mdx + mdy * mdy;
                  const mouseRadSq = mouseRadius * mouseRadius;
                  if (mdistSq < mouseRadSq) {
                    lineHighlight = (1 - Math.sqrt(mdistSq) / mouseRadius) * 0.15;
                  }
                }
                
                ctx.globalAlpha = baseAlpha + lineHighlight;
                const emeraldRGB = this.colorRGB[this.options.colors[0]] || { r: 46, g: 125, b: 92 };
                const amberRGB = this.colorRGB[this.options.colors[2]] || { r: 229, g: 169, b: 60 };
                ctx.strokeStyle = lineHighlight > 0.03
                  ? `rgba(${amberRGB.r}, ${amberRGB.g}, ${amberRGB.b}, ${baseAlpha + lineHighlight})`
                  : `rgba(${emeraldRGB.r}, ${emeraldRGB.g}, ${emeraldRGB.b}, ${baseAlpha})`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }
      }
    }

    // 鼠标与附近粒子的连线
    if (this.mouse.active && this.options.enableMouseInteraction && !this.reducedMode) {
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

  /**
   * 动态调整质量以维持 FPS > 55
   */
  _adjustQuality() {
    const targetFps = 55;
    
    if (this.fps < targetFps && !this.reducedMode && this.particles.length > 20) {
      // 降低粒子数量
      const newCount = Math.max(20, Math.floor(this.particles.length * 0.7));
      this.particles.splice(newCount);
      this.reducedMode = true;
      this.options.enableGlow = false;
      console.info(`[MinimalParticles] FPS drop detected (${this.fps}fps), reducing particle count to ${newCount}`);
    } else if (this.fps > targetFps + 10 && this.reducedMode) {
      // 恢复质量
      this.reducedMode = false;
      this.options.enableGlow = !this.mobileMode;
      console.info(`[MinimalParticles] FPS recovered (${this.fps}fps), restoring quality`);
    }
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
    this.pause();

    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this._onVisibilityChange) document.removeEventListener('visibilitychange', this._onVisibilityChange);
    if (this._onMouseMove) document.removeEventListener('mousemove', this._onMouseMove);
    if (this._onMouseLeave) document.removeEventListener('mouseleave', this._onMouseLeave);
    if (this._onTouchStart) window.removeEventListener('touchstart', this._onTouchStart);
    if (this._onThemeChange) document.removeEventListener('themechange', this._onThemeChange);

    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.particles = [];
    this.mouse = { x: -9999, y: -9999, active: false };
    this.reducedMode = false;
    this.fps = 60;
    this.frameCount = 0;
  }

  /**
   * 重建粒子系统
   */
  rebuild(newOptions = {}) {
    this.destroy();
    if (newOptions) Object.assign(this.options, newOptions);
    this._setQualityLevel();
    this._prerenderGlowTextures();
    this.resize();
    this.init();
    this._bindEvents();
    this.resume();
  }
}