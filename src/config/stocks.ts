export interface MarketSymbolConfig {
  name: string;
  id: `${"NSE" | "BSE"}:${string}`;
  exchange: "NSE" | "BSE";
}

function nseStock(symbol: string, name: string): MarketSymbolConfig {
  return { name, id: `NSE:${symbol}`, exchange: "NSE" };
}

export const supportedStocks = {
  RELIANCE: nseStock("RELIANCE", "Reliance Industries"),
  TCS: nseStock("TCS", "Tata Consultancy Services"),
  INFY: nseStock("INFY", "Infosys"),
  HDFCBANK: nseStock("HDFCBANK", "HDFC Bank"),
  ICICIBANK: nseStock("ICICIBANK", "ICICI Bank"),
  SBIN: nseStock("SBIN", "State Bank of India"),
  ITC: nseStock("ITC", "ITC"),
  LT: nseStock("LT", "Larsen & Toubro"),
  BHARTIARTL: nseStock("BHARTIARTL", "Bharti Airtel"),
  AXISBANK: nseStock("AXISBANK", "Axis Bank"),
} as const;

export type StockSymbol = keyof typeof supportedStocks;

export const supportedIndices = {
  nifty: {
    name: "NIFTY 50",
    id: "NSE:NIFTY",
    exchange: "NSE",
  },
  sensex: {
    name: "SENSEX",
    id: "BSE:SENSEX",
    exchange: "BSE",
  },
  bankNifty: {
    name: "BANK NIFTY",
    id: "NSE:BANKNIFTY",
    exchange: "NSE",
  },
  niftyIt: {
    name: "NIFTY IT",
    id: "NSE:CNXIT",
    exchange: "NSE",
  },
} as const satisfies Record<string, MarketSymbolConfig>;
