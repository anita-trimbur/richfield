import Image from "next/image";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import type { TimelineCard as TimelineCardData } from "@/content/timeline";
import { cx } from "@/lib/cx";
import { isExternalHref } from "@/lib/links";

import { CardLink } from "./CardLink";

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

  // Where the title's last word starts, so it can be kept with the icon
  // (see the nowrap span below). A one-word title stays whole.
  const lastWordStart = title.lastIndexOf(" ") + 1;

  return (
    <div
      // AccentShuffle finds accent elements by this attribute and swaps
      // their fill class, which React would otherwise flag during hydration.
      data-accent={isAccent || undefined}
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

      {/* pr-card-link-bump keeps the icon's bump distance clear to the right
          of the title, so the title wraps a little earlier and the icon can
          always bump without reaching the card's padding. */}
      <h3
        className={cx(
          "pr-card-link-bump type-card-title",
          isAccent && "row-start-3",
        )}
      >
        {/* The ::after stretches the link over the card, so the whole card is
            clickable while the link's name stays just the title. */}
        <CardLink
          href={href}
          className="group outline-none after:absolute after:inset-0 after:rounded-xl"
        >
          {title.slice(0, lastWordStart)}
          {/* The last word and the icon can't be split, so the icon never
              wraps onto a line on its own. */}
          <span className="whitespace-nowrap">
            {title.slice(lastWordStart)}
            <LinkIcon className="ml-icon-label inline size-6 align-middle motion-safe:group-data-bumping:animate-card-link-bump" />
          </span>
        </CardLink>
      </h3>
    </div>
  );
}
