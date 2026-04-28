import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// i18n mapping for SearchModal (runtime locale detection)
const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '搜索',
    placeholder: '搜索文章、标签或主题…',
    ariaLabel: '搜索文章',
    hint: '输入关键词，开启深度阅读…',
    searching: '正在为您寻觅内容…',
    devOnly: '搜索功能仅在生产环境（Build 后）可用',
    noResults: (q: string) => `未找到与 "${q}" 匹配的内容。换个关键词试试？`,
    error: '深感抱歉，搜索过程中出现了一点小意外',
    'filter-all': '全部',
    'filter-articles': '文章',
    'filter-tags': '标签',
    'search-history': '搜索历史',
    'clear-history': '清除历史',
    'no-history': '暂无搜索历史',
    'search-suggestions': '搜索建议',
  },
  en: {
    title: 'Search',
    placeholder: 'Search articles, tags, or topics…',
    ariaLabel: 'Search articles',
    hint: 'Type a keyword to explore insights…',
    searching: 'Looking for contents…',
    devOnly: 'Search is only available in production (after build)',
    noResults: (q: string) => `We couldn't find anything for "${q}". Try another keyword?`,
    error: 'Something went wrong with the search',
    'filter-all': 'All',
    'filter-articles': 'Articles',
    'filter-tags': 'Tags',
    'search-history': 'Search History',
    'clear-history': 'Clear History',
    'no-history': 'No search history yet',
    'search-suggestions': 'Search Suggestions',
  },
};

function getLang(): string {
  return document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
}

function t(key: string): string {
  return (i18n[getLang()] || i18n.zh)[key] || key;
}

function tNoResults(q: string): string {
  const fn = (i18n[getLang()] || i18n.zh).noResults;
  return typeof fn === 'function' ? fn(q) : String(fn);
}

// 搜索历史管理
function getSearchHistory(): string[] {
  const history = localStorage.getItem('searchHistory');
  return history ? JSON.parse(history) : [];
}

function addToSearchHistory(query: string) {
  if (!query.trim()) return;
  let history = getSearchHistory();
  history = history.filter(item => item !== query);
  history.unshift(query);
  history = history.slice(0, 5); // 只保留最近5条
  localStorage.setItem('searchHistory', JSON.stringify(history));
}

function clearSearchHistory() {
  localStorage.removeItem('searchHistory');
}

// 搜索建议
const searchSuggestions = [
  '知识管理',
  '设计系统',
  '前端架构',
  'Astro',
  'Tailwind CSS',
  '性能优化',
  'TypeScript',
  'React',
  'Vue',
  'Node.js',
  'GitHub Actions',
  'PWA',
  'SEO',
  '响应式设计',
  '可访问性'
];

function showSearchSuggestions(query: string): string[] {
  if (!query.trim()) {
    return [];
  }
  return searchSuggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(query.toLowerCase())
  );
}

