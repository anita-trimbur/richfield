"use client";

import { useEffect, useRef } from "react";

import { cx } from "@/lib/cx";

/** How far down the viewport the line's tip sits while scrolling (0–1). */
const TIP_VIEWPORT_POSITION = 0.8;
/**
 * How quickly the drawn line catches up to the tip: it closes about 63% of
 * the remaining distance every this many milliseconds…
 */
const CATCH_UP_MS = 80;
/** …but never faster than this, in pixels per second. */
const MAX_DRAW_SPEED = 2200;

type TimelineRevealProps = {
  className?: string;
  /**
   * The timeline, containing:
   * - `[data-timeline-line]`: the vertical line, scaled by --timeline-drawn.
   * - `[data-timeline-end]`: the bottom dot, revealed once the line is done.
   * - `[data-timeline-reveal="section"]`: a section heading row, revealed when
   *   the line reaches its `[data-timeline-hatch]`.
   * - `[data-timeline-reveal="card"]`: a card, revealed when the line reaches
   *   its top, and dealt out from the left of its row.
   */
  children: React.ReactNode;
};

/**
 * Draws the timeline's line down the page as the visitor scrolls, revealing
 * each section and card as the line reaches it. Parts style their hidden and
 * entrance states with the `timeline-pending:` and `timeline-revealed:`
 * variants (see globals.css); this component only decides when.
 *
 * The static HTML holds the finished timeline, kept hidden for a moment by
 * the `timeline-fallback` animation (motion-safe only), so it doesn't flash
 * fully drawn before hydration. If JavaScript never runs, the fallback fades
 * it in instead. Setting `data-timeline-drawing` turns the fallback off.
 */
