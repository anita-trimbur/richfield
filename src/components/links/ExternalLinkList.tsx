import { IconLink } from "@/components/links/IconLink";
import { externalLinks } from "@/content/navigation";

type ExternalLinkListProps = {
  /**
   * Sets each link's color, including its hover and focus colors, e.g.
   * "text-limestone-700 hover:text-ink".
   */
  linkClassName?: string;
};

/** The site's external icon links, in a row. */
export function ExternalLinkList({ linkClassName }: ExternalLinkListProps) {
  return (
    <ul className="flex items-center gap-4">
      {externalLinks.map((link) => (
        <li key={link.href}>
          <IconLink {...link} className={linkClassName} />
        </li>
      ))}
    </ul>
  );
}
