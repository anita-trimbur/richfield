import type { ComponentType } from "react";

import type { IconProps } from "@/components/icons/Icon";

type TimelineMarkerProps = {
  /** Shown in the box. Unset leaves the box empty, as a placeholder. */
  icon?: ComponentType<IconProps>;
};

/**
 * A section's icon box, with the hatch joining it to the timeline line.
 * Decorative: the section heading names the role and company.
 */
export function TimelineMarker({ icon: MarkerIcon }: TimelineMarkerProps) {
  return (
    <div aria-hidden="true" className="relative shrink-0">
      <span className="absolute top-1/2 right-full h-timeline-line w-timeline-hatch -translate-y-1/2 bg-ink" />
      <span className="flex size-12 items-center justify-center rounded-xs border-3 border-ink bg-surface">
        {MarkerIcon && <MarkerIcon className="size-7" />}
      </span>
    </div>
  );
}
