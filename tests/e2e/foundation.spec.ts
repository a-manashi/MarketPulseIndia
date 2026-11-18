import { expect, test } from "@playwright/test";

test("renders the dashboard, filters news and preserves service health", async ({
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

  expect((await page.goto("/"))?.status()).toBe(200);
  await expect(
    page.getByRole("banner").getByRole("link", { name: await page.title() }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en-IN");
  await expect(
    page.getByRole("heading", { name: "Market Overview" }),
  ).toBeVisible();
  await expect(
    page.getByText(/Market data and news shown are simulated/),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sample breaking news" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "What India’s benchmark indices tell us",
    }),
  ).toBeVisible();
  const latest = page.getByRole("region", { name: "Latest News" });
  await expect(latest.getByRole("article")).toHaveCount(12);
  await expect(
    page.getByRole("heading", { name: "Stock Watchlist" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Banking" }).click();
  await expect(page.getByRole("button", { name: "Banking" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(latest.getByRole("article")).toHaveCount(2);
  await expect(
    latest.getByRole("heading", {
      name: "How banks report changes in lending margins",
    }),
  ).toBeVisible();
  await expect(
    latest.getByRole("heading", {
      name: "What to look for in an IPO prospectus",
    }),
  ).toHaveCount(0);

  const response = await page.request.get("/api/health");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(await response.json()).toEqual({
    status: "ok",
    service: "marketpulse-india",
    timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T.*Z$/),
  });
  await page.getByRole("link", { name: "Check service health" }).click();
  await expect(page).toHaveURL(/\/api\/health$/);
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("defaults to dark, saves an explicit theme and follows the system on request", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const root = page.locator("html");
  const body = page.locator("body");
  const theme = page.getByRole("combobox", { name: "Color theme" });
  await expect(root).toHaveClass(/\bdark\b/);
  await expect(theme).toHaveValue("dark");
  const darkBackground = await body.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await theme.selectOption("light");
  await expect(root).toHaveClass(/\blight\b/);
  await expect(body).not.toHaveCSS("background-color", darkBackground);
  await page.reload();
  await expect(theme).toHaveValue("light");
  await expect(root).toHaveClass(/\blight\b/);
  await theme.selectOption("system");
  await expect(root).toHaveClass(/\blight\b/);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(root).toHaveClass(/\bdark\b/);
  await page.reload();
  await expect(theme).toHaveValue("system");
  await expect(root).toHaveClass(/\bdark\b/);
  expect(errors).toEqual([]);
});

test("supports keyboard navigation and information pages on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  const trigger = page.getByRole("button", { name: "Open navigation" });
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(menu).toBeHidden();
  const size = await trigger.boundingBox();
  expect(size?.height).toBeGreaterThanOrEqual(44);
  await trigger.focus();
  await page.keyboard.press("Space");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(menu.getByRole("link", { name: "Home" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await menu.getByRole("link", { name: "Watchlist" }).click();
  await expect(page).toHaveURL(/\/#watchlist$/);
  await expect(menu).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "Stock Watchlist" }),
  ).toBeInViewport();

  const footer = page.getByRole("navigation", { name: "Footer navigation" });
  for (const [link, heading, path] of [
    ["About", /^About /, /\/about$/],
    ["Disclaimer", "Financial disclaimer", /\/disclaimer$/],
    ["Privacy", "Privacy", /\/privacy$/],
  ] as const) {
    await footer.getByRole("link", { name: link }).click();
    await expect(page).toHaveURL(path);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
  }
  await page.getByRole("button", { name: "Open navigation" }).click();
  await menu.getByRole("link", { name: "Markets" }).click();
  await expect(page).toHaveURL(/\/#markets$/);
  await expect(
    page.getByRole("heading", { name: "Market Overview" }),
  ).toBeInViewport();
});

for (const width of [360, 390, 768, 1024, 1440, 1920]) {
  test(`fits the dashboard at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "NIFTY 50" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Stock Watchlist" }),
    ).toBeVisible();
    const layout = await page.evaluate(() => {
      const main = document.documentElement;
      const clipped = [
        ...document.querySelectorAll("main h1, main h2, main h3"),
      ].filter((heading) => heading.scrollWidth > heading.clientWidth + 1);
      return {
        pageWidth: main.scrollWidth,
        clippedHeadlines: clipped.map((heading) => heading.textContent),
      };
    });
    expect(layout).toEqual({ pageWidth: width, clippedHeadlines: [] });
  });
}
