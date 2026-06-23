# AI Byters Visual Intelligence Library

## Full Implementation Plan for a Custom BI + Decision Intelligence Visual Platform

## 1. Strategic objective

AI Byters should not begin by building a full Power BI clone. The practical first goal is to build a reusable **front-end visual intelligence platform** that can be embedded inside Frappe and reused across AI Byters products.

The system should become the visual foundation for:

* Executive dashboards
* Operational dashboards
* Data science visuals
* Forecasting views
* Anomaly detection views
* AI-generated insight cards
* Evidence panels
* Recommendation cards
* Industry-specific decision dashboards
* Future natural-language analytics interfaces

The core product idea:

> Frappe owns the data, permissions, records, workflows, and APIs.
> AI Byters owns the reusable visual layer, dashboard UX, analytics components, and decision intelligence interface.

The internal product name can be:

**AI Byters Visual Intelligence Library**

The Frappe-facing app can be called:

**AI Byters Decision Canvas for Frappe**

---

# 2. What we are building

## 2.1 Core product

Build a reusable visual platform with five layers:

```text
Frappe Backend / Custom APIs
        ↓
DTO + Permission-Filtered View Models
        ↓
AI Byters DataFrame + ChartSpec
        ↓
Headless Visualization Logic
        ↓
SVG / Canvas / Vendor Adapter Renderers
```

## 2.2 What this means practically

The system should not simply be a folder of random chart components. It should be a structured platform with:

| Layer                     | Purpose                                                              |
| ------------------------- | -------------------------------------------------------------------- |
| Data contract layer       | Standard way for Frappe and other backends to send visual-ready data |
| Chart specification layer | Standard typed config for every visual                               |
| Headless chart logic      | Scales, layout, domains, interactions, formatting                    |
| Renderer layer            | SVG by default, Canvas for dense visuals, WebGL later                |
| Dashboard shell           | Filters, cards, grid, drilldowns, evidence drawers                   |
| Frappe adapter            | Fetches data from Frappe and maps it into the visual system          |
| Storybook documentation   | Visual catalog, usage examples, test states                          |
| Design token system       | AI Byters branding and client theming                                |

---

# 3. Product boundaries

## 3.1 Build now

Build these first:

* Visual component library
* Dashboard shell
* Data contracts
* Frappe adapter
* Custom Frappe APIs
* KPI cards
* Core BI charts
* Tables and matrix
* Forecast and anomaly views
* Insight cards
* Recommendation cards
* Evidence drawer
* Storybook documentation
* Basic theming
* Basic export support

## 3.2 Do not build now

Do not build these in the first version:

* Full Power BI-style drag-and-drop builder
* Full semantic model engine
* Generic SQL editor for business users
* Marketplace for visuals
* Natural-language dashboard generation
* Complex self-service report designer
* Full ETL/data warehouse
* User-created calculated measures engine
* Power BI-style desktop authoring app

Those can come later after the visual platform is stable.

---

# 4. Recommended stack

## 4.1 Frontend stack

| Area                        | Tool                          | Decision                                  |
| --------------------------- | ----------------------------- | ----------------------------------------- |
| UI framework                | React                         | Main component framework                  |
| Language                    | TypeScript                    | Strict typing for chart/data contracts    |
| Build tool                  | Vite                          | Fast development and library builds       |
| Monorepo                    | pnpm workspaces + Turborepo   | Reusable packages                         |
| Versioning                  | Changesets                    | Package versioning and changelog          |
| Documentation               | Storybook                     | Component catalog and QA                  |
| Unit testing                | Vitest                        | Fast test runner                          |
| Browser testing             | Playwright                    | Cross-browser dashboard testing           |
| Table engine                | TanStack Table                | Headless table/matrix logic               |
| Schema validation           | Zod                           | Runtime validation of Frappe/API payloads |
| Accessibility primitives    | React Aria                    | Accessible controls                       |
| Tooltip/popover positioning | Floating UI                   | Tooltips, menus, popovers                 |
| Chart math                  | D3 modules                    | Scales, axes, shapes, formatting          |
| Styling                     | CSS variables + design tokens | Theming and client branding               |

## 4.2 Visualization stack

| Library   | How to use it                                                                |
| --------- | ---------------------------------------------------------------------------- |
| D3        | Use directly for scales, axes, shapes, arrays, formatting                    |
| ECharts   | Keep behind adapter only for fallback/complex visuals                        |
| Plotly    | Keep behind adapter only for scientific/niche visuals                        |
| Vega-Lite | Use as inspiration for ChartSpec, not as main runtime                        |
| Recharts  | Avoid as foundation                                                          |
| Chart.js  | Avoid as foundation                                                          |
| AG Grid   | Use only if enterprise grid requirements become too large for TanStack Table |

## 4.3 Rendering strategy

| Renderer        | Use for                                                            |
| --------------- | ------------------------------------------------------------------ |
| SVG             | KPI, line, bar, combo, area, donut, waterfall, funnel, annotations |
| Canvas          | Dense scatter, heatmap, high-volume time series, large mark counts |
| WebGL           | Later only for very large geospatial/scientific datasets           |
| Vendor adapters | Rare fallback when custom build cost is too high                   |

Default rule:

> Build all MVP visuals with SVG unless there is a measured performance reason to use Canvas.

---

# 5. Monorepo implementation structure

Create one main repository:

