import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { parsePublicEnvironment, publicEnvironment } from "@/lib/env";

describe("public environment", () => {
  it("uses safe local defaults", () => {
    expect(parsePublicEnvironment({})).toEqual({
      NEXT_PUBLIC_APP_NAME: "MarketPulse India",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    });
  });

  it("accepts deployment settings", () => {
    expect(
      parsePublicEnvironment({
        NEXT_PUBLIC_APP_NAME: " MarketPulse Preview ",
        NEXT_PUBLIC_SITE_URL: "https://preview.example.com/",
      }).NEXT_PUBLIC_APP_NAME,
    ).toBe("MarketPulse Preview");
  });

  it.each([
    "invalid",
    "ftp://example.com",
    "https://user:pass@example.com",
    "https://example.com/news",
    "https://example.com/?q=test",
  ])("rejects invalid site origin %s", (url) =>
    expect(() =>
      parsePublicEnvironment({ NEXT_PUBLIC_SITE_URL: url }),
    ).toThrow(),
  );

  it("rejects a blank application name", () => {
    expect(() =>
      parsePublicEnvironment({ NEXT_PUBLIC_APP_NAME: " " }),
    ).toThrow();
  });
});

it("centralizes the public configuration and Indian defaults", () => {
  expect(siteConfig).toMatchObject({
    name: publicEnvironment.NEXT_PUBLIC_APP_NAME,
    url: publicEnvironment.NEXT_PUBLIC_SITE_URL,
    locale: "en-IN",
    timezone: "Asia/Kolkata",
    currency: "INR",
  });
});
