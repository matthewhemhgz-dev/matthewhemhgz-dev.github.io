import { describe, it, expect } from 'vitest';

// 生成响应式尺寸数组
function getResponsiveWidths(baseWidth: number, widths?: number[]): number[] {
  if (widths && widths.length > 0) return widths;
  const steps = [0.5, 0.75, 1, 1.25, 1.5, 2];
  return steps.map(step => Math.round(baseWidth * step)).filter(w => w <= 2048);
}

// 判断图片类型
function isExternalImage(src: string | { src?: string }): boolean {
  const srcString = typeof src === 'string' ? src : src.src || '';
  return typeof srcString === 'string' && (srcString.startsWith('http') || srcString.startsWith('//'));
}

function isPublicImage(src: string | { src?: string }): boolean {
  const srcString = typeof src === 'string' ? src : src.src || '';
  return typeof srcString === 'string' && (srcString.startsWith('/') || srcString.includes('public/') || srcString.includes('public\\'));
}

describe('OptimizedImage Component', () => {
  describe('getResponsiveWidths 函数', () => {
    it('生成默认响应式尺寸数组', () => {
      const widths = getResponsiveWidths(800);
      expect(widths).toEqual([400, 600, 800, 1000, 1200, 1600]);
    });

    it('使用自定义宽度数组', () => {
      const customWidths = [320, 640, 1280];
      const widths = getResponsiveWidths(800, customWidths);
      expect(widths).toEqual(customWidths);
    });

    it('限制最大宽度为 2048', () => {
      const widths = getResponsiveWidths(1500);
      expect(widths).toEqual([750, 1125, 1500, 1875]);
    });

    it('小尺寸图片生成合适的宽度', () => {
      const widths = getResponsiveWidths(300);
      expect(widths).toEqual([150, 225, 300, 375, 450, 600]);
    });

    it('边界情况：刚好 2048', () => {
      const widths = getResponsiveWidths(1024);
      expect(widths).toEqual([512, 768, 1024, 1280, 1536, 2048]);
    });
  });

  describe('图片类型判断', () => {
    it('外部图片判断 - http 开头', () => {
      expect(isExternalImage('https://example.com/image.jpg')).toBe(true);
      expect(isExternalImage('http://example.com/image.png')).toBe(true);
    });

    it('外部图片判断 - // 开头', () => {
      expect(isExternalImage('//example.com/image.jpg')).toBe(true);
    });

    it('外部图片判断 - 非外部图片', () => {
      expect(isExternalImage('/images/test.jpg')).toBe(false);
      expect(isExternalImage('public/images/test.png')).toBe(false);
    });

    it('public 目录图片判断', () => {
      expect(isPublicImage('/images/test.jpg')).toBe(true);
      expect(isPublicImage('public/images/test.png')).toBe(true);
      expect(isPublicImage('public\\images\\test.png')).toBe(true);
    });

    it('public 目录图片判断 - 非 public 图片', () => {
      expect(isPublicImage('https://example.com/image.jpg')).toBe(false);
      expect(isPublicImage('src/assets/image.png')).toBe(false);
    });

    it('对象类型的 src', () => {
      expect(isExternalImage({ src: 'https://example.com/image.jpg' })).toBe(true);
      expect(isPublicImage({ src: '/images/test.jpg' })).toBe(true);
    });
  });

  describe('public 路径处理', () => {
    it('去除 public/ 前缀', () => {
      const src = 'public/images/test.jpg';
      const processed = src.replace('public/', '/').replace('public\\', '/').replace(/\\/g, '/');
      expect(processed).toBe('/images/test.jpg');
    });

    it('Windows 路径格式', () => {
      const src = 'public\\images\\test.jpg';
      const processed = src.replace('public/', '/').replace('public\\', '/').replace(/\\/g, '/');
      expect(processed).toBe('/images/test.jpg');
    });

    it('已经是根路径的不处理', () => {
      const src = '/images/test.jpg';
      const processed = src.replace('public/', '/').replace('public\\', '/').replace(/\\/g, '/');
      expect(processed).toBe('/images/test.jpg');
    });
  });
});