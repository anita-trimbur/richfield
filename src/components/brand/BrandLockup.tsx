import Link from "next/link";

import { BrandMark } from "@/components/brand/BrandMark";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";

type BrandLockupProps = {
  /**
   * Color for the role subtitle, which otherwise inherits. The header mutes
   * it against the light surface; the footer lets it match its own text.
   */
  subtitleClassName?: string;
};

/** The brand mark, site name, and role. Used by the header and the footer. */
export function BrandLockup({ subtitleClassName }: BrandLockupProps) {
  return (
    <div>
      <Link href="/" className="flex w-fit items-center gap-1">
        <BrandMark className="w-9 shrink-0" />
        <span className="type-title">{site.name}</span>
      </Link>
      <p className={cx("type-subtitle", subtitleClassName)}>{site.role}</p>
    </div>
  );
}