// 搜索结果高亮函数
function highlightKeyword(text: string, keyword: string): string {
  if (!keyword.trim() || !text) return text;
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

describe('SearchModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'zh';
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('i18n 国际化功能', () => {
    it('默认语言为中文', () => {
      document.documentElement.lang = 'zh';
      expect(t('title')).toBe('搜索');
      expect(t('placeholder')).toBe('搜索文章、标签或主题…');
    });

    it('切换到英文语言', () => {
      document.documentElement.lang = 'en';
      expect(t('title')).toBe('Search');
      expect(t('placeholder')).toBe('Search articles, tags, or topics…');
    });

    it('noResults 函数正确格式化', () => {
      document.documentElement.lang = 'zh';
      expect(tNoResults('测试')).toBe('未找到与 "测试" 匹配的内容。换个关键词试试？');
      
      document.documentElement.lang = 'en';
      expect(tNoResults('test')).toBe('We couldn\'t find anything for "test". Try another keyword?');
    });

    it('未知 key 返回原 key', () => {
      expect(t('unknown-key')).toBe('unknown-key');
    });
  });

  describe('搜索历史管理', () => {
    it('初始时搜索历史为空', () => {
      expect(getSearchHistory()).toEqual([]);
    });

    it('添加搜索历史', () => {
      addToSearchHistory('前端架构');
      expect(getSearchHistory()).toEqual(['前端架构']);
    });

    it('搜索历史不超过5条', () => {
      addToSearchHistory('搜索1');
      addToSearchHistory('搜索2');
      addToSearchHistory('搜索3');
      addToSearchHistory('搜索4');
      addToSearchHistory('搜索5');
      addToSearchHistory('搜索6');
      
      const history = getSearchHistory();
      expect(history.length).toBe(5);
      expect(history).toEqual(['搜索6', '搜索5', '搜索4', '搜索3', '搜索2']);
    });

    it('相同搜索词不重复添加', () => {
      addToSearchHistory('前端');
      addToSearchHistory('后端');
      addToSearchHistory('前端');
      
      const history = getSearchHistory();
      expect(history.length).toBe(2);
      expect(history).toEqual(['前端', '后端']);
    });

    it('清除搜索历史', () => {
      addToSearchHistory('前端架构');
      expect(getSearchHistory()).toEqual(['前端架构']);
      
      clearSearchHistory();
      expect(getSearchHistory()).toEqual([]);
    });

    it('空字符串不添加到历史', () => {
      addToSearchHistory('');
      addToSearchHistory('   ');
      expect(getSearchHistory()).toEqual([]);
    });
  });

  describe('搜索建议功能', () => {
    it('空查询返回空数组', () => {
      expect(showSearchSuggestions('')).toEqual([]);
      expect(showSearchSuggestions('   ')).toEqual([]);
    });

    it('匹配搜索建议', () => {
      const suggestions = showSearchSuggestions('前端');
      expect(suggestions).toContain('前端架构');
      expect(suggestions).toHaveLength(1);
    });

    it('大小写不敏感匹配', () => {
      const suggestions = showSearchSuggestions('ASTRO');
      expect(suggestions).toContain('Astro');
    });

    it('返回多个匹配结果', () => {
      const suggestions = showSearchSuggestions('设计');
      expect(suggestions).toContain('设计系统');
      expect(suggestions).toContain('响应式设计');
    });

    it('无匹配时返回空数组', () => {
      const suggestions = showSearchSuggestions('不存在的关键词xyz');
      expect(suggestions).toEqual([]);
    });
  });

  describe('关键词高亮功能', () => {
    it('高亮匹配关键词', () => {
      const result = highlightKeyword('这是一篇关于前端架构的文章', '前端');
      expect(result).toBe('这是一篇关于<mark>前端</mark>架构的文章');
    });

    it('大小写不敏感高亮', () => {
      const result = highlightKeyword('Astro 是一个很棒的框架', 'astro');
      expect(result).toBe('<mark>Astro</mark> 是一个很棒的框架');
    });

    it('特殊字符转义', () => {
      const result = highlightKeyword('测试 (括号) 和 [方括号]', '(括号)');
      expect(result).toBe('测试 <mark>(括号)</mark> 和 [方括号]');
    });

    it('空关键词不高亮', () => {
      const result = highlightKeyword('测试文本', '');
      expect(result).toBe('测试文本');
    });

    it('空文本返回空', () => {
      const result = highlightKeyword('', '关键词');
      expect(result).toBe('');
    });
  });

  describe('搜索模态框交互', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="search-modal" class="search-modal" aria-hidden="true">
          <div class="search-backdrop" id="search-backdrop"></div>
          <div class="search-container">
            <input id="search-input" type="search" class="search-input" />
            <div id="search-results" class="search-results"></div>
            <div id="search-suggestions" class="search-suggestions" aria-hidden="true"></div>
          </div>
        </div>
      `;
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('打开搜索模态框', () => {
      const modal = document.getElementById('search-modal');
      const input = document.getElementById('search-input') as HTMLInputElement;
      
      function openSearch() {
        modal?.setAttribute('aria-hidden', 'false');
        input?.focus();
        document.body.style.overflow = 'hidden';
      }

      openSearch();
      
      expect(modal?.getAttribute('aria-hidden')).toBe('false');
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('关闭搜索模态框', () => {
      const modal = document.getElementById('search-modal');
      const input = document.getElementById('search-input') as HTMLInputElement;
      const results = document.getElementById('search-results');
      const suggestions = document.getElementById('search-suggestions');
      
      function closeSearch() {
        modal?.setAttribute('aria-hidden', 'true');
        input!.value = '';
        if (results) results.innerHTML = `<p class="search-hint">${t('hint')}</p>`;
        if (suggestions) {
          suggestions.setAttribute('aria-hidden', 'true');
          suggestions.innerHTML = '';
        }
        document.body.style.overflow = '';
      }

      // 先打开模态框
      modal?.setAttribute('aria-hidden', 'false');
      input.value = 'test';
      
      // 关闭模态框
      closeSearch();
      
      expect(modal?.getAttribute('aria-hidden')).toBe('true');
      expect(input.value).toBe('');
      expect(document.body.style.overflow).toBe('');
    });
  });
});