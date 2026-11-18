import { expect, test } from "@playwright/test";
import { siteConfig } from "../../src/config/site";

test("renders the foundation and serves the health response", async ({
  page,
  baseURL,
}) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    if (baseURL && new URL(request.url()).origin !== baseURL)
      externalRequests.push(request.url());
  });
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: siteConfig.name }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en-IN");
  const healthButton = page.getByRole("button", {
    name: "Check service health",
  });
  await expect(healthButton).toHaveCSS("min-height", "44px");
  const body = page.locator("body");
  await page.emulateMedia({ colorScheme: "light" });
  const lightBackground = await body.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(body).not.toHaveCSS("background-color", lightBackground);
  expect(await body.evaluate((element) => element.scrollWidth)).toBe(375);
  const response = await page.request.get("/api/health");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(await response.json()).toEqual({
    status: "ok",
    service: "marketpulse-india",
    timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T.*Z$/),
  });
  await Promise.all([
    page.waitForURL((url) => url.pathname === "/api/health"),
    healthButton.click(),
  ]);
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
