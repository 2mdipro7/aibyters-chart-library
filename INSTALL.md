# Developer Installation Guide

This guide explains how to install and integrate the **AI Byters Visual Intelligence Library** into your own React project.

---

## Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Version | Notes |
|------|---------|-------|
| [Node.js](https://nodejs.org/) | `>= 18.x` | Required runtime |
| [pnpm](https://pnpm.io/) | `>= 8.x` | Recommended package manager |
| React | `^18.2.0` | Peer dependency |

Install pnpm if you don't have it:
```bash
npm install -g pnpm
```

---

## Quick Start (Clone & Run the Playground)

This gets the component explorer running locally so you can browse all 50+ charts.

```bash
# 1. Clone the repository
git clone https://github.com/2mdipro7/aibyters-chart-library.git
cd aibyters-chart-library

# 2. Install all workspace dependencies
pnpm install

# 3. Start the visual playground
cd apps/playground
pnpm run dev
```

Open **http://localhost:5173** in your browser. You'll see the full component library organized by category.

---

## Integrating Into Your Own Project

The library is a **monorepo** with several scoped packages. You can install only the packages you need.

### Available Packages

| Package | What it contains |
|---------|-----------------|
| `@aibyters/charts-kpi` | Metric, Delta, Target, Sparkline, Severity, Progress cards |
| `@aibyters/charts-bi` | Line, Area, Bar, Pie, Waterfall, SWOT, Risk Matrix, and 20+ more |
| `@aibyters/charts-ds` | Histogram, Box Plot, Heatmap, Volcano Plot, Candlestick, and more |
| `@aibyters/charts-geo` | Choropleth Map, Bubble Map, Connection Map, GIS Tile Map |
| `@aibyters/charts-network` | Network Graph, Dependency Tree, Chord Diagram |
| `@aibyters/charts-ai` | Insight Card, Recommendation Card |
| `@aibyters/layout` | `WidgetCard` wrapper used internally by all charts |
| `@aibyters/renderer` | `SpecChart`: draws a `ChartSpec` + `DataFrame` with the right component (what a backend or model returns) |
| `@aibyters/embed` | One script for pages that are not React: `window.AIBytersCharts.render(el, { spec, frame })` |
| `@aibyters/theme` | CSS design tokens & theme variables |

---

### Step 1: Install Packages

The library is free under MIT. Download the complete source archive and use workspace aliases or local package linking below. Public npm packages will be announced separately once published; no private-registry token is needed for source use.

#### Option A — Path Aliases (Vite / Turborepo monorepo)

If your project is already a monorepo, add the `aibyters` packages to your `pnpm-workspace.yaml`:

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '../aibyters-chart-library/packages/*'   # point to the cloned repo
```

Then reference them in your `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@aibyters/charts-bi':      path.resolve(__dirname, '../aibyters-chart-library/packages/charts-bi/src/index.ts'),
      '@aibyters/charts-kpi':     path.resolve(__dirname, '../aibyters-chart-library/packages/charts-kpi/src/index.ts'),
      '@aibyters/charts-ds':      path.resolve(__dirname, '../aibyters-chart-library/packages/charts-ds/src/index.ts'),
      '@aibyters/charts-geo':     path.resolve(__dirname, '../aibyters-chart-library/packages/charts-geo/src/index.ts'),
      '@aibyters/charts-network': path.resolve(__dirname, '../aibyters-chart-library/packages/charts-network/src/index.ts'),
      '@aibyters/charts-ai':      path.resolve(__dirname, '../aibyters-chart-library/packages/charts-ai/src/index.ts'),
      '@aibyters/layout':         path.resolve(__dirname, '../aibyters-chart-library/packages/layout/src/index.ts'),
      '@aibyters/spec':           path.resolve(__dirname, '../aibyters-chart-library/packages/spec/src/index.ts'),
      '@aibyters/theme':          path.resolve(__dirname, '../aibyters-chart-library/packages/theme/src/index.ts'),
    },
  },
});
```

#### Option B — Local Build & Link

Build the packages first, then link them:

```bash
# Inside the aibyters-chart-library repo root
cd packages/charts-bi
pnpm run build

# Then in your app
pnpm link ../aibyters-chart-library/packages/charts-bi
```

---

### Step 2: Install Peer Dependencies

Each chart package requires these peer dependencies in **your project**:

```bash
pnpm add react react-dom recharts
```

React 18.2+ and 19 are supported.

For geographic charts, also install:
```bash
pnpm add leaflet react-leaflet react-simple-maps
pnpm add -D @types/leaflet
```

---

### Step 3: Import the Theme CSS

The charts rely on CSS custom properties (design tokens) for all colors, spacing, and typography. Import the theme stylesheet once in your app's entry point.

```tsx
// main.tsx or App.tsx
import '@aibyters/theme/styles.css';
```

> [!NOTE]
> The stylesheet only contains scoped global styles (focus rings, print, reduced motion). Colours, spacing and fonts are CSS variables supplied by `ThemeProvider`, and every component carries literal fallbacks, so charts remain readable even if the stylesheet is missing. Tailwind is **not** required.

---

### Step 4: Wrap Your App with ThemeProvider

```tsx
import React from 'react';
import { ThemeProvider } from '@aibyters/theme';
import '@aibyters/theme/dist/index.css';

export default function App() {
  return (
    <ThemeProvider theme="system" unstyled>
      {/* your app */}
    </ThemeProvider>
  );
}
```

---

### Step 5: Use a Chart Component

Here's a minimal working example using a KPI card and a BI line chart:

```tsx
import React from 'react';
import { MetricCard } from '@aibyters/charts-kpi';
import { LineChart } from '@aibyters/charts-bi';

