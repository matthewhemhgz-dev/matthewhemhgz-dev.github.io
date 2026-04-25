/**
 * 环境感知系统
 * 基于时间、季节、设备性能、电池状态等因素调整应用行为
 * @class EnvironmentAware
 */
class EnvironmentAware {
  /**
   * @typedef {Object} TimeData
   * @property {number} hour - 小时
   * @property {number} minute - 分钟
   * @property {number} second - 秒
   * @property {number} dayOfWeek - 星期几
   * @property {number} month - 月份
   * @property {string} season - 季节 (spring, summer, autumn, winter)
   */

  /**
   * @typedef {Object} WeatherData
   * @property {string} type - 天气类型 (sunny, cloudy, rainy, snowy)
   * @property {number} temperature - 温度（摄氏度）
   * @property {number} humidity - 湿度（百分比）
   * @property {number} windSpeed - 风速（公里/小时）
   */

  /**
   * @typedef {Object} BatteryStatus
   * @property {number} level - 电池电量（0-1）
   * @property {boolean} charging - 是否正在充电
   */

  /**
   * @typedef {Object} DeviceData
   * @property {boolean} isMobile - 是否是移动设备
   * @property {boolean} isTablet - 是否是平板设备
   * @property {boolean} isDesktop - 是否是桌面设备
   * @property {string} performance - 性能等级 (high, medium, low)
   * @property {BatteryStatus} battery - 电池状态
   */

  /**
   * @typedef {Object} UserData
   * @property {boolean} prefersReducedMotion - 是否偏好减少动画
   * @property {boolean} prefersDarkMode - 是否偏好深色模式
   */

  /**
   * @typedef {Object} EnvironmentData
   * @property {TimeData} time - 时间数据
   * @property {WeatherData} weather - 天气数据
   * @property {DeviceData} device - 设备数据
   * @property {UserData} user - 用户数据
   */

  /**
   * @typedef {Object} MotionParams
   * @property {number} speed - 动效速度
   * @property {number} intensity - 动效强度
   * @property {number} complexity - 动效复杂度
   */

  /**
   * @typedef {Object} ColorScheme
   * @property {string} primary - 主色
   * @property {string} secondary - 次色
   * @property {string} accent - 强调色
   * @property {string} background - 背景色
   * @property {string} text - 文本色
   */

  constructor() {
    /** @type {EnvironmentData} */
    this.environment = {
      time: {
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        second: new Date().getSeconds(),
        dayOfWeek: new Date().getDay(),
        month: new Date().getMonth(),
        season: this._getSeason(),
      },
      weather: {
        type: 'sunny', // sunny, cloudy, rainy, snowy
        temperature: 22, // Celsius
        humidity: 60, // percentage
        windSpeed: 5, // km/h
      },
      device: {
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024,
        performance: this._getPerformanceLevel(),
        battery: this._getBatteryStatus(),
      },
      user: {
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      },
    };

    /** @type {Function[]} */
    this.callbacks = [];
    /** @type {number|null} */
    this.updateInterval = null;

    this.initialize();
  }

  /**
   * 初始化环境感知系统
   */
  initialize() {
    // 监听设备性能变化
    this._listenToPerformanceChanges();
    // 监听电池状态变化
    this._listenToBatteryChanges();
    // 监听用户偏好变化
    this._listenToUserPreferences();
    // 开始定期更新
    this.startUpdates();
  }