```text
aibyters-visual-intelligence/
  apps/
    storybook/
    playground/
    frappe-shell-demo/

  packages/
    spec/
    tokens/
    theme/
    core/
    svg/
    canvas/
    charts-kpi/
    charts-bi/
    charts-ds/
    charts-ai/
    layout/
    adapters-frappe/
    adapters-vendors/
    testing/
```

## 5.1 Package responsibilities

| Package                     | Responsibility                                        |
| --------------------------- | ----------------------------------------------------- |
| `packages/spec`             | DataFrame, ChartSpec, Zod schemas, shared types       |
| `packages/tokens`           | Colors, spacing, typography, radius, shadows          |
| `packages/theme`            | CSS variables, theme provider, semantic colors        |
| `packages/core`             | Chart math, scales, layout engines, interaction state |
| `packages/svg`              | Axes, legends, labels, annotations, SVG surfaces      |
| `packages/canvas`           | Canvas surfaces and dense visual renderers            |
| `packages/charts-kpi`       | KPI cards, deltas, target cards, sparklines           |
| `packages/charts-bi`        | Line, bar, combo, area, table, matrix, waterfall      |
| `packages/charts-ds`        | Forecast, anomaly, histogram, box plot, control chart |
| `packages/charts-ai`        | Insight cards, recommendations, evidence, narratives  |
| `packages/layout`           | Dashboard grid, filter bar, drilldowns, drawers       |
| `packages/adapters-frappe`  | Frappe client, API adapters, DTO mappers              |
| `packages/adapters-vendors` | ECharts, Plotly, Vega-Lite adapter experiments        |
| `packages/testing`          | Fixtures, mock data, test utilities                   |
| `apps/storybook`            | Component catalog and documentation                   |
| `apps/playground`           | Performance and interaction experiments               |
| `apps/frappe-shell-demo`    | Demo host for Frappe embedding                        |

---

# 6. Data contract design

## 6.1 Why this matters

The biggest mistake would be allowing each chart to accept random props and random API payloads. That will make the library hard to reuse.

Instead, every visual should be powered by a shared structure:

```text
DataFrame + ChartSpec
```

## 6.2 DataFrame contract

```ts
type Primitive = string | number | boolean | null | Date;

type FieldType = "string" | "number" | "date" | "boolean";

type FieldRole =
  | "dimension"
  | "measure"
  | "time"
  | "id"
  | "category";

type FieldMeta = {
  key: string;
  label: string;
  type: FieldType;
  role?: FieldRole;
  format?: string;
};

type DataFrame = {
  fields: FieldMeta[];
  rows: Record<string, Primitive>[];
  meta?: {
    source?: string;
    rowCount?: number;
    lastUpdated?: string;
    currency?: string;
    timezone?: string;
  };
};
```

## 6.3 ChartSpec contract

```ts
type ChartSpec =
  | KpiSpec
  | LineSpec
  | BarSpec
  | ComboSpec
  | TableSpec
  | MatrixSpec
  | WaterfallSpec
  | ForecastSpec
  | AnomalySpec
  | InsightCardSpec;
```

Example line chart:

```ts
type LineSpec = {
  kind: "line";
  title: string;
  description?: string;
  data: DataFrame;
  encodings: {
    x: string;
    y: string;
    series?: string;
  };
  interaction?: {
    tooltip?: boolean;
    brush?: boolean;
    crosshair?: boolean;
    drilldown?: boolean;
  };
  presentation?: {
    curve?: "linear" | "smooth" | "step";
    showPoints?: boolean;
    yAxisLabel?: string;
  };
};
```

## 6.4 Insight card contract

```ts
type InsightCardSpec = {
  kind: "insight-card";
  title: string;
  summary: string;
  severity: "positive" | "neutral" | "warning" | "critical";
  confidence?: number;
  metric?: {
    label: string;
    value: number;
    delta?: number;
    format?: string;
  };
  evidence?: {
    label: string;
    value?: string | number;
    source?: string;
    recordId?: string;
  }[];
  recommendedActions?: {
    action: string;
    reason?: string;
    expectedImpact?: string;
    confidence?: number;
  }[];
};
```

---

# 7. Visual priority roadmap

## 7.1 MVP tier

These are the first visuals to build. They should be production-quality before expanding the library.

| Priority | Category | Visual               | Why it matters                              |
| -------- | -------- | -------------------- | ------------------------------------------- |
| P0       | KPI      | Metric Card          | Most dashboards start with business metrics |
| P0       | KPI      | Delta Card           | Shows period-over-period change             |
| P0       | KPI      | Target/Bullet Card   | Shows actual vs target                      |
| P0       | KPI      | Sparkline Card       | Gives quick trend context                   |
| P0       | KPI      | Status/Severity Card | Shows health, risk, alert status            |
| P0       | BI       | Line Chart           | Core trend visual                           |
| P0       | BI       | Bar/Column Chart     | Core comparison visual                      |
| P0       | BI       | Stacked Bar/Area     | Composition over time/category              |
| P0       | BI       | Combo Chart          | Revenue + margin, volume + rate             |
| P0       | BI       | Data Table           | Detail and auditability                     |
| P0       | BI       | Matrix/Pivot v1      | Business summaries by rows/columns          |
| P0       | BI       | Waterfall            | Variance and contribution analysis          |
| P0       | BI       | Funnel               | Conversion and process flow                 |
| P0       | DS       | Forecast Band        | Actual + forecast + confidence              |
| P0       | DS       | Anomaly Timeline     | Detect unusual changes                      |
| P0       | AI       | Insight Card         | What changed and why it matters             |
| P0       | Layout   | Filter Bar           | Dashboard-wide filtering                    |
| P0       | Layout   | Date Range Slicer    | Time filtering                              |
| P0       | Layout   | Drill Breadcrumb     | Drilldown navigation                        |

