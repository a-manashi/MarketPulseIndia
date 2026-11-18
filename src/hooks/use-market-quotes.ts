"use client";

import useSWR from "swr";
import { marketSnapshotSchema } from "@/types/market-snapshot";

export function useMarketQuotes(enabled: boolean) {
  return useSWR(
    enabled ? "/api/market/quotes" : null,
    async (path: string) => {
      const response = await fetch(path, {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok)
        throw new Error("Market data is currently unavailable.");
      const payload: unknown = await response.json();
      return marketSnapshotSchema.parse(
        payload && typeof payload === "object" && "data" in payload
          ? payload.data
          : undefined,
      );
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      refreshInterval: 0,
    },
  );
}