  /**
   * 获取当前季节
   * @returns {string} 季节 (spring, summer, autumn, winter)
   * @private
   */
  _getSeason() {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  /**
   * 获取设备性能等级
   * @returns {string} 性能等级 (high, medium, low)
   * @private
   */
  _getPerformanceLevel() {
    // 基于设备性能的简单评估
    const score = performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd || 1000;
    if (score < 500) return 'high';
    if (score < 1500) return 'medium';
    return 'low';
  }

  /**
   * 获取电池状态
   * @returns {BatteryStatus} 电池状态
   * @private
   */
  _getBatteryStatus() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        this.environment.device.battery = {
          level: battery.level,
          charging: battery.charging,
        };
      });
    }
    return { level: 1, charging: true };
  }

  /**
   * 监听设备性能变化
   * @private
   */
  _listenToPerformanceChanges() {
    // 监听性能变化
    window.addEventListener('resize', () => {
      this.environment.device.isMobile = window.innerWidth < 768;
      this.environment.device.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      this.environment.device.isDesktop = window.innerWidth >= 1024;
      this.environment.device.performance = this._getPerformanceLevel();
      this._notifyCallbacks();
    });
  }

  /**
   * 监听电池状态变化
   * @private
   */
  _listenToBatteryChanges() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        battery.addEventListener('levelchange', () => {
          this.environment.device.battery.level = battery.level;
          this._notifyCallbacks();
        });
        battery.addEventListener('chargingchange', () => {
          this.environment.device.battery.charging = battery.charging;
          this._notifyCallbacks();
        });
      });
    }
  }

  /**
   * 监听用户偏好变化
   * @private
   */
  _listenToUserPreferences() {
    // 监听用户偏好变化
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.environment.user.prefersReducedMotion = e.matches;
      this._notifyCallbacks();
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.environment.user.prefersDarkMode = e.matches;
      this._notifyCallbacks();
    });
  }

  /**
   * 开始定期更新环境数据
   */
  startUpdates() {
    // 每分钟更新一次时间
    this.updateInterval = setInterval(() => {
      this.environment.time = {
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
        second: new Date().getSeconds(),
        dayOfWeek: new Date().getDay(),
        month: new Date().getMonth(),
        season: this._getSeason(),
      };
      this._notifyCallbacks();
    }, 60000);
  }

  /**
   * 停止定期更新环境数据
   */
  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * 通知所有回调函数
   * @private
   */
  _notifyCallbacks() {
    this.callbacks.forEach((callback) => {
      callback(this.environment);
    });
  }

  /**
   * 添加环境更新回调
   * @param {Function} callback - 回调函数
   */
  onUpdate(callback) {
    this.callbacks.push(callback);
  }

  /**
   * 获取当前环境数据
   * @returns {EnvironmentData} 环境数据
   */
  getEnvironment() {
    return this.environment;
  }

  /**
   * 获取基于环境的动效参数
   * @returns {MotionParams} 动效参数
   */
  getMotionParams() {
    const { time, device, user, weather } = this.environment;

    // 基础参数
    let params = {
      speed: 1,
      intensity: 1,
      complexity: 1,
    };

    // 根据时间调整
    if (time.hour >= 22 || time.hour < 6) {
      // 夜间 - 减少动效
      params.speed *= 0.7;
      params.intensity *= 0.5;
    } else if (time.hour >= 6 && time.hour < 9) {
      // 早晨 - 中等动效
      params.speed *= 0.8;
      params.intensity *= 0.8;
    } else if (time.hour >= 9 && time.hour < 18) {
      // 白天 - 正常动效
      params.speed *= 1;
      params.intensity *= 1;
    } else {
      // 傍晚 - 稍微减少动效
      params.speed *= 0.9;
      params.intensity *= 0.9;
    }

    // 根据季节调整
    switch (time.season) {
      case 'spring':
        params.intensity *= 1.1;
        break;
      case 'summer':
        params.intensity *= 1.2;
        break;
      case 'autumn':
        params.intensity *= 0.9;
        break;
      case 'winter':
        params.intensity *= 0.8;
        break;
    }

    // 根据天气调整
    switch (weather.type) {
      case 'sunny':
        params.intensity *= 1.1;
        break;
      case 'cloudy':
        params.intensity *= 0.9;
        break;
      case 'rainy':
        params.intensity *= 0.7;
        params.speed *= 0.8;
        break;
      case 'snowy':
        params.intensity *= 0.6;
        params.speed *= 0.7;
        break;
    }

    // 根据设备性能调整
    switch (device.performance) {
      case 'high':
        params.complexity *= 1.2;
        break;
      case 'medium':
        params.complexity *= 1;
        break;
      case 'low':
        params.complexity *= 0.7;
        params.speed *= 0.8;
        params.intensity *= 0.8;
        break;
    }

    // 根据设备类型调整
    if (device.isMobile) {
      params.complexity *= 0.6;
      params.speed *= 0.8;
    } else if (device.isTablet) {
      params.complexity *= 0.8;
      params.speed *= 0.9;
    }

    // 根据电池状态调整
    if (device.battery && device.battery.level < 0.2 && !device.battery.charging) {
      params.complexity *= 0.5;
      params.intensity *= 0.5;
      params.speed *= 0.7;
    }

    // 根据用户偏好调整
    if (user.prefersReducedMotion) {
      params.complexity *= 0.3;
      params.intensity *= 0.3;
      params.speed *= 0.5;
    }

    return params;
  }

  /**
   * 获取基于环境的颜色方案
   * @returns {ColorScheme} 颜色方案
   */
  getColorScheme() {
    const { time, weather, user } = this.environment;

    // 基础颜色方案
    let scheme = {
      primary: '#4ade80',
      secondary: '#fbbf24',
      accent: '#a7f3d0',
      background: '#ffffff',
      text: '#1e1b18',
    };

    // 根据时间调整
    if (time.hour >= 22 || time.hour < 6) {
      // 夜间模式
      scheme.background = '#1e1b18';
      scheme.text = '#e8e3dd';
      scheme.primary = '#34d399';
      scheme.secondary = '#f59e0b';
      scheme.accent = '#6ee7b7';
    } else if (time.hour >= 6 && time.hour < 9) {
      // 早晨模式
      scheme.background = '#fefce8';
      scheme.text = '#1e1b18';
      scheme.primary = '#4ade80';
      scheme.secondary = '#fbbf24';
      scheme.accent = '#a7f3d0';
    } else if (time.hour >= 9 && time.hour < 18) {
      // 白天模式
      scheme.background = '#ffffff';
      scheme.text = '#1e1b18';
      scheme.primary = '#4ade80';
      scheme.secondary = '#fbbf24';
      scheme.accent = '#a7f3d0';
    } else {
      // 傍晚模式
      scheme.background = '#fef3c7';
      scheme.text = '#78350f';
      scheme.primary = '#34d399';
      scheme.secondary = '#d97706';
      scheme.accent = '#6ee7b7';
    }

    // 根据天气调整
    switch (weather.type) {
      case 'sunny':
        scheme.primary = '#4ade80';
        scheme.secondary = '#fbbf24';
        break;
      case 'cloudy':
        scheme.primary = '#94a3b8';
        scheme.secondary = '#cbd5e1';
        break;
      case 'rainy':
        scheme.primary = '#64748b';
        scheme.secondary = '#94a3b8';
        break;
      case 'snowy':
        scheme.primary = '#e2e8f0';
        scheme.secondary = '#cbd5e1';
        break;
    }

    // 根据用户偏好调整
    if (user.prefersDarkMode && time.hour < 22 && time.hour >= 6) {
      scheme.background = '#1e1b18';
      scheme.text = '#e8e3dd';
      scheme.primary = '#34d399';
      scheme.secondary = '#f59e0b';
      scheme.accent = '#6ee7b7';
    }

    return scheme;
  }

  /**
   * 获取基于环境的流体效果类型
   * @returns {string} 流体类型 (wave, default, vortex, fountain)
   */
  getFluidType() {
    const { time, weather } = this.environment;

    // 根据时间和天气选择流体类型
    if (weather.type === 'sunny') {
      return 'wave';
    } else if (weather.type === 'cloudy') {
      return 'default';
    } else if (weather.type === 'rainy') {
      return 'vortex';
    } else if (weather.type === 'snowy') {
      return 'fountain';
    }

    // 根据时间选择
    if (time.hour >= 22 || time.hour < 6) {
      return 'vortex';
    } else if (time.hour >= 6 && time.hour < 9) {
      return 'wave';
    } else if (time.hour >= 9 && time.hour < 18) {
      return 'default';
    } else {
      return 'fountain';
    }
  }

  /**
   * 模拟天气数据（实际应用中应该从API获取）
   * @param {Partial<WeatherData>} weather - 天气数据
   */
  setWeather(weather) {
    this.environment.weather = { ...this.environment.weather, ...weather };
    this._notifyCallbacks();
  }

  /**
   * 清理资源
   */
  destroy() {
    this.stopUpdates();
    this.callbacks = [];
  }
}

export { EnvironmentAware };
