import { MarketOverview } from "@/components/market/market-overview";
import { MarketTicker } from "@/components/market/market-ticker";
import { StockWatchlist } from "@/components/market/stock-watchlist";
import { BreakingNewsBanner } from "@/components/news/breaking-news-banner";
import { FeaturedNewsCard } from "@/components/news/featured-news-card";
import { NewsSection } from "@/components/news/news-section";
import { DemoDataNotice } from "@/components/shared/demo-data-notice";
import { demoIndices, demoQuotes } from "@/lib/mock/market";
import {
  demoBreakingNews,
  demoFeaturedNews,
  demoLatestNews,
} from "@/lib/mock/news";

export default function Home() {
  return (
    <>
      <MarketTicker quotes={demoQuotes} />
      <div className="site-container space-y-4 pt-4 sm:space-y-5 sm:pt-5">
        <DemoDataNotice />
        <MarketOverview indices={demoIndices} />
        <BreakingNewsBanner article={demoBreakingNews} />
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(285px,3fr)]">
          <NewsSection
            articles={demoLatestNews}
            featured={<FeaturedNewsCard article={demoFeaturedNews} />}
          />
          <StockWatchlist quotes={demoQuotes} />
        </div>
      </div>
    </>
  );
}
