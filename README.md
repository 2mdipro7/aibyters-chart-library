# AI Byters Visual Intelligence Library

Welcome to the AI Byters Visual Intelligence Library frontend playground. 

## Project Progress

We have successfully built out **48 visualization components** across 6 core categories. This serves as the headless React foundation that will eventually be embedded into Frappe.

### Completed Categories
- **KPI Cards (6)**: Metric, Delta, Target, Sparkline, Severity, Progress
- **Business Intelligence (26)**: Line, Area, Bar, Column, Combo, Funnel, Data Table, Waterfall, Matrix, Pie, Donut, Radar, Scatter, Bubble, Treemap, Sankey, Radial Bar, Stacked Area, Gauge, Timeline, Bullet, Polar Area
  - **Strategic Frameworks (New!)**: Competitive Matrix, SWOT Analysis, Risk Matrix, PESTLE Analysis
- **Data Science (6)**: Forecast Band, Anomaly Timeline, Histogram, Box Plot, Heatmap, Control Chart, Violin Plot, Candlestick
- **Geospatial (4)**: Choropleth Map, Bubble Map, Connection Map
- **Network (3)**: Network Graph, Dependency Tree, Chord Diagram
- **AI Intelligence (2)**: Insight Card, Recommendation Card

### Integration Guide

For full instructions on how to install and integrate these components into your own React projects, please read the **[Installation Guide (INSTALL.md)](./INSTALL.md)**.

### Local Development

To run the local playground and view the entire component catalog:

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the Vite dev server for the playground:
   ```bash
   cd apps/playground
   pnpm run dev
   ```
   *Note: Ensure you are running the `dev` script directly from the `apps/playground` directory to take advantage of Turborepo's workspace aliasing, which allows hot-reloading across packages.*

3. Open your browser to `http://localhost:5173`.

### Architecture

- **`apps/playground`**: Vite + React dev environment for browsing the visual library.
- **`packages/charts-*`**: Domain-specific headless visual components using Recharts, D3, and native SVG.
- **`packages/layout`**: Dashboard layout components like Widget Cards.
- **`packages/spec`**: Core data formats (DataFrame, ChartSpec).
- **`packages/renderer`**: `SpecChart` draws a ChartSpec over a DataFrame with the matching component; the bridge for backends and models that answer with data plus a spec.
- **`packages/embed`**: one script + stylesheet exposing `window.AIBytersCharts.render()` for pages that are not React (Jinja, Frappe, plain HTML).

All charts use a standard `WidgetCard` wrapper from `@aibyters/layout` and are styled globally using Tailwind CSS variables to support rapid theming.
