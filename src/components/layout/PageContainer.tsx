import { cx } from "@/lib/cx";

type PageContainerProps = {
  /** Vertical spacing or layout; the width and side padding are fixed here. */
  className?: string;
  children: React.ReactNode;
};

/**
 * Centers content at the site's max width with its side gutters. The header
 * and every page use it, so page content always lines up with the header.
 */
export function PageContainer({ className, children }: PageContainerProps) {
  return (
    <div className={cx("mx-auto max-w-nav px-3 sm:px-6", className)}>
      {children}
    </div>
  );
}
