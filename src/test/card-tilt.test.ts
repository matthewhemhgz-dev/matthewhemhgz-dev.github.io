import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CardTilt } from '../scripts/card-tilt';

describe('CardTilt', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    document.body.innerHTML = '';
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  function mockFinePointer(matches: boolean) {
    window.matchMedia = (query: string): MediaQueryList => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  it('构造函数在非精细指针设备上不绑定事件', () => {
    mockFinePointer(false);

    const card = document.createElement('div');
    card.classList.add('tilt-card');
    document.body.appendChild(card);

    const tilt = new CardTilt('.tilt-card');
    expect(tilt.elements).toHaveLength(0);
  });

  it('构造函数在精细指针设备上绑定事件', () => {
    mockFinePointer(true);

    const card = document.createElement('div');
    card.classList.add('tilt-card');
    document.body.appendChild(card);

    const tilt = new CardTilt('.tilt-card');
    expect(tilt.elements).toHaveLength(1);
  });

  it('destroy() 清理所有事件监听', () => {
    mockFinePointer(true);

    const card = document.createElement('div');
    card.classList.add('tilt-card');
    document.body.appendChild(card);

    const tilt = new CardTilt('.tilt-card');
    expect(tilt.elements).toHaveLength(1);

    tilt.destroy();
    expect(tilt.elements).toHaveLength(0);
    expect(tilt._handlers.size).toBe(0);
  });

  it('destroy() 在空元素上不报错', () => {
    mockFinePointer(true);
    const tilt = new CardTilt('.nonexistent');
    expect(() => tilt.destroy()).not.toThrow();
  });

  it('_getPerspective 返回不小于 800 的值', () => {
    mockFinePointer(true);

    const card = document.createElement('div');
    card.classList.add('tilt-card');
    document.body.appendChild(card);

    const tilt = new CardTilt('.tilt-card');
    const perspective = tilt._getPerspective(card);
    expect(perspective).toBeGreaterThanOrEqual(800);
  });
});
