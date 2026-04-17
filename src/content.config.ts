import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string().min(1, '标题不能为空'),
    description: z.string().min(1, '描述不能为空').max(160, '描述不超过160字符'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    lang: z.enum(['zh', 'en']).default('zh'),
    category: z.string().default('随思随想'),
    tags: z.array(z.string()).default([]),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    readingTime: z.string().optional(),
    author: z.string().default('Qi-Lab'),
    ogImage: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
