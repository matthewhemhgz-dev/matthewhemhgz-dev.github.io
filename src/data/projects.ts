export interface Project {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  categoryEn: string;
  tags: string[];
  image: string;
  url: string;
  github?: string;
  year: number;
}

export const projects: Project[] = [
  {
    id: 'qi-lab',
    title: '祈研所',
    titleEn: 'Qi-Lab',
    description: '一个探索技术、设计与创意交汇之处的个人知识实验室网站',
    descriptionEn: 'A personal knowledge lab exploring the intersection of technology, design, and creativity',
    category: '个人项目',
    categoryEn: 'Personal Projects',
    tags: ['Astro', 'TypeScript', 'CSS', 'PWA'],
    image: '/images/projects/qi-lab.png',
    url: '/',
    github: 'https://github.com/matthewhemhgz-dev/matthewhemhgz-dev.github.io',
    year: 2024
  },
  {
    id: 'knowledge-graph',
    title: '知识图谱可视化',
    titleEn: 'Knowledge Graph',
    description: '基于 Neo4j 的个人知识图谱系统，实现知识节点的可视化与关系分析',
    descriptionEn: 'Personal knowledge graph system based on Neo4j with visualization and relationship analysis',
    category: '数据可视化',
    categoryEn: 'Data Visualization',
    tags: ['Neo4j', 'D3.js', 'GraphQL'],
    image: '/images/projects/knowledge-graph.png',
    url: '/blog/knowledge-graph-visualization',
    year: 2024
  },
  {
    id: 'design-system',
    title: '设计系统',
    titleEn: 'Design System',
    description: '从零构建的设计系统，包含完整的设计令牌、组件库和样式规范',
    descriptionEn: 'Design system built from scratch with design tokens, component library, and style guidelines',
    category: '设计系统',
    categoryEn: 'Design System',
    tags: ['Design Tokens', 'CSS', 'Component Library'],
    image: '/images/projects/design-system.png',
    url: '/blog/design-system-from-scratch',
    year: 2024
  },
  {
    id: 'ai-assistant',
    title: 'AI 助手',
    titleEn: 'AI Assistant',
    description: '基于 Claude API 的智能助手，支持多模态交互和知识检索',
    descriptionEn: 'AI assistant based on Claude API with multimodal interaction and knowledge retrieval',
    category: 'AI 应用',
    categoryEn: 'AI Applications',
    tags: ['AI', 'Claude', 'API', 'RAG'],
    image: '/images/projects/ai-assistant.png',
    url: '/blog/ai-era-knowledge-worker',
    year: 2025
  },
  {
    id: 'zettelkasten',
    title: '卡片盒笔记系统',
    titleEn: 'Zettelkasten System',
    description: '基于双向链接的个人知识管理系统，实现卡片盒笔记法',
    descriptionEn: 'Personal knowledge management system based on bidirectional links implementing Zettelkasten method',
    category: '知识管理',
    categoryEn: 'Knowledge Management',
    tags: ['Obsidian', 'Notion', 'Second Brain'],
    image: '/images/projects/zettelkasten.png',
    url: '/blog/zettelkasten-practical-guide',
    year: 2024
  },
  {
    id: 'performance',
    title: '性能优化',
    titleEn: 'Performance Optimization',
    description: '前端性能优化实践项目，包含资源压缩、懒加载、代码分割等技术',
    descriptionEn: 'Frontend performance optimization project with resource compression, lazy loading, code splitting',
    category: '性能工程',
    categoryEn: 'Performance Engineering',
    tags: ['Performance', 'Optimization', 'Lighthouse'],
    image: '/images/projects/performance.png',
    url: '/blog/how-to-optimize-frontend-performance',
    year: 2024
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
