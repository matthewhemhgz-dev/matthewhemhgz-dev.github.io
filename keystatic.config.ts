import { config, fields, collection } from '@keystatic/core';

/**
 * Keystatic CMS 配置 — 祈研所
 * 按语言分 collection，兼容现有 src/data/blog/{lang}/ 目录结构
 */

function createBlogCollection(locale: 'zh' | 'en') {
  const isZh = locale === 'zh';
  return collection({
    label: isZh ? '博客文章（中文）' : 'Blog Posts (English)',
    slugField: 'title',
    path: `src/data/blog/${locale}/*`,
    format: { contentField: 'content' },
    schema: {
      title: fields.slug({
        name: {
          label: isZh ? '标题' : 'Title',
          validation: { isRequired: true },
        },
      }),
      description: fields.text({
        label: isZh ? '描述' : 'Description',
        validation: { isRequired: true },
      }),
      pubDate: fields.date({
        label: isZh ? '发布日期' : 'Published Date',
        validation: { isRequired: true },
      }),
      updatedDate: fields.date({
        label: isZh ? '更新日期' : 'Updated Date',
      }),
      draft: fields.checkbox({
        label: isZh ? '草稿' : 'Draft',
        defaultValue: false,
      }),
      lang: fields.text({
        label: isZh ? '语言' : 'Language',
        defaultValue: locale,
      }),
      category: fields.text({
        label: isZh ? '分类' : 'Category',
        defaultValue: isZh ? '随思随想' : 'Thoughts',
      }),
      tags: fields.array(fields.text({ label: isZh ? '标签' : 'Tag' }), {
        label: isZh ? '标签' : 'Tags',
      }),
      image: fields.object({
        src: fields.image({
          label: isZh ? '封面图片' : 'Cover Image',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        alt: fields.text({
          label: isZh ? '图片描述' : 'Image Alt',
        }),
      }),
      author: fields.text({
        label: isZh ? '作者' : 'Author',
        defaultValue: 'Qi-Lab',
      }),
      content: fields.markdoc({
        label: isZh ? '正文内容' : 'Content',
        options: {
          image: {
            directory: 'public/images/blog/content',
            publicPath: '/images/blog/content/',
          },
        },
      }),
    },
  });
}

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    blogZh: createBlogCollection('zh'),
    blogEn: createBlogCollection('en'),
  },
});
