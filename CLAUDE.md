# CLAUDE.md

Portfolio website built with Next.js (App Router, TypeScript) and Tailwind CSS v4, deployed as a fully static export (`output: "export"` → `out/`). This site will be edited constantly, so optimize every change for the next person who has to change it.

## Stack constraints

- Static export only: no API routes, middleware, server actions, or request-time rendering. Pages with dynamic routes need `generateStaticParams`.
- Images use `images.unoptimized` (no image server); size and compress assets before adding them.
- Source lives in `src/`; import with the `@/*` alias.

## Commands

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # static export to ./out
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint (Next.js core-web-vitals + TypeScript + full jsx-a11y recommended)
npm run lint:fix   # ESLint with autofix
npm run format     # Prettier write (also sorts Tailwind classes)
npm run check      # format:check + lint + typecheck — run before every commit
npm run brandmark  # regenerate src/content/brandmark.ts after editing brandmark.svg
```

- ESLint config: `eslint.config.mjs` (flat config). `eslint-config-prettier` goes last so ESLint never fights Prettier.
- Prettier config: `.prettierrc.json`, with `prettier-plugin-tailwindcss` pointed at `src/app/globals.css` so custom theme tokens sort correctly.
- Version pins: ESLint stays on v9 and TypeScript below 6.1 until `eslint-config-next`'s plugins (`eslint-plugin-react`, `jsx-a11y`, `import`, `typescript-eslint`) support newer majors. Check their peer ranges before upgrading.

## Guidelines

### Componentize for reuse

- Whenever a design element could appear more than once (buttons, cards, section headings, links, layout wrappers), make it a component in `src/components/` rather than repeating markup.
- Keep components small, single-purpose, and driven by typed props. Prefer composition (`children`, slots) over one component with many flags.
- Pages in `src/app/` should mostly assemble components, not define styling.
- Wrap page content in `PageContainer` (`src/components/layout/`), the same wrapper the header uses, so content width and side padding always match the header's.

### Design tokens live in Tailwind

- All fonts, colors, spacing, radii, shadows, and other atomic values are defined as Tailwind theme tokens in `@theme` inside `src/app/globals.css`, and used through Tailwind utility classes.
- No hard-coded hex values, pixel sizes, or font stacks in components, and no inline `style` for design values. If a value is missing, add a token rather than using an arbitrary value (`text-[#123456]`).
- Load fonts with `next/font` and expose them as Tailwind font tokens.
- Don't set a pixel `font-size` on `html`. `text-base` (1rem, which is 16px by default) keeps the site respecting users' browser font-size settings.

#### Current tokens

| Token                            | Value                                                       | Use                                                         |
| -------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `font-sans`                      | DM Sans                                                     | Site-wide default                                           |
| `font-mono`                      | DM Mono (300/400/500)                                       | Targeted uses only                                          |
| `text-base`                      | 16px                                                        | Default body size                                           |
| `limestone-50` … `limestone-900` | `#FEFFF5` … `#333330`                                       | Neutral range, lightest to darkest                          |
| `surface`                        | `limestone-50`                                              | Default background                                          |
| `ink`                            | `#2D345B`                                                   | Default text color (11.9:1 on `surface`)                    |
| `accent-sky` … `accent-peach`    | 10 standalone colors (see `globals.css`)                    | Random timeline card fills; ink is ≥ 6.7:1 on each          |
| `size-icon`                      | 18px                                                        | Default icon size                                           |
| `gap-icon-label`                 | 6px                                                         | Space between an icon and its label                         |
| `pr-icon-with-label`             | `icon` + `icon-label` (24px)                                | Balances an icon's space on the other side of a label       |
| `max-w-nav`                      | 1512px                                                      | Page max width (header and content, via `PageContainer`)    |
| `timeline-line` / `-dot`         | 4px / 12px                                                  | Timeline line and hatch thickness / endpoint diameter       |
| `timeline-hatch`                 | 32px                                                        | Hatch length, from the line's edge to a section marker      |
| `pl-timeline-indent`             | half dot + half line + hatch (40px)                         | Timeline content indent                                     |
| `type-heading`                   | 20px, semibold, 24px line height                            | Timeline section headings                                   |
| `type-card-title`                | 24px, 150% line height                                      | Card titles                                                 |
| `type-title`                     | 36px, bold, 100% line height, `tracking-tight` (−0.025em)   | Site title / brand name                                     |
| `type-subtitle`                  | DM Mono, 16px, 150% line height, uppercase, `limestone-700` | Subtitles and labels                                        |
| `animate-brandmark-fallback`     | `brandmark-fallback` 300ms, 1.5s delay                      | Hides the brand mark until it draws; fades it in without JS |
| `animate-timeline-*`             | 160–450ms entrances (see `globals.css`)                     | Timeline reveal: hatch, box, label, icon, card deal, end    |
| `animate-timeline-fallback`      | fade 300ms, 1.5s delay                                      | Hides the timeline until it draws; fades it in without JS   |
| `timeline-deal`                  | 48px                                                        | How far left of its column a dealt card starts              |

Reusable text styles are `@utility` classes in `globals.css`. Add new ones there instead of repeating utility combinations. Join conditional classes with `cx` from `@/lib/cx`.

Contrast on `surface`: `limestone-700`–`900` pass AA for body text. `limestone-600` (4.47:1) and `500` (3.27:1) are only for large text or non-text UI. `limestone-400` and lighter are decorative only (borders, fills).

### Icons

Icons live in `src/components/icons/`, one component per glyph, each wrapping the shared `Icon`. They render at `size-icon` (18px) in `ink` by default; pass `className` to override (`size-6`, `text-limestone-700`). To add one, copy an existing icon, paste the source SVG's `viewBox` and path data, and drop hard-coded `fill`/`stroke` colors so the glyph uses `currentColor`. Keep license notes for third-party icons (e.g. Font Awesome, CC BY 4.0). Icons are hidden from screen readers unless given a `label`; set one only when the icon stands alone without visible text or a labeled parent.

### Brand mark

`BrandMark` draws itself on at page load, built from `src/content/brandmark.svg`. To change the mark, export one frame from the design file (hidden layers are left out) holding two paths in the same coordinate space:

- the tapered stroke, which exports as one closed, filled path, and
- a plain stroked centerline tracing the pen from start to finish.

Then run `npm run brandmark` to regenerate `src/content/brandmark.ts`. The script stops with an error if the SVG doesn't match that shape.

### Home timeline

Edit sections and cards in `src/content/timeline.ts`. Cards are `"accent"` (tall, random accent fill) or `"plain"` (short, `limestone-100`). A full-URL `href` opens in a new tab with an external-link icon; a path gets an arrow. `AccentShuffle` gives each accent card a random fill with no repeats until all 10 are used: an inline script does it on a full page load, before paint, and a layout effect does it on client-side navigation. To add or remove an accent color, change the token in `globals.css` and the list in `src/components/timeline/accentFills.ts`.

`TimelineReveal` draws the line down as the visitor scrolls (its tip sits 80% down the viewport) and reveals each part as the line reaches it: a section's hatch, box outline, then label and icon; then its cards, dealt out left to right. It only decides when, by marking `[data-timeline-reveal]` elements `data-revealed`. Each part styles itself with the `timeline-pending:` (hide) and `timeline-revealed:` (play entrance) variants, and timings live in the `animate-timeline-*` tokens. To animate a new part, give it both variants and put it inside an existing reveal scope. Reduced motion, print, and no-JS get the static timeline. Keyboard focus shows its part at once, so a focused element is never hidden.

### Maintainability

- Clear names, small files, and one obvious place for each thing. Put portfolio content (projects, bio, links) in typed data files (e.g. `src/content/`) separate from the components that render it, so content edits don't touch markup.
- Avoid premature abstraction and dependencies you don't need; delete dead code rather than commenting it out.
- Default to Server Components; add `"use client"` only to the components that need interactivity, and keep those as small as possible.

### Comment interactive and dynamic code

- Any code with state, effects, event handling, animation, or data-derived rendering must be commented to explain the logic: what triggers it, what state changes, and why it's done this way.
- Static presentational markup does not need comments.

### Accessibility (WCAG AA)

All code must meet WCAG AA. In particular:

- Semantic HTML first (`header`, `nav`, `main`, `footer`, `button` vs. `a`), one `h1` per page, and heading levels in order.
- Color contrast of at least 4.5:1 for body text and 3:1 for large text and UI components; check new color tokens against their backgrounds.
- Everything interactive works by keyboard, with a visible focus style (never remove outlines without a replacement).
- Meaningful `alt` text on images (`alt=""` for decorative ones); accessible names on icon-only buttons and links.
- Respect `prefers-reduced-motion` for animation, and don't convey information by color alone.
- Set `lang` on `<html>` and a unique `title` on each page.

### Before committing

Every commit must be formatted, linted, and typechecked, and the build must pass: run `npm run format`, then `npm run check && npm run build`. Fix all errors instead of suppressing them (no `eslint-disable` or `@ts-ignore` without a comment explaining why).

Lint catches only some accessibility problems. Also check contrast, keyboard navigation, and focus order by hand for UI changes.
