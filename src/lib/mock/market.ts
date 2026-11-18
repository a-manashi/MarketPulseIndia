import { supportedStocks, type StockSymbol } from "@/config/stocks";
import type { MarketIndex, StockQuote } from "@/types/market";

const updatedAt = "2026-01-14T10:00:00.000Z";

const samplePrices: readonly [StockSymbol, number, number][] = [
  ["RELIANCE", 1374.6, 1362],
  ["TCS", 3884.25, 3906],
  ["INFY", 1618.4, 1603],
  ["HDFCBANK", 1685.1, 1674],
  ["ICICIBANK", 1260.45, 1256],
  ["SBIN", 792.55, 797],
  ["ITC", 432.8, 429],
  ["LT", 3482.75, 3504],
  ["BHARTIARTL", 1658.3, 1640],
  ["AXISBANK", 1120, 1120],
];

function movement(value: number, previousClose: number) {
  const change = Number((value - previousClose).toFixed(2));
  return { change, changePercent: (change / previousClose) * 100 };
}

export const demoQuotes: readonly StockQuote[] = samplePrices.map(
  ([symbol, price, previousClose]) => ({
    symbol,
    name: supportedStocks[symbol].name,
    exchange: "NSE",
    price,
    previousClose,
    ...movement(price, previousClose),
    updatedAt,
    dataSource: "MarketPulse Demo",
    isDelayed: false,
    isDemo: true,
  }),
);

const sampleIndices: readonly [
  string,
  string,
  string,
  number,
  number,
  readonly number[],
][] = [
  [
    "nifty-50",
    "NIFTY 50",
    "NSE:NIFTY",
    24386.65,
    24212,
    [13, 17, 15, 22, 20, 29, 26, 35, 31, 40, 37, 47, 44, 54],
  ],
  [
    "sensex",
    "SENSEX",
    "BSE:SENSEX",
    80218.37,
    79864,
    [15, 20, 19, 28, 23, 32, 30, 34, 29, 38, 35, 44, 42, 47],
  ],
  [
    "bank-nifty",
    "BANK NIFTY",
    "NSE:BANKNIFTY",
    51674.2,
    51840,
    [47, 44, 49, 39, 42, 35, 37, 29, 33, 25, 28, 20, 24, 15],
  ],
];

export const demoIndices: readonly (MarketIndex & { value: number })[] =
  sampleIndices.map(([id, name, symbol, value, previousClose, sparkline]) => ({
    id,
    name,
    symbol,
    value,
    ...movement(value, previousClose),
    updatedAt,
    sparkline,
    isDemo: true,
  }));
