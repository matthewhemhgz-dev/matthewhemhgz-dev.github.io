export interface PagefindResult {
  url: string;
  meta?: {
    title?: string;
    category?: string;
    pubDate?: string;
    image?: string;
  };
  excerpt?: string;
}

export interface PagefindSearchResult {
  data: () => Promise<PagefindResult>;
}

export interface PagefindSearchResponse {
  results: PagefindSearchResult[];
}

export interface Pagefind {
  init: () => Promise<void>;
  search: (query: string) => Promise<PagefindSearchResponse>;
}
