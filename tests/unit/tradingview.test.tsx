// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { TradingViewWidget } from "@/components/market/tradingview/tradingview-widget";
import Home from "@/app/page";
import {
  parseMarketDisplay,
  widgetOptions,
  widgetScript,
} from "@/config/tradingview";

const state = vi.hoisted(() => ({ theme: "dark" }));
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: state.theme }),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  state.theme = "dark";
});

it("keeps independent flags and only uses verified BSE quote symbols", () => {
  expect(parseMarketDisplay({})).toEqual({
    TRADINGVIEW_WIDGETS_ENABLED: true,
    TRADINGVIEW_CALENDAR_ENABLED: false,
    MARKET_CUSTOM_SECTIONS_ENABLED: true,
  });
  expect(
    parseMarketDisplay({
      TRADINGVIEW_WIDGETS_ENABLED: "false",
      TRADINGVIEW_CALENDAR_ENABLED: "true",
    }),
  ).toMatchObject({
    TRADINGVIEW_WIDGETS_ENABLED: false,
    TRADINGVIEW_CALENDAR_ENABLED: true,
  });
  expect(() =>
    parseMarketDisplay({ MARKET_CUSTOM_SECTIONS_ENABLED: "yes" }),
  ).toThrow();
  const options = JSON.stringify(
    ["ticker", "overview", "watchlist"].map((name) =>
      widgetOptions(
        name === "ticker"
          ? "ticker"
          : name === "overview"
            ? "overview"
            : "watchlist",
        "dark",
      ),
    ),
  );
  expect(options).toContain("BSE:SENSEX");
  expect(options).toContain("BSE:AXISBANK");
  expect(options).not.toContain("NSE:");
});

it("initializes once under Strict Mode and replaces the frame when the theme changes", async () => {
  const view = (
    <StrictMode>
      <TradingViewWidget name="overview" />
    </StrictMode>
  );
  const { container, rerender, unmount } = render(view);
  await act(async () => {});
  expect(container.querySelectorAll("script")).toHaveLength(1);
  const script = container.querySelector("script");
  expect(script?.src).toBe(widgetScript("overview"));
  expect(script?.textContent).toContain('"colorTheme":"dark"');
  await act(async () => {
    container
      .querySelector(".tradingview-widget-container__widget")
      ?.replaceWith(document.createElement("iframe"));
  });
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  state.theme = "light";
  rerender(
    <StrictMode>
      <TradingViewWidget name="overview" />
    </StrictMode>,
  );
  await act(async () => {});
  expect(script?.isConnected).toBe(false);
  expect(container.querySelector("iframe")).toBeNull();
  expect(container.querySelector("script")?.textContent).toContain(
    '"colorTheme":"light"',
  );
  unmount();
  expect(container.querySelector("script")).toBeNull();
});

it("uses the widgets independently when custom sections are explicitly disabled", () => {
  vi.stubEnv("MARKET_CUSTOM_SECTIONS_ENABLED", "false");
  vi.stubEnv("TRADINGVIEW_WIDGETS_ENABLED", "true");
  vi.stubEnv("TRADINGVIEW_CALENDAR_ENABLED", "true");
  render(<Home />);
  expect(screen.getByText(/BSE widget quotes are end-of-day/)).toBeVisible();
  expect(
    screen.getByRole("heading", { name: "Stock Watchlist" }),
  ).toBeVisible();
  expect(
    screen.getByRole("heading", { name: "Economic Calendar" }),
  ).toBeVisible();
  expect(
    screen.queryByRole("button", { name: /refresh market data/i }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Latest News" })).toBeVisible();
});

it("retries with a new script after a load error", async () => {
  const { container } = render(<TradingViewWidget name="ticker" />);
  await act(async () => {});
  const failed = container.querySelector("script");
  if (!failed) throw new Error("Expected an inserted TradingView script");
  fireEvent.error(failed);
  expect(screen.getByRole("status")).toHaveTextContent(
    "Ticker Tape is unavailable",
  );
  expect(failed.isConnected).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: "Retry Ticker Tape" }));
  await act(async () => {});
  expect(container.querySelectorAll("script")).toHaveLength(1);
  expect(container.querySelector("script")).not.toBe(failed);
});
