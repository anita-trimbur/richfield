import Image from "next/image";

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
  image,
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
        "relative h-full rounded-xl p-9 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink",
        isAccent
          ? // card-image-rows lays an accent card out in four rows — spacer,
            // image, title, spacer — and -open hands the image row the card's
            // free space, sliding the image out of the top and the title down
            // to the bottom together (see globals.css). Focus opens it too, so
            // keyboard visitors get the same reveal as a pointer.
            cx(
              "grid min-h-100 card-image-rows hover:card-image-rows-open has-focus-visible:card-image-rows-open",
              fallbackFill,
            )
          : // Plain cards have no image to reveal, so they just center their
            // title and deepen their fill on hover, over the same 300ms as an
            // accent card's reveal.
            "flex min-h-50 items-center bg-limestone-100 transition-colors duration-300 ease-out hover:bg-limestone-200",
      )}
    >
      {/*
       * The image row. min-h-0 lets the row collapse to nothing at rest
       * (grid items in an `fr` row are otherwise at least as tall as their
       * contents), and the padding holds the gap above the title. Neither
       * adds to the card's own height, so opening one card never resizes the
       * row of cards it's in.
       */}
      {isAccent && (
        <div className="row-start-2 min-h-0 pb-card-image-gap">
          <div className="relative h-full overflow-hidden rounded-card-image bg-limestone-300">
            {/* Until a card has its own image, the fill above is the image. */}
            {image && (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      )}

      <h3 className={cx("type-card-title", isAccent && "row-start-3")}>
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
