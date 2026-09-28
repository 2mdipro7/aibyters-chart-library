# Library audit — September 2026

Scope: every package under `packages/`, the playground, the build and publishing setup, and a
reproduction of the "legend and data labels overlap when the library is adopted in another app"
report. The reproduction used a Vite host **without Tailwind**, a 3-column dashboard grid
(~370 px per widget), six-series line/column data with currency formatting, and an 8-slice
pie/donut. Screenshot of the original behaviour: [`audit/host-before.png`](./audit/host-before.png).

## 1. Root causes of the overlap / clipping reports

| # | Symptom in the host app | Root cause | Fix |
|---|---|---|---|
| 1 | Legend text runs into the next widget; long legends eat the plot | Recharts `<Legend>` lives *inside* the fixed-height SVG. A legend that wraps to 3 rows either shrinks the plot or, with `wrapperStyle.paddingTop`, overflows the 300 px container. | Legend is now ordinary HTML flex content rendered **outside** the plot by `ChartFrame` (`@aibyters/core`). It reserves exactly the space it needs, wraps by measured width, and collapses behind "+N more" past `maxRows`. |
| 2 | Y-axis tick labels clipped ("$2.3M" → "2.3M") | `margin.left: -20` was hard-coded to hide Recharts' default 60 px axis gutter. Any formatter wider than 3 digits was cut. | `computeAxisWidth()` measures the widest formatted tick (canvas measurement in browsers, deterministic heuristic in SSR) and sets the axis width per chart. |
| 3 | X-axis labels overlap each other on narrow widgets | `dy={10}` shifted ticks without changing axis height; no thinning or rotation. | `planCategoryTicks()` decides horizontal / rotated 45° / thinned (`interval`) from the real slot width, and grows the axis height accordingly. |
| 4 | Pie/donut labels overlap on small slices; donut centre KPI sits below centre | Labels drawn at fixed 50 % radius regardless of slice size; centre overlay used 50 %/50 % of the *container* while the pie was pushed up by the in-SVG legend. | Labels are placed outside with leader lines and per-side collision resolution (`layoutPieLabels`), or inside only when `labelFits()`. The centre overlay is anchored to the computed pie centre. |
| 5 | Radial bar legend shows blank items; values rotated inside rings | Legend read `name` from data but charts pass `nameKey`; labels rendered along the arc. | Rings are plain SVG; names and values live in the legend. |
| 6 | Cards render with no border, background or padding; title and description collapse | `WidgetCard`, `DataTable`, `DeltaCard`, `TargetCard`, `Grid`, `FilterBar` used Tailwind utility classes (`flex flex-col rounded-xl bg-[var(--…)]`). Those classes only exist if the *host's* Tailwind scans this library's source, which no consumer does. | All components use inline styles + CSS variables with fallbacks. Zero Tailwind in `packages/**`. |
| 7 | Delta colours never show; several colours fall back to black | Components referenced CSS variables that were never defined (`--vi-color-semantic-danger`, `--vi-color-text-tertiary`, `--vi-color-primary`, `--vi-color-brand-primary`). | Tokens now define `semantic.*`, `text.tertiary`, `primary`, `surface.grid`, `chart.0-7`; every `var()` in the library carries a literal fallback. |
| 8 | Charts ignore the host theme; brand colours require editing 30 files | Each chart file had its own hard-coded hex palette. | Single source: `themePalette()` → `var(--vi-color-chart-N, #fallback)`. Override 8 variables to re-skin every chart. |
| 9 | Charts re-animate on every resize / rotation | Recharts animation was always on. | `ChartFrame` animates on first paint only and honours `prefers-reduced-motion`. |
| 10 | `8,999` shown as `9K` | `formatCompactNumber` used for counts. | `formatValue(v, "count")` keeps every digit; compaction only above `compactFrom`. |
| 11 | Fonts fetched from Google at runtime | `ThemeProvider` injected a `<link>` to fonts.googleapis.com — blocked by enterprise CSPs, a GDPR question in the EU, broken offline. | Off by default (`loadFonts` prop); the library uses the host's font stack through `--vi-font-body`. |

