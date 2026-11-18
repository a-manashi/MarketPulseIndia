import { cn } from "@/lib/utils";

function Bar({ className }: { className: string }) {
  return (
    <span
      className={cn(
        "block rounded bg-muted motion-safe:animate-pulse",
        className,
      )}
    />
  );
}

export function MarketOverviewSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading market overview"
      className="grid gap-2.5 sm:grid-cols-3 sm:gap-3"
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          aria-hidden="true"
          className="space-y-3 rounded-lg border bg-card p-4"
        >
          <Bar className="h-4 w-24" />
          <Bar className="h-3 w-20" />
          <Bar className="h-6 w-32" />
          <Bar className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function NewsListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading news"
      className="divide-y rounded-lg border bg-card"
    >
      {[0, 1, 2].map((index) => (
        <div key={index} aria-hidden="true" className="space-y-2 p-4">
          <Bar className="h-3 w-20" />
          <Bar className="h-5 w-3/4" />
          <Bar className="h-4 w-5/6" />
          <Bar className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function WatchlistSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading watchlist"
      className="divide-y rounded-lg border bg-card"
    >
      <div aria-hidden="true" className="p-4">
        <Bar className="h-5 w-36" />
      </div>
      {Array.from({ length: 10 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex justify-between gap-3 px-4 py-4"
        >
          <Bar className="h-4 w-20" />
          <Bar className="h-4 w-16" />
          <Bar className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}
