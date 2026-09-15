"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { primaryNav } from "@/content/navigation";

import { NavLink } from "./NavLink";
import { useIconSlider } from "./useIconSlider";

type PrimaryNavListProps = {
  /** Sets the layout (row or column) for where the list is used. */
  className?: string;
};

// Treat "/work" and "/work/" as the same page.
function normalizePath(path: string) {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export function PrimaryNavList({ className }: PrimaryNavListProps) {
  const pathname = usePathname();
  const currentIndex = primaryNav.findIndex(
    (item) => normalizePath(item.href) === normalizePath(pathname),
  );

  // Which link the mouse is over, and which has keyboard focus. Either one
  // moves the icon to that link; hover wins if both are set. When neither is,
  // the icon rests on the current page's link (or nowhere, off-nav pages).
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Forget hover and focus when the route changes. A list hidden by the
  // mobile menu closing never gets pointerleave or blur, so its stale hover
  // would otherwise keep the icon on the wrong link when the menu reopens.
  // Adjusting state during render avoids painting that stale state.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setHoveredIndex(null);
    setFocusedIndex(null);
  }

  const interactedIndex = hoveredIndex ?? focusedIndex;
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  useIconSlider(
    iconRefs,
    interactedIndex ?? (currentIndex === -1 ? null : currentIndex),
    // Moving onto a link plays at full length; returning to rest is quicker.
    interactedIndex === null ? "out" : "in",
  );

  return (
    <ul
      className={className}
      // Hover is cleared only when the pointer leaves the whole list, not each
      // link, so crossing the gap between two links goes straight from one to
      // the other instead of briefly returning to the current page.
      onPointerLeave={() => setHoveredIndex(null)}
      // Likewise, clear focus only when it moves somewhere outside the list.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusedIndex(null);
        }
      }}
    >
      {primaryNav.map((item, index) => (
        <li key={item.href}>
          <NavLink
            {...item}
            isCurrent={index === currentIndex}
            iconRef={(el) => {
              iconRefs.current[index] = el;
            }}
            onPointerEnter={(event) => {
              // Touch taps fire pointerenter just before navigating, which
              // would play a hover animation nobody sees through; skip them.
              if (event.pointerType !== "touch") setHoveredIndex(index);
            }}
            onFocus={(event) => {
              // Only keyboard focus counts; a mouse click also focuses the
              // link, but hover already covers that case.
              setFocusedIndex(
                event.currentTarget.matches(":focus-visible") ? index : null,
              );
            }}
          />
        </li>
      ))}
    </ul>
  );
}
