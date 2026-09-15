"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { MenuIcon } from "@/components/icons/MenuIcon";
import { PageContainer } from "@/components/layout/PageContainer";
import { cx } from "@/lib/cx";

import { BrandLockup } from "./BrandLockup";
import { ExternalLinks } from "./ExternalLinks";
import { PrimaryNavList } from "./PrimaryNavList";
import { useNavMode } from "./useNavMode";

export function SiteHeader() {
  const rowRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();

  const mode = useNavMode({
    row: rowRef,
    left: leftRef,
    center: centerRef,
    right: rightRef,
  });

  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu whenever the route changes (a link in it was followed) or
  // the layout switches modes (e.g. the window widened to desktop). Adjusting
  // state during render, rather than in an effect, means the stale open menu
  // is never painted.
  const resetKey = `${pathname}|${mode}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setMenuOpen(false);
  }

  // While the menu is open, Escape closes it and returns focus to the menu
  // button, so keyboard users aren't left focused inside a hidden panel.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // In mobile mode the desktop-only areas stay rendered but invisible (which
  // also hides them from keyboard and screen readers) and out of flow, so
  // useNavMode can keep measuring their natural widths. Before the first
  // measurement (static HTML), a breakpoint that roughly matches the current
  // content decides instead.
  const desktopOnly = cx(
    mode === "mobile" && "invisible absolute top-0 left-0",
    mode === null &&
      "max-md:invisible max-md:absolute max-md:top-0 max-md:left-0",
  );
  const mobileOnly = cx(
    mode === "desktop" && "hidden",
    mode === null && "md:hidden",
  );

  return (
    // overflow-x-clip stops the hidden desktop areas from causing horizontal
    // scrolling on narrow screens, without clipping the menu vertically.
    <header className="overflow-x-clip">
      <PageContainer className="pt-3 pb-6 sm:pt-6 sm:pb-12">
        <div
          ref={rowRef}
          className="relative grid grid-cols-[1fr_auto_1fr] items-center"
        >
          <div ref={leftRef} className="w-max">
            <BrandLockup />
          </div>

          <nav
            ref={centerRef}
            aria-label="Primary"
            className={cx("w-max", desktopOnly)}
          >
            {/* auto-cols-fr makes every link cell as wide as the widest. */}
            <PrimaryNavList className="grid auto-cols-fr grid-flow-col gap-6 text-center" />
          </nav>

          <div
            ref={rightRef}
            className={cx("col-start-3 w-max justify-self-end", desktopOnly)}
          >
            <ExternalLinks />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
            className={cx(
              "col-start-3 row-start-1 -mr-2 justify-self-end p-2",
              mobileOnly,
            )}
          >
            <MenuIcon className="size-6" />
          </button>
        </div>

        {/* Mobile menu panel. Full styling is still to come. */}
        <div
          id={menuId}
          hidden={!menuOpen}
          className="flex flex-col gap-6 pt-6"
        >
          <nav aria-label="Primary">
            <PrimaryNavList className="flex flex-col gap-3" />
          </nav>
          <ExternalLinks />
        </div>
      </PageContainer>
    </header>
  );
}
