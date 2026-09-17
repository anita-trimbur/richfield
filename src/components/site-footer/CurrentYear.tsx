"use client";

import { useSyncExternalStore } from "react";

type CurrentYearProps = {
  /** The year at build time, rendered in the HTML and until hydration. */
  buildYear: number;
};

// Nothing to subscribe to: the two snapshots below only tell the server
// render and hydration apart from later client renders.
const subscribe = () => () => {};

/**
 * The current year. The site is a static export, so the year baked into the
 * HTML is whenever it was last built; this replaces it with the year on the
 * visitor's machine once hydrated, in case a new one has since begun.
 * Without JavaScript the build year stays, which is still sensible.
 */
export function CurrentYear({ buildYear }: CurrentYearProps) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => buildYear,
  );

  return <>{year}</>;
}