## 7.2 High-priority tier

Build after MVP is stable.

| Priority | Category | Visual                  | Why it matters                |
| -------- | -------- | ----------------------- | ----------------------------- |
| P1       | KPI      | Progress/Attainment Bar | Target completion             |
| P1       | BI       | Scatter Plot            | Correlation                   |
| P1       | BI       | Bubble Chart            | Multi-variable comparison     |
| P1       | BI       | Heatmap                 | Intensity and patterns        |
| P1       | BI       | Treemap                 | Hierarchical part-to-whole    |
| P1       | BI       | Ranking Table with Bars | Ranking + exact values        |
| P1       | BI       | Donut Chart             | Simple share of total         |
| P1       | DS       | Histogram               | Distribution                  |
| P1       | DS       | Box Plot                | Outliers and spread           |
| P1       | DS       | Control Chart           | Process stability             |
| P1       | DS       | Cohort Heatmap          | Retention/repeat behavior     |
| P1       | AI       | Smart Narrative Block   | Business-language explanation |
| P1       | AI       | Driver/Influencer Chart | Top contributors to change    |
| P1       | AI       | Recommendation Card     | Next actions                  |
| P1       | Layout   | Dimension Slicer        | Category filtering            |
| P1       | Layout   | Legend Control          | Series visibility             |
| P1       | Layout   | Annotation Layer        | Events and notes              |

## 7.3 Medium-priority tier

Build when the first client/product needs them.

| Priority | Category | Visual              | Why it matters               |
| -------- | -------- | ------------------- | ---------------------------- |
| P2       | KPI      | Confidence Badge    | Model/data confidence        |
| P2       | BI       | Calendar Heatmap    | Daily activity               |
| P2       | BI       | Small Multiples     | Compare many groups          |
| P2       | BI       | Choropleth Map      | Region-level analysis        |
| P2       | BI       | Symbol Map          | Location-level analysis      |
| P2       | DS       | Violin Plot         | Advanced distribution        |
| P2       | DS       | Correlation Matrix  | Relationship discovery       |
| P2       | DS       | Pareto Chart        | 80/20 analysis               |
| P2       | AI       | Root-Cause Tree     | Multi-level cause analysis   |
| P2       | AI       | Evidence Drawer     | Show supporting rows/sources |
| P2       | AI       | Scenario Comparison | Base/best/worst cases        |
| P2       | Layout   | Compare Mode Toggle | Period/segment comparison    |
| P2       | Layout   | Split Panel Layout  | Chart + evidence/details     |

## 7.4 Low-priority tier

Do not build these early unless a specific client project requires them.

| Priority | Category | Visual                     | Why lower priority                     |
| -------- | -------- | -------------------------- | -------------------------------------- |
| P3       | KPI      | Radial Gauge               | Less information-dense                 |
| P3       | BI       | Gantt Timeline             | Useful but specialized                 |
| P3       | BI       | Sankey                     | Complex and less common                |
| P3       | BI       | Sunburst                   | Complex hierarchy exploration          |
| P3       | DS       | Density Curve              | Niche statistical use                  |
| P3       | DS       | Decomposition View         | Useful later for advanced forecasting  |
| P3       | AI       | Query Suggestions Panel    | Needs NL analytics layer               |
| P3       | AI       | Conversational Answer Card | Requires stable AI workflow            |
| P3       | Embed    | Web Component Shell        | Useful for cross-framework reuse later |
| P3       | Embed    | Sandboxed Iframe Host      | Useful for isolated deployments later  |

---

# 8. Frappe integration plan

## 8.1 Frappe role

Frappe should provide:

* Authentication
* User/session management
* Role and permission control
* DocTypes
* Business records
* Custom APIs
* Server-side data filtering
* Optional caching
* Dashboard and widget configuration storage

Frappe should not provide:

* Chart rendering logic
* Visualization behavior
* Chart interaction model
* AI Byters design system
* Frontend visual semantics

## 8.2 Create custom Frappe app

Create an app:

```bash
bench new-app aibyters_bi
bench --site yoursite install-app aibyters_bi
```

Recommended app structure:

```text
aibyters_bi/
  aibyters_bi/
    api/
      dashboard.py
      widget.py
      metric.py
      data_source.py
      export.py
    doctype/
      bi_dashboard/
      bi_widget/
      bi_metric/
      bi_data_source/
      bi_saved_filter/
      bi_user_preference/
      bi_alert_rule/
      bi_snapshot/
    public/
      js/
        decision_canvas.bundle.js
        bi_console.js
      css/
        decision_canvas.css
    www/
      decision-canvas.html
  hooks.py
```

## 8.3 Recommended DocTypes

| DocType            | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| BI Dashboard       | Dashboard metadata, layout, owner, permissions           |
| BI Widget          | Widget type, chart spec, position, data source reference |
| BI Metric          | Reusable metric definition                               |
| BI Data Source     | Maps DocType/report/custom query to visual data          |
| BI Saved Filter    | Saved user/team filter presets                           |
| BI User Preference | Layout, theme, collapsed panels                          |
| BI Alert Rule      | Thresholds and anomaly rules                             |
| BI Snapshot        | Cached dashboard/widget results                          |

