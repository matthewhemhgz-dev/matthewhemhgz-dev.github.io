export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: string;
  tags: string[];
  coverImage: string;
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  year: string;
  technologies: string[];
}

export const projects: Project[] = [
  {
    id: 'systempm',
    title: 'SystemPM',
    titleEn: 'SystemPM',
    description: '企业级项目管理系统，支持敏捷/瀑布混合管理模式，集成资源分配、进度追踪、风险评估等核心功能。采用微服务架构，支持多租户部署。',
    descriptionEn: 'Enterprise project management system supporting hybrid agile/waterfall management, with resource allocation, progress tracking, and risk assessment. Microservices architecture with multi-tenant support.',
    category: '企业应用',
    tags: ['项目管理', '微服务', '多租户'],
    coverImage: '/images/projects/systempm.png',
    liveUrl: '#',
    repoUrl: 'https://github.com/matthewhemhgz-dev/systempm',
    featured: true,
    year: '2024',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'stockaassist',
    title: 'StockAAssist',
    titleEn: 'StockAAssist',
    description: 'AI 驱动的股票分析助手，整合多源数据进行智能选股、风险预警和投资组合优化。支持实时行情监控和量化策略回测。',
    descriptionEn: 'AI-powered stock analysis assistant with intelligent stock selection, risk warning, and portfolio optimization. Real-time market monitoring and quantitative strategy backtesting.',
    category: 'AI应用',
    tags: ['AI', '量化分析', '金融'],
    coverImage: '/images/projects/stockaassist.png',
    liveUrl: '#',
    repoUrl: 'https://github.com/matthewhemhgz-dev/stockaassist',
    featured: true,
    year: '2024',
    technologies: ['Python', 'FastAPI', 'Machine Learning', 'WebSocket'],
  },
  {
    id: 'qilab-site',
    title: '祈研所官网',
    titleEn: 'QiLab Website',
    description: '个人技术博客与知识分享平台，采用现代化设计语言，支持深色/浅色主题切换，集成搜索、评论和订阅功能。',
    descriptionEn: 'Personal technical blog and knowledge sharing platform with modern design, dark/light theme switching, search, comments, and subscription features.',
    category: '个人项目',
    tags: ['博客', 'SSG', 'PWA'],
    coverImage: '/images/projects/qilab.png',
    liveUrl: 'https://matthewhemhgz-dev.github.io',
    repoUrl: 'https://github.com/matthewhemhgz-dev/matthewhemhgz-dev.github.io',
    featured: true,
    year: '2024',
    technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'Pagefind'],
  },
  {
    id: 'graphify',
    title: 'Graphify',
    titleEn: 'Graphify',
    description: 'LLM 驱动的智能知识库构建工具，支持自动知识图谱生成、语义搜索和智能问答。采用向量数据库实现高效语义检索。',
    descriptionEn: 'LLM-powered intelligent knowledge base builder with automatic knowledge graph generation, semantic search, and Q&A. Vector database for efficient semantic retrieval.',
    category: 'AI应用',
    tags: ['AI', '知识图谱', '语义搜索'],
    coverImage: '/images/projects/graphify.png',
    liveUrl: '#',
    repoUrl: 'https://github.com/matthewhemhgz-dev/graphify',
    year: '2024',
    technologies: ['LangChain', 'Pinecone', 'React', 'Node.js'],
  },
  {
    id: 'flowy',
    title: 'Flowy',
    titleEn: 'Flowy',
    description: '低代码工作流编排平台，支持可视化流程设计、条件分支、循环迭代和外部 API 集成。拖拽式界面，零代码即可构建复杂业务流程。',
    descriptionEn: 'Low-code workflow orchestration platform with visual flow design, conditional branching, loops, and external API integration. Drag-and-drop interface for building complex workflows.',
    category: '企业应用',
    tags: ['低代码', '工作流', '自动化'],
    coverImage: '/images/projects/flowy.png',
    liveUrl: '#',
    repoUrl: 'https://github.com/matthewhemhgz-dev/flowy',
    year: '2023',
    technologies: ['Vue.js', 'Go', 'Redis', 'gRPC'],
  },
  {
    id: 'notion-sync',
    title: 'Notion Sync',
    titleEn: 'Notion Sync',
    description: 'Notion 数据同步工具，支持双向同步 Obsidian、Google Docs、Trello 等多种数据源，实现跨平台知识管理。',
    descriptionEn: 'Notion data synchronization tool supporting bidirectional sync with Obsidian, Google Docs, Trello, enabling cross-platform knowledge management.',
    category: '工具',
    tags: ['数据同步', 'Notion', '知识管理'],
    coverImage: '/images/projects/notion-sync.png',
    liveUrl: '#',
    repoUrl: 'https://github.com/matthewhemhgz-dev/notion-sync',
    year: '2023',
    technologies: ['TypeScript', 'Notion API', 'Electron', 'Docker'],
  },
];

export const projectCategories = [
  { id: 'all', label: '全部', labelEn: 'All' },
  { id: '企业应用', label: '企业应用', labelEn: 'Enterprise' },
  { id: 'AI应用', label: 'AI应用', labelEn: 'AI' },
  { id: '个人项目', label: '个人项目', labelEn: 'Personal' },
  { id: '工具', label: '工具', labelEn: 'Tools' },
];

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'all') return projects;
  return projects.filter((p) => p.category === category);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter((p) => p.featured);
};
