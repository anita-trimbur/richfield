"use client";

import { useEffect, useRef, useState } from "react";

import { accentTextColors } from "@/lib/accents";
import { cx } from "@/lib/cx";

import { TILE_VIEW_BOX, tileShapes } from "./tileShapes";

/** Rows of tiles, however wide the grid gets. */
const ROWS = 3;
/** Tile edge in pixels: the size aimed for, and the smallest allowed. */
const PREFERRED_TILE_SIZE = 72;
const MIN_TILE_SIZE = 48;
/** How often tiles turn, and how many turn each time (inclusive range). */
const TURN_INTERVAL_MS = 3000;
const TURNS_PER_TICK = [2, 5] as const;
/** How often tiles trade places, and how many pairs each time. */
const SWAP_INTERVAL_MS = 5000;
const SWAPS_PER_TICK = [1, 3] as const;
/**
 * Tries per pair before giving up on it: the tile picked may have moved
 * already this tick, or all of its neighbors may have.
 */
const SWAP_ATTEMPTS = 12;

type Tile = {
  /** Index into tileShapes. */
  shape: number;
  /** Index into accentTextColors. */
  color: number;
  /** Degrees turned in total. Only ever grows, so tiles always turn clockwise. */
  rotation: number;
  /** The cell it occupies now, counting left to right from the top row. */
  cell: number;
};

type ShapeTilesProps = {
  /** Sizing and placement within the footer; the grid fills whatever it gets. */
  className?: string;
};

/**
 * The footer's decoration: a grid of accent-colored geometric tiles that
 * keeps rearranging itself. Every few seconds some tiles turn a quarter turn
 * clockwise, and a few pairs of neighbors trade places.
 *
 * The tile count depends on how wide the grid ends up, so there's nothing to
 * render until it has been measured: the static HTML holds an empty box of
 * the right height, and the tiles appear once the client builds them. Purely
 * decorative, so it's hidden from assistive tech, and reduced motion gets the
 * grid standing still.
 */
export function ShapeTiles({ className }: ShapeTilesProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  // 0 until measured, which is also what keeps the server from rendering tiles.
  const [columns, setColumns] = useState(0);
  const [tileSize, setTileSize] = useState(PREFERRED_TILE_SIZE);
  const [tiles, setTiles] = useState<Tile[]>([]);

  // Build a fresh set of tiles whenever the column count changes, so a resize
  // that only nudges the tile size leaves the arrangement alone. Adjusting
  // state during render, rather than in an effect, means the wrong number of
  // tiles is never painted.
  const [builtFor, setBuiltFor] = useState(0);
  if (columns !== builtFor) {
    setBuiltFor(columns);
    setTiles(columns ? createTiles(columns * ROWS) : []);
  }

  // Fit a whole number of columns across the grid, re-measuring whenever it
  // resizes (the window, or the footer text rewrapping beside it).
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const width = frame.clientWidth;
      if (!width) return;
      // Aim for PREFERRED_TILE_SIZE, then stretch or shrink the tiles so that
      // many columns fill the width exactly. Tiles stay square and never go
      // below MIN_TILE_SIZE, which only bites in a container too narrow for
      // one tile; the overflow is clipped.
      const fitted = Math.max(1, Math.round(width / PREFERRED_TILE_SIZE));
      setColumns(fitted);
      setTileSize(Math.max(MIN_TILE_SIZE, width / fitted));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // The two loops that keep the grid moving. Each one hands setTiles a new
  // array; the tiles themselves animate, because their position and angle
  // transition (see the tile-shuffle utility in globals.css).
  useEffect(() => {
    if (!columns) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const turning = setInterval(() => setTiles(turnTiles), TURN_INTERVAL_MS);
    const swapping = setInterval(
      () => setTiles((current) => swapTiles(current, columns)),
      SWAP_INTERVAL_MS,
    );

    return () => {
      clearInterval(turning);
      clearInterval(swapping);
    };
  }, [columns]);

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className={cx("relative overflow-hidden", className)}
      // Measured, not a design value: the height follows the tile size, so
      // the grid holds its space from the first paint.
      style={{ height: ROWS * tileSize }}
    >
      {tiles.map((tile, id) => (
        <div
          // A tile's index is its identity: cells move between tiles, but a
          // tile keeps its place in this array for as long as it exists.
          key={id}
          className="absolute top-0 left-0 tile-shuffle"
          style={{
            width: tileSize,
            height: tileSize,
            translate: `${(tile.cell % columns) * tileSize}px ${Math.floor(tile.cell / columns) * tileSize}px`,
            rotate: `${tile.rotation}deg`,
          }}
        >
          <svg
            viewBox={TILE_VIEW_BOX}
            fill="currentColor"
            focusable="false"
            className={cx("size-full", accentTextColors[tile.color])}
          >
            <path d={tileShapes[tile.shape].path} />
          </svg>
        </div>
      ))}
    </div>
  );
}

