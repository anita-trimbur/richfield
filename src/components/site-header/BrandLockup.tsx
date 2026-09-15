import Link from "next/link";

import { BrandMark } from "@/components/brand/BrandMark";
import { site } from "@/content/site";

export function BrandLockup() {
  return (
    <div>
      <Link href="/" className="flex w-fit items-center gap-1">
        <BrandMark className="w-9 shrink-0" />
        <span className="type-title">{site.name}</span>
      </Link>
      <p className="type-subtitle">{site.role}</p>
    </div>
  );
}
