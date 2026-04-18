import { describe, it, expect } from 'vitest';
import { getReadingTime } from '../utils/reading-time';

describe('getReadingTime', () => {
  it('空字符串返回不足 1 分钟', () => {
    expect(getReadingTime('')).toBe('不足 1 分钟');
  });

  it('仅 frontmatter 返回不足 1 分钟', () => {
    expect(getReadingTime('---\ntitle: Test\n---\n')).toBe('不足 1 分钟');
  });

  it('短中文内容返回不足 1 分钟', () => {
    const short = '这是一段很短的文字。';
    expect(getReadingTime(short)).toBe('不足 1 分钟');
  });

  it('中文内容正确计算', () => {
    // 350 字 ≈ 1 分钟，700 字 ≈ 2 分钟
    const text = '测试文字'.repeat(200); // 800 字
    expect(getReadingTime(text)).toBe('3 分钟');
  });

  it('英文内容正确计算', () => {
    // 200 词 ≈ 1 分钟
    const words = Array(400).fill('word').join(' ');
    expect(getReadingTime(words)).toBe('2 分钟');
  });

  it('混合中英文内容正确计算', () => {
    const mixed = '这是一段中文测试内容。'.repeat(50) + ' ' + Array(100).fill('english').join(' ');
    const result = getReadingTime(mixed);
    expect(result).toMatch(/^\d+ 分钟$/);
  });

  it('忽略代码块内容', () => {
    const withCode = '```javascript\n' + 'const x = "hello";\n'.repeat(100) + '```\n这是一段文字。';
    expect(getReadingTime(withCode)).toBe('不足 1 分钟');
  });

  it('忽略图片语法', () => {
    const withImages = '![alt](image.png)'.repeat(50) + '正常文字内容。';
    expect(getReadingTime(withImages)).toBe('不足 1 分钟');
  });

  it('链接保留文本计算', () => {
    const withLinks = '[这是一段链接文字](https://example.com)';
    const result = getReadingTime(withLinks);
    expect(result).toBe('不足 1 分钟');
  });

  it('移除 Markdown 标记符号', () => {
    const markdown = '# **加粗** _斜体_ ~~删除线~~ 正文内容'.repeat(50);
    const result = getReadingTime(markdown);
    expect(result).toMatch(/^\d+ 分钟$/);
  });
});
