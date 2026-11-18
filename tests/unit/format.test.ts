import { describe, expect, it } from "vitest";
import { formatPublishedAt } from "@/lib/utils/format-date";
import {
  formatAbsoluteChange,
  formatCurrency,
  formatIndexValue,
  formatPercentageChange,
  getMarketDirection,
} from "@/lib/utils/format-market";
import { demoQuotes } from "@/lib/mock/market";

describe("Indian financial formatting", () => {
  it("formats INR and index points using Indian grouping", () => {
    expect(formatCurrency(1234567.5)).toBe("₹12,34,567.50");
    expect(formatIndexValue(1234567.5)).toBe("12,34,567.50");
    expect(formatAbsoluteChange(145.2)).toBe("+145.20");
  });

  it.each([
    [1.25, "+1.25%", "up"],
    [-0.42, "-0.42%", "down"],
    [0, "0.00%", "flat"],
    [-0, "0.00%", "flat"],
    [-0.001, "0.00%", "flat"],
  ] as const)(
    "signs %s consistently with the direction",
    (value, formatted, direction) => {
      expect(formatPercentageChange(value)).toBe(formatted);
      expect(getMarketDirection(value)).toBe(direction);
    },
  );

  it.each([NaN, Infinity, -Infinity])(
    "handles unavailable value %s",
    (value) => {
      expect(formatCurrency(value)).toBe("—");
      expect(formatIndexValue(value)).toBe("—");
      expect(formatPercentageChange(value)).toBe("—");
      expect(getMarketDirection(value)).toBe("unavailable");
    },
  );

  it("formats UTC timestamps in IST and rejects invalid dates", () => {
    expect(formatPublishedAt("2026-01-14T22:00:00Z")).toMatch(
      /15 Jan 2026.*03:30 IST/,
    );
    expect(formatPublishedAt("invalid")).toBe("Date unavailable");
  });
});

it("derives every demo stock change from its previous close", () => {
  expect(demoQuotes).toHaveLength(10);
  for (const quote of demoQuotes) {
    expect(quote.isDemo).toBe(true);
    expect(quote.change).toBeCloseTo(quote.price - quote.previousClose);
    expect(quote.changePercent).toBeCloseTo(
      (quote.change / quote.previousClose) * 100,
    );
  }
});
