// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import Home from "@/app/page";

afterEach(cleanup);

it("renders dashboard sections with clearly identified demo data", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Market Overview",
  );
  expect(screen.getByRole("region", { name: "Market ticker" })).toBeVisible();
  expect(screen.getByText(/News articles are simulated/)).toBeVisible();
  expect(
    screen.getByRole("heading", { name: "Sample breaking news" }),
  ).toBeVisible();
  expect(screen.getByRole("heading", { name: "Latest News" })).toBeVisible();
  const dividends = screen.getByRole("region", {
    name: "Indian Share Dividend Calendar",
  });
  expect(dividends).toBeVisible();
  expect(
    screen.getByRole("link", { name: "Open dividend calendar" }),
  ).toHaveAttribute("href", "https://in.tradingview.com/dividend-calendar/");
  expect(
    screen.getByRole("heading", { name: "Stock Watchlist" }),
  ).toBeVisible();
});
