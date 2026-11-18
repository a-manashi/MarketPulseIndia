import { ChartNoAxesColumn } from "lucide-react";
import { MarketMovement } from "@/components/market/market-movement";
import { formatCurrency } from "@/lib/utils/format-market";
import type { StockQuote } from "@/types/market";

export function MarketTicker({ quotes }: { quotes: readonly StockQuote[] }) {
  return (
    <section className="border-b bg-card/55" aria-label="Market ticker">
      <div className="site-container flex items-stretch">
        <div className="z-0 flex shrink-0 items-center gap-1.5 border-r pr-3 text-[0.6875rem] font-bold tracking-wider text-primary uppercase sm:pr-4">
          <ChartNoAxesColumn
            aria-hidden="true"
            className="hidden size-4 sm:block"
          />
          {quotes.some((quote) => quote.isDemo)
            ? "Demo ticker"
            : "Market ticker"}
        </div>
        <div
          role="region"
          aria-label="Scrollable stock quotes"
          tabIndex={0}
          className="min-w-0 overflow-x-auto overscroll-x-contain"
        >
          <ul className="flex min-w-max">
            {quotes.map((quote) => (
              <li
                key={quote.symbol}
                className="flex items-center gap-3 border-r px-4 py-3 text-xs whitespace-nowrap"
              >
                <span className="font-bold tracking-wide">{quote.symbol}</span>
                <span className="text-muted-foreground tabular-nums">
                  {formatCurrency(quote.price)}
                </span>
                <MarketMovement
                  changePercent={quote.changePercent}
                  className="font-semibold"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
