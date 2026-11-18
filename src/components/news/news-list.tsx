import { NewsCard } from "@/components/news/news-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { NewsArticle } from "@/types/news";

export function NewsList({ articles }: { articles: readonly NewsArticle[] }) {
  if (articles.length === 0)
    return <EmptyState message="No articles in this category." />;
  return (
    <ul className="divide-y">
      {articles.map((article) => (
        <li key={article.id}>
          <NewsCard article={article} />
        </li>
      ))}
    </ul>
  );
}
