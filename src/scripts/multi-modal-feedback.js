import { kinematics } from './kinematics-engine.js';

/**
 * 多模态反馈系统 (V2: ADSR Acoustics & Kinematics)
 * 基于质量映射动态生成声音包络，且融合物理学阻尼引擎
 * @class MultiModalFeedback
 */
class MultiModalFeedback {
  /**
   * @typedef {Object} FeedbackOptions
   * @property {number} [intensity=0.5] - 反馈强度
   * @property {number} [duration=50] - 反馈持续时间（毫秒）
   * @property {number} [frequency=440] - 音频频率（Hz）
   * @property {number[]} [pattern] - 触觉反馈模式
   */

  /**
   * @typedef {Object} UserAction
   * @property {string} type - 动作类型
   * @property {number} timestamp - 时间戳
   * @property {string} target - 目标元素
   * @property {Object|null} coordinates - 坐标
   * @property {string|null} key - 按键
   */

  /**
   * @typedef {Object} ElementFeedbackOptions
   * @property {boolean} [hover=true] - 悬停反馈
   * @property {boolean} [click=true] - 点击反馈
   * @property {boolean} [focus=true] - 焦点反馈
   */

  constructor() {
    /** @type {AudioContext|null} */
    this.audioContext = null;
    /** @type {boolean} */
    this.audioEnabled = false;
    /** @type {boolean} */
    this.hapticEnabled = false;
    /** @type {HID|null} */
    this.hapticDevice = null;
    /** @type {UserAction[]} */
    this.userActions = [];
    /** @type {number} */
    this.actionThreshold = 5; // 收集多少个动作后开始预测

    this.initialize();
  }

  /**
   * 初始化多模态反馈系统
   */
  initialize() {
    // 初始化音频上下文
    this._initializeAudio();
    // 初始化触觉反馈
    this._initializeHaptic();
    // 监听用户交互
    this._listenToUserActions();
  }

