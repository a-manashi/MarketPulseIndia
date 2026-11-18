# TradingView integration

## Phase 3C

The original embed components were tested but never committed. Phase 3C reimplements their documented iframe lifecycle and restores the verified BSE display. The earlier implementation notes remain below as a historical record. TradingView is a display integration separate from the normalized custom provider path.

### Browser matrix

On 18 November 2026, Chromium loaded official embeds. All quote results below were checked visually in **Market Data**. The date applies to every row. No quote values were extracted or retained as application data.

| Widget      | Symbol            | Instrument                   | Exchange or source          | Quote rendered | Freshness         | Warning or result             |
| ----------- | ----------------- | ---------------------------- | --------------------------- | -------------- | ----------------- | ----------------------------- |
| Market Data | `NSE:NIFTY`       | NIFTY 50 index               | NSE                         | No             | —                 | Only available on TradingView |
| Market Data | `NSE:BANKNIFTY`   | NIFTY BANK index             | NSE                         | No             | —                 | Warning badge, no quote       |
| Market Data | `NSE:CNXIT`       | NIFTY IT index               | NSE                         | No             | —                 | Warning badge, no quote       |
| Market Data | `BSE:SENSEX`      | S&P BSE SENSEX index         | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `BSE:RELIANCE`    | Reliance Industries          | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `BSE:TCS`         | Tata Consultancy Services    | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `BSE:INFY`        | Infosys                      | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `BSE:HDFCBANK`    | HDFC Bank                    | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `BSE:ICICIBANK`   | ICICI Bank                   | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `BSE:SBIN`        | State Bank of India          | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `BSE:ITC`         | ITC                          | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `BSE:LT`          | Larsen & Toubro              | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `BSE:BHARTIARTL`  | Bharti Airtel                | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `BSE:AXISBANK`    | Axis Bank                    | BSE                         | Yes            | End-of-day        | —                             |
| Market Data | `SP:SPX`          | S&P 500 index                | S&P                         | No             | —                 | Only available on TradingView |
| Market Data | `NASDAQ:NDX`      | Nasdaq 100 index             | Nasdaq                      | No             | —                 | Warning badge, no quote       |
| Market Data | `DJ:DJI`          | Dow Jones Industrial Average | Dow Jones                   | No             | —                 | Warning badge, no quote       |
| Market Data | `TVC:NI225`       | Japan 225 (Nikkei benchmark) | TradingView calculated feed | No             | —                 | Empty quote cells             |
| Market Data | `HSI:HSI`         | Hang Seng index              | Hang Seng Indexes           | Yes            | End-of-day        | —                             |
| Market Data | `TVC:UKX`         | UK 100 (FTSE benchmark)      | TradingView calculated feed | No             | —                 | Empty quote cells             |
| Market Data | `FX_IDC:USDINR`   | USD/INR                      | IDC forex                   | Yes            | No badge observed | —                             |
| Market Data | `FX:EURUSD`       | EUR/USD                      | FX feed                     | Yes            | No badge observed | —                             |
| Market Data | `OANDA:XAUUSD`    | Gold/USD                     | OANDA broker feed           | Yes            | Unverified        | —                             |
| Market Data | `OANDA:XAGUSD`    | Silver/USD                   | OANDA broker feed           | Yes            | Unverified        | —                             |
| Market Data | `TVC:UKOIL`       | Brent oil benchmark feed     | TradingView calculated feed | Yes            | Unverified        | —                             |
| Market Data | `TVC:USOIL`       | WTI oil benchmark feed       | TradingView calculated feed | Yes            | Unverified        | —                             |
| Market Data | `BITSTAMP:BTCUSD` | Bitcoin/USD                  | Bitstamp                    | Yes            | No badge observed | —                             |
| Market Data | `BITSTAMP:ETHUSD` | Ethereum/USD                 | Bitstamp                    | Yes            | No badge observed | —                             |

The warning tooltip was read for NIFTY 50 and S&P 500. The other indicated rows showed the same red warning badge and no quote. Empty cells for Japan 225 and UK 100 are observations for this specific widget, rather than a determination that every widget lacks coverage.

TradingView documents end-of-day BSE and Hang Seng widget coverage. It describes forex and crypto widget data as real-time in its general FAQ, but the snapshot inspection did not independently verify the measured latency of these individual feeds. The oil feeds are TradingView-calculated instruments and are separate from exchange-traded futures. The US candidates are the index feeds themselves. No CFD substitutes were activated.

### Widget evaluation

| Widget            | Verification on 18 November 2026                                       | Dashboard                   |
| ----------------- | ---------------------------------------------------------------------- | --------------------------- |
| Ticker Tape       | SENSEX, Reliance and TCS BSE quotes visible                            | Active                      |
| Market Overview   | All ten listed BSE stock quotes visible in a compact 380px-wide widget | Active as the BSE watchlist |
| Market Data       | Quotes and warnings verified in the matrix above                       | Verification only           |
| Symbol Overview   | SENSEX end-of-day quote and history visible                            | Verification only           |
| Mini Chart        | SENSEX end-of-day quote and history visible                            | Active as Market Overview   |
| Economic Calendar | Scheduled event rows visible with India and US filters                 | Optional, off by default    |

