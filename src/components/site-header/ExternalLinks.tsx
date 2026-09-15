import { IconLink } from "@/components/links/IconLink";
import { externalLinks } from "@/content/navigation";

export function ExternalLinks() {
  return (
    <div className="flex items-center gap-4">
      <p className="type-subtitle">Links</p>
      <ul className="flex items-center gap-4">
        {externalLinks.map((link) => (
          <li key={link.href}>
            {/* Matches the type-subtitle label color until hovered or focused. */}
            <IconLink
              {...link}
              className="text-limestone-700 hover:text-ink focus-visible:text-ink"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
