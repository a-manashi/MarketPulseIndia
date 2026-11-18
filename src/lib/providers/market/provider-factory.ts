import "server-only";
import { z } from "zod";
import { supportedIndices, supportedStocks } from "@/config/stocks";
import { demoIndices, demoQuotes } from "@/lib/mock/market";
import type { MarketDataProvider } from "@/lib/providers/market/market-provider";
import type { MarketSnapshot } from "@/types/market-snapshot";

const config = z.object({
  MARKET_DATA_PROVIDER: z
    .enum(["disabled", "mock", "nse-mcp"])
    .default("disabled"),
  NSE_MCP_LOCAL_RESEARCH_ENABLED: z.enum(["true", "false"]).default("false"),
});

export class MarketAccessError extends Error {
  constructor(
    public readonly code:
      "PROVIDER_NOT_AUTHORIZED" | "INVALID_PROVIDER_CONFIGURATION",
    public readonly status: number,
  ) {
    super("Market data is unavailable.");
  }
}

const instruments = [
  ...Object.values(supportedStocks),
  ...Object.values(supportedIndices),
];

const disabledProvider: MarketDataProvider = {
  id: "disabled",
  async getSnapshot(fetchedAt) {
    return {
      provider: "disabled",
      fetchedAt,
      status: "disabled",
      isDemo: false,
      quotes: [],
      indices: [],
      unavailableSymbols: instruments.map(({ id }) => id),
      warnings: [],
    };
  },
};

const mockProvider: MarketDataProvider = {
  id: "mock",
  async getSnapshot(fetchedAt) {
    const shared = {
      fetchedAt,
      freshness: "demo",
      dataSource: "MarketPulse Demo",
    } as const;
    const quotes = demoQuotes.map((quote) => ({
      ...quote,
      ...shared,
      id: `NSE:${quote.symbol}`,
      exchange: "NSE" as const,
      currency: "INR" as const,
    }));
    const indices = demoIndices.map(({ symbol, sparkline, ...index }) => ({
      ...index,
      ...shared,
      id: symbol,
      symbol: symbol.split(":")[1],
      exchange: symbol.startsWith("BSE:") ? ("BSE" as const) : ("NSE" as const),
      previousClose: null,
      sparkline: sparkline ? [...sparkline] : undefined,
    }));
    const found = new Set([...quotes, ...indices].map(({ id }) => id));
    const unavailableSymbols = instruments
      .filter(({ id }) => !found.has(id))
      .map(({ id }) => id);
    const snapshot: MarketSnapshot = {
      provider: "mock",
      fetchedAt,
      status: unavailableSymbols.length ? "partial" : "available",
      isDemo: true,
      quotes,
      indices,
      unavailableSymbols,
      warnings: [],
    };
    return snapshot;
  },
};

export function selectMarketProvider(
  environment: Record<string, string | undefined> = process.env,
): MarketDataProvider {
  const parsed = config.safeParse(environment);
  if (!parsed.success)
    throw new MarketAccessError("INVALID_PROVIDER_CONFIGURATION", 503);
  switch (parsed.data.MARKET_DATA_PROVIDER) {
    case "nse-mcp":
      // Quote retrieval requires authorization and verified tool contracts. No app runtime can reach NSE.
      throw new MarketAccessError("PROVIDER_NOT_AUTHORIZED", 403);
    case "mock":
      if (
        environment.NODE_ENV !== "development" ||
        environment.VERCEL !== undefined ||
        environment.VERCEL_ENV !== undefined ||
        environment.VERCEL_TARGET_ENV !== undefined
      ) {
        throw new MarketAccessError("PROVIDER_NOT_AUTHORIZED", 403);
      }
      return mockProvider;
    case "disabled":
      return disabledProvider;
  }
}
