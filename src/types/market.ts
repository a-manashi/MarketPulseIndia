export interface StockQuote {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  updatedAt: string;
  dataSource: string;
  isDelayed: boolean;
  isDemo: boolean;
}

export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  updatedAt: string;
  sparkline?: readonly number[];
  isDemo: boolean;
}
