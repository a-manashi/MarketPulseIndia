import { z } from "zod";

const toggle = (fallback: "true" | "false") =>
  z
    .enum(["true", "false"])
    .default(fallback)
    .transform((value) => value === "true");

const marketDisplaySchema = z.object({
  TRADINGVIEW_WIDGETS_ENABLED: toggle("true"),
  TRADINGVIEW_CALENDAR_ENABLED: toggle("false"),
  MARKET_CUSTOM_SECTIONS_ENABLED: toggle("true"),
});

export function parseMarketDisplay(input: {
  TRADINGVIEW_WIDGETS_ENABLED?: string;
  TRADINGVIEW_CALENDAR_ENABLED?: string;
  MARKET_CUSTOM_SECTIONS_ENABLED?: string;
}) {
  return marketDisplaySchema.parse(input);
}

const bseWatchlist = [
  ["BSE:RELIANCE", "Reliance Industries"],
  ["BSE:TCS", "Tata Consultancy Services"],
  ["BSE:INFY", "Infosys"],
  ["BSE:HDFCBANK", "HDFC Bank"],
  ["BSE:ICICIBANK", "ICICI Bank"],
  ["BSE:SBIN", "State Bank of India"],
  ["BSE:ITC", "ITC"],
  ["BSE:LT", "Larsen & Toubro"],
  ["BSE:BHARTIARTL", "Bharti Airtel"],
  ["BSE:AXISBANK", "Axis Bank"],
] as const;

const overviewSymbols = { primary: "BSE:SENSEX" } as const;
const tickerSymbols = [
  [overviewSymbols.primary, "SENSEX"],
  bseWatchlist[0],
  bseWatchlist[1],
] as const;

const scriptRoot = "https://s3.tradingview.com/external-embedding/";
export const tradingViewWidgets = {
  ticker: {
    suffix: "ticker-tape",
    label: "Ticker Tape",
    height: 120,
    href: "https://www.tradingview.com/markets/",
  },
  overview: {
    suffix: "mini-symbol-overview",
    label: "SENSEX chart",
    height: 245,
    href: "https://www.tradingview.com/symbols/BSE-SENSEX/",
  },
  watchlist: {
    suffix: "market-overview",
    label: "BSE watchlist",
    height: 660,
    href: "https://www.tradingview.com/markets/stocks-india/",
  },
  calendar: {
    suffix: "events",
    label: "Economic Calendar",
    height: 375,
    href: "https://www.tradingview.com/economic-calendar/",
  },
} as const;

export type WidgetName = keyof typeof tradingViewWidgets;
export type WidgetTheme = "light" | "dark";

export function widgetScript(name: WidgetName): string {
  return scriptRoot + "embed-widget-" + tradingViewWidgets[name].suffix + ".js";
}

export function widgetOptions(name: WidgetName, colorTheme: WidgetTheme) {
  const common = { locale: "en", colorTheme };
  const size = { width: "100%", height: "100%" } as const;
  switch (name) {
    case "ticker":
      return {
        ...common,
        displayMode: "adaptive",
        showSymbolLogo: true,
        symbols: tickerSymbols.map(([proName, title]) => ({ proName, title })),
      };
    case "overview":
      return {
        ...common,
        ...size,
        symbol: overviewSymbols.primary,
        autosize: true,
        dateRange: "12M",
      };
    case "watchlist":
      return {
        ...common,
        ...size,
        showChart: false,
        showSymbolLogo: true,
        tabs: [
          {
            title: "BSE stocks",
            symbols: bseWatchlist.map(([s, d]) => ({ s, d })),
          },
        ],
      };
    case "calendar":
      return {
        ...common,
        ...size,
        importanceFilter: "0,1",
        countryFilter: "in,us",
      };
  }
}
