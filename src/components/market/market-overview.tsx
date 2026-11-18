import { MarketIndexCard } from "@/components/market/market-index-card";
import { MarketStatus } from "@/components/market/market-status";
import type { MarketIndex } from "@/types/market";

export function MarketOverview({
  indices,
}: {
  indices: readonly MarketIndex[];
}) {
  return (
    <section
      id="markets"
      aria-labelledby="market-heading"
      className="space-y-3.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h1
          id="market-heading"
          className="text-2xl font-bold tracking-tight sm:text-[1.8rem]"
        >
          Market Overview
        </h1>
        <MarketStatus />
      </div>
      <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
        {indices.map((index) => (
          <MarketIndexCard key={index.id} index={index} />
        ))}
      </div>
    </section>
  );
}
