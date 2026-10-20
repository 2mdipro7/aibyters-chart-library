# AI Byters Charts for Frappe / ERPNext

Executive-grade dashboards inside Frappe Desk: 60+ responsive chart widgets (KPI tiles, ranked
bars, waffles, diverging bars, status strips, waterfalls, donuts with collision-free labels, and
more) that inherit your site's theme, respect DocType permissions, and work on phones, tablets
and wall displays.

## Features

- **AIB Dashboard** DocType: compose dashboards from Reports, DocTypes, Dashboard Charts,
  Number Cards or server-side aggregations with a JSON spec — no code.
- **Desk page** `/app/aib-dashboard/<name>` and **Workspace blocks** (Custom HTML Block) so a
  dashboard can live beside standard Desk widgets.
- **Theme-aware**: light, dark and custom Desk themes map automatically to the chart tokens.
- **Permission-aware**: every data source runs as the logged-in user through `frappe.get_list`
  / `query_report.run`; no bypass.
- **Export** CSV/XLSX per widget, print-friendly, reduced-motion aware, WCAG-minded.
- **Plans**: the free tier includes 3 dashboards with 6 widgets each. Paid plans add unlimited
  dashboards and widgets, white-labelling and priority support; on Frappe Cloud the plan is
  detected automatically, elsewhere a licence key from AI Byters unlocks it.

## Quick start

1. Open **AI Byters Charts › AIB Dashboard › New**.
2. Give it a title, paste or build a spec (the form ships with a "Load example" button), save.
3. Open it from the workspace card or `/app/aib-dashboard/<name>`.
4. Tick **Create workspace block** to drop it into any Workspace via *Edit › Add Block › Custom HTML Block*.

## Spec example

```json
{
  "title": "Sales overview",
  "columns": 3,
  "filters": [{ "fieldname": "company", "label": "Company", "fieldtype": "Link", "options": "Company" }],
  "widgets": [
    { "id": "rev", "type": "metric", "title": "Revenue (MTD)", "format": "currency", "currency": "USD",
      "source": { "kind": "query", "doctype": "Sales Invoice", "measure": "grand_total", "aggregate": "sum", "filters": { "docstatus": 1 } } },
    { "id": "trend", "type": "line", "title": "Revenue by month", "span": 2, "format": "currency",
      "source": { "kind": "query", "doctype": "Sales Invoice", "dimension": "posting_date", "time_grain": "month", "measure": "grand_total", "filters": { "docstatus": 1 } } },
    { "id": "top", "type": "ranked_bar", "title": "Top customers", "format": "currency",
      "source": { "kind": "query", "doctype": "Sales Invoice", "dimension": "customer", "measure": "grand_total", "order": "desc", "limit": 8, "filters": { "docstatus": 1 } },
      "drilldown": "/app/sales-invoice?customer={name}" }
  ]
}
```

## License

MIT — see `license.txt`. The React chart components are compiled into `public/dist` and
distributed with this app under the same licence; the component source packages
(`@aibyters/*`) are licensed separately for use in other platforms.