## 8.4 Frappe APIs

Create controlled APIs, not open SQL endpoints.

### Dashboard API

```python
@frappe.whitelist()
def get_dashboard(dashboard_name, filters=None):
    # 1. Validate user session
    # 2. Check dashboard permission
    # 3. Load dashboard config
    # 4. Load widget list
    # 5. Apply user/company/role filters
    # 6. Return dashboard shell + widget specs
    return {
        "dashboard": {...},
        "widgets": [...]
    }
```

### Widget API

```python
@frappe.whitelist()
def get_widget_data(widget_name, filters=None):
    # 1. Validate widget permission
    # 2. Validate filters
    # 3. Resolve data source
    # 4. Query data with permission filters
    # 5. Return DataFrame + ChartSpec
    return {
        "spec": {...},
        "data": {...}
    }
```

### Metric API

```python
@frappe.whitelist()
def get_metric(metric_name, filters=None):
    return {
        "label": "Revenue",
        "value": 1250000,
        "previous": 980000,
        "delta": 0.275,
        "format": "currency",
        "status": "positive"
    }
```

### Insight API

```python
@frappe.whitelist()
def get_insight(insight_name, filters=None):
    return {
        "title": "Revenue increased by 27.5%",
        "summary": "Growth was mainly driven by Dhaka branch and repeat customers.",
        "severity": "positive",
        "confidence": 0.84,
        "evidence": [...],
        "recommendedActions": [...]
    }
```

---

# 9. Frappe embedding strategy

## 9.1 Preferred approach

Use **same-origin direct React embedding** inside Frappe Desk pages.

This is the default because it gives:

* Best UX integration
* Same login/session
* No iframe complexity
* Easier theming
* Easier permissions
* Easier routing inside Frappe
* Lower overhead

## 9.2 Desk page integration

In `hooks.py`:

```python
app_include_js = [
    "/assets/aibyters_bi/js/decision_canvas.bundle.js"
]

app_include_css = [
    "/assets/aibyters_bi/css/decision_canvas.css"
]

page_js = {
    "decision-canvas": "public/js/bi_console.js"
}
```

In `public/js/bi_console.js`:

```javascript
frappe.pages["decision-canvas"] = {
  on_page_load(wrapper) {
    const page = frappe.ui.make_app_page({
      parent: wrapper,
      title: "Decision Canvas",
      single_column: true
    });

    const mount = document.createElement("div");
    mount.id = "aibyters-decision-canvas-root";
    page.body.appendChild(mount);

    window.AIBytersDecisionCanvas.mount({
      element: mount,
      frappe,
      dashboardName: "Executive Dashboard"
    });
  }
};
```

## 9.3 Frontend adapter

Create this inside `packages/adapters-frappe`:

```ts
export async function frappeCall<T>(
  method: string,
  args?: Record<string, unknown>
): Promise<T> {
  return new Promise((resolve, reject) => {
    window.frappe.call({
      method,
      args,
      callback: (r: any) => resolve(r.message as T),
      error: reject,
    });
  });
}
```

Then dashboard usage:

```ts
const dashboard = await frappeCall<DashboardResponse>(
  "aibyters_bi.api.dashboard.get_dashboard",
  {
    dashboard_name: "Executive Dashboard",
    filters: {
      from_date: "2026-01-01",
      to_date: "2026-06-30"
    }
  }
);
```

---

# 10. Security and permission model

## 10.1 Core rule

All sensitive filtering must happen in Frappe, not in the browser.

The frontend should never receive data the user is not allowed to see.

## 10.2 Permission checklist

| Requirement           | Implementation                                     |
| --------------------- | -------------------------------------------------- |
| Dashboard access      | Check user role and dashboard ownership            |
| Widget access         | Check widget-level permission                      |
| DocType access        | Use Frappe permission-aware methods where possible |
| Company/branch access | Apply server-side filters                          |
| Drilldown access      | Re-check before returning record-level rows        |
| Export access         | Apply same permission rules as dashboard           |
| API abuse prevention  | Rate limiting and server-side validation           |
| Filter safety         | Validate filter keys and values server-side        |

## 10.3 Permission flow

```text
User opens dashboard
   ↓
Frappe validates session
   ↓
API checks dashboard permission
   ↓
API loads widgets allowed for user
   ↓
API applies company/branch/role filters
   ↓
API returns only permitted visual-ready data
   ↓
Frontend validates payload with Zod
   ↓
Visual renders
```

---

# 11. Performance strategy

## 11.1 Backend performance

| Problem               | Solution                                                |
| --------------------- | ------------------------------------------------------- |
| Slow dashboard load   | Batch widget calls or return initial dashboard payload  |
| Heavy aggregations    | Cache BI Snapshot by dashboard/filter/user              |
| Large tables          | Server-side pagination and filtering                    |
| Repeated KPI requests | Cache metric results per filter window                  |
| Drilldown cost        | Load details only on demand                             |
| Large export          | Use background job                                      |
| Multi-company data    | Add proper database indexes                             |
| Expensive joins       | Use prepared summary DocTypes or materialized snapshots |

## 11.2 Frontend performance

