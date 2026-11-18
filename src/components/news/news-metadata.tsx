import { newsCategories } from "@/config/news-categories";
import { formatPublishedAt } from "@/lib/utils/format-date";
import type { NewsArticle } from "@/types/news";

export function NewsCategoryBadge({
  category,
}: {
  category: NewsArticle["category"];
}) {
  return (
    <span className="text-[0.6875rem] leading-relaxed font-bold tracking-[0.08em] text-primary uppercase">
      {newsCategories[category]}
    </span>
  );
}

export function NewsMetadata({ article }: { article: NewsArticle }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
      <span>{article.source}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={article.publishedAt}>
        {article.isDemo && "Sample · "}
        {formatPublishedAt(article.publishedAt)}
      </time>
    </p>
  );
}
