import { afterEach, expect, it, vi } from "vitest";
import { GET } from "@/app/api/health/route";

afterEach(() => vi.useRealTimers());

it("returns a fresh UTC timestamp in an uncached JSON response", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  const first = GET();
  expect(first.status).toBe(200);
  expect(first.headers.get("Content-Type")).toContain("application/json");
  expect(first.headers.get("Cache-Control")).toBe("no-store");
  expect(await first.json()).toEqual({
    status: "ok",
    service: "marketpulse-india",
    timestamp: "2026-01-01T00:00:00.000Z",
  });
  vi.advanceTimersByTime(1000);
  expect(await GET().json()).toHaveProperty(
    "timestamp",
    "2026-01-01T00:00:01.000Z",
  );
});
