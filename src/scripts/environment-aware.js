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

    /** @type {number} */
    this.globalEnergy = 0.5; // E(t) \in [0.0, 1.0]

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
    this._calculateEnergyState(); // initial calc
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
      this._calculateEnergyState();
      this._notifyCallbacks();
    }, 60000);
  }

  /**
   * 计算全局热力学能量场 (Thermodynamic Energy Field E)
   * E(t) = 0.5 + 0.5 * sin(pi * (t - 6) / 12)
   * 结果: 12:00PM = 1.0 星高能量; 0:00AM = 0.0 最低能量
   */
  _calculateEnergyState() {
    const t = this.environment.time.hour + this.environment.time.minute / 60;
    // 映射到正弦曲线参数
    const energy = 0.5 + 0.5 * Math.sin((Math.PI * (t - 6)) / 12);

    // 叠加天气因子 (云阻挡能量)
    const weatherFactor = { sunny: 1.0, cloudy: 0.7, rainy: 0.5, snowy: 0.4 };
    const w = weatherFactor[this.environment.weather.type] || 1.0;

    // 平滑处理并存储
    this.globalEnergy = Math.max(0.1, Math.min(1.0, energy * w));

    // 反射全局能量场到 CSS Variables
    const root = document.documentElement;
    root.style.setProperty('--env-energy', this.globalEnergy.toFixed(3));
    // 粒子/流体参数映射
    root.style.setProperty('--env-particle-speed', (0.3 + this.globalEnergy * 0.7).toFixed(3));
    root.style.setProperty('--env-fluid-viscosity', (1.0 - this.globalEnergy * 0.6).toFixed(3));
    root.style.setProperty('--env-saturation-boost', (0.8 + this.globalEnergy * 0.4).toFixed(2));
    root.style.setProperty('--env-glow-intensity', (0.2 + this.globalEnergy * 0.8).toFixed(3));
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
    const { device, user } = this.environment;
    const E = this.globalEnergy;

    // 基于连续能量场的动效参数计算
    let params = {
      speed: 0.4 + E * 0.6, // [0.4, 1.0]
      intensity: 0.3 + E * 0.7, // [0.3, 1.0]
      complexity: 0.5 + E * 0.5, // [0.5, 1.0]
    };

    // 设备性能约束
    const perfMultiplier = { high: 1.0, medium: 0.85, low: 0.6 };
    const pf = perfMultiplier[device.performance] || 0.85;
    params.complexity *= pf;
    if (pf < 0.7) {
      params.speed *= 0.85;
      params.intensity *= 0.8;
    }

    // 移动设备约束
    if (device.isMobile) {
      params.complexity *= 0.6;
      params.speed *= 0.8;
    } else if (device.isTablet) {
      params.complexity *= 0.8;
    }

    // 电池状态约束
    if (device.battery && device.battery.level < 0.2 && !device.battery.charging) {
      params.complexity *= 0.5;
      params.intensity *= 0.5;
      params.speed *= 0.7;
    }

    // 用户偏好约束 (prefersReducedMotion)
    if (user.prefersReducedMotion) {
      params.complexity *= 0.3;
      params.intensity *= 0.3;
      params.speed *= 0.5;
    }

    return params;
  }

  /**
   * 获取基于环境的颜色方案
   * 不再硬编码 HEX，而是基于真实 CSS Token 提供参数指导，并在需要时混入偏离值
   */
  getColorScheme() {
    // 提供给 GenerativeArt 或其他需要的组件计算参考，实际颜色读取 DOM 计算样式
    return {
      energy: this.globalEnergy,
      // We let external scripts read computed properties natively where possible
      isLowEnergy: this.globalEnergy < 0.35,
      isHighEnergy: this.globalEnergy > 0.8,
    };
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
