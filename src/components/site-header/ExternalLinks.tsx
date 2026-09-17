import { ExternalLinkList } from "@/components/links/ExternalLinkList";

export function ExternalLinks() {
  return (
    <div className="flex items-center gap-4">
      <p className="type-subtitle text-limestone-700">Links</p>
      {/* Matches the label color until hovered or focused. */}
      <ExternalLinkList linkClassName="text-limestone-700 hover:text-ink focus-visible:text-ink" />
    </div>
  );
}
