# AGENTS.md — MarketPulse India

## 1. Purpose and authority

This file defines permanent engineering instructions for all AI coding agents working in this repository. Read it before making changes. Apply it throughout all ten development phases. Follow the user's explicit current instructions; report conflicts with this file rather than silently changing architecture. Do not modify this file without explicit approval.

MarketPulse India is an Indian financial news and market information website, initially intended as a non-commercial Vercel-hosted MVP. It is not a brokerage, trading execution system or investment advisory service.

## 2. Development roadmap

1. Project Foundation
2. UI Design and Application Layout
3. Market Data Provider Architecture & NSE MCP Integration
4. News API Integration
5. Caching and API Quota Management for News and Market Data
6. News Dashboard and User Experience
7. Authorized Market Data and Personalized Watchlist
8. SEO, Performance and Security
9. Testing and Quality Assurance
10. Vercel Production Deployment

Implement only the phase explicitly requested. Read `docs/DEVELOPMENT_PLAN.md`, `docs/ARCHITECTURE.md` and `docs/DEVELOPMENT_PROGRESS.md` when present. Never start the next phase automatically. Record incomplete or blocked work accurately.

## 3. Approved technology and architecture

- Next.js App Router, React, strict TypeScript, npm and a compatible supported Node.js LTS.
- Tailwind CSS, shadcn/ui and Lucide React for presentation.
- Zod for boundary validation; SWR for client-side data fetching when needed.
- Next.js Route Handlers for server APIs; no separate backend initially.
- Vitest, React Testing Library and Playwright for tests.
- Provider-independent market data through server-side adapters and normalized snapshots. Production display requires an authorized market-data provider.
- Hypeless is the candidate news provider, subject to verification of API contract, quota, freshness and display rights.
- Upstash Redis is the planned shared cache and quota coordination service.
- Official NSE MCP is for permitted local research only. Public deployment requires a separate approved implementation and documented authorization.
- No database, authentication, payments, AI summaries or order execution in the initial MVP unless explicitly approved.
- Use stable compatible versions, preserve the npm lockfile, and avoid unnecessary dependencies. Do not change frameworks or hosting architecture without approval.

## 4. Repository boundaries

- `src/app/`: routes, layouts, metadata and API Route Handlers.
- `src/components/ui/`: shadcn/ui primitives.
- `src/components/layout/`, `market/`, `news/`, `shared/`: feature and presentation components.
- `src/config/`: centralized site settings, supported symbols and policies.
- `src/hooks/`: reusable client hooks.
- `src/lib/providers/news/`, `market/`: server-side external provider adapters.
- `src/lib/cache/`: cache, quota and coordination logic.
- `src/lib/`: shared utilities and validated environment configuration.
- `src/types/`: shared domain contracts.
- `tests/`: unit, integration and end-to-end tests.
- `docs/`: architecture, development plan and progress.

Create files when needed, not speculative abstractions. Keep route handlers thin, domain logic testable, and providers independent of UI. Use `@/*` imports where appropriate. Do not import server-only modules into client components.

## 5. Coding conventions

Use strict TypeScript and explicit types at public boundaries. Avoid `any`, unsafe casts, non-null assertions and rule suppressions unless justified. Prefer small focused functions, descriptive names, composition and straightforward control flow. Use PascalCase for React components, camelCase for functions and variables, and consistent descriptive filenames. Follow existing formatting and lint conventions. Remove unused code and imports. Do not refactor unrelated modules. Use Server Components by default and Client Components only for browser APIs, interaction or client-side state. Avoid unnecessary global state, effects and hydration dependencies. Use semantic HTML and accessible controls.

## 6. Configuration and secrets

Centralize application configuration. Validate environment variables with Zod. Separate server-only secrets from explicitly public `NEXT_PUBLIC_` variables. Never expose provider keys, Redis tokens or private configuration in client bundles, responses, logs, screenshots, tests or Git. Track `.env.example` with safe examples or placeholders only. Ignore secret-bearing environment files. Do not require credentials for disabled or future features. Use safe local defaults where appropriate. Never bypass security or validation to make a build pass.

## 7. Financial data integrity and licensing

Never fabricate production prices, headlines, sources, timestamps, market status or provider responses. Clearly label mock fixtures and keep them out of production data paths. Verify provider documentation, symbol support, endpoint schemas, freshness, quotas and public-display rights before activation. Free access does not imply redistribution rights. Do not scrape exchange endpoints, bypass paywalls, evade rate limits or extract data from embedded widgets. Preserve TradingView attribution and branding. Never describe delayed or end-of-day data as live or tick-by-tick. Display source, timestamp and delay where known; label unknown freshness honestly. Do not silently substitute a different instrument or exchange. Distinguish last trade time from fetch time. Use exchange calendars for market status; if holiday status is unknown, report uncertainty. Never generate investment recommendations or trading signals as part of the MVP.

## 8. News architecture

Use a provider interface and normalized article model. Validate external responses, sanitize untrusted content, deduplicate articles and preserve original publisher URLs and publication timestamps. Display only content permitted by the provider and publisher. Do not republish full articles or unlicensed images. Link to original sources. Mark breaking news only using a verified provider flag or a documented editorial rule; do not confuse recency with breaking status. Apply search and category filters to a consolidated cached feed when possible. Keep mock providers explicit and disabled in production. Do not invent endpoint contracts; document unresolved provider details.

