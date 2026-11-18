import type { NewsCategory } from "@/config/news-categories";

export interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  source: string;
  sourceUrl?: string;
  image?: { src: string; alt: string; width: number; height: number };
  publishedAt: string;
  category: NewsCategory;
  symbols: readonly string[];
  isBreaking?: boolean;
  isDemo: boolean;
}
