export const supportedStocks = {
  RELIANCE: "Reliance Industries",
  TCS: "Tata Consultancy Services",
  INFY: "Infosys",
  HDFCBANK: "HDFC Bank",
  ICICIBANK: "ICICI Bank",
  SBIN: "State Bank of India",
  ITC: "ITC",
  LT: "Larsen & Toubro",
  BHARTIARTL: "Bharti Airtel",
  AXISBANK: "Axis Bank",
} as const;

export type StockSymbol = keyof typeof supportedStocks;
