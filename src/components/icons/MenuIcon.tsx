import { Icon, type IconProps } from "@/components/icons/Icon";

/** Hamburger icon. */
export function MenuIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Icon>
  );
}
