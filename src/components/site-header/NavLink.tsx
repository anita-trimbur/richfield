import Link from "next/link";
import type { FocusEvent, PointerEvent, Ref } from "react";

import type { NavItem } from "@/content/navigation";
import { cx } from "@/lib/cx";

type NavLinkProps = NavItem & {
  isCurrent: boolean;
  /** Receives the sliding icon element, which PrimaryNavList animates. */
  iconRef: Ref<HTMLSpanElement>;
  onPointerEnter: (event: PointerEvent<HTMLAnchorElement>) => void;
  onFocus: (event: FocusEvent<HTMLAnchorElement>) => void;
};

export function NavLink({
  label,
  href,
  icon: ItemIcon,
  isCurrent,
  iconRef,
  onPointerEnter,
  onFocus,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      // pr-icon-with-label mirrors the icon slot and gap on the right, so the
      // label is centered in its link.
      className="inline-flex items-center gap-icon-label pr-icon-with-label aria-[current=page]:font-bold"
    >
      {/*
        The icon slot is always reserved, so the label never moves. The slot
        clips its icon, which rests just outside it (hidden) unless this is the
        current page; useIconSlider slides it in and out from there.
      */}
      <span className="overflow-hidden">
        <span
          ref={iconRef}
          className={cx("block", !isCurrent && "-translate-x-full")}
        >
          <ItemIcon />
        </span>
      </span>

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
