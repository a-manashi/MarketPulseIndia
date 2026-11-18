"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  tradingViewWidgets,
  widgetOptions,
  widgetScript,
  type WidgetName,
  type WidgetTheme,
} from "@/config/tradingview";

function Loading({ label, height }: { label: string; height: number }) {
  return (
    <p
      role="status"
      className="grid place-items-center bg-muted/30 px-3 text-sm text-muted-foreground"
      style={{ minHeight: height }}
    >
      Loading {label} from TradingView…
    </p>
  );
}

function WidgetAttempt({
  name,
  theme,
  retry,
}: {
  name: WidgetName;
  theme: WidgetTheme;
  retry: () => void;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "mounted" | "unavailable">(
    "loading",
  );
  const { label, height, href } = tradingViewWidgets[name];
  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    if (name !== "ticker") container.style.height = "100%";
    const placeholder = document.createElement("div");
    placeholder.className = "tradingview-widget-container__widget";
    const copyright = document.createElement("div");
    copyright.className = "tradingview-widget-copyright";
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener nofollow";
    const labelText = document.createElement("span");
    labelText.className = "blue-text";
    labelText.textContent = label;
    link.append(labelText);
    const trademark = document.createElement("span");
    trademark.className = "trademark";
    trademark.textContent = " by TradingView";
    copyright.append(link, trademark);
    container.append(placeholder, copyright);

    const script = document.createElement("script");
    script.src = widgetScript(name);
    script.async = true;
    script.textContent = JSON.stringify(widgetOptions(name, theme));
    let disposed = false;
    const observer = new MutationObserver(() => {
      if (disposed || !container.querySelector("iframe")) return;
      stopWatching();
      setStatus("mounted");
    });
    const timer = window.setTimeout(unavailable, 12000);
    function stopWatching() {
      observer.disconnect();
      window.clearTimeout(timer);
      script.removeEventListener("error", unavailable);
    }
    function unavailable() {
      disposed = true;
      stopWatching();
      container.remove();
      setStatus("unavailable");
    }
    observer.observe(container, { childList: true, subtree: true });
    script.addEventListener("error", unavailable);
    // Discarded Strict Mode effects should never insert an external script.
    queueMicrotask(() => {
      if (!disposed) {
        host.append(container);
        container.append(script);
      }
    });
    return () => {
      disposed = true;
      stopWatching();
      container.remove();
    };
  }, [href, label, name, theme]);

  return (
    <div className="relative min-w-0">
      <div
        ref={mount}
        className="w-full min-w-0 [&_iframe]:block [&_iframe]:max-w-full"
        style={
          status === "unavailable"
            ? undefined
            : name === "ticker"
              ? { minHeight: height }
              : { height }
        }
      />
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-x-0 top-0">
          <Loading label={label} height={height} />
        </div>
      )}
      {status === "unavailable" && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 p-3 text-sm">
          <p role="status" className="text-muted-foreground">
            TradingView {label} is unavailable.
          </p>
          <a href={href} className="text-primary underline">
            Open on TradingView
          </a>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={retry}
          >
            Retry {label}
          </Button>
        </div>
      )}
    </div>
  );
}

const subscribe = () => () => {};

export function TradingViewWidget({ name }: { name: WidgetName }) {
  const { resolvedTheme } = useTheme();
  const [attempt, setAttempt] = useState(0);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const { label, height } = tradingViewWidgets[name];

  // The initial SSR and hydration render use identical reserved space.
  if (!hydrated || (resolvedTheme !== "dark" && resolvedTheme !== "light")) {
    return <Loading label={label} height={height} />;
  }
  return (
    <WidgetAttempt
      key={`${name}:${resolvedTheme}:${attempt}`}
      name={name}
      theme={resolvedTheme}
      retry={() => setAttempt((previous) => previous + 1)}
    />
  );
}
