# NSE MCP research

## Verified connectivity

On 18 November 2026, one explicitly invoked local session initialized successfully at `https://mcp.nseindia.in/cmmkt/mcp` over Streamable HTTP using `@modelcontextprotocol/sdk@1.32.2`. NSE documents this intraday endpoint and the separate historical endpoint `https://mcp.nseindia.in/bhavcopy/cm/mcp` with no authentication. The historical endpoint was not contacted. No quote tools were called and no market payloads were retrieved.

| Discovered candidate   | Advertised required input                           | Advertised information                                                                                |
| ---------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `cm_get_equity_stocks` | `limit` integer, `symbolFilter` string for a prefix | Symbol, last traded price, open, high, low, change, percentage change, volume and 52-week range       |
| `cm_get_live_indices`  | `group` string and `nameFilter` string              | Index value, previous close, change, percentage change, published session values and an NSE timestamp |

These entries did not supply an output schema in discovery. Their descriptions are metadata rather than verified payload formats. No stock or index has a verified result. NIFTY 50, NIFTY BANK and NIFTY IT remain catalog candidates. SENSEX is a BSE index and has no NSE mapping. Tool metadata mentioned different upstream update patterns, but the application has no verified quote latency, source timestamp semantics, permitted polling budget or retention window.

## Audit verification

A fresh `market:discover` run returned 15 intraday tools. None advertised an output schema. The exact-match candidates and listing tools advertised these required inputs:

| Tool                   | Required inputs                           |
| ---------------------- | ----------------------------------------- |
| `cm_get_stock_quote`   | `symbol` string, such as `RELIANCE`       |
| `cm_get_index_quote`   | `indexName` string, such as `NIFTY 50`    |
| `cm_get_equity_stocks` | `limit` integer and `symbolFilter` string |
| `cm_get_live_indices`  | `group` string and `nameFilter` string    |

The other advertised tools were `cm_get_live_market_data`, `nse_get_losers`, `cm_get_call_auction_stocks`, `cm_get_bond_stocks`, `cm_get_live_gainers`, `nse_get_gainers`, `cm_get_data_status`, `cm_get_sme_stocks`, `cm_get_live_losers`, `nse_get_market_movers` and `cm_get_allstocks_status`.

The discovery CLI implements an SDK client for initialization, enumeration, and connection cleanup. The application has no NSE quote client, adapter, or NSE response normalizer. `npm run market:smoke` is absent, with no equivalent command. No stock or index tool was invoked during either discovery session. NSE's published terms do not clearly establish permission for this application's programmatic quote test and subsequent dashboard display.

## Access

NSE describes its MCP service for noncommercial informational use and incorporates its general Terms of Use. Those terms restrict automated collection and display or storage without permission. The docs do not establish permission for this dashboard’s programmatic retrieval and display. The application rejects `nse-mcp` requests in every environment. It has no quote allowlist, schema parser, quote cache, upstream retry path or quote smoke command. The current number of upstream quote invocations per snapshot is zero.

For discovery on an expressly permitted local machine, run the command manually. The following PowerShell settings apply only to that shell:

```powershell
$env:NODE_ENV = 'development'
$env:MARKET_DATA_PROVIDER = 'nse-mcp'
$env:NSE_MCP_LOCAL_RESEARCH_ENABLED = 'true'
npm run market:discover
```

Discovery is a CLI operation with no inbound listener. It rejects production, CI and Vercel environments, uses one bounded session with a fixed HTTPS endpoint, and closes the client afterwards. It lists metadata only and does not run at installation, startup, build or test time. Use a separate terminal from the dashboard or clear the temporary settings afterwards.

Before adding a quote adapter, obtain documented permission for the intended local retrieval and display, verify response schemas through a separately authorized one-symbol smoke test, and establish a permitted refresh budget. Any later research route must enforce loopback binding independently of request headers and reject hosted deployments. A public feed needs a separately authorized production provider.

## Diagnosing the dashboard

Inspect the response from `GET /api/market/quotes` to distinguish disabled mode from a configuration or access error:

| Response                                       | Meaning                                                                                |
| ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| HTTP 200 with `data.provider: "disabled"`      | Default provider or explicit disabled mode. Both quote arrays are empty.               |
| HTTP 403 with `PROVIDER_NOT_AUTHORIZED`        | The factory rejects `nse-mcp` everywhere and rejects `mock` outside local development. |
| HTTP 503 with `INVALID_PROVIDER_CONFIGURATION` | The server did not accept a configured provider or research flag.                      |
| HTTP 503 with `PROVIDER_UNAVAILABLE`           | The service failed before returning a validated application snapshot.                  |

On Vercel, leave `MARKET_DATA_PROVIDER` unset or set it to `disabled` in both Production and Preview. None of these responses indicates an NSE outage or an NSE payload parsing failure, because the route has no NSE upstream path.

## Official sources

- [NSE MCP setup and disclaimer](https://www.nseindia.com/nse-mcp)
- [NSE Terms of Use](https://betanseapi.nseindia.com/static/nse-terms-of-use)
- [NSE Data Sharing and Usage Policy](https://betanseapi.nseindia.com/static/market-data/nse-data-policy)
- [Official TypeScript MCP SDK v1 client](https://ts.sdk.modelcontextprotocol.io/client)
