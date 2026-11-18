// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";

const { setTheme } = vi.hoisted(() => ({ setTheme: vi.fn() }));
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", setTheme }),
}));
afterEach(cleanup);

it("links the brand and primary navigation to real homepage destinations", () => {
  render(<SiteHeader />);
  expect(screen.getByRole("link", { name: siteConfig.name })).toHaveAttribute(
    "href",
    "/",
  );
  const nav = screen.getByRole("navigation", { name: "Primary navigation" });
  expect(within(nav).getByRole("link", { name: "Markets" })).toHaveAttribute(
    "href",
    "/#markets",
  );
  expect(
    within(nav).getByRole("link", { name: "Latest News" }),
  ).toHaveAttribute("href", "/#news");
  expect(within(nav).getByRole("link", { name: "Watchlist" })).toHaveAttribute(
    "href",
    "/#watchlist",
  );
});

it("exposes the theme control and passes the selected preference", () => {
  render(<SiteHeader />);
  const theme = screen.getByRole("combobox", { name: "Color theme" });
  expect(theme).toHaveValue("dark");
  fireEvent.change(theme, { target: { value: "system" } });
  expect(setTheme).toHaveBeenCalledWith("system");
});

it("opens mobile navigation and closes it with Escape", () => {
  render(<SiteHeader />);
  const trigger = screen.getByRole("button", { name: "Open navigation" });
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  const nav = screen.getByRole("navigation", { name: "Mobile navigation" });
  fireEvent.keyDown(within(nav).getByRole("link", { name: "Markets" }), {
    key: "Escape",
  });
  expect(nav).not.toBeVisible();
  expect(trigger).toHaveFocus();
});

it("links to the information pages and preserves the health control", () => {
  render(<SiteFooter />);
  for (const [name, href] of [
    ["About", "/about"],
    ["Disclaimer", "/disclaimer"],
    ["Privacy", "/privacy"],
    ["Check service health", "/api/health"],
  ]) {
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  }
});
