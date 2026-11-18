# MarketPulse India

MarketPulse India is a planned Indian financial news and market information site. The roadmap includes publisher-linked news, stock-specific coverage, indices, NSE and BSE tickers, and watchlists.

Phase 2 adds a market overview with three benchmark cards, a horizontally scrollable stock ticker, a display-only watchlist and a news dashboard with a sample breaking-news banner, a featured story and 12 category-filterable articles. All quotes, charts and news are deterministic demo fixtures. Real market data and news are not connected.

The header supports Dark (the default), Light and System. It saves the selected theme in the current browser with `next-themes`, the sole Phase 2 dependency addition. The same header, footer and theme are shared by the dashboard and the `/about`, `/disclaimer` and `/privacy` routes.

## Local setup

Install a current patch of Node.js 24 LTS, npm and Git. From the repository root, run:

```sh
npm ci
npm run dev
```

Open the [homepage](http://localhost:3000) and [health endpoint](http://localhost:3000/api/health). The defaults work without an environment file. To customize them, copy `.env.example` to `.env.local` and set:

| Variable               | Local default           | Purpose                         |
| ---------------------- | ----------------------- | ------------------------------- |
| `NEXT_PUBLIC_APP_NAME` | `MarketPulse India`     | Display name and document title |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | HTTP(S) origin for metadata     |

Both values are public. The dashboard requires no credentials.

## Commands

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

## Project layout

- `src/app` contains the App Router pages, styles and health API.
- `src/components/ui` contains the shadcn/ui Button and Card.
- `src/components/layout`, `market`, `news` and `shared` contain the dashboard shell and feature components.
- `src/config` holds site settings, stock symbols, news categories and navigation. `src/lib/mock` holds fixtures and `src/lib/utils` holds Indian financial and date formatters.
- `tests` separates unit, integration and end-to-end checks.
- `docs` tracks [architecture](docs/ARCHITECTURE.md), the [ten-phase plan](docs/DEVELOPMENT_PLAN.md) and [current progress](docs/DEVELOPMENT_PROGRESS.md).

The stack uses Next.js, React, strict TypeScript, Tailwind CSS, shadcn/ui, Lucide React, Zod and SWR. ESLint and Prettier handle code quality and formatting. Vitest, React Testing Library and Playwright provide test coverage.

The planned deployment target is Vercel Hobby for eligible non-commercial use, subject to plan terms and deployment approval.
