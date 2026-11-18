import type { NewsArticle } from "@/types/news";

const demo = { source: "MarketPulse Demo", isDemo: true } as const;

export const demoFeaturedNews: NewsArticle = {
  ...demo,
  id: "benchmark-guide",
  title: "What India’s benchmark indices tell us",
  summary:
    "An illustrated guide to the NIFTY 50 and SENSEX, how they’re weighted, and why they can move in different directions.",
  publishedAt: "2026-01-14T08:40:00Z",
  category: "markets",
  symbols: [],
};

export const demoBreakingNews: NewsArticle = {
  ...demo,
  id: "market-brief-example",
  title: "How a benchmark move appears in a market brief",
  publishedAt: "2026-01-14T09:30:00Z",
  category: "markets",
  symbols: [],
  isBreaking: true,
};

const examples: readonly [
  string,
  NewsArticle["category"],
  string,
  string,
  readonly string[],
][] = [
  [
    "bank-margins",
    "banking",
    "How banks report changes in lending margins",
    "A sample banking brief on how deposit costs and loan yields shape net interest margins.",
    ["HDFCBANK", "ICICIBANK"],
  ],
  [
    "it-results",
    "technology",
    "Reading the key figures in an IT earnings report",
    "An example of how analysts compare revenue, margins and deal bookings.",
    ["TCS", "INFY"],
  ],
  [
    "market-breadth",
    "markets",
    "Why market breadth matters alongside the headline index",
    "An example of how advancing and declining shares can add context to a broad index move.",
    [],
  ],
  [
    "ipo-prospectus",
    "ipo",
    "What to look for in an IPO prospectus",
    "A sample checklist covering use of proceeds, ownership and the issuer’s stated risks.",
    [],
  ],
  [
    "inflation",
    "economy",
    "How inflation measures differ across the economy",
    "An example of the distinction between consumer and wholesale price measures.",
    [],
  ],
  [
    "global-cues",
    "global",
    "How global trading sessions overlap with India",
    "A sample explainer on time zones and the market cues available before India’s session.",
    [],
  ],
  [
    "cash-flow",
    "results",
    "Why profit and operating cash flow can diverge",
    "A sample earnings note on working capital, non-cash items and the cash flow statement.",
    [],
  ],
  [
    "corporate-actions",
    "stocks",
    "Reading a share split in a company announcement",
    "A sample company brief on how a split affects the share count and quoted price.",
    ["RELIANCE"],
  ],
  [
    "asset-quality",
    "banking",
    "The asset-quality figures in a bank filing",
    "An illustrative comparison of loan provisions and gross and net non-performing assets.",
    ["SBIN", "AXISBANK"],
  ],
  [
    "currency",
    "global",
    "How currency conversion affects overseas revenue",
    "An example of the difference between reported and constant-currency growth.",
    ["INFY"],
  ],
  [
    "segments",
    "results",
    "Making sense of segment reporting",
    "A sample explanation of how business lines contribute to reported revenue and profit.",
    ["ITC", "LT"],
  ],
  [
    "turnover",
    "stocks",
    "What turnover tells you about a trading session",
    "An example of how traded value adds context to share volume.",
    ["BHARTIARTL"],
  ],
];

export const demoLatestNews: readonly NewsArticle[] = examples.map(
  ([id, category, title, summary, symbols], index) => ({
    ...demo,
    id,
    category,
    title,
    summary,
    symbols,
    publishedAt: new Date(
      Date.UTC(2026, 0, 14, 8, 20 - index * 15),
    ).toISOString(),
  }),
);
