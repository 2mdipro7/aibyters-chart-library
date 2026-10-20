"""Whitelisted endpoints used by the dashboard bundle.

Every query runs through ``frappe.get_list`` so DocType permissions, user permissions and
``permission_query_conditions`` apply exactly as in a List View. Nothing here uses
``ignore_permissions``.
"""
from __future__ import annotations

import json
from collections import OrderedDict

import frappe
from frappe import _
from frappe.utils import add_to_date, getdate, nowdate

from aibyters_charts.license import enforce_widget_limit, get_license_state

AGGREGATES = {"sum": "sum", "count": "count", "avg": "avg", "min": "min", "max": "max"}
GRAINS = {"day", "week", "month", "quarter", "year"}


def _spec(spec):
    if isinstance(spec, str):
        spec = json.loads(spec)
    if not isinstance(spec, dict):
        frappe.throw(_("Invalid query spec"))
    return spec


def _check_field(doctype: str, fieldname: str | None):
    if not fieldname:
        return
    meta = frappe.get_meta(doctype)
    if fieldname in ("name", "creation", "modified", "owner", "docstatus", "idx"):
        return
    if not meta.get_field(fieldname):
        frappe.throw(_("Field {0} does not exist on {1}").format(fieldname, doctype))


def _bucket(value, grain: str):
    d = getdate(value)
    if grain == "day":
        return d.strftime("%Y-%m-%d")
    if grain == "week":
        return f"{d.isocalendar()[0]}-W{d.isocalendar()[1]:02d}"
    if grain == "month":
        return d.strftime("%Y-%m")
    if grain == "quarter":
        return f"{d.year}-Q{(d.month - 1) // 3 + 1}"
    return str(d.year)


@frappe.whitelist()
def query(spec):
    """Server-side aggregation: group ``doctype`` by ``dimension`` (and optional ``series``),
    aggregating ``measure`` with ``aggregate``; optional ``time_grain`` buckets dates.

    Returns ``{"rows": [{"dimension": ..., "series": ..., "value": ...}]}`` or ``{"value": n}``
    when no dimension is given.
    """
    spec = _spec(spec)
    doctype = spec.get("doctype")
    if not doctype:
        frappe.throw(_("doctype is required"))
    frappe.has_permission(doctype, "read", throw=True)

    dimension = spec.get("dimension")
    series = spec.get("series")
    measure = spec.get("measure")
    aggregate = AGGREGATES.get(spec.get("aggregate") or ("count" if not measure else "sum"))
    grain = spec.get("time_grain")
    if grain and grain not in GRAINS:
        frappe.throw(_("Invalid time grain"))
    for f in (dimension, series, measure):
        _check_field(doctype, f)

    value_expr = f"{aggregate}(`{measure}`)" if measure else "count(name)"
    fields = [f"{value_expr} as value"]
    group_by = []
    if dimension:
        fields.append(f"`{dimension}` as dimension")
        group_by.append(f"`{dimension}`")
    if series:
        fields.append(f"`{series}` as series")
        group_by.append(f"`{series}`")

    filters = spec.get("filters") or {}
    rows = frappe.get_list(
        doctype,
        fields=fields,
        filters=filters,
        group_by=", ".join(group_by) if group_by else None,
        order_by=f"value {spec.get('order')}" if spec.get("order") in ("asc", "desc") and not grain else None,
        limit_page_length=int(spec.get("limit") or 0) if not grain else 0,
    )

    if not dimension:
        return {"value": rows[0]["value"] if rows else 0}

    if grain:
        buckets: "OrderedDict[tuple, float]" = OrderedDict()
        for r in rows:
            if r.get("dimension") in (None, ""):
                continue
            key = (_bucket(r["dimension"], grain), r.get("series"))
            buckets[key] = (buckets.get(key) or 0) + (r["value"] or 0)
        rows = [{"dimension": k[0], "series": k[1], "value": v} for k, v in sorted(buckets.items(), key=lambda kv: kv[0][0])]
        if spec.get("limit"):
            rows = rows[-int(spec["limit"]) :]
    return {"rows": rows}


@frappe.whitelist()
def kpi_strip(doctype, measure, date_field="posting_date", filters=None):
    """Four tiles: this month, last month, year-to-date, and count of documents, with deltas."""
    frappe.has_permission(doctype, "read", throw=True)
    _check_field(doctype, measure)
    _check_field(doctype, date_field)
    base = dict(json.loads(filters) if isinstance(filters, str) else (filters or {}))
    base.setdefault("docstatus", 1)
    today = getdate(nowdate())
    month_start = today.replace(day=1)
    last_month_start = add_to_date(month_start, months=-1)
    year_start = today.replace(month=1, day=1)

    def total(start, end=None):
        f = dict(base)
        f[date_field] = [">=", start] if end is None else ["between", [start, end]]
        r = frappe.get_list(doctype, fields=[f"sum(`{measure}`) as v", "count(name) as n"], filters=f)
        return (r[0]["v"] or 0, r[0]["n"] or 0) if r else (0, 0)

    this_m, this_n = total(month_start)
    last_m, _n = total(last_month_start, add_to_date(month_start, days=-1))
    ytd, ytd_n = total(year_start)
    delta = (this_m - last_m) / last_m if last_m else None
    return [
        {"label": _("This month"), "value": this_m, "delta": delta},
        {"label": _("Last month"), "value": last_m},
        {"label": _("Year to date"), "value": ytd},
        {"label": _("Documents (YTD)"), "value": ytd_n, "format": "count"},
    ]


@frappe.whitelist()
def get_dashboard(name):
    """Returns the spec for a dashboard the user may read, plus licence state."""
    doc = frappe.get_doc("AIB Dashboard", name)
    doc.check_permission("read")
    spec = json.loads(doc.spec or "{}")
    spec = enforce_widget_limit(spec)
    return {"name": doc.name, "title": doc.title, "spec": spec, "license": get_license_state(), "modified": doc.modified}


@frappe.whitelist()
def list_dashboards():
    return frappe.get_list("AIB Dashboard", fields=["name", "title", "description", "is_public", "modified"], order_by="title asc")


@frappe.whitelist()
def validate_spec(spec):
    """Light server-side validation used by the form's 'Validate' button."""
    spec = _spec(spec)
    errors = []
    if not spec.get("title"):
        errors.append(_("title is required"))
    widgets = spec.get("widgets") or []
    if not isinstance(widgets, list) or not widgets:
        errors.append(_("at least one widget is required"))
    ids = set()
    for w in widgets:
        wid = w.get("id")
        if not wid or wid in ids:
            errors.append(_("widget ids must be unique and non-empty"))
        ids.add(wid)
        src = w.get("source") or {}
        if src.get("kind") in ("query", "list") and src.get("doctype") and not frappe.has_permission(src["doctype"], "read"):
            errors.append(_("You do not have read access to {0} (widget {1})").format(src["doctype"], wid))
        if src.get("kind") == "report" and src.get("name") and not frappe.db.exists("Report", src["name"]):
            errors.append(_("Report {0} not found (widget {1})").format(src["name"], wid))
    return {"ok": not errors, "errors": errors}
