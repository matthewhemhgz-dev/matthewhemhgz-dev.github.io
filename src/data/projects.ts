export interface Project {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  categoryEn: string;
  tags: string[];
  image: string;
  previewImage?: string;
  previewType?: 'gif' | 'video';
  url: string;
  github?: string;
  year: number;
  features?: string[];
  featuresEn?: string[];
}

export const projects: Project[] = [
  {
    id: 'qi-lab',
    slug: 'qi-lab',
    title: '祈研所',
    titleEn: 'Qi-Lab',
    description: '一个探索技术、设计与创意交汇之处的个人知识实验室网站',
    descriptionEn: 'A personal knowledge lab exploring the intersection of technology, design, and creativity',
    category: '个人项目',
    categoryEn: 'Personal Projects',
    tags: ['Astro', 'TypeScript', 'CSS', 'PWA'],
    image: '/blog/astro-ssg-why-i-chose.png',
    url: '/',
    github: 'https://github.com/matthewhemhgz-dev/matthewhemhgz-dev.github.io',
    year: 2024,
    features: [
      '基于 Astro 静态站点生成器构建',
      '支持 PWA 离线访问和推送通知',
      '响应式设计，适配多种设备',
      '暗色模式支持',
      '文章搜索和标签筛选功能',
      'SEO 优化和结构化数据支持'
    ],
    featuresEn: [
      'Built with Astro static site generator',
      'PWA support for offline access and push notifications',
      'Responsive design for all devices',
      'Dark mode support',
      'Article search and tag filtering',
      'SEO optimization with structured data'
    ]
  },
  {
    id: 'knowledge-graph',
    slug: 'knowledge-graph',
    title: '知识图谱可视化',
    titleEn: 'Knowledge Graph',
    description: '基于 Neo4j 的个人知识图谱系统，实现知识节点的可视化与关系分析',
    descriptionEn: 'Personal knowledge graph system based on Neo4j with visualization and relationship analysis',
    category: '数据可视化',
    categoryEn: 'Data Visualization',
    tags: ['Neo4j', 'D3.js', 'GraphQL'],
    image: '/blog/knowledge-graph-visualization.png',
    url: '/blog/knowledge-graph-visualization',
    year: 2024,
    features: [
      '基于 Neo4j 图数据库存储',
      'D3.js 实现交互式知识图谱可视化',
      '支持节点搜索和关系探索',
      'GraphQL API 接口',
      '实时更新和同步'
    ],
    featuresEn: [
      'Neo4j graph database storage',
      'Interactive knowledge graph visualization with D3.js',
      'Node search and relationship exploration',
      'GraphQL API interface',
      'Real-time updates and sync'
    ]
  },
  {
    id: 'design-system',
    slug: 'design-system',
    title: '设计系统',
    titleEn: 'Design System',
    description: '从零构建的设计系统，包含完整的设计令牌、组件库和样式规范',
    descriptionEn: 'Design system built from scratch with design tokens, component library, and style guidelines',
    category: '设计系统',
    categoryEn: 'Design System',
    tags: ['Design Tokens', 'CSS', 'Component Library'],
    image: '/blog/design-system-from-scratch.png',
    url: '/blog/design-system-from-scratch',
    year: 2024,
    features: [
      '完整的设计令牌体系',
      '可复用的组件库',
      '一致的样式规范文档',
      '多主题支持',
      '无障碍访问支持'
    ],
    featuresEn: [
      'Complete design token system',
      'Reusable component library',
      'Consistent style guidelines documentation',
      'Multi-theme support',
      'Accessibility support'
    ]
  },
  {
    id: 'ai-assistant',
    slug: 'ai-assistant',
    title: 'AI 助手',
    titleEn: 'AI Assistant',
    description: '基于 Claude API 的智能助手，支持多模态交互和知识检索',
    descriptionEn: 'AI assistant based on Claude API with multimodal interaction and knowledge retrieval',
    category: 'AI 应用',
    categoryEn: 'AI Applications',
    tags: ['AI', 'Claude', 'API', 'RAG'],
    image: '/blog/ai-era-knowledge-worker.png',
    url: '/blog/ai-era-knowledge-worker',
    year: 2025,
    features: [
      '基于 Claude API 的智能对话',
      '多模态交互支持',
      'RAG 知识检索增强',
      '上下文记忆功能',
      '多场景应用支持'
    ],
    featuresEn: [
      'Intelligent dialogue based on Claude API',
      'Multimodal interaction support',
      'RAG knowledge retrieval augmentation',
      'Context memory functionality',
      'Multi-scenario application support'
    ]
  },
  {
    id: 'zettelkasten',
    slug: 'zettelkasten',
    title: '卡片盒笔记系统',
    titleEn: 'Zettelkasten System',
    description: '基于双向链接的个人知识管理系统，实现卡片盒笔记法',
    descriptionEn: 'Personal knowledge management system based on bidirectional links implementing Zettelkasten method',
    category: '知识管理',
    categoryEn: 'Knowledge Management',
    tags: ['Obsidian', 'Notion', 'Second Brain'],
    image: '/blog/zettelkasten-practical-guide.png',
    url: '/blog/zettelkasten-practical-guide',
    year: 2024,
    features: [
      '双向链接笔记系统',
      '原子化笔记管理',
      '标签和分类系统',
      '快速搜索和检索',
      '与 Obsidian、Notion 同步'
    ],
    featuresEn: [
      'Bidirectional link note system',
      'Atomic note management',
      'Tag and category system',
      'Fast search and retrieval',
      'Sync with Obsidian and Notion'
    ]
  },
  {
    id: 'performance',
    slug: 'performance',
    title: '性能优化',
    titleEn: 'Performance Optimization',
    description: '前端性能优化实践项目，包含资源压缩、懒加载、代码分割等技术',
    descriptionEn: 'Frontend performance optimization project with resource compression, lazy loading, code splitting',
    category: '性能工程',
    categoryEn: 'Performance Engineering',
    tags: ['Performance', 'Optimization', 'Lighthouse'],
    image: '/blog/how-to-optimize-frontend-performance.png',
    url: '/blog/how-to-optimize-frontend-performance',
    year: 2024,
    features: [
      '资源压缩与合并',
      '图片懒加载优化',
      '代码分割与按需加载',
      '缓存策略优化',
      'Lighthouse 性能提升方案'
    ],
    featuresEn: [
      'Resource compression and bundling',
      'Image lazy loading optimization',
      'Code splitting and on-demand loading',
      'Cache strategy optimization',
      'Lighthouse performance improvement plan'
    ]
  }
];

export const projectCategories = [
  '全部',
  '个人项目',
  '数据可视化',
  '设计系统',
  'AI 应用',
  '知识管理',
  '性能工程'
];

export const projectCategoriesEn = [
  'All',
  'Personal Projects',
  'Data Visualization',
  'Design System',
  'AI Applications',
  'Knowledge Management',
  'Performance Engineering'
];

export const categoryMapping: Record<string, string> = {
  '全部': 'All',
  '个人项目': 'Personal Projects',
  '数据可视化': 'Data Visualization',
  '设计系统': 'Design System',
  'AI 应用': 'AI Applications',
  '知识管理': 'Knowledge Management',
  '性能工程': 'Performance Engineering'
};
