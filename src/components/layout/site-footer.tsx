import { Activity } from "lucide-react";
import Link from "next/link";
import { informationNavigation, primaryNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t bg-card">
      <div className="site-container py-8">
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-5 pb-5">
          <div>
            <p className="flex items-center gap-2 font-semibold">
              <Activity aria-hidden="true" className="size-4 text-primary" />
              {siteConfig.name}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-4">
              {[...primaryNavigation, ...informationNavigation].map(
                ({ href, label }) => (
                  <li key={href}>
                    <Link
                      prefetch={false}
                      className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground hover:underline"
                      href={href}
                    >
                      {label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
        <p className="border-t pt-5 text-sm leading-relaxed text-muted-foreground">
          For informational and educational purposes only. News articles are
          simulated. Market information may be delayed or unavailable. This site
          does not provide investment advice. Investing involves risk.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 text-xs text-muted-foreground">
          <small className="text-xs">
            © {new Date().getUTCFullYear()} {siteConfig.name}
          </small>
          <a
            className="inline-flex min-h-11 items-center underline decoration-border underline-offset-4 hover:text-foreground"
            href="/api/health"
          >
            Check service health
          </a>
        </div>
      </div>
    </footer>
  );
}
