# Adopting the library in any platform

The library has **no runtime CSS framework dependency**. Every component styles itself with
inline styles and CSS custom properties (`--vi-*`). If a variable is missing, a literal fallback
is used, so charts render acceptably even before the theme is loaded.

## 1. Install

Download or clone the MIT-licensed source, then follow [INSTALL.md](../INSTALL.md) for workspace aliases or local package linking. Registry publication is a separate release step. Install the host peer dependencies your selected packages require.


Peer matrix: React 18.2+ or 19, Recharts 2.12+ (charts-bi/ds), Leaflet + react-leaflet + react-simple-maps (charts-geo only).

## 2. Wrap once, use anywhere

```tsx
import "@aibyters/theme/styles.css";
import { ThemeProvider } from "@aibyters/theme";

<ThemeProvider theme="system" unstyled>   {/* dark | light | aibyters | system */}
  <App />
</ThemeProvider>
```

- `unstyled` renders `display: contents`, so the provider never affects your layout; it only
  supplies variables.
- `overrides={{ "--vi-color-chart-0": "#c49837", "--vi-font-body": "inherit" }}` re-skins
  every chart. No component code changes.
- SSR / static CSS: `themeToCss("light", ":root")` returns a CSS string you can inline.
- Fonts: nothing is fetched. Set `--vi-font-body` / `--vi-font-heading` to your stack, or pass
  `loadFonts` to opt in to Google Fonts.

## 3. Sizing rules (why nothing overlaps)

Every chart is `ChartCard` → `ChartFrame`:

```
┌ WidgetCard (title, description, actions) ───────────┐
│ ┌ ChartFrame ───────────────────────────────────────┐ │
│ │ plot area: exactly `height` px (or aspectRatio,   │ │
│ │            or "fill")                             │ │
│ │ legend: HTML, outside the plot, wraps by width    │ │
│ │ footer                                            │ │
│ └───────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

| Prop | Meaning |
|---|---|
| `height={280}` | Fixed plot height (default). Legend is added on top of this. |
| `height="auto" aspectRatio={16/9}` | Plot height follows container width (responsive tiles). |
| `height="fill"` | Plot grows to fill the parent — use in equal-height grid cells or full-screen views. |
| `legend={{ position: "right", maxRows: 2, interactive: false }}` | Side legends auto-collapse to bottom under 640 px. |
| `dataLabels="auto" \| "always" \| "never"` | `auto` draws a label only when it fits its mark and does not collide. |
| `variant="plain"` | No card chrome: embed inside your own card component. |

Give the chart a container with a definite width; that is the only requirement. Do **not**
wrap charts in elements with `overflow: hidden` and an undefined height.

## 4. Responsive behaviour you get for free

| Container width | Behaviour |
|---|---|
| ≥ 960 px (`lg`) | Full fonts, 6 ticks, side legends allowed, outside pie labels. |
| 640–959 (`md`) | 11 px ticks, 5 ticks, up to 10 legend items before "+N more". |
| 400–639 (`sm`) | Side legends move to bottom; pie labels inside; 8 legend items. |
| < 400 (`xs`) | 10 px ticks, 4 ticks, rotated/thinned category labels, list charts stack label-over-bar, 6 legend items. |

Touch devices get ≥ 44 px targets and larger hover dots. OS "reduce motion" disables animation.
Charts animate once on first paint, never on resize.

## 5. Framework notes

- **Next.js / Remix (SSR):** charts measure their container on mount; server HTML renders the
  card, title and an empty plot of the right height (no layout shift). Import `styles.css` in the root layout.
- **Frappe / Vue / Angular / plain HTML:** mount via a React island (`createRoot`) per widget
  or use the `@aibyters/adapters-frappe` package. Theme variables can be set on any ancestor element.
- **Micro-frontends:** each chart package is `sideEffects: false` and tree-shakeable; only
  `@aibyters/theme` ships CSS. Load React once (peer) to avoid duplicate React instances.
- **PDF / email:** pass `animate={false}` and render at a fixed width; `@media print` styles are included.

## 6. Data conventions

- Cartesian charts take `data: object[]`, `index` (x key) and `categories` (series keys).
  `seriesLabels` maps keys to human labels.
- Part-of-whole charts take `data`, `dataKey`, `nameKey`.
- `valueFormatter` receives a number and returns the string used for ticks, tooltips and labels.
  Use `makeFormatter("currency", { currency: "CHF" })` from `@aibyters/spec` for locale-aware output.
- Empty arrays render the empty state; `loading` renders a skeleton; `error` renders an inline error.
  A throwing chart is contained by an error boundary and never takes down the page.

## 7. Upgrading from 0.0.x

- `showLabels` (Pie) → `dataLabels`.
- `thresholds` (Gauge) → `bands` (old prop still accepted).
- `BulletChart` accepts `rows` for multi-row bullets; single-row props unchanged.
- Recharts `Legend` props are no longer exposed; use `legend={...}`.
- Tailwind is no longer required (and no longer scanned) in consumers.