| Problem                      | Solution                         |
| ---------------------------- | -------------------------------- |
| Too many SVG marks           | Switch visual to Canvas renderer |
| Large table                  | Use virtualization               |
| Heavy filter changes         | Debounce updates                 |
| Expensive chart calculations | Memoized headless model hooks    |
| Large dashboard bundle       | Lazy-load visual packages        |
| Dense heatmap                | Canvas renderer                  |
| Heavy interactions           | Use requestAnimationFrame        |
| Re-render storm              | Central dashboard filter store   |

## 11.3 Rendering thresholds

| Data volume          | Recommendation                     |
| -------------------- | ---------------------------------- |
| 1–1,000 marks        | SVG                                |
| 1,000–20,000 marks   | SVG or Canvas depending on visual  |
| 20,000–100,000 marks | Canvas                             |
| 100,000+ marks       | Aggregate first, then render       |
| Millions of points   | Backend aggregation or WebGL later |

---

# 12. Quality and accessibility standards

## 12.1 Every component must support

| State                | Required            |
| -------------------- | ------------------- |
| Loading              | Yes                 |
| Empty data           | Yes                 |
| Error                | Yes                 |
| No permission        | Yes                 |
| Filtered state       | Yes                 |
| Stale data           | Yes                 |
| Drilldown available  | Yes, where relevant |
| Export available     | Later               |
| Keyboard interaction | Yes                 |
| Accessible label     | Yes                 |

## 12.2 Accessibility requirements

Every visual must include:

* Title
* Short summary
* Keyboard-accessible interactions
* Tooltip content available without hover only
* Table fallback or exportable data
* Text labels for severity/status
* No reliance on color alone
* Accessible mirror for Canvas-based visuals

## 12.3 Testing requirements

| Test type           | Tool                                          |
| ------------------- | --------------------------------------------- |
| Type tests          | TypeScript                                    |
| Schema tests        | Zod + Vitest                                  |
| Transform tests     | Vitest                                        |
| Component tests     | Testing Library                               |
| Browser tests       | Playwright                                    |
| Accessibility tests | axe-core                                      |
| Visual regression   | Storybook/Chromatic or Playwright screenshots |
| Mock API tests      | MSW                                           |

---

# 13. 90-day implementation roadmap

## Team assumption

Minimum practical team:

| Role                           | Count     |
| ------------------------------ | --------- |
| Frontend architect / tech lead | 1         |
| Visualization engineer         | 1–2       |
| Frappe backend engineer        | 1         |
| Design-system/UI engineer      | 1         |
| QA/test engineer               | Part-time |
| Product owner                  | 1         |

---

## Sprint 0: Product setup and technical alignment

**Duration:** Days 1–5

### Goals

* Finalize scope
* Confirm first dashboard use case
* Confirm Frappe version
* Confirm first data source
* Confirm branding direction
* Create engineering backlog

### Deliverables

| Deliverable          | Owner                     |
| -------------------- | ------------------------- |
| MVP visual list      | Product owner + tech lead |
| First demo domain    | Product owner             |
| Repository structure | Tech lead                 |
| Frappe app plan      | Frappe engineer           |
| Design direction     | UI/design-system engineer |
| Data contract v0     | Tech lead                 |

### Recommended first demo domain

Start with a **Sales + Revenue Executive Dashboard**, because it proves:

* KPI cards
* Trend charts
* Bar charts
* Tables
* Matrix
* Filters
* Forecast
* Anomalies
* Insight cards
* Recommendations

---

## Sprint 1: Foundation and contracts

**Duration:** Days 6–14

### Build

```text
packages/spec
packages/tokens
packages/theme
apps/storybook
```

### Tasks

| Task                    | Output                                     |
| ----------------------- | ------------------------------------------ |
| Create monorepo         | pnpm + Turborepo                           |
| Configure TypeScript    | Strict mode                                |
| Configure Vite          | Library mode                               |
| Configure Storybook     | Component docs shell                       |
| Create design tokens    | Color, spacing, typography, radius         |
| Create theme provider   | CSS variables                              |
| Create DataFrame schema | TypeScript + Zod                           |
| Create ChartSpec schema | TypeScript + Zod                           |
| Create formatters       | Currency, percentage, compact number, date |
| Add CI skeleton         | Build, typecheck, test                     |

### Exit criteria

* Storybook runs
* Packages compile
* DataFrame validates with Zod
* ChartSpec validates with Zod
* Theme variables load correctly
* One dummy KPI renders in Storybook

---

## Sprint 2: Headless core and layout primitives

**Duration:** Days 15–30

### Build

```text
packages/core
packages/svg
packages/layout
```

### Tasks

| Task                       | Output                         |
| -------------------------- | ------------------------------ |
| Chart surface primitive    | Responsive chart container     |
| Resize handling            | Container-aware charts         |
| Scale utilities            | Time, linear, band scales      |
| Tooltip model              | Shared tooltip state           |
| Legend model               | Shared legend control          |
| Selection model            | Hover, selected, active states |
| Filter store               | Shared dashboard filters       |
| Widget card                | Standard chart container       |
| Dashboard grid             | Responsive layout              |
| Filter bar                 | Date + dimension filters       |
| Empty/error/loading states | Shared components              |

### Exit criteria

* A chart shell can resize
* A widget card supports loading/error/empty states
* Filter bar can update dashboard state
* Tooltip and legend primitives work in Storybook

---

## Sprint 3: MVP KPI components

**Duration:** Days 31–38

