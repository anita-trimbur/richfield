import { Icon, type IconProps } from "@/components/icons/Icon";

// Lucide "arrow-right", ISC License: https://lucide.dev/license
export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </g>
    </Icon>
  );
}
