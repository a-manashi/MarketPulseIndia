// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { MarketOverview } from "@/components/market/market-overview";
import { MarketTicker } from "@/components/market/market-ticker";
import { MarketSparkline } from "@/components/market/market-sparkline";
import { DemoDataNotice } from "@/components/shared/demo-data-notice";
import { demoIndices, demoQuotes } from "@/lib/mock/market";

afterEach(cleanup);

it("keeps the isolated Phase 2 market fixtures clearly labeled", () => {
  render(
    <>
      <MarketTicker quotes={demoQuotes} />
      <MarketOverview indices={demoIndices} />
      <DemoDataNotice />
    </>,
  );
  const ticker = screen.getByRole("region", { name: "Market ticker" });
  expect(within(ticker).getByText("Demo ticker")).toBeVisible();
  expect(within(ticker).getAllByRole("listitem")).toHaveLength(10);
  expect(
    screen.getByText("Demo mode — market data not connected"),
  ).toBeVisible();
  expect(screen.getAllByText("Demo")).toHaveLength(3);
  expect(
    screen.getByText(/Market data and news shown are simulated/),
  ).toBeVisible();
});

it("does not draw a sparkline with missing or invalid values", () => {
  const { container, rerender } = render(
    <MarketSparkline values={[5]} changePercent={0} />,
  );
  expect(container.querySelector("svg")).toBeNull();
  rerender(<MarketSparkline values={[0, NaN]} changePercent={0} />);
  expect(container.querySelector("svg")).toBeNull();
  rerender(<MarketSparkline values={[2, 2]} changePercent={0} />);
  expect(container.querySelector("polyline")).toHaveAttribute(
    "points",
    "2,36 118,36",
  );
});
