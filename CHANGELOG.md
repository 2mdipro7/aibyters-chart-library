# Changelog

All notable changes to the AI Byters Visual Intelligence Library are documented here.
Every `@aibyters/*` package shares one version (see `docs/RELEASING.md`).

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Embed

- `AIBytersCharts.renderComponent(el, { component, props, theme, overrides })` draws one named
  component with explicit props, bypassing the planner, for hosts that must keep their own KPI
  values, supplied deltas or forecast bounds. `componentNames()` lists what it accepts and
  `isMounted(el)` reports whether an element holds a chart. `render` and `renderComponent` share
  one root per element.
- `ForecastBand`, `HeatmapChart`, `RiskMatrixChart` and `BulletChart` are registered in the embed
  bundle (no spec kind selects them yet). `formatValue` is exposed on the API. Version 0.3.0.

## [0.1.0] - 2026-09-28

### Enterprise hardening

- Packaging: every `@aibyters/*` package ships ESM (`dist/index.js`), CommonJS (`dist/index.cjs`)
  and type declarations (`dist/index.d.ts`) with an `exports` map (`types` first), a shared
  `0.1.0` version, `"license": "SEE LICENSE IN LICENSE"`, `publishConfig.access: "restricted"`
  and an explicit `sideEffects` declaration. React, Recharts, Leaflet, `@xyflow/react`,
  `framer-motion` and `lucide-react` are peer dependencies.
- Build: standardised `vite.config.ts` per package (`vite-plugin-dts`, externals derived from
  `package.json`, CSS bundled to `dist/index.css` and exposed as `./styles.css`).
- Tests: root Vitest configuration (node for `*.test.ts`, jsdom for `*.test.tsx`) with unit tests
  for text measurement, label collision, responsive settings and scales in `@aibyters/core`.
- CI / release: GitHub Actions `ci.yml` (typecheck, test, build, playground artifact) and manual
  `release.yml` (release checks + `pnpm publish` to a private registry).
- Tooling: `scripts/release-check.mjs`, `scripts/bundle-size.mjs`, `scripts/visual-check.mjs`,
  `scripts/copy-license.mjs`, `.editorconfig`, `.prettierrc`, `docs/RELEASING.md`.
- Removed the stale duplicate `packages/kpi` (superseded by `@aibyters/charts-kpi`).

### Chart engine (breaking for consumers of Recharts `<Legend>` props)

- New `@aibyters/core` chart primitives: `ChartFrame` (plot height / aspect ratio / fill, HTML
  legend outside the SVG, loading / error / empty states, first-paint-only animation,
  reduced-motion), `ChartLegend` (interactive, width-packed, "+N more" overflow),
  `computeAxisWidth` / `planCategoryTicks` (measured axis sizing, rotate/thin category labels),
  `layoutPieLabels` / `labelFits` / `dropCollidingLabels` (collision-free data labels),
  container-width breakpoints (`xs/sm/md/lg`), touch and reduced-motion detection,
  `themePalette()` (all colours via `--vi-color-chart-N` with fallbacks), shared `ChartTooltip`.
- `@aibyters/layout`: `ChartCard` (WidgetCard + ChartFrame + error boundary); `WidgetCard`,
  `Grid` (auto-fit responsive), `FilterBar` rewritten without Tailwind; `variant="plain"`,
  `footer`, `headingLevel`.
- `@aibyters/theme`: `ThemeProvider` gains `system` and `aibyters` themes, `unstyled`,
  `overrides`, opt-in `loadFonts` (no runtime font fetch by default); `getThemeVars`, `themeToCss`;
  print, forced-colours, reduced-motion and touch rules in `styles.css`.
- `@aibyters/tokens`: `semantic.*`, `text.tertiary`, `primary`, `surface.grid`, `colorRamps`.
- `@aibyters/spec`: `formatValue` / `makeFormatter` (counts keep every digit, compaction thresholds).
- `@aibyters/charts-bi`: every chart rebuilt on `ChartCard` with `BaseChartProps`
  (`height`, `legend`, `dataLabels`, `loading`, `error`, `emptyMessage`, `variant`, `exportData`).
  Pie/Donut outside labels with leader lines; RadialBar, Gauge, Bullet, Funnel, PolarArea as plain SVG;
  DataTable with sorting, pagination, sticky header. New: RankedBarChart, WaffleChart,
  DivergingBarChart, ProgressRingGroup, CompositionBandChart, DumbbellChart, LollipopChart,
  ParetoChart, SlopeChart, PairedBarChart, StatusStripChart.
- `@aibyters/charts-kpi`: cards rewritten without Tailwind, container-query value sizing,
  `DeltaBadge`, count formatting; new `MetricStrip`.
- `@aibyters/charts-ds` and `@aibyters/charts-ai`: rebuilt on the same pattern (measured axes,
  HTML legends, theme colours, pointer tooltips for plain-SVG charts).
- Apps: `apps/host-smoke` (Tailwind-free consumer smoke test) and a `/lab/responsive` playground page.
- Fixed: d3 version split between `@xyflow/react` and `react-simple-maps` (flow diagram crashed with
  "transition is not a function") via pnpm overrides; `react-leaflet` pinned to 4.x for React 18.

[Unreleased]: https://github.com/2mdipro7/aibyters-chart-library/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/2mdipro7/aibyters-chart-library/releases/tag/v0.1.0
