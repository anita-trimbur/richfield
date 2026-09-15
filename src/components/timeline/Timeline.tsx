import type { TimelineSection as TimelineSectionData } from "@/content/timeline";

import { AccentShuffle } from "./AccentShuffle";
import { accentFills } from "./accentFills";
import { TimelineCard } from "./TimelineCard";
import { TimelineSection } from "./TimelineSection";

type TimelineProps = {
  sections: TimelineSectionData[];
};

/** Career sections and their cards along a vertical line. */
export function Timeline({ sections }: TimelineProps) {
  // Accent cards in page order. Each one's fallback fill is the palette color
  // at its position, so the HTML shows distinct colors even before (or
  // without) the random shuffle.
  const accentCards = sections
    .flatMap((section) => section.cards)
    .filter((card) => card.variant === "accent");

  return (
    <div className="relative pt-9 pb-3 pl-timeline-indent">
      {/* The line, with a dot at each end. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 flex w-timeline-dot justify-center"
      >
        <span className="w-timeline-line bg-ink" />
        <span className="absolute top-0 size-timeline-dot rounded-full bg-ink" />
        <span className="absolute bottom-0 size-timeline-dot rounded-full bg-ink" />
      </div>

      <AccentShuffle>
        <ol className="flex flex-col gap-20">
          {sections.map(({ cards, ...section }) => (
            <TimelineSection
              key={`${section.period}|${section.heading}`}
              {...section}
            >
              {cards.map((card) => (
                <li key={card.href}>
                  <TimelineCard
                    {...card}
                    fallbackFill={
                      accentFills[
                        accentCards.indexOf(card) % accentFills.length
                      ]
                    }
                  />
                </li>
              ))}
            </TimelineSection>
          ))}
        </ol>
      </AccentShuffle>
    </div>
  );
}
