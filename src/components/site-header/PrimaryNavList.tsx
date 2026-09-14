import { primaryNav } from "@/content/navigation";

import { NavLink } from "./NavLink";

type PrimaryNavListProps = {
  /** Sets the layout (row or column) for where the list is used. */
  className?: string;
};

export function PrimaryNavList({ className }: PrimaryNavListProps) {
  return (
    <ul className={className}>
      {primaryNav.map((item) => (
        <li key={item.href}>
          <NavLink {...item} />
        </li>
      ))}
    </ul>
  );
}
