# Use-case dashboards

Six complete dashboards ship in the playground (`/#/dashboards/...`) and, as ERPNext-backed JSON
specs, inside the Frappe app (`apps/frappe-app/aibyters_charts/examples/`). Each mixes 9–12
visual types chosen for the question the audience actually asks.

| Dashboard | Audience | Visuals | Playground | Frappe example |
|---|---|---|---|---|
| Executive Finance | CFO / Board | Metric strip, waterfall, dual-axis combo, donut, ranked bars, forecast band, bullet, stacked area, gauge, sparkline, table | `/dashboards/finance` | `finance_overview.json` |
| Sales & Pipeline | CRO | Funnel, Pareto, slope, stacked area, heatmap, lollipop, gauge, status strip, bars, pie | `/dashboards/sales` | `sales_overview.json` |
| Operations & Supply Chain | COO | Control chart, anomaly timeline, progress rings, diverging bars, treemap, histogram, box plot, paired bars, Sankey, stacked columns | `/dashboards/operations` | `inventory_operations.json` |
| People & HR | CHRO | Waffle, composition band, dumbbell, grouped columns, radar, polar area, timeline, risk matrix, line | `/dashboards/people` | `people_hr.json` |
| Reconciliation & Controls | Ops control | Status donut, ranked bars, diverging bars, waffle, paired bars, priority rings, status strip, scatter, heatmap, line, table | `/dashboards/reconciliation` | — (see `sales_overview.json` for the pattern) |
| SaaS Growth | CEO / Product | Stacked area, line, radial bars, Pareto, cohort heatmap, 2×2 positioning, SWOT, sparkline, target, AI insight & recommendation | `/dashboards/saas` | `projects_support.json` (service variant) |

Screenshots (1400 px, dark theme): `finance.png`, `sales.png`, `operations.png`, `people.png`, `reconciliation.png`, `saas.png`.

## Design rules applied

- One metric strip on top answers "how are we doing" before any chart.
- Every chart answers a question in its title ("Which assets account for the gap?"), not a data name.
- Part-to-whole only when there are ≤ 6 parts (donut, waffle, composition band); ranked bars otherwise.
- Comparisons between two sources use paired bars, dumbbells or diverging bars, never two pies.
- Time uses lines/areas/columns; status over time uses the status strip; process stability uses control charts.
- Tables close each dashboard with the drill-down records.
- All widgets are responsive: the 4-column grid collapses to 1 column on phones and spans clamp automatically.
