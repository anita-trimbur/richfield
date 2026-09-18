import { type RefObject, useEffect, useRef } from "react";

/** "in": moving onto a hovered or focused link. "out": returning to rest. */
export type SlideSpeed = "in" | "out";

/**
 * Milliseconds for an icon to travel one full slot width. Out is quicker, so
 * the icon snaps back when the pointer leaves.
 */
const SLOT_CROSSING_MS: Record<SlideSpeed, number> = { in: 160, out: 90 };

/**
 * Slides nav icons as if one icon rides a slider behind the labels. Whenever
 * `activeIndex` changes:
 *
 * 1. Every other icon that is at least partly visible slides out of its slot
 *    in the direction of travel (rightward when the new link is to the right).
 * 2. Once those have cleared, the active icon slides into its slot from the
 *    opposite side, so the motion reads as one continuous sweep.
 *
 * With no previous icon (off-nav pages), the new icon enters from the left,
 * and with no new one, the old icon exits back to the left.
 *
 * Animations start from wherever each icon currently is, so an interrupted
 * slide (e.g. quickly hovering across links) reverses or continues smoothly.
 * Speed is constant per slot width, so partial moves take proportionally less
 * time. It uses the Web Animations API rather than CSS transitions because
 * hidden icons must jump to the correct side before sliding in, which
 * transitions can't do. The static HTML positions icons with classes (see
 * NavLink), so the current page's icon shows without JavaScript.
 */
export function useIconSlider(
  icons: RefObject<(HTMLElement | null)[]>,
  activeIndex: number | null,
  speed: SlideSpeed,
) {
  const previousIndex = useRef(activeIndex);

  useEffect(() => {
    const from = previousIndex.current;
    previousIndex.current = activeIndex;
    if (from === activeIndex) return;

    // +1 slides rightward, -1 leftward.
    const direction =
      from === null
        ? 1
        : activeIndex === null
          ? -1
          : Math.sign(activeIndex - from);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const msPerSlot = reduceMotion ? 0 : SLOT_CROSSING_MS[speed];

    // Phase 1: slide out the other icons. Track when the last one is gone.
    let clearedAfter = 0;
    icons.current.forEach((icon, index) => {
      if (!icon || index === activeIndex) return;
      const position = positionInSlot(icon);

      if (position === null || isHidden(position)) {
        // Hold it hidden. This also cancels any delayed slide-in still waiting
        // to start, and hides icons in a list that isn't displayed.
        const hiddenAt = position ?? -1;
        slide(icon, hiddenAt, hiddenAt, 0, 0);
        return;
      }

      const duration = Math.abs(direction - position) * msPerSlot;
      clearedAfter = Math.max(clearedAfter, duration);
      slide(icon, position, direction, duration, 0, "ease-in");
    });

    // Phase 2: slide in the active icon after the others have cleared.
    const icon = activeIndex === null ? null : icons.current[activeIndex];
    if (!icon) return;
    const position = positionInSlot(icon);
    if (position === null) {
      slide(icon, 0, 0, 0, 0);
      return;
    }

    // A fully hidden icon starts just outside the side it enters from (the
    // jump is invisible because the slot clips it). A partly visible one,
    // caught mid-slide, returns from where it is.
    const start = isHidden(position) ? -direction : position;
    slide(
      icon,
      start,
      0,
      Math.abs(start) * msPerSlot,
      clearedAfter,
      "ease-out",
    );
  }, [icons, activeIndex, speed]);
}

/**
 * The icon's horizontal offset in slot widths: 0 is fully shown, ±1 or
 * further is fully hidden. Null if the list isn't displayed (no layout).
 */
function positionInSlot(icon: HTMLElement) {
  const slot = icon.parentElement?.getBoundingClientRect();
  if (!slot?.width) return null;
  return (icon.getBoundingClientRect().left - slot.left) / slot.width;
}

function isHidden(position: number) {
  // Tolerance for sub-pixel rounding at the slot edge.
  return Math.abs(position) > 0.99;
}

/**
 * Replaces any running animation on the icon with a slide between two
 * positions (in slot widths). `fill: "both"` holds the start position during
 * the delay and the end position afterward.
 */
function slide(
  icon: HTMLElement,
  from: number,
  to: number,
  duration: number,
  delay: number,
  easing = "linear",
) {
  for (const animation of icon.getAnimations()) animation.cancel();
  icon.animate(
    [{ translate: `${from * 100}% 0` }, { translate: `${to * 100}% 0` }],
    { duration, delay, easing, fill: "both" },
  );
}