  /**
   * 初始化音频上下文
   * @private
   */
  _initializeAudio() {
    // 尝试初始化音频上下文
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioEnabled = true;
    } catch (error) {
      console.warn('Audio context not supported:', error);
      this.audioEnabled = false;
    }
  }

  /**
   * 初始化触觉反馈
   * @private
   */
  _initializeHaptic() {
    // 检查是否支持触觉反馈
    if ('vibrate' in navigator) {
      this.hapticEnabled = true;
    } else if ('HID' in navigator) {
      // 尝试访问HID设备
      this._requestHIDAccess();
    } else {
      console.warn('Haptic feedback not supported');
      this.hapticEnabled = false;
    }
  }

  /**
   * 请求HID设备访问
   * @private
   */
  async _requestHIDAccess() {
    try {
      const devices = await navigator.hid.requestDevice({
        filters: [{ usagePage: 0x01, usage: 0x05 }], // 通用输入设备
      });
      if (devices.length > 0) {
        this.hapticDevice = devices[0];
        await this.hapticDevice.open();
        this.hapticEnabled = true;
      }
    } catch (error) {
      console.warn('HID access denied:', error);
      this.hapticEnabled = false;
    }
  }

  /**
   * 监听用户交互动作
   * @private
   */
  _listenToUserActions() {
    // 监听用户交互动作
    const actionTypes = ['click', 'touchstart', 'keydown', 'scroll', 'mouseover'];

    actionTypes.forEach((type) => {
      document.addEventListener(type, (e) => {
        this._recordUserAction(type, e);
      });
    });
  }

  /**
   * 记录用户动作
   * @param {string} type - 动作类型
   * @param {Event} event - 事件对象
   * @private
   */
  _recordUserAction(type, event) {
    // 记录用户动作
    const action = {
      type,
      timestamp: Date.now(),
      target: event.target.tagName,
      coordinates:
        type === 'click' || type === 'touchstart'
          ? {
            x: event.clientX || event.touches[0]?.clientX,
            y: event.clientY || event.touches[0]?.clientY,
          }
          : null,
      key: type === 'keydown' ? event.key : null,
    };

    this.userActions.push(action);

    // 限制动作记录数量
    if (this.userActions.length > 100) {
      this.userActions.shift();
    }

    // 触发反馈
    this._triggerFeedback(type, event);

    // 预测用户行为
    if (this.userActions.length >= this.actionThreshold) {
      this._predictUserBehavior();
    }
  }

  /**
   * 根据动作类型触发不同的反馈
   * @param {string} type - 动作类型
   * @param {Event} event - 事件对象
   * @private
   */
  _triggerFeedback(type, event) {
    // 根据动作类型触发不同的反馈
    switch (type) {
      case 'click':
      case 'touchstart':
        this.triggerFeedback('success', {
          intensity: 0.7,
          duration: 50,
        });
        break;
      case 'keydown':
        this.triggerFeedback('key', {
          intensity: 0.3,
          duration: 30,
          frequency: this._getKeyFrequency(event.key),
        });
        break;
      case 'scroll':
        // 滚动时不触发反馈，避免过于频繁
        break;
      case 'mouseover':
        this.triggerFeedback('hover', {
          intensity: 0.2,
          duration: 20,
        });
        break;
    }
  }

  /**
   * 根据按键生成不同的频率
   * @param {string} key - 按键
   * @returns {number} 频率（Hz）
   * @private
   */
  _getKeyFrequency(key) {
    // 根据按键生成不同的频率
    const keyFrequencies = {
      a: 440,
      b: 494,
      c: 523,
      d: 587,
      e: 659,
      f: 698,
      g: 784,
      h: 880,
      i: 988,
      j: 1047,
      k: 1175,
      l: 1319,
      m: 1397,
      n: 1568,
      o: 1760,
      p: 1976,
      q: 2217,
      r: 2489,
      s: 2637,
      t: 2960,
      u: 3136,
      v: 3520,
      w: 3951,
      x: 4435,
      y: 4978,
      z: 5274,
    };

    return keyFrequencies[key.toLowerCase()] || 440;
  }

  /**
   * 触发多模态反馈
   * @param {string} type - 反馈类型
   * @param {FeedbackOptions} options - 反馈选项
   */
  triggerFeedback(type, options = {}) {
    const { intensity = 0.5, duration = 50, frequency = 440, pattern = [duration] } = options;

    // 触发视觉反馈
    this._triggerVisualFeedback(type, options);

    // 触发听觉反馈
    if (this.audioEnabled) {
      this._triggerAudioFeedback(type, {
        intensity,
        frequency,
        duration,
      });
    }

    // 触发触觉反馈
    if (this.hapticEnabled) {
      this._triggerHapticFeedback(type, {
        intensity,
        pattern,
      });
    }
  }

  /**
   * 触发视觉反馈
   * @param {string} type - 反馈类型
   * @param {FeedbackOptions} options - 反馈选项
   * @private
   */
  _triggerVisualFeedback(type, options) {
    // 视觉反馈已经在前面的任务中实现
    // 这里可以添加额外的视觉反馈效果
    const { intensity, duration } = options;

    // 创建临时的视觉反馈元素
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `feedback visual-feedback ${type}`;
    feedbackElement.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      border-radius: 50%;
      background: rgba(74, 222, 128, ${intensity * 0.5});
      transform: scale(0);
      animation: feedback-pulse ${duration * 2}ms ease-out;
    `;

    // 添加到文档
    document.body.appendChild(feedbackElement);

    // 移除元素
    setTimeout(() => {
      feedbackElement.remove();
    }, duration * 2);
  }

  /**
   * 触发听觉反馈 (ADSR 包络合成器)
   * @param {string} type - 反馈类型
   * @param {Object} options - 音频选项
   * @private
   */
  _triggerAudioFeedback(type, options) {
    const { intensity, mass = 1.0 } = options;

    try {
      if (!this.audioContext) this._initializeAudio();
      if (!this.audioContext) return;
      if (this.audioContext.state === 'suspended') this.audioContext.resume();

      // 基于质量映射频率与衰减
      // 质量越大，频率越低，持音时间越长
      const baseFreq = Math.max(100, Math.min(2000, 2000 / mass));

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = type === 'click' ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);

      // ADSR 包络控制
      const now = this.audioContext.currentTime;
      const attack = type === 'click' ? 0.01 : 0.05;
      const decay = type === 'click' ? 0.1 * mass : 0.05;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(intensity * 0.3, now + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + attack + decay + 0.1);
    } catch (error) {
      console.warn('Audio feedback error:', error);
    }
  }

  /**
   * 触发触觉反馈
   * @param {string} type - 反馈类型
   * @param {Object} options - 触觉选项
   * @private
   */
  _triggerHapticFeedback(type, options) {
    const { pattern } = options;

    try {
      if ('vibrate' in navigator) {
        // 使用 navigator.vibrate
        navigator.vibrate(pattern);
      } else if (this.hapticDevice) {
        // 使用 HID 设备
        // 这里需要根据具体设备的协议实现
        console.log('Haptic feedback via HID');
      }
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  /**
   * 预测用户行为
   * @private
   */
  _predictUserBehavior() {
    // 简单的用户行为预测
    // 分析最近的用户动作
    const recentActions = this.userActions.slice(-this.actionThreshold);

    // 统计动作类型
    const actionCounts = recentActions.reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1;
      return acc;
    }, {});

    // 预测用户可能的下一步动作
    const mostFrequentAction = Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    if (mostFrequentAction) {
      this._providePredictiveFeedback(mostFrequentAction);
    }
  }

  /**
   * 根据预测的动作提供提前反馈
   * @param {string} predictedAction - 预测的动作
   * @private
   */
  _providePredictiveFeedback(predictedAction) {
    // 根据预测的动作提供提前反馈
    console.log('Predicted action:', predictedAction);

    // 这里可以根据预测的动作提供相应的反馈
    // 例如，如果预测用户会点击某个按钮，可以提前高亮该按钮
  }

  /**
   * 为特定UI元素添加反馈 (与阻尼物理引擎打通)
   * @param {HTMLElement} element - 目标元素
   * @param {ElementFeedbackOptions} options - 反馈选项
   */
  addFeedbackToElement(element, options = {}) {
    const { hover = true, click = true, focus = true } = options;

    // 获取并注册该元素的物理质量
    let mass = 1.0;
    try {
      const rect = element.getBoundingClientRect();
      const area = rect.width * rect.height;
      mass = Math.max(0.5, Math.min(Math.log10(area || 1000) * 0.5, 5.0));
      kinematics.register(element, { mass: mass });
    } catch (e) {
      // Ignore geometry parsing errors
    }

    if (hover) {
      element.addEventListener('mouseenter', () => {
        this.triggerFeedback('hover', {
          intensity: 0.15,
          mass: mass * 0.5, // Hover lighter sound
        });
      });
    }

    if (click) {
      element.addEventListener('mousedown', () => {
        this.triggerFeedback('click', {
          intensity: 0.6,
          mass: mass,
        });
      });
    }

    if (focus) {
      element.addEventListener('focus', () => {
        this.triggerFeedback('focus', {
          intensity: 0.2,
          mass: mass * 0.8,
        });
      });
    }
  }

  /**
   * 批量为多个元素添加反馈
   * @param {HTMLElement[]} elements - 元素数组
   * @param {ElementFeedbackOptions} options - 反馈选项
   */
  addFeedbackToElements(elements, options = {}) {
    elements.forEach((element) => {
      this.addFeedbackToElement(element, options);
    });
  }

  /**
   * 启用/禁用反馈类型
   * @param {string|string[]} types - 反馈类型
   * @param {boolean} enabled - 是否启用
   */
  setEnabled(types, enabled) {
    if (Array.isArray(types)) {
      types.forEach((type) => {
        this._setFeedbackEnabled(type, enabled);
      });
    } else {
      this._setFeedbackEnabled(types, enabled);
    }
  }

  /**
   * 设置反馈类型的启用状态
   * @param {string} type - 反馈类型
   * @param {boolean} enabled - 是否启用
   * @private
   */
  _setFeedbackEnabled(type, enabled) {
    switch (type) {
      case 'audio':
        this.audioEnabled = enabled;
        break;
      case 'haptic':
        this.hapticEnabled = enabled;
        break;
      case 'visual':
        // 视觉反馈始终启用
        break;
    }
  }

  /**
   * 清理资源
   */
  destroy() {
    // 清理音频上下文
    if (this.audioContext) {
      this.audioContext.close();
    }

    // 清理HID设备
    if (this.hapticDevice) {
      this.hapticDevice.close();
    }

    this.userActions = [];
  }
}

// 添加视觉反馈的CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes feedback-pulse {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  .feedback.visual-feedback {
    box-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
  }
  
  .feedback.visual-feedback.success {
    background: rgba(74, 222, 128, 0.5);
  }
  
  .feedback.visual-feedback.error {
    background: rgba(239, 68, 68, 0.5);
  }
  
  .feedback.visual-feedback.warning {
    background: rgba(245, 158, 11, 0.5);
  }
  
  .feedback.visual-feedback.info {
    background: rgba(59, 130, 246, 0.5);
  }
`;
document.head.appendChild(style);

export { MultiModalFeedback };
