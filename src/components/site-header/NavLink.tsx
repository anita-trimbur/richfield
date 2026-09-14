"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/content/navigation";

// Treat "/work" and "/work/" as the same page.
function normalizePath(path: string) {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export function NavLink({ label, href }: NavItem) {
  const isCurrent = normalizePath(usePathname()) === normalizePath(href);

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className="aria-[current=page]:font-bold"
    >
      {/*
        Reserve the bold width at all times: the ::after is an invisible,
        zero-height bold copy of the label, so the span is always as wide as
        the bold text and switching the current page never shifts the links.
      */}
      <span
        data-label={label}
        className="inline-flex flex-col items-center after:invisible after:h-0 after:overflow-hidden after:font-bold after:content-[attr(data-label)]"
      >
        {label}
      </span>
    </Link>
  );
}
