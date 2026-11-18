import "server-only";
import { selectMarketProvider } from "@/lib/providers/market/provider-factory";
import {
  marketSnapshotSchema,
  type MarketSnapshot,
} from "@/types/market-snapshot";

export async function getMarketSnapshot(
  signal: AbortSignal,
): Promise<MarketSnapshot> {
  const provider = selectMarketProvider();
  const snapshot = await provider.getSnapshot(new Date().toISOString(), signal);
  return marketSnapshotSchema.parse(snapshot);
}
