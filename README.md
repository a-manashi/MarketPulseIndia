# MarketPulse India

MarketPulse India is a planned Indian financial news and market information site. The roadmap includes publisher-linked news, stock-specific coverage, indices, NSE and BSE tickers, and watchlists.

Revised Phase 3 supplies a provider-independent market snapshot to the custom ticker, benchmark cards and aligned watchlist table. The default view shows unavailable values. Demo news remains local and filterable.

The header supports Dark (the default), Light and System. It saves the selected theme in the current browser with `next-themes`, the sole Phase 2 dependency addition. The same header, footer and theme are shared by the dashboard and the `/about`, `/disclaimer` and `/privacy` routes.

## Local setup

Install a current patch of Node.js 24 LTS, npm and Git. From the repository root, run:

```sh
npm ci
npm run dev
```

Open the [homepage](http://localhost:3000) and [health endpoint](http://localhost:3000/api/health). The defaults work without an environment file. To customize them, copy `.env.example` to `.env.local` and set:

| Variable               | Local default           | Purpose                                                                   |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_NAME` | `MarketPulse India`     | Display name and document title                                           |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | HTTP(S) origin for metadata                                               |
| `MARKET_DATA_PROVIDER` | `disabled`              | Server-only mode. Set to `mock` in local development for labeled samples. |

Restart the development server after changing the market provider. `GET /api/market/quotes` returns a normalized snapshot with `Cache-Control: no-store`. The app does not require credentials.

## Commands

The watchlist uses aligned Symbol, Price and Change columns. The default view shows unavailable values for tracked stocks. Enable the development-only mock provider to see labeled sample prices.

| npm script      | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `dev`           | Start the development server                       |
| `build`         | Build for production                               |
| `start`         | Serve the production build                         |
| `lint`          | Check ESLint rules                                 |
| `typecheck`     | Generate Next.js route types and check TypeScript  |
| `format`        | Apply Prettier formatting                          |
| `format:check`  | Verify formatting                                  |
| `test`          | Run unit and integration tests once                |
| `test:watch`    | Run tests in watch mode                            |
| `test:coverage` | Run tests and write coverage reports               |
| `test:e2e`      | Run the Chromium browser suite with a local server |

Install Playwright Chromium once with `npx playwright install chromium` before running the browser tests.

The browser suite uses local and intercepted market API responses. For manually invoked metadata discovery, see the [NSE MCP integration notes](docs/NSE_MCP_INTEGRATION.md). Quote smoke testing awaits documented permission and a confirmed output schema. The [original TradingView notes](docs/TRADINGVIEW_INTEGRATION.md) are retained as a historical record.

## Project layout

- `src/app` contains the App Router pages, styles and health API.
- `src/components/ui` contains the shadcn/ui Button and Card.
- `src/components/layout`, `market`, `news` and `shared` contain the dashboard shell and feature components.
- `src/config` holds site settings, stock symbols, news categories and navigation. `src/lib/mock` holds fixtures and `src/lib/utils` holds Indian financial and date formatters.
- `tests` separates unit, integration and end-to-end checks.
- `docs` tracks [architecture](docs/ARCHITECTURE.md), the [ten-phase plan](docs/DEVELOPMENT_PLAN.md) and [current progress](docs/DEVELOPMENT_PROGRESS.md).

The stack uses Next.js, React, strict TypeScript, Tailwind CSS, shadcn/ui, Lucide React, Zod and SWR. ESLint and Prettier handle code quality and formatting. Vitest, React Testing Library and Playwright provide test coverage.

The planned deployment target is Vercel Hobby for eligible non-commercial use, subject to plan terms and deployment approval.
