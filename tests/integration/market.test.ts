import { afterEach, expect, it, vi } from "vitest";
import { GET } from "@/app/api/market/quotes/route";
import { selectMarketProvider } from "@/lib/providers/market/provider-factory";
import { marketSnapshotSchema } from "@/types/market-snapshot";

vi.mock("server-only", () => ({}));
afterEach(() => vi.unstubAllEnvs());

const request = () => new Request("http://localhost:3000/api/market/quotes");

it("returns a validated, price-free default without caching", async () => {
  vi.stubEnv("MARKET_DATA_PROVIDER", undefined);
  const response = await GET(request());
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe("no-store");
  const { data } = await response.json();
  expect(marketSnapshotSchema.parse(data)).toMatchObject({
    status: "disabled",
    quotes: [],
    indices: [],
  });
});

it("returns labeled and deterministic local demo quotes, preserving timestamp meaning", async () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("MARKET_DATA_PROVIDER", "mock");
  const response = await GET(request());
  expect(response.status).toBe(200);
  const snapshot = marketSnapshotSchema.parse((await response.json()).data);
  expect(snapshot).toMatchObject({
    provider: "mock",
    status: "partial",
    unavailableSymbols: ["NSE:CNXIT"],
  });
  expect(snapshot.quotes[0]).toMatchObject({
    id: "NSE:RELIANCE",
    price: 1374.6,
    freshness: "demo",
    isDemo: true,
    fetchedAt: snapshot.fetchedAt,
  });
  expect(snapshot.quotes[0]?.updatedAt).not.toBe(snapshot.fetchedAt);
});

it.each([
  ["production", "production"],
  ["development", "preview"],
  ["development", undefined],
])(
  "rejects NSE quotes in %s / %s even with explicit settings",
  (NODE_ENV, VERCEL_ENV) => {
    expect(() =>
      selectMarketProvider({
        NODE_ENV,
        VERCEL_ENV,
        MARKET_DATA_PROVIDER: "nse-mcp",
        NSE_MCP_LOCAL_RESEARCH_ENABLED: "true",
      }),
    ).toThrow();
  },
);

it("rejects mock mode on hosted or production builds and fails closed on invalid settings", () => {
  expect(() =>
    selectMarketProvider({
      NODE_ENV: "production",
      MARKET_DATA_PROVIDER: "mock",
    }),
  ).toThrow();
  expect(() =>
    selectMarketProvider({
      NODE_ENV: "development",
      VERCEL: "1",
      MARKET_DATA_PROVIDER: "mock",
    }),
  ).toThrow();
  expect(() =>
    selectMarketProvider({ MARKET_DATA_PROVIDER: "unknown" }),
  ).toThrow();
  expect(() =>
    selectMarketProvider({ NSE_MCP_LOCAL_RESEARCH_ENABLED: "1" }),
  ).toThrow();
});

it("returns safe errors for unauthorized providers and rejects caller-supplied symbols", async () => {
  vi.stubEnv("MARKET_DATA_PROVIDER", "nse-mcp");
  const response = await GET(request());
  expect(response.status).toBe(403);
  expect(await response.json()).toEqual({
    error: {
      code: "PROVIDER_NOT_AUTHORIZED",
      message: "Market data is currently unavailable.",
    },
  });
  expect((await GET(new Request(request().url + "?symbols=TCS"))).status).toBe(
    400,
  );
});

it("rejects invalid normalized numbers and ambiguous source timestamps", async () => {
  const snapshot = await selectMarketProvider({
    NODE_ENV: "development",
    MARKET_DATA_PROVIDER: "mock",
  }).getSnapshot("2026-01-14T10:00:00Z", new AbortController().signal);
  const quote = snapshot.quotes[0];
  expect(
    marketSnapshotSchema.safeParse({
      ...snapshot,
      quotes: [{ ...quote, price: NaN }],
    }).success,
  ).toBe(false);
  expect(
    marketSnapshotSchema.safeParse({
      ...snapshot,
      quotes: [{ ...quote, updatedAt: "2026-01-14T10:00:00" }],
    }).success,
  ).toBe(false);
});