### Build

```text
packages/charts-kpi
```

### Components

| Component                | Priority |
| ------------------------ | -------- |
| Metric Card              | P0       |
| Delta Card               | P0       |
| Target/Bullet Card       | P0       |
| Sparkline Card           | P0       |
| Status/Severity Card     | P0       |
| Progress/Attainment Card | P1       |
| Confidence Badge         | P2       |

### Exit criteria

Each KPI component must support:

* Loading state
* Empty state
* Error state
* Tooltip
* Accessible label
* Theme support
* Storybook usage example
* Storybook state examples

---

## Sprint 4: MVP BI visuals

**Duration:** Days 39–52

### Build

```text
packages/charts-bi
```

### Components

| Component               | Priority |
| ----------------------- | -------- |
| Line Chart              | P0       |
| Bar Chart               | P0       |
| Column Chart            | P0       |
| Stacked Bar Chart       | P0       |
| Area Chart              | P0       |
| Combo Chart             | P0       |
| Data Table              | P0       |
| Matrix/Pivot v1         | P0       |
| Waterfall Chart         | P0       |
| Funnel Chart            | P0       |
| Donut Chart             | P1       |
| Heatmap                 | P1       |
| Ranking Table with Bars | P1       |

### Exit criteria

A complete dashboard can be built using:

* KPI cards
* Line chart
* Bar chart
* Combo chart
* Matrix
* Table
* Waterfall
* Funnel
* Filters

---

## Sprint 5: Data science and decision intelligence v1

**Duration:** Days 53–66

### Build

```text
packages/charts-ds
packages/charts-ai
```

### Data science visuals

| Component        | Priority |
| ---------------- | -------- |
| Forecast Band    | P0       |
| Anomaly Timeline | P0       |
| Histogram        | P1       |
| Box Plot         | P1       |
| Control Chart    | P1       |

### AI decision visuals

| Component               | Priority |
| ----------------------- | -------- |
| Insight Card            | P0       |
| Smart Narrative Block   | P1       |
| Recommendation Card     | P1       |
| Evidence Drawer         | P2       |
| Driver/Influencer Chart | P1       |

### Exit criteria

Dashboard can answer:

* What happened?
* What changed?
* Where is the anomaly?
* What is forecasted?
* Why does it matter?
* What should the business do next?
* What evidence supports this?

---

## Sprint 6: Frappe integration v1

**Duration:** Days 67–78

### Build

```text
packages/adapters-frappe
frappe_app/aibyters_bi
```

### Frappe tasks

| Task                        | Output                 |
| --------------------------- | ---------------------- |
| Create Frappe app           | `aibyters_bi`          |
| Create Desk page            | `/app/decision-canvas` |
| Include JS/CSS assets       | via hooks              |
| Create dashboard API        | `get_dashboard`        |
| Create widget API           | `get_widget_data`      |
| Create metric API           | `get_metric`           |
| Create insight API          | `get_insight`          |
| Create BI Dashboard DocType | Metadata/layout        |
| Create BI Widget DocType    | Widget config          |
| Add permission checks       | User/company/role      |
| Mount React app             | Direct React embed     |
| Connect frontend to API     | Frappe adapter         |

### Exit criteria

A logged-in Frappe user can open the custom Decision Canvas page and see a real dashboard using Frappe data.

---

## Sprint 7: Hardening, documentation, and release candidate

**Duration:** Days 79–90

### Tasks

| Task                      | Output                          |
| ------------------------- | ------------------------------- |
| Storybook documentation   | Complete MVP visual docs        |
| Accessibility sweep       | WCAG-focused checks             |
| Performance benchmark     | Data volume thresholds          |
| Visual regression setup   | Screenshot tests                |
| Frappe permission testing | Role/company access tests       |
| Dashboard template        | Sales/revenue starter dashboard |
| API documentation         | Backend contract docs           |
| Developer guide           | How to add a new visual         |
| Release candidate         | v0.1 internal release           |

### Day-90 release criteria

By day 90, the system must have:

* Stable DataFrame contract
* Stable ChartSpec contract
* Theme/token system
* KPI visual package
* Core BI visual package
* Forecast/anomaly visuals
* AI insight/recommendation components
* Dashboard shell
* Storybook documentation
* Frappe Desk page integration
* Frappe APIs
* Permission-aware backend filtering
* One real working dashboard
* One reusable dashboard template

---

# 14. First real dashboard to build

Build this as the first proof dashboard:

## Executive Revenue Intelligence Dashboard

### Sections

| Section                | Components                           |
| ---------------------- | ------------------------------------ |
| Executive Summary      | KPI cards, delta cards, status cards |
| Revenue Trend          | Line chart, forecast band            |
| Revenue by Segment     | Bar chart, stacked bar               |
| Margin Movement        | Combo chart, waterfall               |
| Branch/Product Ranking | Ranking table with bars              |
| Sales Detail           | Data table                           |
| Anomaly Detection      | Anomaly timeline                     |
| Decision Layer         | Insight cards, recommendation cards  |
| Evidence               | Evidence drawer                      |

### First dashboard layout

```text
[Filter Bar: Date | Company | Branch | Product | Customer Group]

[Revenue KPI] [Gross Margin KPI] [Orders KPI] [Forecast KPI]

[Revenue Trend + Forecast]
[Revenue by Branch] [Revenue by Product]

[Margin Waterfall]
[Top/Bottom Branch Ranking]

[Anomaly Timeline]
[Insight Cards + Recommendations]

[Detailed Sales Table]
```

