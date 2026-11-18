import { FlaskConical } from "lucide-react";

export function DemoDataNotice() {
  return (
    <p className="flex items-start gap-2.5 rounded-md border border-market-warning/25 bg-market-warning/8 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground sm:items-center sm:text-sm">
      <FlaskConical
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-market-warning sm:mt-0"
      />
      <span>
        <strong className="text-market-warning">Demo mode</strong> — Market data
        and news shown are simulated for development purposes.
      </span>
    </p>
  );
}
