import Image from "next/image";
import {
  NewsCategoryBadge,
  NewsMetadata,
} from "@/components/news/news-metadata";
import type { NewsArticle } from "@/types/news";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex flex-wrap items-start gap-3 px-4 py-3.5 sm:flex-nowrap sm:px-5">
      <div className="min-w-0 flex-1 basis-52 space-y-1.5">
        <NewsCategoryBadge category={article.category} />
        <h3 className="text-base leading-snug font-semibold tracking-tight sm:text-lg">
          {article.sourceUrl ? (
            <a href={article.sourceUrl} className="hover:underline">
              {article.title}
            </a>
          ) : (
            article.title
          )}
        </h3>
        {article.summary && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
        )}
        <NewsMetadata article={article} />
        {article.symbols.length > 0 && (
          <ul
            aria-label="Related stocks"
            className="flex flex-wrap gap-1.5 pt-0.5"
          >
            {article.symbols.map((symbol) => (
              <li
                key={symbol}
                className="rounded bg-muted px-1.5 py-0.5 text-[0.625rem] font-semibold text-muted-foreground"
              >
                {symbol}
              </li>
            ))}
          </ul>
        )}
      </div>
      {article.image && (
        <Image
          src={article.image.src}
          alt={article.image.alt}
          width={article.image.width}
          height={article.image.height}
          sizes="112px"
          className="aspect-[4/3] w-28 rounded-md object-cover"
        />
      )}
    </article>
  );
}
