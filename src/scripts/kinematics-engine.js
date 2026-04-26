/**
 * 统一运动学核心 (Unified Kinematics Engine)
 * 基于受阻尼系统弹簧振子方程: m * d2x/dt2 + c * dx/dt + k * x = F
 */
class KinematicsEngine {
  constructor() {
    this.elements = new Map();
    this.rafId = null;
    this.isRunning = false;
    this.energyMultiplier = 1.0; // Driven by EnvironmentAware
  }

  /**
   * 设置全局能量乘数 (来自 EnvironmentAware)
   * 高能量 = 更快的弹簧响应; 低能量 = 更沉重的阻尼
   * @param {number} energy - [0.0, 1.0]
   */
  setGlobalEnergy(energy) {
    this.energyMultiplier = 0.6 + energy * 0.4; // [0.6, 1.0]
  }

  /**
   * 注册元素到物理引擎
   * @param {HTMLElement} el
   * @param {Object} options 物理属性
   */
  register(el, options = {}) {
    const rect = el.getBoundingClientRect();
    const area = rect.width * rect.height;

    // 面积近似质量
    let mass = options.mass || Math.log10(area || 1000) * 0.5;
    mass = Math.max(0.5, Math.min(mass, 5.0));

    this.elements.set(el, {
      mass: mass,
      stiffness: options.stiffness || 300, // k
      damping: options.damping || 20, // c (2 * sqrt(m*k) = 临界阻尼)
      position: { x: 0, y: 0, scale: 1 },
      velocity: { x: 0, y: 0, scale: 0 },
      target: { x: 0, y: 0, scale: 1 },
      isHovered: false,
      rect: rect,
    });

    el.dataset.kinematics = 'true';
    this._bindEvents(el);
  }

  _bindEvents(el) {
    const state = this.elements.get(el);

    el.addEventListener('mouseenter', () => {
      state.isHovered = true;
      state.target.scale = 0.98; // 轻微质量下压
      if (!this.isRunning) this._loop();
    });

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // 光标相对于元素中心的偏移力
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      // 最大倾斜角度: 10度 x 外力
      state.target.x = dx * 10;
      state.target.y = dy * 10;
    });

    el.addEventListener('mouseleave', () => {
      state.isHovered = false;
      state.target.x = 0;
      state.target.y = 0;
      state.target.scale = 1;
    });

    el.addEventListener('mousedown', () => {
      // 巨大受力，压缩
      state.velocity.scale -= 0.05 / state.mass;
      state.target.scale = 0.92;
    });

    el.addEventListener('mouseup', () => {
      // 释放回弹
      state.target.scale = state.isHovered ? 0.98 : 1;
    });
  }

  _loop() {
    this.isRunning = true;
    let anyActive = false;

    // 单步欧拉显式积分
    const dt = 1 / 60; // 假设 60fps

    for (let [el, state] of this.elements.entries()) {
      let active = false;

      // 分三个维度积分 (rotX, rotY, scale)
      ['x', 'y', 'scale'].forEach((prop) => {
        const x = state.position[prop];
        const v = state.velocity[prop];
        const target = state.target[prop];

        // 弹力: F = -k(x - target)
        const springForce = -state.stiffness * this.energyMultiplier * (x - target);
        // 阻尼力: F = -c*v (低能量时阻尼增强)
        const dampingForce = -state.damping * (2.0 - this.energyMultiplier) * v;

        // a = F / m
        const acceleration = (springForce + dampingForce) / state.mass;

        // v = v + a*dt
        state.velocity[prop] += acceleration * dt;
        // x = x + v*dt
        state.position[prop] += state.velocity[prop] * dt;

        if (Math.abs(state.velocity[prop]) > 0.001 || Math.abs(x - target) > 0.001) {
          active = true;
        }
      });

      if (active || state.isHovered) {
        anyActive = true;
        el.style.setProperty('--kn-rx', `${-state.position.y}deg`);
        el.style.setProperty('--kn-ry', `${state.position.x}deg`);
        el.style.setProperty('--kn-s', state.position.scale);
      } else {
        // 重置以避免微小抖动
        el.style.removeProperty('--kn-rx');
        el.style.removeProperty('--kn-ry');
        el.style.removeProperty('--kn-s');
      }
    }

    if (anyActive) {
      this.rafId = requestAnimationFrame(() => this._loop());
    } else {
      this.isRunning = false;
    }
  }
}

// 自动注入全局 CSS 规则来消费这些变量，不破坏原本的 transform
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    [data-kinematics="true"] {
      /* Preserves original transform via CSS cascade while blending kinematics */
      transform: perspective(1000px) rotateX(var(--kn-rx, 0deg)) rotateY(var(--kn-ry, 0deg)) scale(var(--kn-s, 1)) !important;
      will-change: transform;
    }
  `;
  document.head.appendChild(style);
}

export const kinematics = new KinematicsEngine();
