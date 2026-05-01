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
  previewImage?: string;
  previewType?: 'gif' | 'video';
  url: string;
  github?: string;
  year: number;
}

export type ProjectCategory = typeof import('../data/projects').projectCategories[number];
export type ProjectCategoryEn = typeof import('../data/projects').projectCategoriesEn[number];
export type CategoryMapping = Record<string, string>;
