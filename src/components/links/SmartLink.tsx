import Link from "next/link";

import { isExternalHref } from "@/lib/links";

type SmartLinkProps = {
  /** A path on this site, or an absolute URL to another site. */
  href: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Text link that navigates within the site, or opens another site (any
 * absolute URL) in a new tab.
 */
export function SmartLink({ href, className, children }: SmartLinkProps) {
  if (!isExternalHref(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      {/* Screen reader users otherwise get no warning of the new tab. */}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
