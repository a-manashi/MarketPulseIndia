import { publicEnvironment } from "@/lib/env";

export const siteConfig = {
  name: publicEnvironment.NEXT_PUBLIC_APP_NAME,
  description: "Indian Stock Market News & Market Intelligence",
  service: "marketpulse-india",
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  currency: "INR",
  url: publicEnvironment.NEXT_PUBLIC_SITE_URL,
} as const;
