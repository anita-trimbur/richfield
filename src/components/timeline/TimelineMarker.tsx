import type { ComponentType } from "react";

import type { IconProps } from "@/components/icons/Icon";

type TimelineMarkerProps = {
  /** Shown in the box. Unset leaves the box empty, as a placeholder. */
  icon?: ComponentType<IconProps>;
};

/**
 * A section's icon box, with the hatch joining it to the timeline line.
 * Decorative: the section heading names the role and company. The box's
 * outline is its own layer, so it can draw on (see TimelineReveal) while the
 * box clips the icon sliding in.
 */
export function TimelineMarker({ icon: MarkerIcon }: TimelineMarkerProps) {
  return (
    <div aria-hidden="true" className="relative shrink-0">
      <span
        data-timeline-hatch
        className="absolute top-1/2 right-full h-timeline-line w-timeline-hatch origin-left -translate-y-1/2 bg-ink timeline-pending:opacity-0 timeline-revealed:animate-timeline-hatch"
      />
      <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-sm bg-surface">
        {/* 4px, the same weight as the line and hatch that draw the box on. */}
        <span className="absolute inset-0 rounded-sm border-4 border-ink timeline-pending:opacity-0 timeline-revealed:animate-timeline-box timeline-revealed:timeline-box-mask" />
        {MarkerIcon && (
          <MarkerIcon className="size-8 timeline-pending:opacity-0 timeline-revealed:animate-timeline-icon" />
        )}
      </span>
    </div>
  );
}
