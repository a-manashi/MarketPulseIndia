import { siteConfig } from "@/config/site";

const precision = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;
const number = new Intl.NumberFormat(siteConfig.locale, precision);
const currency = new Intl.NumberFormat(siteConfig.locale, {
  ...precision,
  style: "currency",
  currency: siteConfig.currency,
});
const signedNumber = new Intl.NumberFormat(siteConfig.locale, {
  ...precision,
  signDisplay: "exceptZero",
});
const percentage = new Intl.NumberFormat(siteConfig.locale, {
  ...precision,
  style: "percent",
  signDisplay: "exceptZero",
});

function format(value: number, formatter: Intl.NumberFormat): string {
  return Number.isFinite(value)
    ? formatter.format(Object.is(value, -0) ? 0 : value)
    : "—";
}

export const formatCurrency = (value: number): string =>
  format(value, currency);
export const formatIndexValue = (value: number): string =>
  format(value, number);
export const formatAbsoluteChange = (value: number): string =>
  format(value, signedNumber);
export const formatPercentageChange = (value: number): string =>
  format(value / 100, percentage);

export function getMarketDirection(
  value: number,
): "up" | "down" | "flat" | "unavailable" {
  if (!Number.isFinite(value)) return "unavailable";
  if (Math.abs(value) < 0.005) return "flat";
  return value > 0 ? "up" : "down";
}
