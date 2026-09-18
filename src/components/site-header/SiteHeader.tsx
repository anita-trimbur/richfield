"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { BrandLockup } from "@/components/brand/BrandLockup";
import { PageContainer } from "@/components/layout/PageContainer";
import { cx } from "@/lib/cx";

import { ExternalLinks } from "./ExternalLinks";
import { MenuToggleIcon } from "./MenuToggleIcon";
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
            <BrandLockup subtitleClassName="text-limestone-700" />
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
            // The icon swap keys off this button's aria-expanded, so it has
            // to be the group (see MenuToggleIcon).
            className={cx(
              "group col-start-3 row-start-1 -mr-2 justify-self-end p-2",
              mobileOnly,
            )}
          >
            <MenuToggleIcon />
          </button>
        </div>
      </PageContainer>

      {/*
        Mobile menu panel: a band of limestone-100 across the full width, with
        its rows inside PageContainer so they line up with the brand lockup
        above. The header's own bottom padding is the gap between the two. The
        external links are left out at this size; the footer carries them.

        It stays in the page at every width, collapsed to nothing when closed
        (menu-panel-rows, which is what lets it slide instead of appear) and
        marked inert so it takes no space, no focus and no announcement there.
        aria-hidden says the same thing to the browsers whose inert support
        stops at focus. Opening slides the band down and the rows fade in one
        after another behind it (menu-row-shown, staggered by --nav-order).
      */}
      <div
        id={menuId}
        data-open={menuOpen || undefined}
        inert={!menuOpen}
        aria-hidden={!menuOpen}
        className={cx(
          "group grid menu-panel-closed overflow-hidden data-open:menu-panel-open",
          mobileOnly,
        )}
      >
        {/*
          The collapsing grid item, and the band itself: the limestone surface
          belongs here rather than on the panel, so that the panel's own
          bottom padding reads as a gap above the page content.

          min-h-0 lets the closed row squeeze this to nothing, and it must
          carry no padding of its own: padding isn't something a 0fr row can
          squeeze away, so it would leave a sliver of the band showing under
          the header. The slim padding that keeps the first and last rows'
          focus rings clear of the clipped edges goes inside it instead.
          PageContainer has to stay an ordinary block here too — as a grid
          item, its mx-auto would shrink it to its content and center that,
          rather than filling the width.
        */}
        <nav aria-label="Primary" className="min-h-0 bg-limestone-100">
          <PageContainer className="py-1">
            <PrimaryNavList
              className="flex flex-col divide-y divide-limestone-200"
              itemClassName="menu-row-hidden group-data-open:menu-row-shown"
              linkClassName="w-full py-5 text-2xl"
              iconClassName="size-6"
            />
          </PageContainer>
        </nav>
      </div>
    </header>
  );
}
