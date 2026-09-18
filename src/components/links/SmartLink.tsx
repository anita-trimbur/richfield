import Link from "next/link";
import type { ComponentProps } from "react";

import { isExternalHref } from "@/lib/links";

type SmartLinkProps = Omit<ComponentProps<"a">, "href"> & {
  /** A path on this site, or an absolute URL to another site. */
  href: string;
  children: React.ReactNode;
};

/**
 * Text link that navigates within the site, or opens another site (any
 * absolute URL) in a new tab. Anything else an anchor takes (event handlers,
 * data attributes) is passed straight through.
 */
export function SmartLink({ href, children, ...anchorProps }: SmartLinkProps) {
  if (!isExternalHref(href)) {
    return (
      <Link href={href} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...anchorProps}>
      {children}
      {/* Screen reader users otherwise get no warning of the new tab. */}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
