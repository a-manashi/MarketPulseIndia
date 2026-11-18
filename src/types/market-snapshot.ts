import { z } from "zod";

const freshness = z.enum([
  "real-time",
  "delayed",
  "end-of-day",
  "stale",
  "unknown",
  "demo",
]);
const instrument = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  exchange: z.enum(["NSE", "BSE"]),
  previousClose: z.number().positive().nullable(),
  change: z.number().nullable(),
  changePercent: z.number().nullable(),
  updatedAt: z.iso.datetime({ offset: true }).nullable(),
  fetchedAt: z.iso.datetime(),
  dataSource: z.string().min(1),
  freshness,
  isDemo: z.boolean(),
});
export const marketSnapshotSchema = z.object({
  quotes: z.array(
    instrument.extend({
      price: z.number().nonnegative(),
      currency: z.literal("INR"),
      volume: z.number().nonnegative().nullable().optional(),
    }),
  ),
  indices: z.array(
    instrument.extend({
      value: z.number().nonnegative(),
      sparkline: z.array(z.number()).optional(),
    }),
  ),
  provider: z.enum(["disabled", "mock", "nse-mcp"]),
  fetchedAt: z.iso.datetime(),
  isDemo: z.boolean(),
  status: z.enum(["available", "partial", "unavailable", "disabled"]),
  unavailableSymbols: z.array(z.string()),
  warnings: z.array(z.string()),
});
export type MarketSnapshot = z.infer<typeof marketSnapshotSchema>;
export type MarketProviderId = MarketSnapshot["provider"];
