/**
 * The two edges of a stroke's outline, each running from the start cap to the
 * end cap as flat [x, y, t, x, y, t, ...] triples. t (0–1) is how far along
 * the stroke the pen is when that point gets inked; it never decreases along
 * an edge. Generated from artwork by scripts/generate-brandmark.mjs.
 */
export type StrokeSides = readonly [readonly number[], readonly number[]];

/**
 * Returns SVG path data for the part of a stroke inked once the pen is
 * `progress` (0–1) of the way along it: out along one edge to the pen,
 * straight across the stroke, and back along the other edge.
 *
 * Rebuilding the outline like this, rather than uncovering the finished shape
 * with a mask, keeps a tapered stroke's width exact, and never reveals a later
 * part of the stroke early where it crosses itself.
 */
export function partialStrokeOutline(
  sides: StrokeSides,
  progress: number,
): string {
  const points = [
    ...inkedPoints(sides[0], progress),
    ...inkedPoints(sides[1], progress).reverse(),
  ];
  // Fewer than three points has no area to fill.
  return points.length < 3 ? "" : `M${points.join("L")}Z`;
}

/** The points of one edge inked by `progress`, as "x y" strings. */
function inkedPoints(edge: readonly number[], progress: number): string[] {
  const points: string[] = [];
  for (let i = 0; i < edge.length; i += 3) {
    const t = edge[i + 2];
    if (t <= progress) {
      points.push(formatPoint(edge[i], edge[i + 1]));
      continue;
    }
    // The pen is between this point and the previous one. Add the edge's
    // position exactly at the pen, so the cut across the stroke glides
    // smoothly instead of stepping from point to point.
    if (i > 0) {
      const k = (progress - edge[i - 1]) / (t - edge[i - 1]);
      points.push(
        formatPoint(
          edge[i - 3] + (edge[i] - edge[i - 3]) * k,
          edge[i - 2] + (edge[i + 1] - edge[i - 2]) * k,
        ),
      );
    }
    break;
  }
  return points;
}

function formatPoint(x: number, y: number) {
  return `${Math.round(x * 1000) / 1000} ${Math.round(y * 1000) / 1000}`;
}
