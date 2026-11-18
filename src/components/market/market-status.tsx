import { Info } from "lucide-react";

export function MarketStatus() {
  return (
    <p className="flex items-center gap-1.5 rounded-full border border-market-warning/30 bg-market-warning/10 px-3 py-1.5 text-xs font-semibold text-market-warning">
      <Info aria-hidden="true" className="size-3.5 shrink-0" />
      Demo mode — market data not connected
    </p>
  );
}
