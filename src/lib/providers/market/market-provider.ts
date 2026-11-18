import type { MarketSnapshot } from "@/types/market-snapshot";

export interface MarketDataProvider {
  readonly id: MarketSnapshot["provider"];
  getSnapshot(fetchedAt: string, signal: AbortSignal): Promise<MarketSnapshot>;
}
