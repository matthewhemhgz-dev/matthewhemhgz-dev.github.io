import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft && data.lang === 'zh')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: '祈研所 Qi-Lab',
    description: '知识管理 × 项目管理 × IT/AI 技巧 × 八卦前沿',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id.replace('zh/', '')}/`,
      categories: post.data.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
}
