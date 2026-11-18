// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import {
  MarketOverviewSkeleton,
  NewsListSkeleton,
  WatchlistSkeleton,
} from "@/components/shared/loading/dashboard-skeletons";

afterEach(cleanup);

it("announces the loading state of each dashboard region", () => {
  render(
    <>
      <MarketOverviewSkeleton />
      <NewsListSkeleton />
      <WatchlistSkeleton />
    </>,
  );
  for (const name of [
    "Loading market overview",
    "Loading news",
    "Loading watchlist",
  ]) {
    expect(screen.getByRole("status", { name })).toBeVisible();
  }
});

it("announces an empty result", () => {
  render(<EmptyState message="No results" />);
  expect(screen.getByRole("status")).toHaveTextContent("No results");
});

it("offers retry only when a handler is provided", () => {
  const { rerender } = render(<ErrorState message="News is unavailable." />);
  expect(screen.getByRole("alert")).toHaveTextContent("News is unavailable.");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  const retry = vi.fn();
  rerender(<ErrorState message="News is unavailable." onRetry={retry} />);
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(retry).toHaveBeenCalledOnce();
});
