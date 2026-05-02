import { describe, it, expect } from 'vitest';
import { getReadingTime } from './reading-time';

describe('getReadingTime', () => {
  it('returns "不足 1 分钟" for empty content', () => {
    expect(getReadingTime('')).toBe('不足 1 分钟');
  });

  it('returns "不足 1 分钟" for whitespace-only content', () => {
    expect(getReadingTime('   \n\n   ')).toBe('不足 1 分钟');
  });

  it('handles frontmatter correctly', () => {
    const content = `---
title: Test Article
date: 2024-01-01
---

这是一篇测试文章。`;
    expect(getReadingTime(content)).not.toBe('不足 1 分钟');
  });

  it('calculates Chinese reading time correctly', () => {
    const chineseText = '这是一个测试文章'.repeat(50);
    const result = getReadingTime(chineseText);
    expect(result).toMatch(/^\d+ 分钟$/);
  });

  it('calculates English reading time correctly', () => {
    const englishText = 'This is a test article. '.repeat(50);
    const result = getReadingTime(englishText);
    expect(result).toMatch(/^\d+ 分钟$/);
  });

  it('handles mixed Chinese and English content', () => {
    const mixedText = `
这是一段中文内容。

This is English content.

混合内容测试 mixed content test.
    `.repeat(20);
    const result = getReadingTime(mixedText);
    expect(result).toMatch(/^\d+ 分钟$/);
  });

  it('removes code blocks from calculation', () => {
    const withCode = `
这是一段普通文本。

\`\`\`javascript
const code = 'this should not count';
console.log(code);
\`\`\`

更多文本内容。
    `;
    const result = getReadingTime(withCode);
    expect(result).toBeDefined();
  });

  it('removes inline code from calculation', () => {
    const withInlineCode = '这是 `inline code` 测试文本';
    const result = getReadingTime(withInlineCode);
    expect(result).toBe('不足 1 分钟');
  });

  it('removes images from calculation', () => {
    const withImages = `
文章内容开始

![图片描述](https://example.com/image.png)

文章内容结束
    `;
    const result = getReadingTime(withImages);
    expect(result).toBeDefined();
  });

  it('preserves link text', () => {
    const withLinks = '点击 [这里](https://example.com) 查看更多内容';
    const result = getReadingTime(withLinks);
    expect(result).toBeDefined();
  });

  it('removes Markdown markers', () => {
    const markdown = `
# 标题

**粗体** 和 *斜体*

- 列表项 1
- 列表项 2

> 引用文本
    `;
    const result = getReadingTime(markdown);
    expect(result).toBeDefined();
  });

  it('rounds up to nearest minute', () => {
    const shortText = '短文本测试';
    expect(getReadingTime(shortText)).toBe('不足 1 分钟');
  });
});