const revenueData = [
  { month: 'Jan', revenue: 42000, target: 40000 },
  { month: 'Feb', revenue: 51000, target: 45000 },
  { month: 'Mar', revenue: 48000, target: 50000 },
  { month: 'Apr', revenue: 63000, target: 55000 },
];

export default function Dashboard() {
  return (
    <div style={{ display: 'grid', gap: 24, padding: 24 }}>
      <MetricCard
        title="Monthly Revenue"
        value={63000}
        format="currency"
      />

      <LineChart
        title="Revenue vs Target"
        data={revenueData}
        index="month"
        categories={['revenue', 'target']}
      />
    </div>
  );
}
```

---

## Package-by-Package Examples

### KPI Charts (`@aibyters/charts-kpi`)

```tsx
import { MetricCard, DeltaCard, SparklineCard, ProgressCard } from '@aibyters/charts-kpi';

<MetricCard title="Revenue" value={120000} format="currency" />

<DeltaCard title="Growth" value={12.4} delta={2.1} format="percent" />

<SparklineCard title="Weekly Sales" value={8400} data={[5, 6, 8, 7, 9, 8, 10]} trend="up" />

<ProgressCard title="Quota Attainment" value={73} max={100} type="circular" />
```

### BI Charts (`@aibyters/charts-bi`)

```tsx
import { LineChart, BarChart, PieChart, WaterfallChart } from '@aibyters/charts-bi';

<LineChart
  title="Monthly Trend"
  data={data}
  index="month"
  categories={['revenue', 'expenses']}
/>

<PieChart
  title="Revenue by Region"
  data={data}
  dataKey="value"
  nameKey="region"
/>

<WaterfallChart
  title="P&L Breakdown"
  data={[
    { name: 'Revenue', value: 100000 },
    { name: 'COGS',    value: -40000 },
    { name: 'OpEx',    value: -25000 },
    { name: 'Net',     value: 35000  },
  ]}
/>
```

### Strategic Frameworks (`@aibyters/charts-bi`)

```tsx
import { SWOTAnalysisCard, RiskMatrixChart, CompetitivePositioningChart } from '@aibyters/charts-bi';

<SWOTAnalysisCard
  title="Product Strategy SWOT"
  strengths={['Strong brand', 'Global reach']}
  weaknesses={['High cost base']}
  opportunities={['Emerging markets']}
  threats={['Rising competition']}
/>

<RiskMatrixChart
  title="Risk Register"
  data={[{ name: 'Supply Chain', likelihood: 4, impact: 5 }]}
/>
```

### Data Science Charts (`@aibyters/charts-ds`)

```tsx
import { HistogramChart, VolcanoPlot, CandlestickChart } from '@aibyters/charts-ds';

<HistogramChart title="Score Distribution" data={rawScores} bins={20} />

<VolcanoPlot
  title="Differential Expression"
  data={geneData} // [{ id, x: log2FC, y: -log10Pval }]
  pThreshold={1.3}
  fcThreshold={1.0}
/>
```

### Geographic Charts (`@aibyters/charts-geo`)

```tsx
import { ChoroplethMap, BubbleMap, TileMap } from '@aibyters/charts-geo';

// Worldwide choropleth — match countries by name or ISO code
<ChoroplethMap
  title="Global Sales"
  data={[
    { region: 'United States', value: 120000 },
    { region: 'Germany', value: 85000 },
  ]}
/>

// GIS interactive map (requires Leaflet CSS in your bundle)
import 'leaflet/dist/leaflet.css';

<TileMap
  title="Office Locations"
  data={[
    { name: 'London HQ', coordinates: [51.5074, -0.1276], value: 500 },
  ]}
  center={[30, 0]}
  zoom={2}
/>
```

---

## TypeScript Support

All packages ship with TypeScript declarations. No extra `@types` packages are needed for the core chart libraries themselves.

```ts
import type { LineChartProps } from '@aibyters/charts-bi';
import type { VolcanoPlotDataPoint } from '@aibyters/charts-ds';
import type { ChoroplethMapProps } from '@aibyters/charts-geo';
```

---

## Troubleshooting

### Charts render but have no color/styling
→ You are missing the theme CSS. Add `import '@aibyters/theme/dist/index.css'` to your app entry file.

### Leaflet map tiles not showing
→ Make sure you also import Leaflet's own CSS: `import 'leaflet/dist/leaflet.css'`.

### Choropleth map shows all regions in grey
→ Make sure your `data[].region` values match the country names in the TopoJSON (English country names, e.g. `"United States"`, `"United Kingdom"`).

### TypeScript path errors
→ Confirm your `tsconfig.json` `paths` match the aliases in `vite.config.ts`.

### Vite fails to resolve `@aibyters/*`
→ Double-check the `resolve.alias` paths in your `vite.config.ts` point to the correct locations of the cloned repo.

---

## Project Structure Reference

```
aibyters-chart-library/
├── apps/
│   └── playground/          # Visual component explorer (run with pnpm dev)
└── packages/
    ├── charts-bi/           # Business intelligence charts
    ├── charts-ds/           # Data science charts
    ├── charts-kpi/          # KPI card components
    ├── charts-geo/          # Geographic map charts
    ├── charts-network/      # Network & relationship charts
    ├── charts-ai/           # AI insight cards
    ├── layout/              # WidgetCard wrapper
    ├── theme/               # CSS design tokens & ThemeProvider
    ├── spec/                # Shared TypeScript types & formatters
    └── tokens/              # Raw design token values
```
