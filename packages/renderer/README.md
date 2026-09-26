# @aibyters/renderer

Draws a `ChartSpec` over a `DataFrame` (both from `@aibyters/spec`) with the matching component from
`charts-kpi`, `charts-bi` and `charts-ai`. This is the piece that lets a backend, or a model, answer with
data plus a spec and have the front end pick the visual.

```tsx
import { SpecChart } from "@aibyters/renderer";

<SpecChart
  spec={{ kind: "column", title: "Revenue by room", encodings: { x: "room", y: "revenue" } }}
  frame={{
    fields: [
      { key: "room", label: "Room", type: "string", role: "dimension" },
      { key: "revenue", label: "Revenue", type: "number", role: "measure", format: "currency" },
    ],
    rows: [{ room: "101", revenue: 12500 }],
    meta: { currency: "BDT", currencySymbol: "৳" },
  }}
/>
```

- `planChart(spec, frame)` is the pure part: it returns `{ component, props, warnings }`. Missing columns
  and kinds the renderer does not draw yet fall back to a `DataTable`, with the reason in `warnings`, so a
  wrong spec still shows the data.
- Money uses `frame.meta.currencySymbol` (or the `currencySymbol` prop) and the frame's `locale` for
  grouping, so a Bangladeshi hotel sees `৳12,500` and `৳12.5K` on axes rather than `$`.
- `registerComponent(name, Component)` lets a host add or replace a component a plan names.

Kinds drawn today: metric, delta, target, sparkline, progress, severity, line, area, bar, column, combo
(as grouped columns), pie, donut, funnel, waterfall, table, insight, recommendation. Matrix, forecast and
anomaly fall back to a table.