This dashboard proves the whole architecture without needing a full BI builder.

---

# 15. Six-month roadmap

## Month 1–3

Goal: Build the reusable platform foundation.

Deliverables:

* Visual library MVP
* Dashboard shell
* Frappe integration
* Sales/revenue dashboard
* Storybook docs
* Permission-aware APIs

## Month 4

Goal: Add operational analytics.

Build:

* Inventory dashboard
* Operations dashboard
* Heatmaps
* Control charts
* Ranking tables
* Advanced filters
* Export improvements

## Month 5

Goal: Add decision intelligence depth.

Build:

* Root-cause tree
* Driver analysis
* Evidence drawer v2
* Recommendation workflow
* Alert rules
* Snapshot caching
* User saved filters

## Month 6

Goal: Productize for client delivery.

Build:

* Dashboard templates by industry
* Theme builder
* Portal embedding
* Client-specific branding
* Starter Frappe app package
* Deployment documentation
* Internal sales/demo assets

---

# 16. Industry dashboard templates

## 16.1 Manufacturing template

| Visual               | Purpose                            |
| -------------------- | ---------------------------------- |
| OEE KPI Card         | Availability, performance, quality |
| Production Trend     | Output over time                   |
| Defect Pareto        | Top defect causes                  |
| Downtime Heatmap     | Machine/time downtime              |
| Control Chart        | Process stability                  |
| Scrap Waterfall      | Waste cost breakdown               |
| Recommendation Cards | Corrective actions                 |

## 16.2 Distribution template

| Visual                      | Purpose              |
| --------------------------- | -------------------- |
| Sales/Margin KPI            | Revenue and margin   |
| Inventory Velocity Matrix   | Fast/slow movers     |
| Stockout Risk Card          | Risk alerts          |
| Branch Ranking              | Branch performance   |
| Margin Leakage Waterfall    | Pricing/cost leakage |
| Customer Wallet Card        | Growth opportunity   |
| Delivery Exception Timeline | Service leakage      |

## 16.3 Hospitality template

| Visual                 | Purpose                     |
| ---------------------- | --------------------------- |
| Occupancy KPI          | Occupancy health            |
| ADR/RevPAR Cards       | Hotel revenue metrics       |
| Booking Pace Chart     | Demand trend                |
| Occupancy Forecast     | Future occupancy            |
| Room Readiness Board   | Operational status          |
| Add-on Revenue Tracker | Upsell capture              |
| Guest Value Card       | Returning/high-value guests |

## 16.4 Finance template

| Visual                     | Purpose              |
| -------------------------- | -------------------- |
| Revenue Forecast           | Expected revenue     |
| Expense Variance Waterfall | Budget vs actual     |
| Cash Flow Timeline         | Cash movement        |
| Risk Score Distribution    | Risk profile         |
| Anomaly Ledger             | Unusual transactions |
| Portfolio Heatmap          | Exposure analysis    |

## 16.5 Healthcare/revenue cycle template

| Visual                     | Purpose                 |
| -------------------------- | ----------------------- |
| Claims Aging Matrix        | AR by age bucket        |
| Denial Root Cause Chart    | Denial drivers          |
| Recovery Worklist          | Prioritized claims      |
| Payer Performance Board    | Reimbursement analysis  |
| Compliance Exception Panel | Risk alerts             |
| Evidence Drawer            | Claim-level source data |

---

# 17. Engineering backlog

## 17.1 Epic 1: Repository and platform setup

| Ticket     | Description                       |
| ---------- | --------------------------------- |
| AB-VIS-001 | Create pnpm + Turborepo monorepo  |
| AB-VIS-002 | Configure TypeScript strict mode  |
| AB-VIS-003 | Configure Vite library builds     |
| AB-VIS-004 | Configure Storybook               |
| AB-VIS-005 | Configure Vitest                  |
| AB-VIS-006 | Configure Playwright              |
| AB-VIS-007 | Configure Changesets              |
| AB-VIS-008 | Create package export conventions |

## 17.2 Epic 2: Spec and contracts

| Ticket      | Description                            |
| ----------- | -------------------------------------- |
| AB-SPEC-001 | Define Primitive, FieldMeta, DataFrame |
| AB-SPEC-002 | Define ChartSpec base type             |
| AB-SPEC-003 | Define KPI specs                       |
| AB-SPEC-004 | Define BI chart specs                  |
| AB-SPEC-005 | Define forecast/anomaly specs          |
| AB-SPEC-006 | Define insight/recommendation specs    |
| AB-SPEC-007 | Add Zod validation                     |
| AB-SPEC-008 | Create fixture datasets                |

## 17.3 Epic 3: Design system

| Ticket    | Description                         |
| --------- | ----------------------------------- |
| AB-DS-001 | Define AI Byters color tokens       |
| AB-DS-002 | Define typography tokens            |
| AB-DS-003 | Define spacing/radius/shadow tokens |
| AB-DS-004 | Create CSS variable output          |
| AB-DS-005 | Build ThemeProvider                 |
| AB-DS-006 | Add light theme                     |
| AB-DS-007 | Add dark theme later                |
| AB-DS-008 | Add client theme override model     |

## 17.4 Epic 4: Core visualization logic

