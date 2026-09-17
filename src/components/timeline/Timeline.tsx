import type { TimelineSection as TimelineSectionData } from "@/content/timeline";

import { AccentShuffle } from "./AccentShuffle";
import { accentFills } from "./accentFills";
import { TimelineCard } from "./TimelineCard";
import { TimelineReveal } from "./TimelineReveal";
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
    <TimelineReveal className="relative pt-9 pb-3 pl-timeline-indent">
      {/* The line, with a dot at each end. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 flex w-timeline-dot justify-center"
      >
        <span
          data-timeline-line
          className="w-timeline-line origin-top bg-ink timeline-drawing:scale-y-(--timeline-drawn)"
        />
        <span className="absolute top-0 size-timeline-dot rounded-full bg-ink" />
        <span
          data-timeline-end
          className="absolute bottom-0 size-timeline-dot rounded-full bg-ink timeline-pending:opacity-0 timeline-revealed:animate-timeline-end"
        />
      </div>

      <AccentShuffle>
        <ol className="flex flex-col gap-20">
          {sections.map(({ cards, ...section }) => (
            <TimelineSection
              key={`${section.period}|${section.heading}`}
              {...section}
            >
              {cards.map((card) => (
                <li
                  key={card.href}
                  data-timeline-reveal="card"
                  className="timeline-pending:opacity-0 timeline-revealed:animate-timeline-deal"
                >
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
    </TimelineReveal>
  );
}
