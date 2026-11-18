import { expect, test } from "@playwright/test";

const widgetScripts =
  /^https:\/\/s3\.tradingview\.com\/external-embedding\/embed-widget-(ticker-tape|mini-symbol-overview|market-overview|events)\.js$/;

test.beforeEach(async ({ page }) => {
  await page.route("**/api/market/quotes", (route) =>
    route.fulfill({
      json: {
        data: {
          provider: "disabled",
          status: "disabled",
          isDemo: false,
          quotes: [],
          indices: [],
          fetchedAt: "2026-01-14T10:00:00Z",
          unavailableSymbols: [],
          warnings: [],
        },
      },
    }),
  );
  await page.route(widgetScripts, (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `(() => {
      const script = document.currentScript;
      const frame = document.createElement("iframe");
      frame.title = "Controlled TradingView fixture";
      frame.dataset.theme = JSON.parse(script.textContent).colorTheme;
      frame.style.width = "100%";
      script.parentElement.querySelector(".tradingview-widget-container__widget").replaceWith(frame);
    })();`,
    }),
  );
});

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
    if (
      baseURL &&
      new URL(request.url()).origin !== baseURL &&
      !widgetScripts.test(request.url())
    )
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
    page.getByText(/News articles are simulated for development purposes/),
  ).toBeVisible();
  await expect(
    page.getByText(/BSE widget quotes are end-of-day/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Refresh market data" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Market ticker" }),
  ).toBeVisible();
  const watchlist = page.getByRole("complementary", {
    name: "Stock Watchlist",
  });
  await expect(watchlist.locator("iframe")).toHaveCount(1);
  await expect(
    watchlist.getByRole("link", { name: "BSE watchlist" }),
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
  await page
    .getByRole("combobox", { name: "Color theme" })
    .selectOption("light");
  await expect(watchlist.locator("iframe")).toHaveAttribute(
    "data-theme",
    "light",
  );
  await expect(latest.getByRole("article")).toHaveCount(2);
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
    const ticker = page.getByRole("region", { name: "Market ticker" });
    await expect(ticker).toBeVisible();
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

test("keeps news usable after a market API failure", async ({ page }) => {
  await page.route("**/api/market/quotes", (route) =>
    route.fulfill({
      status: 503,
      json: { error: { code: "PROVIDER_UNAVAILABLE" } },
    }),
  );
  await page.goto("/");
  await expect(
    page.getByText("Market data is currently unavailable."),
  ).toBeVisible();
  await expect(
    page
      .getByRole("complementary", { name: "Stock Watchlist" })
      .getByLabel("Price unavailable"),
  ).toHaveCount(10);
  await page.getByRole("button", { name: "Banking" }).click();
  await expect(
    page.getByRole("region", { name: "Latest News" }).getByRole("article"),
  ).toHaveCount(2);
});

test("loads a partial demo snapshot once and refreshes it manually", async ({
  page,
}) => {
  let requests = 0;
  const fetchedAt = "2026-01-14T10:00:00Z";
  await page.route("**/api/market/quotes", async (route) => {
    requests++;
    await route.fulfill({
      json: {
        data: {
          provider: "mock",
          fetchedAt,
          isDemo: true,
          status: "partial",
          indices: [],
          unavailableSymbols: ["BSE:SENSEX"],
          warnings: [],
          quotes: [
            {
              id: "NSE:RELIANCE",
              symbol: "RELIANCE",
              name: "Reliance Industries",
              exchange: "NSE",
              currency: "INR",
              price: 125.5,
              previousClose: null,
              change: null,
              changePercent: null,
              updatedAt: null,
              fetchedAt,
              dataSource: "MarketPulse Demo",
              freshness: "demo",
              isDemo: true,
            },
          ],
        },
      },
    });
  });
  await page.goto("/");
  await expect(
    page.getByText(/Demo market data.*Some market instruments/),
  ).toBeVisible();
  const watchlist = page.getByRole("complementary", {
    name: "Stock Watchlist",
  });
  await expect(watchlist.getByText(/125\.50/)).toBeVisible();
  await expect(watchlist.getByLabel("Price unavailable")).toHaveCount(9);
  expect(requests).toBe(1);
  await expect(
    page.locator(
      '[aria-label="Market ticker"] iframe, #markets iframe, #watchlist iframe',
    ),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Refresh market data" }).click();
  await expect.poll(() => requests).toBe(2);
});

test("keeps the news usable when TradingView is blocked", async ({ page }) => {
  await page.route(widgetScripts, (route) => route.abort());
  await page.goto("/");
  const ticker = page.getByRole("region", { name: "Market ticker" });
  await expect(ticker.getByRole("status")).toHaveText(
    "TradingView Ticker Tape is unavailable.",
  );
  await expect(
    ticker.getByRole("link", { name: "Open on TradingView" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Latest News" }),
  ).toBeVisible();
});
