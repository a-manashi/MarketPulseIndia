import { TradingViewWidget } from "@/components/market/tradingview/tradingview-widget";

export function TradingViewTicker() {
  return (
    <section aria-label="Market ticker" className="border-b bg-card">
      <TradingViewWidget name="ticker" />
    </section>
  );
}

export function TradingViewOverview() {
  return (
    <section
      id="markets"
      aria-labelledby="embed-market-heading"
      className="grid min-w-0 rounded-lg border bg-card md:grid-cols-2"
    >
      <div className="self-center px-4 py-4">
        <h1
          id="embed-market-heading"
          className="text-2xl font-bold tracking-tight"
        >
          Market Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          S&amp;P BSE SENSEX and BSE stock prices via TradingView. BSE widget
          quotes are end-of-day.
        </p>
      </div>
      <div className="min-w-0 border-t md:border-t-0 md:border-l">
        <TradingViewWidget name="overview" />
      </div>
    </section>
  );
}

export function TradingViewWatchlist() {
  return (
    <aside
      id="watchlist"
      aria-labelledby="embed-watchlist-heading"
      className="min-w-0 self-start rounded-lg border bg-card"
    >
      <div className="border-b px-4 py-3">
        <h2
          id="embed-watchlist-heading"
          className="text-lg font-bold tracking-tight"
        >
          Stock Watchlist
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          BSE listings · End-of-day quotes via TradingView
        </p>
      </div>
      <TradingViewWidget name="watchlist" />
    </aside>
  );
}

export function TradingViewCalendar() {
  return (
    <section
      aria-labelledby="calendar-heading"
      className="min-w-0 rounded-lg border bg-card"
    >
      <h2
        id="calendar-heading"
        className="border-b px-4 py-3 text-lg font-bold"
      >
        Economic Calendar
      </h2>
      <TradingViewWidget name="calendar" />
    </section>
  );
}
