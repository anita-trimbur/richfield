import type { ComponentType } from "react";

import type { IconProps } from "@/components/icons/Icon";
import { cx } from "@/lib/cx";
import { isExternalHref } from "@/lib/links";

export type IconLinkProps = {
  href: string;
  /** Accessible name; the link has no visible text. */
  label: string;
  icon: ComponentType<IconProps>;
  /** Download the file at `href` instead of navigating to it. */
  download?: boolean;
  /** Sets the color (the icon inherits it), e.g. with a hover color. */
  className?: string;
};

/** Icon-only link to an external page or a downloadable file. */
export function IconLink({
  href,
  label,
  icon: LinkIcon,
  download,
  className,
}: IconLinkProps) {
  // Absolute URLs point off-site, so they open in a new tab. The name says so,
  // because screen reader users otherwise get no warning of the new tab.
  const isExternal = isExternalHref(href);

  return (
    <a
      href={href}
      aria-label={isExternal ? `${label} (opens in new tab)` : label}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      download={download || undefined}
      className={cx("block", className)}
    >
      <LinkIcon className="text-current" />
    </a>
  );
}
