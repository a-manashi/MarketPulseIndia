// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { BreakingNewsBanner } from "@/components/news/breaking-news-banner";
import { NewsCard } from "@/components/news/news-card";
import { NewsSection } from "@/components/news/news-section";
import { demoBreakingNews, demoLatestNews } from "@/lib/mock/news";
import type { NewsArticle } from "@/types/news";

afterEach(cleanup);

const article: NewsArticle = {
  id: "test",
  category: "markets",
  title: "Example article",
  source: "MarketPulse Demo",
  isDemo: true,
  symbols: [],
  publishedAt: "2026-01-14T09:30:00Z",
};

it("renders article metadata and handles an optional image", () => {
  const { rerender } = render(<NewsCard article={article} />);
  expect(screen.getByRole("heading", { name: article.title })).toBeVisible();
  expect(screen.getByText("MarketPulse Demo")).toBeVisible();
  expect(screen.getByText(/Sample.*IST/)).toBeVisible();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  rerender(
    <NewsCard
      article={{
        ...article,
        image: {
          src: "/example.png",
          alt: "Example chart",
          width: 120,
          height: 90,
        },
      }}
    />,
  );
  expect(screen.getByRole("img", { name: "Example chart" })).toBeVisible();
});

it("filters the latest list and shows an empty category", () => {
  const markets = demoLatestNews.filter((item) => item.category === "markets");
  render(
    <NewsSection
      articles={markets}
      featured={<p>Unfiltered featured story</p>}
    />,
  );
  expect(screen.getByRole("button", { name: "All News" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("article")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Banking" }));
  expect(screen.getByRole("button", { name: "Banking" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    "No articles in this category.",
  );
  expect(screen.queryByRole("article")).not.toBeInTheDocument();
  expect(screen.getByText("Unfiltered featured story")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Markets" }));
  expect(screen.getByRole("article")).toBeVisible();
});

it("labels illustrative breaking news and leaves it unlinked", () => {
  render(<BreakingNewsBanner article={demoBreakingNews} />);
  expect(
    screen.getByRole("heading", { name: "Sample breaking news" }),
  ).toBeVisible();
  expect(screen.getByText(demoBreakingNews.title)).toBeVisible();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
