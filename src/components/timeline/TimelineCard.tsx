import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { SmartLink } from "@/components/links/SmartLink";
import type { TimelineCard as TimelineCardData } from "@/content/timeline";
import { cx } from "@/lib/cx";
import { isExternalHref } from "@/lib/links";

type TimelineCardProps = TimelineCardData & {
  /** Accent cards only: the fill in the HTML until AccentShuffle picks one. */
  fallbackFill?: string;
};

/** A linked article or case study. The whole card is clickable. */
export function TimelineCard({
  title,
  href,
  variant,
  fallbackFill,
}: TimelineCardProps) {
  const isAccent = variant === "accent";
  const LinkIcon = isExternalHref(href) ? ExternalLinkIcon : ArrowRightIcon;

  // The title's last word and the icon can't be split across lines, so the
  // icon never wraps onto a line by itself.
  const lastWordStart = title.lastIndexOf(" ") + 1;

  return (
    <div
      // AccentShuffle finds accent cards by this attribute and swaps their
      // fill class, which React would otherwise flag during hydration.
      data-accent-card={isAccent || undefined}
      suppressHydrationWarning={isAccent}
      className={cx(
        // The link's own focus outline is removed below; the card shows it.
        "relative flex h-full items-center rounded-xl p-9 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink",
        isAccent ? cx("min-h-100", fallbackFill) : "min-h-50 bg-limestone-100",
      )}
    >
      <h3 className="type-card-title">
        {/* The ::after stretches the link over the card, so the whole card is
            clickable while the link's name stays just the title. */}
        <SmartLink
          href={href}
          className="outline-none after:absolute after:inset-0 after:rounded-xl"
        >
          {title.slice(0, lastWordStart)}
          <span className="whitespace-nowrap">
            {title.slice(lastWordStart)}
            <LinkIcon className="ml-icon-label inline size-6 align-middle" />
          </span>
        </SmartLink>
      </h3>
    </div>
  );
}
