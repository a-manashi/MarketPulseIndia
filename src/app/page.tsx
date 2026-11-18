import { MarketDashboard } from "@/components/market/market-dashboard";
import { DividendCalendar } from "@/components/market/dividend-calendar";
import {
  TradingViewTicker,
  TradingViewOverview,
  TradingViewWatchlist,
  TradingViewCalendar,
} from "@/components/market/tradingview/market-panels";
import { parseMarketDisplay } from "@/config/tradingview";
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
  const display = parseMarketDisplay({
    TRADINGVIEW_WIDGETS_ENABLED: process.env.TRADINGVIEW_WIDGETS_ENABLED,
    TRADINGVIEW_CALENDAR_ENABLED: process.env.TRADINGVIEW_CALENDAR_ENABLED,
    MARKET_CUSTOM_SECTIONS_ENABLED: process.env.MARKET_CUSTOM_SECTIONS_ENABLED,
  });
  const widgets = display.TRADINGVIEW_WIDGETS_ENABLED;
  return (
    <MarketDashboard
      customEnabled={display.MARKET_CUSTOM_SECTIONS_ENABLED}
      widgetTicker={widgets ? <TradingViewTicker /> : undefined}
      widgetOverview={widgets ? <TradingViewOverview /> : undefined}
      widgetWatchlist={widgets ? <TradingViewWatchlist /> : undefined}
      calendar={
        <>
          <DividendCalendar />
          {widgets && display.TRADINGVIEW_CALENDAR_ENABLED && (
            <TradingViewCalendar />
          )}
        </>
      }
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
