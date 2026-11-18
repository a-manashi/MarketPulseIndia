import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="grid justify-items-center gap-3 rounded-lg border bg-card p-6 text-center text-sm">
      <p role="alert" className="flex items-center gap-2">
        <CircleAlert
          aria-hidden="true"
          className="size-4 shrink-0 text-destructive"
        />
        {message}
      </p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="min-h-11"
        >
          Try again
        </Button>
      )}
    </div>
  );
}
