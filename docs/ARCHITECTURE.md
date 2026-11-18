# Architecture

## Implemented in Phase 1

MarketPulse India uses a single Next.js App Router application with strict TypeScript, Tailwind CSS, shadcn/ui and system fonts.

The stateless `GET /api/health` Route Handler returns the service identifier and current UTC time with `Cache-Control: no-store`. It performs no I/O. Site metadata and Indian locale, time zone and currency defaults come from `src/config/site.ts`.

`src/lib/env.ts` validates explicit public environment values with Zod. Next.js can include public values in the client bundle. Phase 1 has no private settings. Add future private configuration in a separate module guarded by `import "server-only"` and import it only from server entry points. Keep deployment secrets in Vercel environment configuration and local secrets in ignored environment files.

## Implemented in Phase 2

The server-rendered root layout supplies the header, footer and main landmark for the homepage and three information routes. The client theme provider accepts the server-rendered layout content as children. Its initial script applies the saved theme class before paint, with Dark as the default and explicit Light and System options. Only the theme selector, mobile navigation and local news filter need interaction state.

The dashboard uses a centered 1,500px container, compact index cards and a 70/30 news and watchlist grid at desktop widths. Smaller screens stack the sections, with intentional horizontal scrolling inside the ticker and category navigation. Shared colors include accessible market movement tokens. Direction is also communicated through arrows, signs and screen-reader text.

`src/lib/mock/market.ts` and `src/lib/mock/news.ts` supply deterministic fixtures with explicit demo markers. Stock changes are calculated from sample previous closes. The presentation components take typed data via props, and `src/lib/utils` formats INR currency, index points, changes and Asia/Kolkata timestamps. The dashboard renders immediately. Reusable loading, empty and error states are available for future asynchronous views.

The ticker is an isolated component for the future TradingView replacement. Breaking, featured and latest news consume provider-neutral article types. The featured story remains an editorial selection while the local category controls filter the latest feed. The watchlist is a fixed set of display-only quotes.

## Revised Phase 3

The dashboard uses one SWR key for the validated, no-store market snapshot from the Node.js Route Handler at `/api/market/quotes`. A server-only service selects a provider and validates the normalized result. The ticker, index cards and watchlist use the same snapshot and show placeholders for missing values. Manual refresh is explicit, with focus and reconnect refreshes disabled. News is independently rendered and still uses local demo fixtures.

The factory defaults to disabled mode. Mock is explicitly selected in development and uses deterministic samples. Every application request for NSE MCP quotes is denied, including on Vercel. The standalone discovery script uses the official MCP SDK and a fixed intraday endpoint for an explicitly enabled local metadata session. It does not call quote tools. See the [NSE research notes](NSE_MCP_INTEGRATION.md) for prerequisites and actual verification.

A future authorized adapter must establish its response schema, source timestamp semantics and permitted refresh budget before activation. Raw NSE results, distributed caching and production authorization are outside the current implementation.

## Phase 3C hybrid display

The dashboard chooses the embedded display when the custom snapshot reports disabled or when the custom market sections are explicitly off. The embedded path replaces the empty ticker, index cards and stock table with the BSE ticker, SENSEX Mini Chart and BSE Market Overview watchlist. The custom refresh control appears only with the custom sections. Both paths share the existing news layout and theme, with no TradingView calls from the market service.

TradingView symbols and independent presentation flags are centralized. Embeds load only trusted official scripts, reserve dimensions and use the resolved theme. Each widget owns a disposable DOM subtree. Its mutation observer detects frame insertion, while a timer and script error handler provide retry and link fallbacks. The provider renders the quotes and the application preserves attribution. See the [verification matrix](TRADINGVIEW_INTEGRATION.md).

## Planned architecture

- **Route Handlers** validate and bound inputs and return safe JSON errors. Provider adapters remain server-side. Use SWR for browser fetching when needed.
- **News** uses a provider interface and one normalized, deduplicated feed with original publisher URLs and publication timestamps. Verify Hypeless API schemas, quotas, freshness and display rights before activation. Publish only permitted content with attribution.
- **Market** uses typed exchange-qualified symbols and a normalized provider contract. Production display requires an authorized provider and verified entitlements.
- **Caching** uses shared Upstash Redis state for request-driven freshness, distributed locking and atomic upstream quota accounting. Serve labeled stale data where available and fail closed for metered calls if coordination is unavailable.
- **Deployment** targets stateless Vercel functions. Keep durable state out of local files and process memory. Disable or isolate metered providers in previews. Verify Hobby terms and obtain approval before deployment.
