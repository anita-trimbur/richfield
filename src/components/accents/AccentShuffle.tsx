"use client";

import { useLayoutEffect, useRef, useSyncExternalStore } from "react";

import { shuffleAccentClasses } from "./shuffleAccentClasses";

type AccentShuffleProps = {
  /**
   * The accent classes to deal out, from `@/lib/accents`: fills for the
   * timeline's cards, text colors for the footer's brand lockup.
   */
  classes: string[];
  /** Content holding the accent elements (marked `data-accent`). */
  children: React.ReactNode;
};

// Nothing to subscribe to: the snapshot below only tells the server render and
// hydration apart from later client renders.
const subscribe = () => () => {};

/**
 * Gives the `data-accent` elements inside it random accent classes, so they
 * differ on every page load. The static HTML gives them fallback classes in
 * palette order, which the shuffle replaces before the first paint in both of
 * these cases:
 *
 * - Full page load: an inline script right after the content shuffles it as
 *   the browser parses the HTML, well before React hydrates.
 * - Client-side navigation (e.g. the Home link): React never runs scripts it
 *   renders, so a layout effect shuffles instead, before the browser paints.
 *
 * The shuffle marks the wrapper when it runs, so the layout effect that also
 * runs after hydration leaves the script's colors alone.
 */
export function AccentShuffle({ classes, children }: AccentShuffleProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  // True on the server and during hydration; false once hydrated and on
  // client-side renders. The script renders only while this is true: rendering
  // a <script> on the client does nothing and makes React log an error.
  const isServerHtml = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );

  useLayoutEffect(() => {
    if (groupRef.current) shuffleAccentClasses(groupRef.current, classes);
  }, [classes]);

  return (
    // The shuffle adds an attribute here and changes classes below, which
    // React would otherwise report as hydration mismatches.
    <div ref={groupRef} suppressHydrationWarning>
      {children}
      {isServerHtml && (
        <script
          // The function's compiled source differs between the server and
          // client bundles; the one in the HTML already ran, so that's fine.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(${shuffleAccentClasses})(document.currentScript.parentElement,${JSON.stringify(classes)})`,
          }}
        />
      )}
    </div>
  );
}
