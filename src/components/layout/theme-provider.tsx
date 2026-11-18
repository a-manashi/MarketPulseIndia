"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="marketpulse-theme"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
