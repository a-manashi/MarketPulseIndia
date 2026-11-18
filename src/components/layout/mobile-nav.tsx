"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { primaryNavigation } from "@/config/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  return (
    <div
      className="md:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <Button
        ref={trigger}
        type="button"
        variant="outline"
        size="icon"
        className="size-11"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>
      <nav
        id={menuId}
        aria-label="Mobile navigation"
        hidden={!open}
        className="absolute inset-x-0 top-full z-20 border-y bg-card px-4 py-2 shadow-lg"
      >
        <ul className="mx-auto max-w-3xl">
          {primaryNavigation.map(({ href, label }) => (
            <li key={href}>
              <Link
                prefetch={false}
                href={href}
                className="flex min-h-11 items-center rounded px-3 text-sm font-medium hover:bg-accent"
                onClick={() => {
                  setOpen(false);
                  trigger.current?.focus();
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
