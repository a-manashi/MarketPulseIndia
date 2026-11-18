import { MarketMovement } from "@/components/market/market-movement";
import { MarketSparkline } from "@/components/market/market-sparkline";
import { Card } from "@/components/ui/card";
import {
  formatAbsoluteChange,
  formatIndexValue,
} from "@/lib/utils/format-market";
import type { MarketIndex } from "@/types/market";

export function MarketIndexCard({ index }: { index: MarketIndex }) {
  return (
    <Card className="gap-0 rounded-lg border p-3.5 ring-0 sm:p-4 xl:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold tracking-wide">{index.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{index.symbol}</p>
        </div>
        {index.isDemo && (
          <span className="rounded border bg-muted px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-wide text-muted-foreground uppercase">
            Demo
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p
            aria-label={formatIndexValue(index.value) + " index points"}
            className="text-[1.35rem] leading-none font-bold tracking-tight tabular-nums xl:text-[1.75rem]"
          >
            {formatIndexValue(index.value)}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs font-medium">
            <span className="text-muted-foreground tabular-nums">
              {formatAbsoluteChange(index.change)} pts
            </span>
            <MarketMovement changePercent={index.changePercent} />
          </p>
        </div>
        {index.sparkline && (
          <MarketSparkline
            values={index.sparkline}
            changePercent={index.changePercent}
          />
        )}
      </div>
    </Card>
  );
}
