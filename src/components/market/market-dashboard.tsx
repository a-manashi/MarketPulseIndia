"use client";

import { useRef, type ReactNode } from "react";
import { MarketOverview } from "@/components/market/market-overview";
import { MarketTicker } from "@/components/market/market-ticker";
import { StockWatchlist } from "@/components/market/stock-watchlist";
import { Button } from "@/components/ui/button";
import { supportedIndices, supportedStocks } from "@/config/stocks";
import { useMarketQuotes } from "@/hooks/use-market-quotes";

export function MarketDashboard({
  banner,
  children,
  customEnabled,
  widgetTicker,
  widgetOverview,
  widgetWatchlist,
  calendar,
}: {
  banner: ReactNode;
  children: ReactNode;
  customEnabled: boolean;
  widgetTicker?: ReactNode;
  widgetOverview?: ReactNode;
  widgetWatchlist?: ReactNode;
  calendar?: ReactNode;
}) {
  const { data, error, isLoading, isValidating, mutate } =
    useMarketQuotes(customEnabled);
  const refreshing = useRef(false);
  const snapshot = error ? undefined : data;
  const showCustom = customEnabled && snapshot?.status !== "disabled";
  const hasWatchlist = showCustom || Boolean(widgetWatchlist);
  const quotes = Object.entries(supportedStocks).map(([symbol, instrument]) => {
    const quote = snapshot?.quotes.find(({ id }) => id === instrument.id);
    return {
      symbol,
      name: instrument.name,
      price: quote?.price ?? null,
      changePercent: quote?.changePercent ?? null,
      isDemo: quote?.isDemo ?? false,
    };
  });
  const indices = Object.values(supportedIndices).map((instrument) => {
    const quote = snapshot?.indices.find(({ id }) => id === instrument.id);
    return {
      id: instrument.id,
      symbol: instrument.id,
      name: instrument.name,
      value: quote?.value ?? null,
      change: quote?.change ?? null,
      changePercent: quote?.changePercent ?? null,
      updatedAt: quote?.updatedAt ?? null,
      sparkline: quote?.sparkline,
      freshness: quote?.freshness,
      isDemo: quote?.isDemo ?? false,
    };
  });
  const notice = isLoading
    ? "Loading market data…"
    : snapshot?.isDemo
      ? "Demo market data — simulated values."
      : snapshot?.provider === "nse-mcp"
        ? "NSE market data — local research mode. Data may be delayed."
        : snapshot?.status === "available" || snapshot?.status === "partial"
          ? "Market data"
          : "Market data is currently unavailable.";

  async function refresh() {
    if (refreshing.current || isValidating) return;
    refreshing.current = true;
    try {
      await mutate();
    } catch {
      /* SWR exposes the refresh error. */
    } finally {
      refreshing.current = false;
    }
  }

  return (
    <>
      {showCustom ? <MarketTicker quotes={quotes} /> : widgetTicker}
      <div className="site-container space-y-4 pt-4 sm:space-y-5 sm:pt-5">
        {showCustom ? (
          <MarketOverview
            indices={indices}
            status={
              <div className="flex flex-wrap items-center gap-2">
                <p role="status" className="text-sm text-muted-foreground">
                  {notice}
                  {snapshot?.status === "partial" &&
                    " Some market instruments are currently unavailable."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  disabled={isValidating}
                  onClick={() => void refresh()}
                >
                  {isValidating
                    ? "Refreshing market data…"
                    : "Refresh market data"}
                </Button>
              </div>
            }
          />
        ) : (
          (widgetOverview ?? (
            <section id="markets" className="rounded-lg border bg-card p-4">
              <h1 className="text-2xl font-bold tracking-tight">
                Market Overview
              </h1>
              <p id="watchlist" className="text-sm text-muted-foreground">
                Market displays are disabled.
              </p>
            </section>
          ))
        )}
        {banner}
        <div
          className={
            hasWatchlist
              ? "grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(285px,3fr)]"
              : undefined
          }
        >
          {children}
          {showCustom ? <StockWatchlist quotes={quotes} /> : widgetWatchlist}
        </div>
        {calendar}
      </div>
    </>
  );
}
