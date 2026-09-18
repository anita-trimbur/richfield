"use client";

import { useState } from "react";

import { SmartLink } from "@/components/links/SmartLink";

type CardLinkProps = {
  /** The card's destination; external URLs open in a new tab (SmartLink). */
  href: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * A timeline card's link, which nudges the card's icon when the card is
 * clicked, so a click is acknowledged even while the page is still navigating.
 *
 * Every activation lands on this link — a click anywhere on the card, because
 * the link's ::after covers it, and Enter on the focused link — and sets
 * `data-bumping`. That plays the icon's bump (the `group-data-bumping` class
 * in TimelineCard, timed by `animate-card-link-bump` in globals.css), and the
 * flag clears when the animation ends; animationend bubbles up from the icon,
 * and the bump is the only animation inside the link.
 *
 * Clicking again while a bump is still playing doesn't restart it: the flag is
 * already set. Under reduced motion there's no animation to play or to end, so
 * the flag stays set and nothing moves.
 */
export function CardLink({ href, className, children }: CardLinkProps) {
  const [isBumping, setIsBumping] = useState(false);

  return (
    <SmartLink
      href={href}
      className={className}
      data-bumping={isBumping || undefined}
      onClick={() => setIsBumping(true)}
      onAnimationEnd={() => setIsBumping(false)}
    >
      {children}
    </SmartLink>
  );
}
