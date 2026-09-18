import { ExternalLinkList } from "@/components/links/ExternalLinkList";

/**
 * The header's external icon links. Each link carries its own accessible
 * name (see IconLink), so the row needs no visible label.
 */
export function ExternalLinks() {
  return (
    // Muted to match the rest of the header until hovered or focused.
    <ExternalLinkList linkClassName="text-limestone-700 hover:text-ink focus-visible:text-ink" />
  );
}
