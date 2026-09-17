import { SmartLink } from "@/components/links/SmartLink";
import type { TimelineSection as TimelineSectionData } from "@/content/timeline";

import { TimelineMarker } from "./TimelineMarker";

type TimelineSectionProps = Omit<TimelineSectionData, "cards"> & {
  /** The section's cards, each wrapped in an <li>. */
  children: React.ReactNode;
};

/** One career stage: its marker, heading and period, then its cards. */
export function TimelineSection({
  period,
  heading,
  company,
  icon,
  children,
}: TimelineSectionProps) {
  return (
    <li className="flex flex-col gap-6">
      <div data-timeline-reveal="section" className="flex items-start gap-3">
        <TimelineMarker icon={icon} />
        {/* Reversed so screen readers reach the heading first, while the
            period still shows above it. */}
        <div className="flex flex-col-reverse timeline-pending:opacity-0 timeline-revealed:animate-timeline-label">
          <h2 className="type-heading">
            {heading}
            {company && (
              <>
                {" "}
                <SmartLink
                  href={company.href}
                  className="underline underline-offset-2"
                >
                  {company.name}
                </SmartLink>
              </>
            )}
          </h2>
          <p className="type-subtitle">{period}</p>
        </div>
      </div>

      {/* Isolated so cards dealt out from under each other (see
          TimelineReveal) stack only among themselves. */}
      <ul className="isolate grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </ul>
    </li>
  );
}
