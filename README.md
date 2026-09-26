# AI Byters Visual Intelligence Library

Enterprise-grade React chart and dashboard components that drop into **any** platform:
no CSS framework required, themed entirely through CSS variables, responsive from 320 px phones
to wall displays, accessible, SSR-safe, and free of runtime network calls.

**60+ components** across seven packages:

| Package | Contents |
|---|---|
| `@aibyters/charts-kpi` | Metric, Delta, Target, Sparkline, Severity, Progress cards, **MetricStrip** |
| `@aibyters/charts-bi` | Line, Area, Stacked Area, Bar, Column, Combo, Pie, Donut, Radar, Radial Bar, Scatter, Bubble, Treemap, Sankey, Funnel, Waterfall, Gauge, Bullet, Polar Area, Timeline, Data Table, Matrix Table, SWOT, PESTLE, Risk Matrix, Competitive Positioning, **Ranked Bar, Waffle, Diverging Bar, Progress Ring Group, Composition Band, Dumbbell, Lollipop, Pareto, Slope, Paired Bar, Status Strip** |
| `@aibyters/charts-ds` | Forecast Band, Anomaly Timeline, Histogram, Box Plot, Violin, Heatmap, Control Chart, Candlestick, Volcano |
| `@aibyters/charts-geo` | Choropleth, Bubble Map, Connection Map, Tile Map |
| `@aibyters/charts-network` | Network Graph, Dependency Tree, Chord Diagram |
| `@aibyters/charts-ai` | Insight Card, Recommendation Card |
| `@aibyters/charts-flow` / `charts-infographics` | Flow diagrams and showcase infographics |
| `@aibyters/layout`, `@aibyters/theme`, `@aibyters/core`, `@aibyters/spec`, `@aibyters/tokens` | Card/grid layout, theming, chart primitives, formatters, design tokens |

## Why it does not overlap, clip or break in your app

Every chart renders through `ChartCard` → `ChartFrame` (`@aibyters/core`):

- the **legend is HTML outside the SVG**, so it never steals plot height or spills into the next widget;
- **axis widths are measured** from the formatted ticks, so `$1.2M` is never clipped;
- **category labels rotate or thin out** based on the real slot width;
- **data labels are drawn only when they fit** (pie labels are placed outside with leader lines and collision resolution);
- **breakpoints come from the container width**, not the viewport, with touch-size targets and reduced-motion support;
- **no Tailwind, no fonts, no telemetry** — inline styles + `--vi-*` variables with literal fallbacks.

See [docs/ADOPTION.md](./docs/ADOPTION.md) for integration, [docs/AUDIT.md](./docs/AUDIT.md) for
the findings that drove this design, and [INSTALL.md](./INSTALL.md) for a quick start.

## Quick start

```tsx
import "@aibyters/theme/styles.css";
import { ThemeProvider } from "@aibyters/theme";
import { MetricStrip } from "@aibyters/charts-kpi";
import { LineChart, DonutChart, RankedBarChart } from "@aibyters/charts-bi";
import { Grid } from "@aibyters/layout";

export function Dashboard() {
  return (
    <ThemeProvider theme="system" unstyled>
      <Grid columns={3} minColumnWidth={320}>
        <LineChart title="AUM by region" data={rows} index="month" categories={["NA", "EMEA", "APAC"]} valueFormatter={usd} />
        <DonutChart title="Holdings outcome" data={outcomes} dataKey="count" nameKey="status" centerValue="595" centerLabel="need review" legend={{ position: "right" }} />
        <RankedBarChart title="Which assets account for the gap?" data={assetGaps} valueFormatter={usd} highlightTop={3} />
      </Grid>
    </ThemeProvider>
  );
}
```

## Development

```bash
pnpm install
pnpm dev            # playground at http://localhost:5173 (includes /#/lab/responsive)
pnpm typecheck      # all packages from source
pnpm test           # unit tests (label collision, axis sizing, scales, formatters)
pnpm build          # ES + CJS + d.ts for every package, topological order
pnpm build:playground && pnpm test:visual   # screenshots at 360/768/1280 px
```

Packages for non-React hosts:

- **`packages/renderer`**: `SpecChart` draws a ChartSpec over a DataFrame with the matching component; the bridge for backends and models that answer with data plus a spec.
- **`packages/embed`**: one script + stylesheet exposing `window.AIBytersCharts.render()` for pages that are not React (Jinja, Frappe, plain HTML).

## Licensing

Proprietary — see [LICENSE](./LICENSE). Commercial terms, the licensee questionnaire and the pricing
model are in [docs/commercial](./docs/commercial). Release procedure: [docs/RELEASING.md](./docs/RELEASING.md).
