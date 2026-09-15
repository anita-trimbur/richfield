"use client";

import { useEffect, useRef } from "react";

import {
  brandmarkOutline,
  brandmarkSides,
  brandmarkViewBox,
} from "@/content/brandmark";
import { partialStrokeOutline } from "@/lib/stroke-outline";

/** How long the pen takes to draw the whole mark. */
const DRAW_DURATION_MS = 1600;

type BrandMarkProps = {
  className?: string;
};

/**
 * Brand icon, drawn on like a pen stroke when the page loads. Fills with
 * `currentColor`, so set its color with a text color utility on it or a parent
 * (e.g. `text-ink`). Size it by width (`w-*`); the height follows the mark's
 * proportions. Decorative: always pair it with visible text or an accessible
 * label.
 */
export function BrandMark({ className }: BrandMarkProps) {
  const pathRef = useRef<SVGPathElement>(null);

  // Draws the mark once, after hydration.
  //
  // The static HTML holds the finished mark, kept hidden for a moment by the
  // `brandmark-fallback` animation (motion-safe only), so it doesn't flash
  // fully drawn before this effect erases it. If JavaScript never runs, the
  // fallback fades it in instead. Setting `data-drawing` turns the fallback
  // off.
  //
  // Frames write the path's `d` attribute directly instead of going through
  // React state, so drawing doesn't re-render 60 times a second. React leaves
  // the attribute alone afterwards because the `d` prop never changes.
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Hydration was slow enough that the fallback has started showing the
    // finished mark; erasing and redrawing it now would look like a glitch.
    const alreadyShown = getComputedStyle(path).opacity !== "0";
    if (reduceMotion || alreadyShown) return;

    let frame = 0;
    let start: number | undefined;

    const drawFrame = (now: number) => {
      start ??= now;
      const elapsed = Math.min((now - start) / DRAW_DURATION_MS, 1);
      if (elapsed < 1) {
        path.setAttribute(
          "d",
          partialStrokeOutline(brandmarkSides, easeInOutCubic(elapsed)),
        );
        frame = requestAnimationFrame(drawFrame);
      } else {
        // End on the exact exported outline rather than the rebuilt one.
        path.setAttribute("d", brandmarkOutline);
      }
    };

    path.dataset.drawing = "";
    path.setAttribute("d", "");
    frame = requestAnimationFrame(drawFrame);

    // Stopped early (unmounted, or re-run by Strict Mode in development):
    // restore the finished mark and the fallback, so a re-run starts clean.
    return () => {
      cancelAnimationFrame(frame);
      path.setAttribute("d", brandmarkOutline);
      delete path.dataset.drawing;
    };
  }, []);

  return (
    <svg
      viewBox={brandmarkViewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        ref={pathRef}
        d={brandmarkOutline}
        fill="currentColor"
        className="motion-safe:not-data-drawing:animate-brandmark-fallback"
      />
    </svg>
  );
}

/** Starts and ends slowly, like a pen setting down and lifting off. */
function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;
}
