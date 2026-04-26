/**
 * 动效管理器
 * 统一管理所有动效，包括鼠标跟随、粒子系统、流体系统、生成系统等
 */
export class EffectsManager {
  constructor() {
    this.effects = {};
    this.effectGroups = {};
    this.isInitialized = false;
    this.isMobile = window.innerWidth < 768;
    this.activeEffects = new Set();
  }

  /**
   * 初始化动效管理器
   */
  initialize() {
    if (this.isInitialized) return;

    // 监听窗口大小变化
    window.addEventListener('resize', this._onResize.bind(this));

    this.isInitialized = true;
  }

  /**
   * 注册动效
   * @param {string} name - 动效名称
   * @param {Object} effect - 动效实例
   * @param {Object} options - 配置选项
   * @param {string} options.group - 动效分组
   * @param {number} options.priority - 优先级，数值越大优先级越高
   * @param {boolean} options.active - 是否默认激活
   */
  registerEffect(name, effect, options = {}) {
    const defaultOptions = {
      group: 'default',
      priority: 0,
      active: true,
    };

    const config = { ...defaultOptions, ...options };

    this.effects[name] = {
      instance: effect,
      config,
    };

    // 添加到分组
    if (!this.effectGroups[config.group]) {
      this.effectGroups[config.group] = new Set();
    }
    this.effectGroups[config.group].add(name);

    // 激活动效
    if (config.active) {
      this.activeEffects.add(name);
    }
  }

  /**
   * 获取动效
   * @param {string} name - 动效名称
   * @returns {Object} 动效实例
   */
  getEffect(name) {
    return this.effects[name]?.instance;
  }

  /**
   * 移除动效
   * @param {string} name - 动效名称
   */
  removeEffect(name) {
    if (this.effects[name]) {
      // 从分组中移除
      const group = this.effects[name].config.group;
      if (this.effectGroups[group]) {
        this.effectGroups[group].delete(name);
      }

      // 从激活集合中移除
      this.activeEffects.delete(name);

      // 销毁动效
      if (this.effects[name].instance.destroy) {
        this.effects[name].instance.destroy();
      }

      delete this.effects[name];
    }
  }

  /**
   * 激活动效
   * @param {string} name - 动效名称
   */
  activateEffect(name) {
    if (this.effects[name]) {
      this.activeEffects.add(name);
    }
  }

  /**
   * 停用动效
   * @param {string} name - 动效名称
   */
  deactivateEffect(name) {
    this.activeEffects.delete(name);
  }

  /**
   * 激活分组
   * @param {string} group - 分组名称
   */
  activateGroup(group) {
    if (this.effectGroups[group]) {
      this.effectGroups[group].forEach((name) => {
        this.activeEffects.add(name);
      });
    }
  }

  /**
   * 停用分组
   * @param {string} group - 分组名称
   */
  deactivateGroup(group) {
    if (this.effectGroups[group]) {
      this.effectGroups[group].forEach((name) => {
        this.activeEffects.delete(name);
      });
    }
  }

  /**
   * 更新所有动效
   */
  update() {
    // 按优先级排序动效
    const sortedEffects = Object.entries(this.effects)
      .filter(([name]) => this.activeEffects.has(name))
      .sort(([, a], [, b]) => b.config.priority - a.config.priority);

    sortedEffects.forEach(([, { instance }]) => {
      if (instance.update) {
        instance.update();
      }
    });
  }

  /**
   * 绘制所有动效
   */
  draw() {
    // 按优先级排序动效
    const sortedEffects = Object.entries(this.effects)
      .filter(([name]) => this.activeEffects.has(name))
      .sort(([, a], [, b]) => b.config.priority - a.config.priority);

    sortedEffects.forEach(([, { instance }]) => {
      if (instance.draw) {
        instance.draw();
      }
    });
  }

  /**
   * 设置鼠标位置
   * @param {number} x - 鼠标X坐标
   * @param {number} y - 鼠标Y坐标
   */
  setMousePosition(x, y) {
    Object.entries(this.effects).forEach(([name, { instance }]) => {
      if (this.activeEffects.has(name) && instance.setMousePosition) {
        instance.setMousePosition(x, y);
      }
    });
  }

  /**
   * 设置随机种子
   * @param {number} seed - 随机种子
   */
  setSeed(seed) {
    Object.entries(this.effects).forEach(([name, { instance }]) => {
      if (this.activeEffects.has(name) && instance.setSeed) {
        instance.setSeed(seed);
      }
    });
  }

  /**
   * 响应式调整
   * @param {number} width - 新的宽度
   * @param {number} height - 新的高度
   */
  resize(width, height) {
    this.isMobile = width < 768;

    Object.entries(this.effects).forEach(([, { instance }]) => {
      if (instance.setSize) {
        instance.setSize(width, height);
      }
    });
  }

  /**
   * 销毁所有动效
   */
  destroy() {
    Object.keys(this.effects).forEach((name) => {
      this.removeEffect(name);
    });

    window.removeEventListener('resize', this._onResize.bind(this));
    this.isInitialized = false;
    this.effectGroups = {};
    this.activeEffects.clear();
  }

  /**
   * 窗口大小变化回调
   * @private
   */
  _onResize() {
    this.resize(window.innerWidth, window.innerHeight);
  }
}

// 导出单例
export const effectsManager = new EffectsManager();