Use `TRADINGVIEW_WIDGETS_ENABLED=false` to disable embeds. Set `TRADINGVIEW_CALENDAR_ENABLED=true` to add the verified calendar when widgets are enabled. The ticker, overview and watchlist lists are separate configurations in `src/config/tradingview.ts`. Keep `MARKET_DATA_PROVIDER=disabled` or unset on Vercel to use widgets while the custom provider remains disabled. `MARKET_CUSTOM_SECTIONS_ENABLED=false` independently turns off the custom market fetch and display.

The browser loads approved scripts from `s3.tradingview.com`. The provider controls downstream frames and quote rendering. The application keeps the attribution and never reads frame content. A successful initialization only confirms frame insertion. TradingView may independently report quote restrictions or upstream failures.

- [Official widget documentation](https://www.tradingview.com/widget-docs/)
- [TradingView widget coverage in Asia and the Pacific](https://www.tradingview.com/widget-docs/markets/asia-pacific/)
- [Widget data FAQ](https://www.tradingview.com/widget-docs/faq/data/)
- [TVC symbol sources](https://www.tradingview.com/support/solutions/43000709178-what-does-tvc-stand-for-in-the-instrument-ticker/)
- [TradingView terms and attribution](https://www.tradingview.com/policies/)

## Original Phase 3 (historical)

The TradingView-first strategy was superseded by Revised Phase 3 because the required embeds did not provide NSE quotes. The following records the prior implementation and verified BSE behavior. The dashboard now uses its own provider-independent market snapshot.

## Widgets and sizing

| Widget          | Official script filename          | Configuration                                                                 | Placement                                                    |
| --------------- | --------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Ticker Tape     | `embed-widget-ticker-tape.js`     | `symbols`, `displayMode: "adaptive"`, `showSymbolLogo`                        | Full-width row after the header                              |
| Market Overview | `embed-widget-market-overview.js` | `tabs`, responsive `width` and `height`, `showChart: false`, `showSymbolLogo` | Main Market Overview section, with a compact reserved height |
| Symbol Overview | `embed-widget-symbol-overview.js` | `symbols`, responsive `width` and `height`, `autosize`, `showVolume: false`   | Below the news, with a reserved chart height                 |

All three use the documented iframe-generating embed scripts under `https://s3.tradingview.com/external-embedding/`. Ticker Tape and Market Overview also have newer web component formats. This implementation uses their documented iframe variants and supplies `colorTheme` (Dark or Light) and `locale: "en"` to each script. It keeps the provider branding and the linked copyright markup supplied in the official embed structure.

The browser owns downstream frame and asset requests. Chromium observed frames at `https://www.tradingview-widget.com`. There is no custom proxy, quote cache or access to frame contents. Any future CSP must account for the approved script and frame origins and should reverify the provider's requirements.

## Symbol verification

| Symbols                                                                                                                                   | Embed result                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BSE:SENSEX`                                                                                                                              | Visually observed SENSEX data in Ticker Tape, Market Overview and Symbol Overview. TradingView lists BSE widget coverage as end-of-day.                                       |
| `NSE:NIFTY`, `NSE:BANKNIFTY`, `NSE:CNXIT`                                                                                                 | Excluded. TradingView's widget coverage list does not include India's NSE. Individual quote rendering was not tested.                                                         |
| `NSE:RELIANCE`, `NSE:TCS`, `NSE:INFY`, `NSE:HDFCBANK`, `NSE:ICICIBANK`, `NSE:SBIN`, `NSE:ITC`, `NSE:LT`, `NSE:BHARTIARTL`, `NSE:AXISBANK` | Excluded from the embed configuration for the same coverage reason. Names and original NSE symbols remain in the sidebar as links. Individual quote rendering was not tested. |

SENSEX is an explicitly labeled chart choice. NIFTY 50 is excluded and there is only one eligible chart symbol, so the selector is omitted. No fixed delay in minutes is claimed. A TradingView account subscription does not change widget entitlements. Review attribution, permitted use and exchange restrictions before production deployment.

## Troubleshooting and tests

- Use `NEXT_PUBLIC_MARKET_WIDGETS_ENABLED=false` for local, preview or offline use without widget requests. Restart the dev server or rebuild after changing the flag.
- Browser content blockers or unavailable scripts may trigger the local retry state. Retry starts a fresh instance. If TradingView displays its own availability message, use the linked symbol or markets page. Iframe insertion only confirms that the embed initialized.
- `npm run test` exercises configuration and lifecycle. `npm run test:e2e` uses controlled scripts, including blocked-script tests. To check the external integration, run `npm run dev` with widgets enabled and inspect the ticker, market overview and chart visually at desktop and mobile widths in both themes.

## Official references

- [Widget documentation](https://www.tradingview.com/widget-docs/) and [widget directory](https://www.tradingview.com/widget/)
- [Ticker Tape iframe embed](https://www.tradingview.com/widget-docs/widgets/tickers/legacy-ticker-tape/)
- [Market Overview iframe embed](https://www.tradingview.com/widget-docs/widgets/watchlists/legacy-market-overview/)
- [Symbol Overview](https://www.tradingview.com/widget-docs/widgets/charts/symbol-overview/)
- [Widget market coverage](https://www.tradingview.com/widget-docs/markets/asia-pacific/) and [data FAQ](https://www.tradingview.com/widget-docs/faq/data/)
- [TradingView policies](https://www.tradingview.com/policies/) and [privacy policy](https://www.tradingview.com/privacy-policy/)
