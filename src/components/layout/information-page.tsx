import type { ReactNode } from "react";

export function InformationPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="site-container py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </article>
  );
}