| Ticket      | Description                       |
| ----------- | --------------------------------- |
| AB-CORE-001 | Create responsive chart container |
| AB-CORE-002 | Add scale utilities               |
| AB-CORE-003 | Add axis model                    |
| AB-CORE-004 | Add tooltip state                 |
| AB-CORE-005 | Add legend state                  |
| AB-CORE-006 | Add formatter utilities           |
| AB-CORE-007 | Add interaction store             |
| AB-CORE-008 | Add ResizeObserver wrapper        |

## 17.5 Epic 5: KPI visuals

| Ticket     | Description        |
| ---------- | ------------------ |
| AB-KPI-001 | Metric Card        |
| AB-KPI-002 | Delta Card         |
| AB-KPI-003 | Target/Bullet Card |
| AB-KPI-004 | Sparkline Card     |
| AB-KPI-005 | Severity Card      |
| AB-KPI-006 | Progress Card      |
| AB-KPI-007 | Confidence Badge   |

## 17.6 Epic 6: BI visuals

| Ticket    | Description       |
| --------- | ----------------- |
| AB-BI-001 | Line Chart        |
| AB-BI-002 | Bar Chart         |
| AB-BI-003 | Column Chart      |
| AB-BI-004 | Stacked Bar Chart |
| AB-BI-005 | Area Chart        |
| AB-BI-006 | Combo Chart       |
| AB-BI-007 | Data Table        |
| AB-BI-008 | Matrix Table v1   |
| AB-BI-009 | Waterfall Chart   |
| AB-BI-010 | Funnel Chart      |
| AB-BI-011 | Heatmap           |
| AB-BI-012 | Ranking Table     |

## 17.7 Epic 7: Data science visuals

| Ticket     | Description      |
| ---------- | ---------------- |
| AB-DSV-001 | Forecast Band    |
| AB-DSV-002 | Anomaly Timeline |
| AB-DSV-003 | Histogram        |
| AB-DSV-004 | Box Plot         |
| AB-DSV-005 | Control Chart    |

## 17.8 Epic 8: AI decision components

| Ticket    | Description           |
| --------- | --------------------- |
| AB-AI-001 | Insight Card          |
| AB-AI-002 | Smart Narrative Block |
| AB-AI-003 | Recommendation Card   |
| AB-AI-004 | Evidence Drawer       |
| AB-AI-005 | Driver Chart          |
| AB-AI-006 | Alert Feed            |

## 17.9 Epic 9: Frappe integration

| Ticket    | Description                          |
| --------- | ------------------------------------ |
| AB-FR-001 | Create `aibyters_bi` Frappe app      |
| AB-FR-002 | Add hooks for JS/CSS bundles         |
| AB-FR-003 | Create Decision Canvas Desk page     |
| AB-FR-004 | Create BI Dashboard DocType          |
| AB-FR-005 | Create BI Widget DocType             |
| AB-FR-006 | Create get_dashboard API             |
| AB-FR-007 | Create get_widget_data API           |
| AB-FR-008 | Create Frappe frontend adapter       |
| AB-FR-009 | Add permission checks                |
| AB-FR-010 | Connect first dashboard to real data |

---

# 18. Definition of done

Every visual is only complete when it has:

* TypeScript types
* Zod schema where needed
* Storybook usage story
* Storybook loading state
* Storybook empty state
* Storybook error state
* Theme support
* Accessible label
* Keyboard behavior where applicable
* Unit tests for transforms
* Visual regression snapshot
* Responsive behavior
* Frappe fixture example
* Documented data schema
* Documented limitations

Every Frappe API is only complete when it has:

* Permission check
* Filter validation
* Error handling
* Typed response shape
* Example response
* Test with allowed user
* Test with restricted user
* Server-side pagination where needed
* No unrestricted raw SQL exposure

---

# 19. Risks and mitigations

| Risk                                  | Impact                     | Mitigation                                             |
| ------------------------------------- | -------------------------- | ------------------------------------------------------ |
| Building too many visuals too early   | Low quality, slow progress | Complete MVP tier first                                |
| Copying Power BI too closely          | Weak differentiation       | Position as decision intelligence, not dashboard clone |
| Letting ECharts/Plotly define the API | Vendor lock-in             | Keep them behind adapters                              |
| Frappe returns raw inconsistent data  | Fragile frontend           | Enforce DataFrame + ChartSpec                          |
| Permissions handled in frontend       | Security risk              | Apply all permissions server-side                      |
| SVG performance issues                | Slow dense charts          | Switch dense visuals to Canvas                         |
| No documentation                      | Hard to reuse              | Storybook is mandatory                                 |
| No accessibility standard             | Enterprise weakness        | WCAG-focused component rules                           |
| Overbuilding backend                  | Delays visual product      | Keep Frappe APIs controlled and simple                 |
| No real demo dashboard                | Hard to sell internally    | Build revenue dashboard first                          |

---

# 20. Final recommendation

The most practical implementation path is:

```text
Build a reusable visual intelligence library first.
Integrate it into Frappe as a custom app second.
Add decision intelligence components third.
Only later build self-service BI-builder features.
```

The first 90-day target should be:

> A production-ready reusable visual system with 20–25 strong components, a working Frappe Desk integration, typed API contracts, Storybook documentation, and one real AI Byters decision dashboard showing KPIs, trends, tables, forecasts, anomalies, insights, recommendations, and evidence.

That gives AI Byters a real reusable asset, not just a one-off dashboard project.
