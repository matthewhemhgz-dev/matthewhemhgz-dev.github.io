import { describe, it, expect } from 'vitest';

interface MockPost {
  id: string;
  data: {
    tags?: string[];
    category?: string;
    pubDate?: Date;
    title: string;
    description: string;
  };
}

function calculateSimilarity(current: MockPost, other: MockPost): number {
  let score = 0;
  const currentTags = current.data.tags || [];
  const otherTags = other.data.tags || [];

  // 基于共同标签计算相似度
  if (currentTags.length > 0 && otherTags.length > 0) {
    const commonTags = otherTags.filter(tag => currentTags.includes(tag));
    const jaccardIndex = commonTags.length / (currentTags.length + otherTags.length - commonTags.length);
    score += jaccardIndex * 10;
  }

  // 基于相同分类加分
  if (current.data.category === other.data.category) {
    score += 3;
  }

  // 基于发布日期相近度加分
  if (current.data.pubDate && other.data.pubDate) {
    const dateDiff = Math.abs(other.data.pubDate.getTime() - current.data.pubDate.getTime());
    const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
    score += Math.max(0, 2 - daysDiff / 180);
  }

  return score;
}

function getRelatedPosts(currentPost: MockPost, allPosts: MockPost[], limit: number = 3): { post: MockPost; score: number }[] {
  return allPosts
    .filter(post => post.id !== currentPost.id)
    .map(post => ({
      post,
      score: calculateSimilarity(currentPost, post),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

describe('RelatedArticles Component', () => {
  describe('calculateSimilarity 函数', () => {
    const currentDate = new Date('2024-01-01');
    
    it('相同标签越多相似度越高', () => {
      const current: MockPost = {
        id: 'current',
        data: { tags: ['前端', 'React', 'TypeScript'], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      const post1: MockPost = {
        id: 'post1',
        data: { tags: ['前端', 'React', 'TypeScript'], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      const post2: MockPost = {
        id: 'post2',
        data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      expect(calculateSimilarity(current, post1)).toBeGreaterThan(calculateSimilarity(current, post2));
    });

    it('Jaccard 相似度计算正确', () => {
      const current: MockPost = {
        id: 'current',
        data: { tags: ['A', 'B', 'C'], category: 'tech', pubDate: currentDate, title: '', description: '' }
      };
      
      // 完全相同的标签
      const post1: MockPost = {
        id: 'post1',
        data: { tags: ['A', 'B', 'C'], category: 'tech', pubDate: currentDate, title: '', description: '' }
      };
      expect(calculateSimilarity(current, post1)).toBeCloseTo(15, 1); // Jaccard=1, score=10+3+2=15
      
      // 完全不同的标签
      const post2: MockPost = {
        id: 'post2',
        data: { tags: ['D', 'E', 'F'], category: 'tech', pubDate: currentDate, title: '', description: '' }
      };
      expect(calculateSimilarity(current, post2)).toBe(5); // 0 + 3 + 2 = 5
    });

    it('相同分类加分', () => {
      const current: MockPost = {
        id: 'current',
        data: { tags: [], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      const sameCategory: MockPost = {
        id: 'same',
        data: { tags: [], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      const diffCategory: MockPost = {
        id: 'diff',
        data: { tags: [], category: '生活', pubDate: currentDate, title: '', description: '' }
      };
      
      expect(calculateSimilarity(current, sameCategory)).toBe(5); // 0 + 3 + 2 = 5
      expect(calculateSimilarity(current, diffCategory)).toBe(2); // 0 + 0 + 2 = 2
    });

    it('日期越接近分数越高', () => {
      const current: MockPost = {
        id: 'current',
        data: { tags: [], category: 'tech', pubDate: new Date('2024-01-01'), title: '', description: '' }
      };
      
      const sameDay: MockPost = {
        id: 'same',
        data: { tags: [], category: 'tech', pubDate: new Date('2024-01-01'), title: '', description: '' }
      };
      
      const oneMonthLater: MockPost = {
        id: 'one-month',
        data: { tags: [], category: 'tech', pubDate: new Date('2024-02-01'), title: '', description: '' }
      };
      
      const sixMonthsLater: MockPost = {
        id: 'six-months',
        data: { tags: [], category: 'tech', pubDate: new Date('2024-07-01'), title: '', description: '' }
      };
      
      expect(calculateSimilarity(current, sameDay)).toBe(5); // 0 + 3 + 2 = 5
      expect(calculateSimilarity(current, oneMonthLater)).toBeGreaterThan(calculateSimilarity(current, sixMonthsLater));
    });

    it('日期相差超过 360 天不加分', () => {
      const current: MockPost = {
        id: 'current',
        data: { tags: [], category: 'tech', pubDate: new Date('2024-01-01'), title: '', description: '' }
      };
      
      const oneYearLater: MockPost = {
        id: 'year',
        data: { tags: [], category: 'tech', pubDate: new Date('2025-01-01'), title: '', description: '' }
      };
      
      expect(calculateSimilarity(current, oneYearLater)).toBe(3); // 0 + 3 + 0 = 3
    });

    it('无标签时不计算标签相似度', () => {
      const current: MockPost = {
        id: 'current',
        data: { tags: [], category: 'tech', pubDate: currentDate, title: '', description: '' }
      };
      
      const postWithTags: MockPost = {
        id: 'post',
        data: { tags: ['前端', 'React'], category: 'tech', pubDate: currentDate, title: '', description: '' }
      };
      
      expect(calculateSimilarity(current, postWithTags)).toBe(5); // 0 + 3 + 2 = 5
    });

    it('无边际日期时不计算日期相似度', () => {
      const current: MockPost = {
        id: 'current',
        data: { tags: ['前端'], category: 'tech', pubDate: undefined, title: '', description: '' }
      };
      
      const postWithDate: MockPost = {
        id: 'post',
        data: { tags: ['前端'], category: 'tech', pubDate: currentDate, title: '', description: '' }
      };
      
      // 只有标签相似度和分类加分
      expect(calculateSimilarity(current, postWithDate)).toBe(13); // 10 + 3 + 0 = 13
    });
  });

  describe('getRelatedPosts 函数', () => {
    const currentDate = new Date('2024-01-01');
    
    it('排除当前文章', () => {
      const currentPost: MockPost = {
        id: 'current',
        data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      const allPosts: MockPost[] = [
        currentPost,
        { id: 'post1', data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
        { id: 'post2', data: { tags: ['后端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
      ];
      
      const related = getRelatedPosts(currentPost, allPosts);
      expect(related).toHaveLength(2);
      expect(related[0].post.id).not.toBe('current');
      expect(related[1].post.id).not.toBe('current');
    });

    it('按相似度排序', () => {
      const currentPost: MockPost = {
        id: 'current',
        data: { tags: ['前端', 'React', 'TypeScript'], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      const allPosts: MockPost[] = [
        currentPost,
        { id: 'post1', data: { tags: ['前端', 'React', 'TypeScript'], category: '技术', pubDate: currentDate, title: '', description: '' } },
        { id: 'post2', data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
        { id: 'post3', data: { tags: ['后端'], category: '生活', pubDate: new Date('2023-01-01'), title: '', description: '' } },
      ];
      
      const related = getRelatedPosts(currentPost, allPosts);
      expect(related).toHaveLength(3);
      expect(related[0].score).toBeGreaterThan(related[1].score);
      expect(related[1].score).toBeGreaterThan(related[2].score);
    });

    it('默认返回 3 篇相关文章', () => {
      const currentPost: MockPost = {
        id: 'current',
        data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      const allPosts: MockPost[] = [
        currentPost,
        { id: 'post1', data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
        { id: 'post2', data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
        { id: 'post3', data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
        { id: 'post4', data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
      ];
      
      const related = getRelatedPosts(currentPost, allPosts);
      expect(related).toHaveLength(3);
    });

    it('可自定义返回数量', () => {
      const currentPost: MockPost = {
        id: 'current',
        data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      const allPosts: MockPost[] = [
        currentPost,
        { id: 'post1', data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
        { id: 'post2', data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
        { id: 'post3', data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
      ];
      
      const related = getRelatedPosts(currentPost, allPosts, 2);
      expect(related).toHaveLength(2);
    });

    it('当文章数量不足时返回所有文章', () => {
      const currentPost: MockPost = {
        id: 'current',
        data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      const allPosts: MockPost[] = [
        currentPost,
        { id: 'post1', data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' } },
      ];
      
      const related = getRelatedPosts(currentPost, allPosts, 5);
      expect(related).toHaveLength(1);
    });

    it('只有一篇文章时返回空数组', () => {
      const currentPost: MockPost = {
        id: 'current',
        data: { tags: ['前端'], category: '技术', pubDate: currentDate, title: '', description: '' }
      };
      
      const allPosts: MockPost[] = [currentPost];
      
      const related = getRelatedPosts(currentPost, allPosts);
      expect(related).toEqual([]);
    });
  });
});