# @aibyters/embed

One script and one stylesheet for pages that are not React (Jinja, Frappe, plain HTML). It bundles React,
Recharts, the theme and `@aibyters/renderer`, and exposes `window.AIBytersCharts`.

```html
<link rel="stylesheet" href="aibyters-charts.css">
<script src="aibyters-charts.js"></script>
<div id="chart"></div>
<script>
  AIBytersCharts.render(document.getElementById("chart"), {
    spec: { kind: "column", title: "Revenue by room", encodings: { x: "room", y: "revenue" } },
    frame: {
      fields: [
        { key: "room", label: "Room", type: "string" },
        { key: "revenue", label: "Revenue", type: "number", format: "currency" },
      ],
      rows: [{ room: "101", revenue: 12500 }, { room: "102", revenue: 9000 }],
      meta: { currencySymbol: "৳" },
    },
    theme: "dark",                                   // or "light"
    overrides: { "--vi-color-surface-card": "#1e293b" }, // match the host page
  });
</script>
```

`render(el, options)` returns the plan (`{ component, props, warnings }`); call it again on the same element
to redraw, and `unmount(el)` to remove the chart. Invalid specs or frames throw before anything is drawn.

## Drawing a component directly

Hosts that already hold a figure in their own shape (an explicit KPI value with stale history, a
period-over-period delta they computed themselves, a forecast with real bounds) can bypass the planner:

```js
AIBytersCharts.renderComponent(el, {
  component: "DeltaCard",               // any name in AIBytersCharts.componentNames()
  props: { title: "Members", value: 8120, delta: 0.042, valueFormatter: (v) => v.toLocaleString() },
  theme: "light",
  overrides: { "--vi-color-surface-card": "var(--card-bg)" },
});
```

The planner's components are all available, plus `ForecastBand`, `HeatmapChart`, `RiskMatrixChart` and
`BulletChart`, which no spec kind selects yet. An element has exactly one React root whichever of
`render` / `renderComponent` drew it last; `isMounted(el)` says whether it holds a chart.

Build with `pnpm --filter @aibyters/embed build`; the output is `dist/aibyters-charts.js` and
`dist/aibyters-charts.css`.
