type MenuIconProps = {
  className?: string;
};

/** Hamburger icon. Decorative; the button using it must have a label. */
export function MenuIcon({ className }: MenuIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
