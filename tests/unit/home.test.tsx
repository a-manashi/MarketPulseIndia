// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import Home from "@/app/page";
import { siteConfig } from "@/config/site";

afterEach(cleanup);

it("renders the foundation content and links to service health", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    siteConfig.name,
  );
  expect(screen.getByText(siteConfig.description)).toBeVisible();
  expect(
    screen.getByRole("heading", { name: "Project Foundation" }),
  ).toBeVisible();
  expect(
    screen
      .getByRole("button", { name: "Check service health" })
      .closest("form"),
  ).toHaveAttribute("action", "/api/health");
});
