/**
 * MultiLightSystem — 多光源系统 (v1.0)
 * 支持点光源、方向光、环境光
 * 支持光源位置和强度调整
 * 支持光源阴影效果
 * 使用 CSS transition 替代 rAF 循环，降低 CPU 占用
 * 支持呼吸动画、移动端自动禁用、reduced-motion 媒体查询
 */
export class MultiLightSystem {
  constructor(options = {}) {
    this.els = [];
    this.lights = [];
    this.isTouchDevice = false;
    this.hasInteracted = false;

    const defaults = {
      size: 350,
      blend: 'screen',
    };
    this.options = { ...defaults, ...options };

    this._createStyle();
    this._createLights();
    this._bindEvents();
  }

  _createStyle() {
    // 从 CSS 变量读取品牌色
    const cs = getComputedStyle(document.documentElement);
    const mintRGB = this._hexToRGB(cs.getPropertyValue('--qi-brand-mint').trim());
    const emeraldRGB = this._hexToRGB(cs.getPropertyValue('--qi-brand-emerald').trim());
    const amberRGB = this._hexToRGB(cs.getPropertyValue('--qi-brand-amber').trim());

    // 避免重复创建样式
    if (!document.getElementById('multi-light-style')) {
      const style = document.createElement('style');
      style.id = 'multi-light-style';
      style.textContent = `
        .light-source {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: var(--qi-z-overlay);
          mix-blend-mode: screen;
          opacity: 0.6;
          will-change: transform, opacity;
          transition:
            transform 0.15s cubic-bezier(0.25, 0.1, 0.25, 1),
            opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .light-source.is-active {
          opacity: 1;
        }
        .light-source.is-leaving {
          opacity: 0;
          transition: opacity 0.6s ease, transform 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        /* 点光源 */
        .light-source.point-light {
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.4) 20%,
            rgba(255, 255, 255, 0.1) 40%,
            transparent 70%
          );
          filter: blur(20px);
        }

        /* 方向光 */
        .light-source.directional-light {
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0.3) 30%,
            transparent 60%
          );
          filter: blur(15px);
        }

        /* 环境光 */
        .light-source.ambient-light {
          background: radial-gradient(
            circle at center,
            rgba(${mintRGB.r}, ${mintRGB.g}, ${mintRGB.b}, 0.1) 0%,
            rgba(${mintRGB.r}, ${mintRGB.g}, ${mintRGB.b}, 0.05) 30%,
            transparent 70%
          );
          filter: blur(40px);
        }

        /* 光源阴影效果 */
        .light-shadow {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: var(--qi-z-overlay);
          mix-blend-mode: multiply;
          opacity: 0.2;
          will-change: transform, opacity;
          transition:
            transform 0.15s cubic-bezier(0.25, 0.1, 0.25, 1),
            opacity 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        @keyframes light-breathe {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @media (max-width: 1024px) {
          .light-source, .light-shadow { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .light-source, .light-shadow { display: none; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  _createLights() {
    // 创建点光源（鼠标跟随）
    const pointLight = this._createLight('point-light', {
      size: 200,
      color: '#ffffff',
      intensity: 1,
      type: 'point'
    });
    
    // 创建方向光（固定位置）
    const directionalLight = this._createLight('directional-light', {
      size: 400,
      color: '#fbbf24',
      intensity: 0.6,
      type: 'directional',
      x: window.innerWidth * 0.8,
      y: window.innerHeight * 0.2
    });
    
    // 创建环境光（全屏）
    const ambientLight = this._createLight('ambient-light', {
      size: window.innerWidth * 2,
      color: '#4ade80',
      intensity: 0.3,
      type: 'ambient',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    
    this.lights = [pointLight, directionalLight, ambientLight];
  }

  _createLight(type, options) {
    const light = {
      type: type,
      options: options,
      el: null,
      shadowEl: null
    };
    
    // 创建光源元素
    light.el = document.createElement('div');
    light.el.className = `light-source ${type}`;
    light.el.setAttribute('aria-hidden', 'true');
    light.el.style.width = `${options.size}px`;
    light.el.style.height = `${options.size}px`;
    
    // 设置初始位置
    if (options.x && options.y) {
      light.el.style.transform = `translate(${options.x - options.size / 2}px, ${options.y - options.size / 2}px)`;
    } else {
      // 初始定位在页面中心
      light.el.style.transform = `translate(${window.innerWidth / 2 - options.size / 2}px, ${window.innerHeight / 2 - options.size / 2}px)`;
    }
    
    // 创建阴影元素
    if (type === 'point-light') {
      light.shadowEl = document.createElement('div');
      light.shadowEl.className = 'light-shadow';
      light.shadowEl.style.width = `${options.size * 2}px`;
      light.shadowEl.style.height = `${options.size * 2}px`;
      light.shadowEl.style.borderRadius = '50%';
      light.shadowEl.style.background = 'radial-gradient(circle, transparent 0%, rgba(0, 0, 0, 0.1) 100%)';
      light.shadowEl.style.transform = `translate(${window.innerWidth / 2 - options.size}px, ${window.innerHeight / 2 - options.size}px)`;
      document.body.appendChild(light.shadowEl);
    }
    
    document.body.appendChild(light.el);
    this.els.push(light.el);
    if (light.shadowEl) this.els.push(light.shadowEl);
    
    return light;
  }

  _bindEvents() {
    this._onTouchStart = () => {
      this.isTouchDevice = true;
      this.els.forEach(el => {
        if (el) el.style.display = 'none';
      });
    };
    window.addEventListener('touchstart', this._onTouchStart, { once: true, passive: true });

    // 鼠标移动 — 直接更新 CSS transform，由 CSS transition 处理平滑过渡
    this._onMouseMove = (e) => {
      if (this.isTouchDevice) return;

      if (!this.hasInteracted) {
        this.hasInteracted = true;
        this.els.forEach(el => {
          if (el) el.classList.add('is-active');
        });
      }

      // 更新点光源位置
      const pointLight = this.lights.find(light => light.type === 'point-light');
      if (pointLight && pointLight.el) {
        pointLight.el.style.transform = `translate(${e.clientX - pointLight.options.size / 2}px, ${e.clientY - pointLight.options.size / 2}px)`;
      }
      
      // 更新点光源阴影位置
      if (pointLight && pointLight.shadowEl) {
        pointLight.shadowEl.style.transform = `translate(${e.clientX - pointLight.options.size}px, ${e.clientY - pointLight.options.size}px)`;
      }
    };
    document.addEventListener('mousemove', this._onMouseMove, { passive: true });

    this._onMouseLeave = () => {
      this.els.forEach(el => {
        if (el) el.classList.add('is-leaving');
      });
    };
    document.addEventListener('mouseleave', this._onMouseLeave);

    this._onMouseEnter = () => {
      if (this.hasInteracted) {
        this.els.forEach(el => {
          if (el) el.classList.remove('is-leaving');
        });
      }
    };
    document.addEventListener('mouseenter', this._onMouseEnter);
  }

  // 添加光源
  addLight(type, options) {
    const light = this._createLight(type, options);
    this.lights.push(light);
    return light;
  }

  // 更新光源参数
  updateLight(index, options) {
    const light = this.lights[index];
    if (light) {
      light.options = { ...light.options, ...options };
      if (light.el) {
        if (options.size) {
          light.el.style.width = `${options.size}px`;
          light.el.style.height = `${options.size}px`;
        }
        if (options.x && options.y) {
          light.el.style.transform = `translate(${options.x - light.options.size / 2}px, ${options.y - light.options.size / 2}px)`;
        }
        if (options.intensity) {
          light.el.style.opacity = options.intensity;
        }
      }
    }
  }

  // 移除光源
  removeLight(index) {
    const light = this.lights[index];
    if (light) {
      if (light.el) {
        light.el.remove();
        const elIndex = this.els.indexOf(light.el);
        if (elIndex > -1) this.els.splice(elIndex, 1);
      }
      if (light.shadowEl) {
        light.shadowEl.remove();
        const shadowIndex = this.els.indexOf(light.shadowEl);
        if (shadowIndex > -1) this.els.splice(shadowIndex, 1);
      }
      this.lights.splice(index, 1);
    }
  }

  destroy() {
    // 移除事件监听器
    if (this._onTouchStart) window.removeEventListener('touchstart', this._onTouchStart);
    if (this._onMouseMove) document.removeEventListener('mousemove', this._onMouseMove);
    if (this._onMouseLeave) document.removeEventListener('mouseleave', this._onMouseLeave);
    if (this._onMouseEnter) document.removeEventListener('mouseenter', this._onMouseEnter);
    
    // 移除 DOM 元素
    this.els.forEach(el => {
      if (el) el.remove();
    });
    this.els = [];
    this.lights = [];
  }

  _hexToRGB(hex) {
    if (!hex || hex === '') return { r: 0, g: 0, b: 0 };
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }
}

// 保持向后兼容
export class CursorGlow extends MultiLightSystem {
  constructor(options = {}) {
    super(options);
  }
}
