import { getMarketDirection } from "@/lib/utils/format-market";
import { cn } from "@/lib/utils";

export function MarketSparkline({
  values,
  changePercent,
}: {
  values: readonly number[];
  changePercent: number;
}) {
  if (values.length < 2 || values.some((value) => !Number.isFinite(value)))
    return null;
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const points = values
    .map(
      (value, index) =>
        `${(index / (values.length - 1)) * 116 + 2},${36 - ((value - min) / range) * 30}`,
    )
    .join(" ");
  const direction = getMarketDirection(changePercent);
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 40"
      className={cn(
        "h-auto w-16 shrink-0 sm:w-23 xl:w-28",
        direction === "up" && "text-market-positive",
        direction === "down" && "text-market-negative",
        direction !== "up" && direction !== "down" && "text-muted-foreground",
      )}
    >
      <polygon
        points={`2,40 ${points} 118,40`}
        fill="currentColor"
        opacity="0.09"
      />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
