"use client";

import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const current = hydrated ? (theme ?? "dark") : "dark";
  const Icon =
    current === "light" ? Sun : current === "system" ? Monitor : Moon;

  return (
    <label className="relative inline-flex min-h-11 items-center rounded-md text-muted-foreground">
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 size-4"
      />
      <span className="sr-only">Color theme</span>
      <select
        className="min-h-11 appearance-none rounded-md border bg-card pr-6 pl-8 text-xs font-medium text-foreground sm:text-sm"
        value={current}
        onChange={(event) => setTheme(event.currentTarget.value)}
        disabled={!hydrated}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="system">System</option>
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-2 size-3"
      />
    </label>
  );
}
