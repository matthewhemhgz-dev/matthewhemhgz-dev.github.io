import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { marked } from 'marked';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft && data.lang === 'en')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const items = await Promise.all(
    posts.map(async (post) => {
      const body = post.body || '';
      const htmlContent = await marked(body);

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/en/blog/${post.id.replace('en/', '')}/`,
        categories: post.data.tags,
        content: htmlContent,
      };
    }),
  );

  return rss({
    title: 'Qi-Lab',
    description: 'Knowledge Management × Project Management × IT/AI Skills × Trends',
    site: context.site!,
    items,
    customData: '<language>en-US</language><atom:link href="' + context.site + 'en/rss.xml" rel="self" type="application/rss+xml"/>',
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      content: 'http://purl.org/rss/1.0/modules/content/',
    },
  });
}