/** A whole number from `min` to `max`, both included. */
function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Tiles for every cell, each with a random shape, color and quarter turn. */
function createTiles(count: number): Tile[] {
  const colors = dealColors(count);
  return Array.from({ length: count }, (_, cell) => ({
    shape: randomInt(0, tileShapes.length - 1),
    color: colors[cell],
    rotation: randomInt(0, 3) * 90,
    cell,
  }));
}

/**
 * Colors for `count` tiles, dealt so none repeats until every accent has been
 * used, which spreads the palette evenly over the grid. (The timeline deals
 * its card fills the same way, but that version works on DOM classes and has
 * to stay inlinable in a <script>, so the two aren't shared.)
 */
function dealColors(count: number) {
  const colors: number[] = [];
  let deck: number[] = [];

  for (let i = 0; i < count; i++) {
    if (deck.length === 0) {
      // Start a new round: every color once, Fisher–Yates shuffled.
      deck = accentTextColors.map((_, index) => index);
      for (let j = deck.length - 1; j > 0; j--) {
        const k = randomInt(0, j);
        [deck[j], deck[k]] = [deck[k], deck[j]];
      }
    }
    colors.push(deck.pop() as number);
  }

  return colors;
}

/** Turns a few random tiles a quarter turn clockwise. */
function turnTiles(tiles: Tile[]): Tile[] {
  const turning = new Set<number>();
  const wanted = Math.min(randomInt(...TURNS_PER_TICK), tiles.length);
  while (turning.size < wanted) turning.add(randomInt(0, tiles.length - 1));

  return tiles.map((tile, id) =>
    turning.has(id) ? { ...tile, rotation: tile.rotation + 90 } : tile,
  );
}

/**
 * Has a few pairs of neighboring tiles trade cells. Each tile moves at most
 * once per tick, so the pairs never contradict each other.
 */
function swapTiles(tiles: Tile[], columns: number): Tile[] {
  const next = tiles.map((tile) => ({ ...tile }));
  // Which tile is in which cell, kept current as pairs trade.
  const occupant = new Map(next.map((tile, id) => [tile.cell, id]));
  const moved = new Set<number>();

  for (let pair = 0; pair < randomInt(...SWAPS_PER_TICK); pair++) {
    for (let attempt = 0; attempt < SWAP_ATTEMPTS; attempt++) {
      const first = randomInt(0, next.length - 1);
      if (moved.has(first)) continue;

      // Neighbors that are still free to move this tick.
      const options: number[] = [];
      for (const cell of neighborCells(
        next[first].cell,
        columns,
        next.length,
      )) {
        const id = occupant.get(cell);
        if (id !== undefined && !moved.has(id)) options.push(id);
      }
      if (options.length === 0) continue;

      const second = options[randomInt(0, options.length - 1)];
      [next[first].cell, next[second].cell] = [
        next[second].cell,
        next[first].cell,
      ];
      occupant.set(next[first].cell, first);
      occupant.set(next[second].cell, second);
      moved.add(first);
      moved.add(second);
      break;
    }
  }

  return next;
}

/** The cells sharing an edge with `cell`, inside the grid. */
function neighborCells(cell: number, columns: number, total: number) {
  const column = cell % columns;
  const cells: number[] = [];
  if (column > 0) cells.push(cell - 1);
  if (column < columns - 1) cells.push(cell + 1);
  if (cell >= columns) cells.push(cell - columns);
  if (cell + columns < total) cells.push(cell + columns);
  return cells;
}
