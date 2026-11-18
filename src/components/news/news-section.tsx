"use client";

import { useState, type ReactNode } from "react";
import {
  NewsCategoryNav,
  type NewsFilter,
} from "@/components/news/news-category-nav";
import { NewsList } from "@/components/news/news-list";
import type { NewsArticle } from "@/types/news";

export function NewsSection({
  articles,
  featured,
}: {
  articles: readonly NewsArticle[];
  featured: ReactNode;
}) {
  const [category, setCategory] = useState<NewsFilter>("all");
  const results =
    category === "all"
      ? articles
      : articles.filter((article) => article.category === category);
  return (
    <section id="news" aria-label="News" className="min-w-0 space-y-4">
      <NewsCategoryNav active={category} onSelect={setCategory} />
      {featured}
      <section
        aria-labelledby="latest-news-heading"
        className="overflow-hidden rounded-lg border bg-card"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-1 border-b px-4 py-3.5 sm:px-5">
          <h2
            id="latest-news-heading"
            className="text-lg font-bold tracking-tight"
          >
            Latest News
          </h2>
          <p
            aria-live="polite"
            className="text-xs font-medium text-muted-foreground"
          >
            {results.length}{" "}
            {results.some((article) => article.isDemo) ? "sample " : ""}
            {results.length === 1 ? "article" : "articles"}
          </p>
        </div>
        <div id="latest-news-list">
          <NewsList articles={results} />
        </div>
      </section>
    </section>
  );
}
