/**
 * The accent palette, as the Tailwind classes that apply it: fills for the
 * timeline's cards, text colors for the footer's tiles (whose shapes fill
 * with `currentColor`).
 *
 * Both lists are written out in full so Tailwind generates the classes, and
 * both must stay in sync with the `--color-accent-*` tokens in globals.css
 * and with each other: the entry at a given index is the same color in both.
 */
export const accentFills = [
  "bg-accent-sky",
  "bg-accent-sage",
  "bg-accent-mint",
  "bg-accent-lavender",
  "bg-accent-lime",
  "bg-accent-lilac",
  "bg-accent-ochre",
  "bg-accent-butter",
  "bg-accent-rose",
  "bg-accent-peach",
];

export const accentTextColors = [
  "text-accent-sky",
  "text-accent-sage",
  "text-accent-mint",
  "text-accent-lavender",
  "text-accent-lime",
  "text-accent-lilac",
  "text-accent-ochre",
  "text-accent-butter",
  "text-accent-rose",
  "text-accent-peach",
];
