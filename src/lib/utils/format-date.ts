import { siteConfig } from "@/config/site";

const sampleDate = new Intl.DateTimeFormat(siteConfig.locale, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: siteConfig.timezone,
});

export function formatPublishedAt(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : sampleDate.format(date) + " IST";
}
