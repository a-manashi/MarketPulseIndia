import { Activity } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="relative z-10 border-b bg-card">
      <div className="site-container flex min-h-16 items-center justify-between gap-2 py-2 md:gap-6">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-2.5 rounded font-bold tracking-tight sm:gap-3"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground sm:size-9">
            <Activity aria-hidden="true" className="size-5" />
          </span>
          <span className="text-sm leading-tight sm:text-lg">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="hidden md:block" aria-label="Primary navigation">
          <ul className="flex items-center gap-1 lg:gap-4">
            {primaryNavigation.map(({ href, label }) => (
              <li key={href}>
                <Link
                  prefetch={false}
                  href={href}
                  className="inline-flex min-h-11 items-center rounded-md px-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