## 9. Market architecture

Maintain supported symbols in centralized typed configuration. Keep exchange-qualified identifiers and display labels distinct. Use a normalized market provider contract with source and freshness metadata. Keep disabled mode as the safe default. Authorized NSE MCP access must be server-side, use fixed official HTTPS endpoints and verified read-only tools, require explicit local development opt-in and loopback binding, and fail closed in production and all Vercel environments. Require documented permission before enabling quote retrieval. Watchlists may use local storage initially; validate stored values and handle unavailable storage. No trading or brokerage integration in the MVP.

## 10. News and market data caching and quota protection

Never fetch upstream data once per visitor. Use shared server-side caching, request-driven refresh and a distributed lock when implemented. Initial proposed policy: 15-minute news freshness, 8 AM–6 PM Asia/Kolkata refresh window, maximum 40 upstream requests per day and 5-minute browser polling. These values are configurable and must be verified against actual provider terms and quota reset rules. Count upstream attempts atomically before making requests, including retries; do not exceed the configured budget. Use bounded timeouts, safe retry policies, lock ownership and expiry. Serve clearly labeled stale data during failures where available. If cache or quota coordination is unavailable, fail closed for metered upstream calls rather than allowing unlimited requests. Do not assume in-memory state is shared across Vercel instances. Do not rely on frequent Hobby cron jobs or long-running background processes.

## 11. API and security rules

Validate query parameters, symbols, pagination and external responses. Bound input sizes and request timeouts. Use appropriate HTTP status codes and consistent safe error responses. Do not leak stack traces or secrets. Treat external content as untrusted; do not render raw HTML without safe sanitization. Restrict outbound requests to approved HTTPS providers; never fetch arbitrary user-supplied URLs. Apply rate limits and security headers as appropriate. Configure CSP compatible with approved embeds without unnecessary broad permissions. Keep logs useful but free of secrets and personal data. Do not disable TLS verification. Avoid new dependencies with known serious vulnerabilities; report unresolved security findings rather than forcing risky upgrades.

## 12. UI and localization

Build a professional, responsive financial dashboard with consistent design tokens and light/dark support. Prioritize readability and accessible keyboard navigation. Do not rely on red/green alone to convey market direction. Use signs, labels or icons as well. Support loading, empty, error, stale and unavailable states. Do not display misleading zeros for missing data. Default locale `en-IN`, timezone `Asia/Kolkata`, currency `INR`. Store and exchange timestamps in ISO 8601 with explicit timezone or UTC; format for Indian users at presentation boundaries. Keep index points distinct from currency prices. Use original publisher links and appropriate attribution. Respect reduced motion preferences.

## 13. Vercel deployment constraints

Design for stateless serverless execution. Do not rely on persistent local files, in-memory shared state, permanent WebSocket servers or always-running processes. Keep secrets in deployment environment configuration. Avoid external API calls during builds unless explicitly necessary and approved. Preview deployments must not accidentally consume production quotas; isolate environments or disable metered integrations. Vercel Hobby is intended for non-commercial use; verify current plan limits and terms before deployment or monetization. Do not deploy without explicit approval.

## 14. Testing and validation

Add or update meaningful tests with each phase. Test success, invalid input, failure and boundary cases. Mock external APIs by default; do not spend real API quota in routine tests. Keep tests deterministic and independent. Test cache concurrency and quota enforcement when implemented. Test mobile layouts, accessibility, theme behavior and provider failure states as applicable. Never remove tests or weaken assertions to hide failures. Run relevant checks and, before phase completion, the established mandatory checks:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Use `npm run test:coverage` when coverage verification is needed. Report actual command results, including skipped or blocked checks. Do not claim success without execution. Fix implementation-related failures or report the phase as incomplete. Do not run destructive commands or change system-wide settings without approval.

## 15. Git and change management

Inspect Git status before edits. Preserve user changes, including untracked files. Never reset, clean, force-push, overwrite unrelated work or delete files unnecessarily. Do not commit, push, create remote repositories or deploy without explicit user approval. Keep changes scoped to the requested phase. Suggest a conventional commit message. Do not commit secrets, build output, test reports or local environment files.

## 16. Documentation and phase workflow

For every task:

1. Inspect the workspace and read applicable instructions and documentation.
2. Identify the current phase, dependencies and existing changes.
3. Present a concise implementation plan.
4. Implement only the requested scope.
5. Add or update tests.
6. Run validation and resolve implementation-related errors.
7. Update README and architecture documentation when behavior or decisions change.
8. Update `docs/DEVELOPMENT_PROGRESS.md` with status, actual validation results, decisions and blockers.
9. Provide a final report and stop.

Distinguish planned functionality from implemented functionality. Do not mark a phase complete until its mandatory acceptance criteria pass. Record dates only when known. If a provider contract, licensing issue or environment limitation blocks work, report it explicitly; do not invent a workaround that changes the agreed scope.

## 17. Required final report

Include implementation summary, created and modified files, dependency changes, commands executed, actual test and build results, known issues, assumptions and architecture decisions, local verification instructions, suggested commit message and phase completion status. Clearly identify any action the user must take. Do not automatically proceed to the next phase.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
