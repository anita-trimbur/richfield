import { type RefObject, useEffect, useState } from "react";

/** Minimum space (px) required between each pair of adjacent header areas. */
const MIN_AREA_GAP = 60;

export type NavMode = "desktop" | "mobile";

type NavAreaRefs = {
  /** The row containing all three areas; its width is the space available. */
  row: RefObject<HTMLElement | null>;
  left: RefObject<HTMLElement | null>;
  center: RefObject<HTMLElement | null>;
  right: RefObject<HTMLElement | null>;
};

/**
 * Decides whether the header has room for the full desktop layout, based on
 * the actual widths of its content rather than a fixed breakpoint, so it stays
 * correct as links, icons, and fonts change.
 *
 * The center area is centered in the row, so the space on each side of it is
 * (rowWidth - centerWidth) / 2 - sideWidth. The wider side area leaves the
 * smaller gap, so desktop fits only when:
 *
 *   rowWidth >= centerWidth + 2 * (max(leftWidth, rightWidth) + MIN_AREA_GAP)
 *
 * The areas must keep their natural (max-content) width in both modes, even
 * while visually hidden, for this measurement to work.
 *
 * Returns null until the first measurement (i.e. in the static HTML, before
 * hydration), so callers can fall back to a CSS breakpoint.
 */
export function useNavMode({
  row,
  left,
  center,
  right,
}: NavAreaRefs): NavMode | null {
  const [mode, setMode] = useState<NavMode | null>(null);

  useEffect(() => {
    const rowEl = row.current;
    const leftEl = left.current;
    const centerEl = center.current;
    const rightEl = right.current;
    if (!rowEl || !leftEl || !centerEl || !rightEl) return;

    const width = (el: HTMLElement) => el.getBoundingClientRect().width;

    const update = () => {
      const sideWidth = Math.max(width(leftEl), width(rightEl));
      const required = width(centerEl) + 2 * (sideWidth + MIN_AREA_GAP);
      setMode(width(rowEl) >= required ? "desktop" : "mobile");
    };

    // ResizeObserver calls update once when observation starts, then again
    // whenever the row (viewport) or any area's content changes size, e.g.
    // when a link is added or the web font finishes loading.
    const observer = new ResizeObserver(update);
    for (const el of [rowEl, leftEl, centerEl, rightEl]) observer.observe(el);
    return () => observer.disconnect();
  }, [row, left, center, right]);

  return mode;
}
