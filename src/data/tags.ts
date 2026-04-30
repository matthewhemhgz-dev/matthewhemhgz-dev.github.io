export interface TagMapping {
  slug: string;
  zh: string;
  en: string;
}

export const tagMappings: Record<string, TagMapping> = {
  'ai': {
    slug: 'ai',
    zh: 'AI',
    en: 'AI'
  },
  'astro': {
    slug: 'astro',
    zh: 'Astro',
    en: 'Astro'
  },
  'css': {
    slug: 'css',
    zh: 'CSS',
    en: 'CSS'
  },
  'design-tokens': {
    slug: 'design-tokens',
    zh: 'Design Tokens',
    en: 'Design Tokens'
  },
  'notion': {
    slug: 'notion',
    zh: 'Notion',
    en: 'Notion'
  },
  'obsidian': {
    slug: 'obsidian',
    zh: 'Obsidian',
    en: 'Obsidian'
  },
  'refactoring': {
    slug: 'refactoring',
    zh: 'Refactoring',
    en: 'Refactoring'
  },
  'ssg': {
    slug: 'ssg',
    zh: 'SSG',
    en: 'SSG'
  },
  'tailwindcss': {
    slug: 'tailwindcss',
    zh: 'TailwindCSS',
    en: 'TailwindCSS'
  },
  'ui-ux': {
    slug: 'ui-ux',
    zh: 'UI-UX',
    en: 'UI-UX'
  },
  'web-performance': {
    slug: 'web-performance',
    zh: 'Web性能',
    en: 'Web Performance'
  },
  'personal-system': {
    slug: 'personal-system',
    zh: '个人系统',
    en: 'Personal System'
  },
  'writing': {
    slug: 'writing',
    zh: '写作',
    en: 'Writing'
  },
  'frontend-development': {
    slug: 'frontend-development',
    zh: '前端开发',
    en: 'Frontend Development'
  },
  'frontend-architecture': {
    slug: 'frontend-architecture',
    zh: '前端架构',
    en: 'Frontend Architecture'
  },
  'zettelkasten': {
    slug: 'zettelkasten',
    zh: '卡片盒笔记法',
    en: 'Zettelkasten'
  },
  'bidirectional-links': {
    slug: 'bidirectional-links',
    zh: '双向链接',
    en: 'Bidirectional Links'
  },
  'visualization': {
    slug: 'visualization',
    zh: '可视化',
    en: 'Visualization'
  },
  'learning': {
    slug: 'learning',
    zh: '学习法',
    en: 'Learning'
  },
  'practice': {
    slug: 'practice',
    zh: '实践',
    en: 'Practice'
  },
  'tools': {
    slug: 'tools',
    zh: '工具',
    en: 'Tools'
  },
  'engineering-practice': {
    slug: 'engineering-practice',
    zh: '工程实践',
    en: 'Engineering Practice'
  },
  'mental-models': {
    slug: 'mental-models',
    zh: '思维模型',
    en: 'Mental Models'
  },
  'performance': {
    slug: 'performance',
    zh: '性能优化',
    en: 'Performance Optimization'
  },
  'technical-evolution': {
    slug: 'technical-evolution',
    zh: '技术演进',
    en: 'Technical Evolution'
  },
  'productivity': {
    slug: 'productivity',
    zh: '效率工具',
    en: 'Productivity Tools'
  },
  'best-practices': {
    slug: 'best-practices',
    zh: '最佳实践',
    en: 'Best Practices'
  },
  'knowledge-system': {
    slug: 'knowledge-system',
    zh: '知识体系',
    en: 'Knowledge System'
  },
  'knowledge-graph': {
    slug: 'knowledge-graph',
    zh: '知识图谱',
    en: 'Knowledge Graph'
  },
  'knowledge-management': {
    slug: 'knowledge-management',
    zh: '知识管理',
    en: 'Knowledge Management'
  },
  'second-brain': {
    slug: 'second-brain',
    zh: '第二大脑',
    en: 'Second Brain'
  },
  'component-library': {
    slug: 'component-library',
    zh: '组件库',
    en: 'Component Library'
  },
  'design-tokens-cn': {
    slug: 'design-tokens-cn',
    zh: '设计令牌',
    en: 'Design Tokens'
  },
  'design-system': {
    slug: 'design-system',
    zh: '设计系统',
    en: 'Design System'
  },
  'long-termism': {
    slug: 'long-termism',
    zh: '长期主义',
    en: 'Long-termism'
  },
  'static-sites': {
    slug: 'static-sites',
    zh: '静态站点',
    en: 'Static Sites'
  }
};

export function getTagBySlug(slug: string): TagMapping | undefined {
  return tagMappings[slug];
}

export function getSlugByZhTag(tag: string): string | undefined {
  const mapping = Object.values(tagMappings).find(m => m.zh === tag);
  return mapping?.slug;
}

export function getSlugByEnTag(tag: string): string | undefined {
  const mapping = Object.values(tagMappings).find(m => m.en === tag);
  return mapping?.slug;
}

export function getAllTags(): TagMapping[] {
  return Object.values(tagMappings);
}
