// jsdom 环境下补充 DOM API polyfill
if (typeof globalThis.HTMLElement === 'undefined') {
  // @ts-expect-error — jsdom should provide this, but guard against edge cases
  globalThis.HTMLElement = class HTMLElement extends Element {};
}

// matchMedia polyfill (jsdom 不支持)
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
