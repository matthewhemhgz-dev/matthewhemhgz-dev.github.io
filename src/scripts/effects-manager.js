/**
 * 动效管理器
 * 统一管理所有动效，包括鼠标跟随、粒子系统、流体系统、生成系统等
 */
export class EffectsManager {
  constructor() {
    this.effects = {};
    this.isInitialized = false;
    this.isMobile = window.innerWidth < 768;
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
   */
  registerEffect(name, effect) {
    this.effects[name] = effect;
  }

  /**
   * 获取动效
   * @param {string} name - 动效名称
   * @returns {Object} 动效实例
   */
  getEffect(name) {
    return this.effects[name];
  }

  /**
   * 移除动效
   * @param {string} name - 动效名称
   */
  removeEffect(name) {
    if (this.effects[name]) {
      // 销毁动效
      if (this.effects[name].destroy) {
        this.effects[name].destroy();
      }
      delete this.effects[name];
    }
  }

  /**
   * 更新所有动效
   */
  update() {
    Object.values(this.effects).forEach(effect => {
      if (effect.update) {
        effect.update();
      }
    });
  }

  /**
   * 绘制所有动效
   */
  draw() {
    Object.values(this.effects).forEach(effect => {
      if (effect.draw) {
        effect.draw();
      }
    });
  }

  /**
   * 设置鼠标位置
   * @param {number} x - 鼠标X坐标
   * @param {number} y - 鼠标Y坐标
   */
  setMousePosition(x, y) {
    Object.values(this.effects).forEach(effect => {
      if (effect.setMousePosition) {
        effect.setMousePosition(x, y);
      }
    });
  }

  /**
   * 设置随机种子
   * @param {number} seed - 随机种子
   */
  setSeed(seed) {
    Object.values(this.effects).forEach(effect => {
      if (effect.setSeed) {
        effect.setSeed(seed);
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
    
    Object.values(this.effects).forEach(effect => {
      if (effect.setSize) {
        effect.setSize(width, height);
      }
    });
  }

  /**
   * 销毁所有动效
   */
  destroy() {
    Object.keys(this.effects).forEach(name => {
      this.removeEffect(name);
    });
    
    window.removeEventListener('resize', this._onResize.bind(this));
    this.isInitialized = false;
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
