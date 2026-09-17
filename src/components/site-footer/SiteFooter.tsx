import { BrandLockup } from "@/components/brand/BrandLockup";
import { PageContainer } from "@/components/layout/PageContainer";
import { ExternalLinkList } from "@/components/links/ExternalLinkList";
import { site } from "@/content/site";

import { CurrentYear } from "./CurrentYear";
import { ShapeTiles } from "./ShapeTiles";

/** Site-wide footer: the brand lockup, links and copyright, on ink. */
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-limestone-50">
      <PageContainer className="flex flex-col gap-12 py-12 md:flex-row md:items-end md:gap-15">
        <div className="flex shrink-0 flex-col gap-6">
          <BrandLockup />
          {/* Dims on hover and focus, the reverse of the header's links. */}
          <ExternalLinkList linkClassName="hover:text-limestone-300 focus-visible:text-limestone-300" />
          <p>
            © <CurrentYear buildYear={new Date().getFullYear()} />{" "}
            {site.legalName}. All rights reserved.
          </p>
        </div>

        <ShapeTiles className="min-w-0 flex-1" />
      </PageContainer>
    </footer>
  );
}
