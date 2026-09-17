/**
 * The four decorative tile shapes, each drawn to fill a 77×77 box (the size
 * the source SVGs were exported at). Paths fill with `currentColor`, so a
 * tile's accent color comes from a text color class.
 *
 * ShapeTiles turns tiles about their center in 90° steps, so the orientation
 * here is only where a shape starts. To add a shape, paste its exported path
 * data below, in the same 77×77 box.
 */
export const TILE_VIEW_BOX = "0 0 77 77";

export const tileShapes = [
  { name: "square", path: "M0 0H77V77H0V0Z" },
  {
    name: "circle",
    path: "M38.5 0A38.5 38.5 0 0 1 38.5 77A38.5 38.5 0 0 1 38.5 0Z",
  },
  { name: "triangle", path: "M0 0V77H77L0 0Z" },
  {
    name: "half-circle",
    path: "M76.9953 38C76.9953 59.2617 59.7594 76.4977 38.4977 76.4977C17.236 76.4977 9.29377e-07 59.2617 0 38L76.9953 38Z",
  },
];
