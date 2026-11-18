import { MarketDashboard } from "@/components/market/market-dashboard";
import { BreakingNewsBanner } from "@/components/news/breaking-news-banner";
import { FeaturedNewsCard } from "@/components/news/featured-news-card";
import { NewsSection } from "@/components/news/news-section";
import { DemoDataNotice } from "@/components/shared/demo-data-notice";
import {
  demoBreakingNews,
  demoFeaturedNews,
  demoLatestNews,
} from "@/lib/mock/news";

export default function Home() {
  return (
    <MarketDashboard
      banner={
        <>
          <DemoDataNotice scope="news" />
          <BreakingNewsBanner article={demoBreakingNews} />
        </>
      }
    >
      <NewsSection
        articles={demoLatestNews}
        featured={<FeaturedNewsCard article={demoFeaturedNews} />}
      />
    </MarketDashboard>
  );
}
