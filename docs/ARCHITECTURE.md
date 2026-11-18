# Architecture

## Implemented in Phase 1

MarketPulse India uses a single Next.js App Router application. The root layout and foundation page are Server Components. Browser state and browser APIs will live in narrowly scoped Client Components as features require them. Tailwind CSS and shadcn/ui share neutral CSS tokens with system light and dark preferences. The app uses system fonts.

The stateless `GET /api/health` Route Handler returns the service identifier and current UTC time with `Cache-Control: no-store`. It performs no I/O. Site metadata and Indian locale, time zone and currency defaults come from `src/config/site.ts`.

`src/lib/env.ts` validates explicit public environment values with Zod. Next.js can include public values in the client bundle. Phase 1 has no private settings. Add future private configuration in a separate module guarded by `import "server-only"` and import it only from server entry points. Keep deployment secrets in Vercel environment configuration and local secrets in ignored environment files.

## Planned architecture

- **Route Handlers** validate and bound inputs and return safe JSON errors. Provider adapters remain server-side. Use SWR for browser fetching when needed.
- **News** uses a provider interface and one normalized, deduplicated feed with original publisher URLs and publication timestamps. Verify Hypeless API schemas, quotas, freshness and display rights before activation. Publish only permitted content with attribution.
- **Market** uses typed exchange-qualified symbols. TradingView embeds use supported initialization methods and retain attribution. Verify licensing and supported symbols. Custom quotes use a separate normalized provider contract with source and freshness metadata. NSE MCP public display requires documented authorization.
- **Caching** uses shared Upstash Redis state for request-driven freshness, distributed locking and atomic upstream quota accounting. Serve labeled stale data where available and fail closed for metered calls if coordination is unavailable.
- **Deployment** targets stateless Vercel functions. Keep durable state out of local files and process memory. Disable or isolate metered providers in previews. Verify Hobby terms and obtain approval before deployment.
