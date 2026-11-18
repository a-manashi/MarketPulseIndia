export const newsCategories = {
  markets: "Markets",
  stocks: "Stocks",
  banking: "Banking",
  technology: "IT & Technology",
  ipo: "IPO",
  economy: "Economy",
  global: "Global Markets",
  results: "Corporate Results",
} as const;

export type NewsCategory = keyof typeof newsCategories;
