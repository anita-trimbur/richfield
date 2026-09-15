import type { ComponentType } from "react";

import { EnvelopeIcon } from "@/components/icons/EnvelopeIcon";
import { HouseIcon } from "@/components/icons/HouseIcon";
import type { IconProps } from "@/components/icons/Icon";
import { WaveIcon } from "@/components/icons/WaveIcon";

export type NavItem = {
  label: string;
  href: string;
  /** Shown beside the label on the current page and while hovered. */
  icon: ComponentType<IconProps>;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: HouseIcon },
  { label: "About", href: "/about", icon: WaveIcon },
  { label: "Contact", href: "/contact", icon: EnvelopeIcon },
];
