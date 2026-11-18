// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { MarketIndexCard } from "@/components/market/market-index-card";
import { StockWatchlist } from "@/components/market/stock-watchlist";
import type { MarketIndex, StockQuote } from "@/types/market";

afterEach(cleanup);

const index: MarketIndex = {
  id: "test-index",
  name: "Test Index",
  symbol: "NSE:TEST",
  value: 24386.65,
  change: 0,
  changePercent: 0,
  updatedAt: "2026-01-14T10:00:00Z",
  isDemo: true,
};

it.each([
  [1, "Up", "+1.00%"],
  [-1, "Down", "-1.00%"],
  [0, "Unchanged", "0.00%"],
] as const)(
  "shows an index value and the direction for %s",
  (changePercent, direction, percentage) => {
    render(<MarketIndexCard index={{ ...index, changePercent }} />);
    expect(screen.getByRole("heading", { name: "Test Index" })).toBeVisible();
    expect(screen.getByText("NSE:TEST")).toBeVisible();
    expect(screen.getByText("24,386.65")).toBeVisible();
    expect(screen.getByText("Demo")).toBeVisible();
    expect(screen.getByText(direction)).toBeInTheDocument();
    expect(screen.getByText(percentage)).toBeVisible();
  },
);

it("renders sample watchlist quotes with prices and directional text", () => {
  const quote: StockQuote = {
    symbol: "TEST",
    name: "Example Company",
    exchange: "NSE",
    price: 990,
    previousClose: 1000,
    change: -10,
    changePercent: -1,
    updatedAt: index.updatedAt,
    dataSource: "Test",
    isDemo: true,
    isDelayed: false,
  };
  render(<StockWatchlist quotes={[quote]} />);
  expect(
    screen.getByRole("heading", { name: "Stock Watchlist" }),
  ).toBeVisible();
  expect(screen.getByText("Demo quotes")).toBeVisible();
  const row = screen.getByRole("row", { name: /TEST\s*Example Company/ });
  expect(within(row).getByText("₹990.00")).toBeVisible();
  expect(within(row).getByText("Down")).toBeInTheDocument();
});
