/**
 * 计算文章阅读时间
 *
 * 中文阅读速度：~350 字/分钟（含标点）
 * 英文阅读速度：~200 词/分钟
 * 混合内容取加权平均
 *
 * @param body - Markdown 原始内容
 * @returns 格式化的阅读时间字符串，如 "3 分钟" 或 "不足 1 分钟"
 */
export function getReadingTime(body: string): string {
  // 移除 frontmatter 和 Markdown 语法
  const cleanBody = body
    .replace(/^---[\s\S]*?---/, '') // frontmatter
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/`[^`]+`/g, '') // 行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // 链接保留文本
    .replace(/[#*_~>|`-]/g, '') // Markdown 标记符号
    .trim();

  if (!cleanBody) return '不足 1 分钟';

  // 统计中文字符数（CJK 统一汉字）
  const chineseChars = (cleanBody.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;

  // 统计英文单词数
  const englishWords = (cleanBody.match(/[a-zA-Z]+/g) || []).length;

  // 加权计算：中文 350 字/分钟，英文 200 词/分钟
  const minutes = chineseChars / 350 + englishWords / 200;

  if (minutes < 1) return '不足 1 分钟';

  // 向上取整
  const rounded = Math.ceil(minutes);
  return `${rounded} 分钟`;
}
