/**
 * Gives every accent element (`[data-accent]`) inside `group` a random class
 * from `classes`, replacing whichever one it had. Classes don't repeat until
 * all of them are used, and then a newly shuffled round begins. Runs once per
 * group: it marks the group so later calls leave its colors alone.
 *
 * This is serialized into an inline <script> with toString() (see
 * AccentShuffle), so it must stay self-contained: no imports, no outside
 * variables, and only syntax browsers run without transpiling.
 */
export function shuffleAccentClasses(group: HTMLElement, classes: string[]) {
  if (group.hasAttribute("data-accents-shuffled")) return;
  group.setAttribute("data-accents-shuffled", "");

  const elements = group.querySelectorAll("[data-accent]");
  let deck: string[] = [];

  for (let i = 0; i < elements.length; i++) {
    // Start a new round: copy the classes and Fisher–Yates shuffle them.
    if (deck.length === 0) {
      deck = classes.slice();
      for (let j = deck.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        const swap = deck[j];
        deck[j] = deck[k];
        deck[k] = swap;
      }
    }

    for (let j = 0; j < classes.length; j++) {
      elements[i].classList.remove(classes[j]);
    }
    elements[i].classList.add(deck.pop() as string);
  }
}
