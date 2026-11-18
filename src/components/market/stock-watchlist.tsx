import { ListFilter } from "lucide-react";
import type { ReactNode } from "react";
import { MarketMovement } from "@/components/market/market-movement";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency } from "@/lib/utils/format-market";

type WatchlistRow = {
  symbol: string;
  name: string;
  href?: string;
  price?: number | null;
  changePercent?: number | null;
  isDemo?: boolean;
};

export function StockWatchlist({
  quotes,
  action,
}: {
  quotes: readonly WatchlistRow[];
  action?: ReactNode;
}) {
  return (
    <aside
      id="watchlist"
      aria-labelledby="watchlist-heading"
      className="self-start rounded-lg border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
        <h2
          id="watchlist-heading"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <ListFilter aria-hidden="true" className="size-4 text-primary" />{" "}
          Stock Watchlist
        </h2>
        {quotes.some((quote) => quote.isDemo) && (
          <span className="rounded border bg-muted px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-wide text-muted-foreground uppercase">
            Demo quotes
          </span>
        )}
      </div>
      {action}
      {quotes.length === 0 ? (
        <EmptyState message="No quotes are available." />
      ) : (
        <table className="w-full table-fixed text-xs">
          <caption className="sr-only">
            Watchlist prices and percentage changes
          </caption>
          <thead className="border-b bg-muted/60 text-muted-foreground">
            <tr>
              <th
                scope="col"
                className="w-2/5 py-2 pl-3 text-left font-medium sm:pl-4"
              >
                Symbol
              </th>
              <th
                scope="col"
                className="w-[32%] px-1 py-2 text-right font-medium"
              >
                Price
              </th>
              <th
                scope="col"
                className="py-2 pr-3 text-right font-medium sm:pr-4"
              >
                Change
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {quotes.map((quote) => (
              <tr key={quote.symbol} className="align-middle">
                <th scope="row" className="py-2.5 pr-1 pl-3 text-left sm:pl-4">
                  <span className="block font-bold tracking-wide">
                    {quote.href ? (
                      <a href={quote.href} className="hover:underline">
                        {quote.symbol}
                      </a>
                    ) : (
                      quote.symbol
                    )}
                  </span>
                  <span className="mt-0.5 block text-[0.6875rem] leading-snug font-normal text-muted-foreground">
                    {quote.name}
                  </span>
                </th>
                <td className="px-1 text-right font-semibold whitespace-nowrap tabular-nums">
                  {quote.price != null ? (
                    formatCurrency(quote.price)
                  ) : (
                    <span aria-label="Price unavailable">—</span>
                  )}
                </td>
                <td className="pr-3 text-right font-semibold sm:pr-4">
                  {quote.changePercent != null ? (
                    <MarketMovement changePercent={quote.changePercent} />
                  ) : (
                    <span aria-label="Change unavailable">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </aside>
  );
}
