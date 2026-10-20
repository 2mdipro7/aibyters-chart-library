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
- **Licensing**: free tier (3 dashboards, 6 widgets each); paid plans unlock unlimited
  dashboards, all chart packs and white-labelling (Frappe Cloud plan or licence key).

## Install

```bash
bench get-app https://github.com/2mdipro7/aibyters-chart-library --branch main --subdir apps/frappe-app
bench --site yoursite install-app aibyters_charts
```

On Frappe Cloud: install from the Marketplace and pick a plan.

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

Proprietary. See `license.txt`. A licence key or Frappe Cloud Marketplace plan is required for
the paid tier; the free tier needs no key.
