import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EnvironmentAware } from '../scripts/environment-aware';

describe('EnvironmentAware', () => {
  let environmentAware: EnvironmentAware;
  let originalMatchMedia: typeof window.matchMedia;
  let originalDate: DateConstructor;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    originalDate = global.Date;
    environmentAware = new EnvironmentAware();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    global.Date = originalDate;
    environmentAware.destroy();
  });

  function mockMatchMedia(matches: boolean, query: string) {
    window.matchMedia = (q: string): MediaQueryList => ({
      matches: q === query ? matches : false,
      media: q,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  it('构造函数正确初始化环境数据', () => {
    const env = environmentAware.getEnvironment();
    expect(env).toHaveProperty('time');
    expect(env).toHaveProperty('weather');
    expect(env).toHaveProperty('device');
    expect(env).toHaveProperty('user');
  });

  it('getEnvironment() 返回当前环境数据', () => {
    const env1 = environmentAware.getEnvironment();
    const env2 = environmentAware.getEnvironment();
    expect(env1).toEqual(env2);
  });

  it('getMotionParams() 返回合理的动效参数', () => {
    const params = environmentAware.getMotionParams();
    expect(params).toHaveProperty('speed');
    expect(params).toHaveProperty('intensity');
    expect(params).toHaveProperty('complexity');
    expect(params.speed).toBeGreaterThan(0);
    expect(params.intensity).toBeGreaterThan(0);
    expect(params.complexity).toBeGreaterThan(0);
  });

  it('getColorScheme() 返回颜色方案', () => {
    const scheme = environmentAware.getColorScheme();
    expect(scheme).toHaveProperty('primary');
    expect(scheme).toHaveProperty('secondary');
    expect(scheme).toHaveProperty('accent');
    expect(scheme).toHaveProperty('background');
    expect(scheme).toHaveProperty('text');
  });

  it('getFluidType() 返回流体类型', () => {
    const fluidType = environmentAware.getFluidType();
    expect(['wave', 'default', 'vortex', 'fountain']).toContain(fluidType);
  });

  it('setWeather() 更新天气数据', () => {
    const newWeather = {
      type: 'rainy',
      temperature: 15,
      humidity: 80,
      windSpeed: 10,
    };
    environmentAware.setWeather(newWeather);
    const env = environmentAware.getEnvironment();
    expect(env.weather.type).toBe('rainy');
    expect(env.weather.temperature).toBe(15);
  });

  it('getMotionParams() 考虑用户偏好减少动画', () => {
    mockMatchMedia(true, '(prefers-reduced-motion: reduce)');
    const newEnv = new EnvironmentAware();
    const params = newEnv.getMotionParams();
    expect(params.complexity).toBeLessThan(0.5);
    expect(params.intensity).toBeLessThan(0.5);
    expect(params.speed).toBeLessThan(0.6);
    newEnv.destroy();
  });

  it('getColorScheme() 考虑用户偏好深色模式', () => {
    mockMatchMedia(true, '(prefers-color-scheme: dark)');
    const newEnv = new EnvironmentAware();
    const scheme = newEnv.getColorScheme();
    // 深色模式下背景色应该较深
    expect(scheme.background).toBe('#1e1b18');
    expect(scheme.text).toBe('#e8e3dd');
    newEnv.destroy();
  });

  it('getFluidType() 根据天气返回不同类型', () => {
    const newEnv = new EnvironmentAware();
    newEnv.setWeather({ type: 'sunny' });
    expect(newEnv.getFluidType()).toBe('wave');
    newEnv.setWeather({ type: 'cloudy' });
    expect(newEnv.getFluidType()).toBe('default');
    newEnv.setWeather({ type: 'rainy' });
    expect(newEnv.getFluidType()).toBe('vortex');
    newEnv.setWeather({ type: 'snowy' });
    expect(newEnv.getFluidType()).toBe('fountain');
    newEnv.destroy();
  });

  it('onUpdate() 添加回调函数', () => {
    let called = false;
    let receivedEnv: unknown = null;

    environmentAware.onUpdate((env) => {
      called = true;
      receivedEnv = env;
    });

    // 触发更新（通过设置天气）
    environmentAware.setWeather({ type: 'sunny' });

    expect(called).toBe(true);
    expect(receivedEnv).not.toBeNull();
  });

  it('destroy() 清理资源', () => {
    expect(() => environmentAware.destroy()).not.toThrow();
  });
});
