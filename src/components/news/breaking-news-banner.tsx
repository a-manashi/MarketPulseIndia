import { Zap } from "lucide-react";
import { newsCategories } from "@/config/news-categories";
import { formatPublishedAt } from "@/lib/utils/format-date";
import type { NewsArticle } from "@/types/news";

export function BreakingNewsBanner({ article }: { article: NewsArticle }) {
  if (!article.isBreaking) return null;

  return (
    <section
      aria-label="Breaking news banner"
      className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md border border-market-negative/25 bg-market-negative/8 px-3.5 py-2.5 sm:px-4"
    >
      <h2 className="flex shrink-0 items-center gap-1.5 text-xs font-bold tracking-wider text-market-negative uppercase">
        <Zap aria-hidden="true" className="size-3.5" />{" "}
        {article.isDemo ? "Sample breaking news" : "Breaking news"}
      </h2>
      <p className="flex-1 basis-48 text-sm font-semibold">
        {article.sourceUrl ? (
          <a className="underline underline-offset-4" href={article.sourceUrl}>
            {article.title}
          </a>
        ) : (
          article.title
        )}
      </p>
      <p className="text-xs text-muted-foreground">
        <span className="mr-2">{newsCategories[article.category]}</span>
        {article.publishedAt && (
          <time dateTime={article.publishedAt}>
            {article.isDemo && "Sample · "}
            {formatPublishedAt(article.publishedAt)}
          </time>
        )}
      </p>
    </section>
  );
}
