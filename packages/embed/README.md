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

Build with `pnpm --filter @aibyters/embed build`; the output is `dist/aibyters-charts.js` and
`dist/aibyters-charts.css`.
