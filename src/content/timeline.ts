import type { ComponentType } from "react";

import type { IconProps } from "@/components/icons/Icon";

export type TimelineCard = {
  title: string;
  /**
   * A page on this site (e.g. "/work/zero-to-mvp"), or a full URL, which opens
   * another site in a new tab and shows an external-link icon.
   */
  href: string;
  /**
   * "accent": tall, with a random accent fill (no two alike on the page).
   * "plain": shorter, always limestone-100.
   */
  variant: "accent" | "plain";
};

export type TimelineSection = {
  /** Shown uppercase above the heading, e.g. "Apr ’24 – Present". */
  period: string;
  /** The role, plus any word joining it to the company ("for", "@"). */
  heading: string;
  /** Linked right after the heading. */
  company?: { name: string; href: string };
  /** Shown in the section's marker box. Unset leaves the box empty. */
  icon?: ComponentType<IconProps>;
  cards: TimelineCard[];
};

// Case study links point at /work/* pages that don't exist yet.

/** Career stages for the home page, newest first. */
export const timeline: TimelineSection[] = [
  {
    period: "Apr ’24 – Present",
    heading: "Founding product designer for",
    // Placeholder URL: replace with MultiTool's site.
    company: { name: "MultiTool", href: "https://example.com/" },
    cards: [
      {
        title: "From zero to MVP in three months",
        href: "/work/zero-to-mvp",
        variant: "accent",
      },
      {
        title:
          "Doing a lot with a little: actionable research insights in 12 discovery interviews",
        href: "/work/discovery-interviews",
        variant: "accent",
      },
      {
        title:
          "10 hats I wore as a founding team member at an early-stage startup",
        href: "/work/founding-team-hats",
        variant: "accent",
      },
    ],
  },
  {
    period: "Dec ’21 – Mar ’24",
    heading: "UX designer (I, II, & Sr. I) @",
    company: { name: "Pulumi", href: "https://www.pulumi.com/" },
    cards: [
      {
        title:
          "How I redesigned a SaaS dashboard to support two key user groups",
        href: "/work/saas-dashboard-redesign",
        variant: "accent",
      },
      {
        title:
          "Product docs: improving discoverability with an information architecture overhaul",
        href: "/work/docs-information-architecture",
        variant: "accent",
      },
      {
        title:
          "All it took was a 4-day hackathon to increase daily active users by 20%",
        href: "/work/hackathon-daily-active-users",
        variant: "accent",
      },
    ],
  },
  {
    period: "Sep ’20 – Dec ’21",
    heading: "Transition to design",
    cards: [
      {
        title:
          "Then and now: same project, six years’ difference in experience",
        href: "/work/then-and-now",
        variant: "plain",
      },
    ],
  },
  {
    period: "Another era",
    heading: "Pre-design",
    cards: [
      // Placeholder URLs: replace with the real sites.
      {
        title: "Photography website",
        href: "https://example.com/photography",
        variant: "plain",
      },
      {
        title: "Author website",
        href: "https://example.com/author",
        variant: "plain",
      },
    ],
  },
];
