class MultiModalFeedback {
  constructor() {
    this.audioContext = null;
    this.audioEnabled = false;
    this.hapticEnabled = false;
    this.hapticDevice = null;
    this.userActions = [];
    this.actionThreshold = 5; // 收集多少个动作后开始预测
    
    this.initialize();
  }

  initialize() {
    // 初始化音频上下文
    this._initializeAudio();
    // 初始化触觉反馈
    this._initializeHaptic();
    // 监听用户交互
    this._listenToUserActions();
  }

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

  async _requestHIDAccess() {
    try {
      const devices = await navigator.hid.requestDevice({
        filters: [{ usagePage: 0x01, usage: 0x05 }] // 通用输入设备
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

  _listenToUserActions() {
    // 监听用户交互动作
    const actionTypes = ['click', 'touchstart', 'keydown', 'scroll', 'mouseover'];
    
    actionTypes.forEach((type) => {
      document.addEventListener(type, (e) => {
        this._recordUserAction(type, e);
      });
    });
  }

  _recordUserAction(type, event) {
    // 记录用户动作
    const action = {
      type,
      timestamp: Date.now(),
      target: event.target.tagName,
      coordinates: type === 'click' || type === 'touchstart' ? {
        x: event.clientX || event.touches[0]?.clientX,
        y: event.clientY || event.touches[0]?.clientY
      } : null,
      key: type === 'keydown' ? event.key : null
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

  _triggerFeedback(type, event) {
    // 根据动作类型触发不同的反馈
    switch (type) {
      case 'click':
      case 'touchstart':
        this.triggerFeedback('success', {
          intensity: 0.7,
          duration: 50
        });
        break;
      case 'keydown':
        this.triggerFeedback('key', {
          intensity: 0.3,
          duration: 30,
          frequency: this._getKeyFrequency(event.key)
        });
        break;
      case 'scroll':
        // 滚动时不触发反馈，避免过于频繁
        break;
      case 'mouseover':
        this.triggerFeedback('hover', {
          intensity: 0.2,
          duration: 20
        });
        break;
    }
  }

  _getKeyFrequency(key) {
    // 根据按键生成不同的频率
    const keyFrequencies = {
      'a': 440, 'b': 494, 'c': 523, 'd': 587, 'e': 659, 'f': 698, 'g': 784,
      'h': 880, 'i': 988, 'j': 1047, 'k': 1175, 'l': 1319, 'm': 1397, 'n': 1568,
      'o': 1760, 'p': 1976, 'q': 2217, 'r': 2489, 's': 2637, 't': 2960, 'u': 3136,
      'v': 3520, 'w': 3951, 'x': 4435, 'y': 4978, 'z': 5274
    };
    
    return keyFrequencies[key.toLowerCase()] || 440;
  }

  // 触发多模态反馈
  triggerFeedback(type, options = {}) {
    const {
      intensity = 0.5,
      duration = 50,
      frequency = 440,
      pattern = [duration]
    } = options;
    
    // 触发视觉反馈
    this._triggerVisualFeedback(type, options);
    
    // 触发听觉反馈
    if (this.audioEnabled) {
      this._triggerAudioFeedback(type, {
        intensity,
        frequency,
        duration
      });
    }
    
    // 触发触觉反馈
    if (this.hapticEnabled) {
      this._triggerHapticFeedback(type, {
        intensity,
        pattern
      });
    }
  }

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

  _triggerAudioFeedback(type, options) {
    const { intensity, frequency, duration } = options;
    
    try {
      // 创建音频上下文
      if (!this.audioContext) {
        this._initializeAudio();
      }
      
      if (!this.audioContext) return;
      
      // 恢复音频上下文（如果被暂停）
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // 创建振荡器
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // 设置参数
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = intensity * 0.3;
      
      // 连接节点
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 启动和停止
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, duration);
    } catch (error) {
      console.warn('Audio feedback error:', error);
    }
  }

  _triggerHapticFeedback(type, options) {
    const { intensity, pattern } = options;
    
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
    const mostFrequentAction = Object.entries(actionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    
    if (mostFrequentAction) {
      this._providePredictiveFeedback(mostFrequentAction);
    }
  }

  _providePredictiveFeedback(predictedAction) {
    // 根据预测的动作提供提前反馈
    console.log('Predicted action:', predictedAction);
    
    // 这里可以根据预测的动作提供相应的反馈
    // 例如，如果预测用户会点击某个按钮，可以提前高亮该按钮
  }

  // 为特定UI元素添加反馈
  addFeedbackToElement(element, options = {}) {
    const {
      hover = true,
      click = true,
      focus = true,
      feedbackType = 'default'
    } = options;
    
    if (hover) {
      element.addEventListener('mouseenter', () => {
        this.triggerFeedback('hover', {
          intensity: 0.2,
          duration: 20
        });
      });
    }
    
    if (click) {
      element.addEventListener('click', () => {
        this.triggerFeedback('success', {
          intensity: 0.7,
          duration: 50
        });
      });
    }
    
    if (focus) {
      element.addEventListener('focus', () => {
        this.triggerFeedback('focus', {
          intensity: 0.3,
          duration: 30
        });
      });
    }
  }

  // 批量为多个元素添加反馈
  addFeedbackToElements(elements, options = {}) {
    elements.forEach((element) => {
      this.addFeedbackToElement(element, options);
    });
  }

  // 启用/禁用反馈类型
  setEnabled(types, enabled) {
    if (Array.isArray(types)) {
      types.forEach((type) => {
        this._setFeedbackEnabled(type, enabled);
      });
    } else {
      this._setFeedbackEnabled(types, enabled);
    }
  }

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

  // 清理
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