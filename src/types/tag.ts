export interface TagMapping {
  slug: string;
  zh: string;
  en: string;
}

export type TagMappings = Record<string, TagMapping>;
