import { cx } from "@/lib/cx";

/** Props shared by every icon component. */
export type IconProps = {
  /** Overrides the 18px `ink` default, e.g. "size-6 text-limestone-700". */
  className?: string;
  /**
   * Accessible name, for an icon that carries meaning on its own. Leave unset
   * when the icon sits beside visible text or inside a labeled control.
   */
  label?: string;
};

type IconBaseProps = IconProps & {
  /** The glyph's own coordinate space, copied from its source SVG. */
  viewBox: string;
  children: React.ReactNode;
};

/**
 * Shared <svg> wrapper for icons. Default size and color come from the `.icon`
 * class in globals.css; glyph paths should fill with currentColor.
 */
export function Icon({ viewBox, className, label, children }: IconBaseProps) {
  // With a label, expose the icon as an image with that name. Without one,
  // hide it from assistive tech so it doesn't add noise next to its text.
  const a11yProps = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": true };

  return (
    <svg
      viewBox={viewBox}
      fill="currentColor"
      focusable="false"
      className={cx("icon", className)}
      {...a11yProps}
    >
      {children}
    </svg>
  );
}
