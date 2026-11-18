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
  value: number | null;
  change: number | null;
  changePercent: number | null;
  updatedAt: string | null;
  freshness?: string;
  sparkline?: readonly number[];
  isDemo: boolean;
}
