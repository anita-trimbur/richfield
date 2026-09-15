/**
 * Background classes for every accent color token in globals.css, written out
 * in full so Tailwind generates them. Keep in sync with those tokens.
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

/**
 * Gives every accent card (`[data-accent-card]`) inside `group` a random fill
 * from `fills`, replacing whichever fill it had. Fills don't repeat until all
 * of them are used, and then a newly shuffled round begins. Runs once per
 * group: it marks the group so later calls leave its colors alone.
 *
 * This is serialized into an inline <script> with toString() (see
 * AccentShuffle), so it must stay self-contained: no imports, no outside
 * variables, and only syntax browsers run without transpiling.
 */
export function shuffleAccentFills(group: HTMLElement, fills: string[]) {
  if (group.hasAttribute("data-accents-shuffled")) return;
  group.setAttribute("data-accents-shuffled", "");

  const cards = group.querySelectorAll("[data-accent-card]");
  let deck: string[] = [];

  for (let i = 0; i < cards.length; i++) {
    // Start a new round: copy the fills and Fisher–Yates shuffle them.
    if (deck.length === 0) {
      deck = fills.slice();
      for (let j = deck.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        const swap = deck[j];
        deck[j] = deck[k];
        deck[k] = swap;
      }
    }

    for (let j = 0; j < fills.length; j++) {
      cards[i].classList.remove(fills[j]);
    }
    cards[i].classList.add(deck.pop() as string);
  }
}
