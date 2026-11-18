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

## Planned architecture

- **Route Handlers** validate and bound inputs and return safe JSON errors. Provider adapters remain server-side. Use SWR for browser fetching when needed.
- **News** uses a provider interface and one normalized, deduplicated feed with original publisher URLs and publication timestamps. Verify Hypeless API schemas, quotas, freshness and display rights before activation. Publish only permitted content with attribution.
- **Market** uses typed exchange-qualified symbols. TradingView embeds use supported initialization methods and retain attribution. Verify licensing and supported symbols. Custom quotes use a separate normalized provider contract with source and freshness metadata. NSE MCP public display requires documented authorization.
- **Caching** uses shared Upstash Redis state for request-driven freshness, distributed locking and atomic upstream quota accounting. Serve labeled stale data where available and fail closed for metered calls if coordination is unavailable.
- **Deployment** targets stateless Vercel functions. Keep durable state out of local files and process memory. Disable or isolate metered providers in previews. Verify Hobby terms and obtain approval before deployment.
