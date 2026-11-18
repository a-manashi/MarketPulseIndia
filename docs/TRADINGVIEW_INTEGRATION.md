# TradingView integration (historical)

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
