import { ArrowUpRight, CalendarDays } from "lucide-react";

export function DividendCalendar() {
  return (
    <section
      id="dividends"
      aria-labelledby="dividend-heading"
      className="rounded-lg border bg-card p-4"
    >
      <h2
        id="dividend-heading"
        className="flex items-center gap-2 text-lg font-bold"
      >
        <CalendarDays aria-hidden="true" className="size-5 text-primary" />
        Indian Share Dividend Calendar
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Select India in TradingView to browse upcoming ex-dividend dates and
        payouts. Check NSE filings for company-announced dates.
      </p>
      <div className="mt-2 flex flex-wrap gap-x-5">
        <a
          href="https://in.tradingview.com/dividend-calendar/"
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary underline underline-offset-4"
        >
          Open dividend calendar{" "}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
        <a
          href="https://www.nseindia.com/companies-listing/corporate-filings-application"
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary underline underline-offset-4"
        >
          Check NSE corporate filings{" "}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
      </div>
    </section>
  );
}
