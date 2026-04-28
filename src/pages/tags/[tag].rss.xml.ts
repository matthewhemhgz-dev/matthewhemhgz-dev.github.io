import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function getStaticPaths() {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft && data.lang === 'zh');
  const allTags = [...new Set(allPosts.flatMap((post) => post.data.tags))];
  return allTags.map((tag) => ({ params: { tag } }));
}

export async function GET(context: APIContext) {
  const tag = context.params?.tag;
  if (!tag) {
    return new Response('Tag not found', { status: 404 });
  }

  const allPosts = await getCollection('blog', ({ data }) => !data.draft && data.lang === 'zh');
  const posts = allPosts
    .filter((p) => p.data.tags.includes(tag))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const items = posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.pubDate,
    description: post.data.description,
    link: `/blog/${post.id.replace('zh/', '')}/`,
    categories: post.data.tags,
  }));

  return rss({
    title: `#${tag} — 祈研所 Qi-Lab`,
    description: `${tag} 相关文章 — 祈研所的深度技术分享与思考`,
    site: context.site!,
    items,
    customData: `<language>zh-CN</language><atom:link href="${context.site}tags/${tag}.rss.xml" rel="self" type="application/rss+xml"/>`,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
  });
}