export function TimelineReveal({ className, children }: TimelineRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Runs once after hydration, and keeps drawing on scroll, resize and focus
  // until the whole line is drawn.
  //
  // Drawing only ever moves forward: scrolling back up leaves the line and
  // revealed parts in place. The drawn length eases toward the target tip
  // each frame instead of jumping to it, so the line visibly draws on page
  // load and after big jumps, and sections reveal in page order as it passes.
  useEffect(() => {
    const root = rootRef.current;
    const line = root?.querySelector<HTMLElement>("[data-timeline-line]");
    const end = root?.querySelector<HTMLElement>("[data-timeline-end]");
    if (!root || !line || !end) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Hydration was slow enough that the fallback has started showing the
    // finished timeline; hiding it again to draw it would look like a glitch.
    const alreadyShown = getComputedStyle(root).opacity !== "0";
    if (reduceMotion || alreadyShown) return;

    const pending = new Set(
      root.querySelectorAll<HTMLElement>("[data-timeline-reveal]"),
    );
    // Pixels of line drawn, and the length it's heading for, both measured
    // from the top of the timeline.
    let drawn = 0;
    let target = 0;
    let frame = 0;
    let lastFrameAt: number | undefined;

    /** Raises the target to wherever the tip should be for this scroll. */
    const updateTarget = () => {
      const box = root.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - viewportHeight;
      const scrolled = maxScroll > 0 ? window.scrollY / maxScroll : 1;

      // The tip sits at a fixed spot in the viewport, except near the end of
      // the page: if the timeline's bottom would stay below that spot even
      // when fully scrolled, the tip slides down to meet it, so the line
      // always finishes.
      let tip = viewportHeight * TIP_VIEWPORT_POSITION;
      const bottomWhenFullyScrolled = box.bottom + window.scrollY - maxScroll;
      if (bottomWhenFullyScrolled > tip) {
        tip += (bottomWhenFullyScrolled - tip) * Math.min(scrolled, 1);
      }

      target = Math.max(target, Math.min(tip - box.top, box.height));
    };

    /** The point, from the timeline's top, where the line reveals a part. */
    const revealPoint = (part: HTMLElement, rootTop: number) => {
      const at =
        part.dataset.timelineReveal === "section"
          ? (part.querySelector("[data-timeline-hatch]") ?? part)
          : part;
      return at.getBoundingClientRect().top - rootTop;
    };

    const drawFrame = (now: number) => {
      const elapsed = now - (lastFrameAt ?? now);
      lastFrameAt = now;
      updateTarget();

      // Ease toward the target, capped at the max speed, and snap the last
      // half pixel so the loop can stop.
      const eased = (target - drawn) * (1 - Math.exp(-elapsed / CATCH_UP_MS));
      drawn += Math.min(eased, (MAX_DRAW_SPEED * elapsed) / 1000);
      if (target - drawn < 0.5) drawn = target;

      const box = root.getBoundingClientRect();
      line.style.setProperty(
        "--timeline-drawn",
        String(Math.min(drawn / box.height, 1)),
      );

      // Reveal every part the line has now passed. Cards passed in the same
      // frame share a row, so they're numbered left to right to stagger
      // their entrances, and each starts from the row's first column.
      let dealOrder = 0;
      for (const part of pending) {
        if (revealPoint(part, box.top) > drawn) continue;
        if (part.dataset.timelineReveal === "card") {
          const list = part.parentElement?.getBoundingClientRect();
          const fromFirstColumn = list
            ? part.getBoundingClientRect().left - list.left
            : 0;
          part.style.setProperty(
            "--timeline-deal-from",
            `${-fromFirstColumn}px`,
          );
          part.style.setProperty("--timeline-deal-order", String(dealOrder++));
        }
        part.dataset.revealed = "animate";
        pending.delete(part);
      }

      if (drawn >= box.height) {
        // Done. From here the line stays fully drawn even if the timeline
        // grows (e.g. the window narrows and cards stack).
        line.style.setProperty("--timeline-drawn", "1");
        end.dataset.revealed = "";
        stopListening();
        frame = 0;
      } else if (drawn < target) {
        frame = requestAnimationFrame(drawFrame);
      } else {
        // Caught up with the tip; wait for the next scroll, resize or focus.
        frame = 0;
      }
    };

    const wake = () => {
      if (frame) return;
      lastFrameAt = undefined;
      frame = requestAnimationFrame(drawFrame);
    };

    // Keyboard focus can land on a card or link the line hasn't reached, or
    // one still waiting out its entrance delay. Show its part at once, with
    // no entrance, so the focused element is never invisible; then draw the
    // line down past it.
    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const part = event.target.closest<HTMLElement>("[data-timeline-reveal]");
      if (part) {
        part.dataset.revealed = "instant";
        pending.delete(part);
      }
      const box = root.getBoundingClientRect();
      target = Math.max(
        target,
        event.target.getBoundingClientRect().bottom - box.top,
      );
      wake();
    };

    // Layout shifts (web fonts loading, resizing) move the parts without a
    // scroll, so re-measure then too.
    const resizeObserver = new ResizeObserver(wake);
    const stopListening = () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      root.removeEventListener("focusin", onFocusIn);
      resizeObserver.disconnect();
    };

    // Start with the line already drawn past anything above the viewport
    // (e.g. a reload that restores the scroll position), so the visitor
    // doesn't wait for it to draw through parts they can't see.
    drawn = Math.max(0, -root.getBoundingClientRect().top);
    target = drawn;
    line.style.setProperty("--timeline-drawn", "0");
    root.dataset.timelineDrawing = "";

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    root.addEventListener("focusin", onFocusIn);
    resizeObserver.observe(root);
    wake();

    // Stopped early (unmounted, or re-run by Strict Mode in development):
    // undo everything, so the timeline shows in full and a re-run starts clean.
    return () => {
      cancelAnimationFrame(frame);
      stopListening();
      delete root.dataset.timelineDrawing;
      line.style.removeProperty("--timeline-drawn");
      delete end.dataset.revealed;
      for (const part of root.querySelectorAll<HTMLElement>(
        "[data-timeline-reveal]",
      )) {
        delete part.dataset.revealed;
        part.style.removeProperty("--timeline-deal-from");
        part.style.removeProperty("--timeline-deal-order");
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cx(
        "motion-safe:not-data-timeline-drawing:animate-timeline-fallback",
        className,
      )}
    >
      {children}
    </div>
  );
}
