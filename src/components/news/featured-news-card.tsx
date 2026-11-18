import Image from "next/image";
import {
  NewsCategoryBadge,
  NewsMetadata,
} from "@/components/news/news-metadata";
import type { NewsArticle } from "@/types/news";

const heights = [28, 36, 31, 50, 44, 60, 54, 75, 67, 87, 78, 96];

function BenchmarkIllustration() {
  return (
    <div
      aria-hidden="true"
      className="benchmark-illustration relative aspect-[2.2] overflow-hidden sm:aspect-auto sm:min-h-52"
    >
      <div className="absolute inset-x-[10%] top-5 flex justify-between gap-2 text-[0.625rem] font-semibold tracking-[0.16em] text-[#a5d5c8] uppercase">
        <span>NIFTY 50 / SENSEX</span>
        <span>Illustration</span>
      </div>
      <div className="absolute inset-x-[10%] top-13 bottom-5 flex items-end gap-[3%] border-b border-[#48847c]/60">
        {heights.map((height, index) => (
          <span
            key={height}
            className={
              index % 3 === 1
                ? "flex-1 rounded-t-sm bg-[#d8aa62]/75"
                : "flex-1 rounded-t-sm bg-[#52c9ab]/70"
            }
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function FeaturedNewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="grid overflow-hidden rounded-lg border bg-card sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="order-2 self-center p-4 sm:order-1 sm:p-5 xl:p-6">
        <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="rounded bg-primary/12 px-2 py-0.5 text-[0.625rem] font-bold tracking-widest text-primary uppercase">
            Featured
          </span>
          <NewsCategoryBadge category={article.category} />
        </div>
        <h2 className="text-[1.5rem] leading-[1.14] font-bold tracking-tight lg:text-[1.65rem] 2xl:text-[1.85rem]">
          {article.sourceUrl ? (
            <a className="hover:underline" href={article.sourceUrl}>
              {article.title}
            </a>
          ) : (
            article.title
          )}
        </h2>
        {article.summary && (
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
        )}
        <div className="mt-3">
          <NewsMetadata article={article} />
        </div>
      </div>
      <div className="order-1 sm:order-2 sm:border-l sm:[&>div]:h-full">
        {article.image ? (
          <Image
            src={article.image.src}
            alt={article.image.alt}
            width={article.image.width}
            height={article.image.height}
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 35vw"
            className="aspect-[2.2] h-full w-full object-cover sm:aspect-auto sm:min-h-52"
          />
        ) : (
          <BenchmarkIllustration />
        )}
      </div>
    </article>
  );
}