## 2. Findings beyond the reported bug

### Portability / adoption
- **Packages could not be typechecked or built from a fresh clone.** Every package pointed `main`/`types` at a `dist` that no build script produced in order; `tsc` failed with "Cannot find module '@aibyters/layout'". Fixed with `tsconfig.base.json` `paths`, a root `build`/`typecheck` that runs topologically, and vite configs for the packages that had none (`core`, `tokens`, `charts-geo`, `charts-network`).
- **`exports` maps listed `import` before `types`**, so TypeScript consumers using `moduleResolution: bundler/node16` lost typings. Fixed (types first) and CJS added for Jest/Next.js server contexts.
- **`private: true` on every package** made them unpublishable; licensing requires publishing to a private registry. Now `publishConfig.access: restricted`, `license: SEE LICENSE IN LICENSE`, `sideEffects: false`, `files: [dist, LICENSE]`.
- **Dead duplicate package** `packages/kpi` (older copy of `charts-kpi`) removed.
- **Un-typed dependencies** (`d3-array`, `d3-scale` without `@types/*`) broke strict builds; replaced with dependency-free scale/aggregation helpers in `core` (fewer third-party licences to audit, smaller bundle).
- **React 19** peer range added (`^18.2 || ^19`).

### Device coverage (new)
- Breakpoints are computed from the **chart container width**, not the viewport (`xs <400`, `sm <640`, `md <960`, `lg`). A widget in a desktop 4-column grid gets the same compact treatment as a phone.
- Compact mode: smaller tick fonts, fewer ticks, side legends move to the bottom, pie labels move inside/omit, list charts stack labels over bars.
- Touch: `(pointer: coarse)` detection enlarges hit targets to ≥ 44 px (legend items, rows, export button) and increases active-dot radius; `touch-action: pan-y` keeps page scroll working over charts.
- Motion: `prefers-reduced-motion` disables animation; first-paint-only animation avoids replay on rotate/resize.
- Print/PDF: `@media print` flattens cards, hides export UI, prevents page breaks inside a widget. `forced-colors` keeps borders.
- KPI values scale with container query units (`cqw`) and wrap instead of overflowing.
- `Grid` uses `auto-fit/minmax` so one markup works from 320 px to wall displays.

### Accessibility
- Every SVG has `role="img"` + `aria-label`; legend is a `role="list"` of toggle buttons with `aria-pressed`; tables expose `aria-sort`; progress bars expose `aria-valuenow`; keyboard focus rings are scoped to `.vi-theme-root`.
- Colour is never the only channel for hidden series (strike-through + dimming).

### Also fixed while auditing
- Flow diagram crashed at runtime ("e.transition is not a function"): the lockfile paired `d3-zoom@3` (used by `@xyflow/react`) with `d3-selection@2` (pulled by `react-simple-maps`). pnpm overrides now pin the d3 family to v3.
- `react-leaflet@5` requires React 19; pinned to 4.x so `TileMap` works on React 18.
- Vitest 4 could not start against Vite 5; pinned Vitest 3 so `pnpm test` runs in CI.

### Still open (not fixed in this pass, recommended next)
- `charts-infographics` and `charts-flow` still use Tailwind classes, `lucide-react` and hard-coded hex; they are marketing pieces rather than reusable charts. Either port them to the same pattern or ship them as a separate "showcase" package excluded from the licensed core.
- `charts-geo` depends on Leaflet, react-leaflet and react-simple-maps (~450 kB gzipped combined). Keep it an optional package and document the tile-server / attribution obligations.
- No visual regression baseline is committed yet; `scripts/visual-check.mjs` produces screenshots at 360/768/1280 px but a golden set must be captured and reviewed once.
- Storybook app is a stub (no stories).

## 3. Verification performed
- `pnpm typecheck` across `packages/**`.
- `pnpm build` (topological, ES + CJS + d.ts).
- Playground build.
- Tailwind-free host harness re-rendered at 1280 px and 1600 px tall; no legend/label/axis collisions; see the before/after images in `docs/audit/`.
