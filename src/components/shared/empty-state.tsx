import { Inbox } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="grid justify-items-center gap-2 px-5 py-9 text-center text-sm text-muted-foreground"
    >
      <Inbox aria-hidden="true" className="size-5" />
      <p>{message}</p>
    </div>
  );
}
