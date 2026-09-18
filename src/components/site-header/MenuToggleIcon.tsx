import { MenuIcon } from "@/components/icons/MenuIcon";
import { XMarkIcon } from "@/components/icons/XMarkIcon";

/**
 * The menu button's glyph: a hamburger that leaves and comes back as an X.
 *
 * Both icons share one 24px slot, stacked so neither takes part in layout.
 * Closed, the hamburger sits in the slot and the X waits out past the screen
 * edge (the header's overflow-x-clip hides it there). Opening slides the
 * hamburger out the same way and brings the X back in behind it; closing is
 * the same swap with the roles traded.
 *
 * The button's aria-expanded drives all of it, so this needs no props and no
 * JavaScript of its own — the button just has to be the `group`. Each icon
 * takes the transition of the state it moves *to*, which is what lets one
 * pair of utilities (menu-icon-out leaves at once, menu-icon-in waits a leg;
 * see globals.css) play both directions. They're transitions rather than
 * animations, so a second press reverses the swap mid-flight and nothing
 * moves on the first paint.
 */
export function MenuToggleIcon() {
  return (
    <span className="relative block size-6">
      <MenuIcon className="absolute top-0 left-0 size-6 menu-icon-in group-aria-expanded:menu-icon-out" />
      <XMarkIcon className="absolute top-0 left-0 size-6 menu-icon-out group-aria-expanded:menu-icon-in" />
    </span>
  );
}
