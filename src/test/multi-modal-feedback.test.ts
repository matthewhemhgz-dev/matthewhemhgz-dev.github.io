/* eslint-disable no-unused-vars */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MultiModalFeedback } from '../scripts/multi-modal-feedback';

describe('MultiModalFeedback', () => {
  let feedback: MultiModalFeedback;
  let originalAudioContext: unknown;
  let originalVibrate: unknown;
  let originalHID: unknown;

  beforeEach(() => {
    // @ts-expect-error
    originalAudioContext = window.AudioContext || window.webkitAudioContext;
    originalVibrate = navigator.vibrate;
    // @ts-expect-error
    originalHID = navigator.hid;

    // 模拟音频上下文
    // @ts-expect-error
    window.AudioContext = class MockAudioContext {
      currentTime = 0;
      createOscillator() {
        return {
          type: 'sine',
          frequency: { value: 0, setValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        };
      }
      createGain() {
        return {
          gain: {
            value: 0,
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn()
          },
          connect: vi.fn(),
        };
      }
      resume() {
        return Promise.resolve();
      }
      close() {
        return Promise.resolve();
      }
      state = 'running';
      destination = {};
    };

    // 模拟振动功能
    navigator.vibrate = vi.fn();

    // 模拟HID
    navigator.hid = {
      requestDevice: vi.fn().mockResolvedValue([
        {
          open: vi.fn().mockResolvedValue(undefined),
          close: vi.fn().mockResolvedValue(undefined),
        },
      ]),
    };

    feedback = new MultiModalFeedback();
  });

  afterEach(() => {
    if (window.AudioContext) {
      // @ts-expect-error
      window.AudioContext = originalAudioContext;
    }
    // @ts-ignore
    if (window.webkitAudioContext) {
      // @ts-expect-error
      window.webkitAudioContext = originalAudioContext;
    }
    // @ts-expect-error
    navigator.vibrate = originalVibrate;
    // @ts-expect-error
    navigator.hid = originalHID;
    feedback.destroy();
  });

  it('构造函数正确初始化', () => {
    expect(feedback).toBeDefined();
  });

  it('triggerFeedback() 触发视觉反馈', () => {
    const originalCreateElement = document.createElement;
    let createdElement: HTMLElement | null = null;

    document.createElement = (tagName: string) => {
      if (tagName === 'div') {
        createdElement = originalCreateElement.call(document, tagName);
        return createdElement;
      }
      return originalCreateElement.call(document, tagName);
    };

    feedback.triggerFeedback('success', {
      intensity: 0.5,
      duration: 50,
    });

    expect(createdElement).not.toBeNull();
    if (createdElement) {
      expect(createdElement.className).toContain('visual-feedback');
      expect(createdElement.className).toContain('success');
    }

    document.createElement = originalCreateElement;
  });

  it('triggerFeedback() 触发听觉反馈', () => {
    feedback.triggerFeedback('key', {
      intensity: 0.5,
      frequency: 440,
      duration: 50,
    });
    // 这里可以添加更多断言，检查音频上下文的使用
  });

  it('triggerFeedback() 触发触觉反馈', () => {
    feedback.triggerFeedback('success', {
      intensity: 0.5,
      pattern: [50],
    });

    if (navigator.vibrate) {
      expect(navigator.vibrate).toHaveBeenCalledWith([50]);
    }
  });

  it('addFeedbackToElement() 为元素添加反馈事件', () => {
    const element = document.createElement('button');
    const addEventListenerSpy = vi.spyOn(element, 'addEventListener');

    feedback.addFeedbackToElement(element);

    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function));
  });

  it('addFeedbackToElements() 为多个元素添加反馈', () => {
    const element1 = document.createElement('button');
    const element2 = document.createElement('button');
    const elements = [element1, element2];

    const addFeedbackToElementSpy = vi.spyOn(feedback, 'addFeedbackToElement');

    feedback.addFeedbackToElements(elements);

    expect(addFeedbackToElementSpy).toHaveBeenCalledTimes(2);
  });

  it('setEnabled() 启用/禁用反馈类型', () => {
    feedback.setEnabled('audio', false);
    // 这里可以添加更多断言，检查状态是否正确更新
  });

  it('setEnabled() 批量启用/禁用反馈类型', () => {
    feedback.setEnabled(['audio', 'haptic'], false);
    // 这里可以添加更多断言，检查状态是否正确更新
  });

  it('destroy() 清理资源', () => {
    expect(() => feedback.destroy()).not.toThrow();
  });

  it('_getKeyFrequency() 返回正确的频率', () => {
    const frequency = (
      feedback as unknown as { _getKeyFrequency: (_key: string) => number }
    )._getKeyFrequency('a');
    expect(frequency).toBe(440);

    const defaultFrequency = (
      feedback as unknown as { _getKeyFrequency: (_key: string) => number }
    )._getKeyFrequency('1');
    expect(defaultFrequency).toBe(440);
  });

  it('_recordUserAction() 记录用户动作', () => {
    const event = {
      target: { tagName: 'BUTTON' },
      clientX: 100,
      clientY: 100,
    } as Event;

    (
      feedback as unknown as { _recordUserAction: (_type: string, _event: Event) => void }
    )._recordUserAction('click', event);

    // 这里可以添加更多断言，检查动作是否被正确记录
  });

  it('_predictUserBehavior() 预测用户行为', () => {
    // 模拟用户动作
    const event = {
      target: { tagName: 'BUTTON' },
      clientX: 100,
      clientY: 100,
    } as Event;

    // 添加足够的动作以触发预测
    for (let i = 0; i < 5; i++) {
      (
        feedback as unknown as { _recordUserAction: (_type: string, _event: Event) => void }
      )._recordUserAction('click', event);
    }

    // 这里可以添加更多断言，检查预测功能
  });
});
