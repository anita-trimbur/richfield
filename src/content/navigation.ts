import type { ComponentType } from "react";

import { EnvelopeIcon } from "@/components/icons/EnvelopeIcon";
import { FileIcon } from "@/components/icons/FileIcon";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { HouseIcon } from "@/components/icons/HouseIcon";
import type { IconProps } from "@/components/icons/Icon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { WaveIcon } from "@/components/icons/WaveIcon";
import type { IconLinkProps } from "@/components/links/IconLink";

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

/**
 * Set to true once the résumé PDF is at public/resume.pdf. Until then its
 * link stays hidden rather than pointing at a missing file.
 */
const RESUME_AVAILABLE = false;

const resumeLink: IconLinkProps = {
  label: "Download résumé (PDF)",
  href: "/resume.pdf",
  icon: FileIcon,
  download: true,
};

/** Icon links after the "Links" label, left to right. */
export const externalLinks: IconLinkProps[] = [
  {
    label: "GitHub",
    href: "https://github.com/anita-trimbur/",
    icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anitatrimbur/",
    icon: LinkedInIcon,
  },
  ...(RESUME_AVAILABLE ? [resumeLink] : []),
];
