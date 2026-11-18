import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import {
  formatPercentageChange,
  getMarketDirection,
} from "@/lib/utils/format-market";
import { cn } from "@/lib/utils";

const movements = {
  up: { Icon: ArrowUpRight, label: "Up", color: "text-market-positive" },
  down: { Icon: ArrowDownRight, label: "Down", color: "text-market-negative" },
  flat: {
    Icon: ArrowRight,
    label: "Unchanged",
    color: "text-muted-foreground",
  },
  unavailable: {
    Icon: Minus,
    label: "Unavailable",
    color: "text-muted-foreground",
  },
};

export function MarketMovement({
  changePercent,
  className,
}: {
  changePercent: number;
  className?: string;
}) {
  const { Icon, label, color } = movements[getMarketDirection(changePercent)];
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-0.5 whitespace-nowrap tabular-nums",
        color,
        className,
      )}
    >
      <span className="sr-only">{label} </span>
      <Icon aria-hidden="true" className="size-3.5" />
      {formatPercentageChange(changePercent)}
    </span>
  );
}
