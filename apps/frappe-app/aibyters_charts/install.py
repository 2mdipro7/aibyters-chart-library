import json
import os

import frappe


def after_install():
    _ensure_settings()
    _ensure_example_dashboard()


def after_migrate():
    _ensure_settings()


def _ensure_settings():
    if not frappe.db.exists("AIB Settings", "AIB Settings"):
        frappe.get_doc({"doctype": "AIB Settings"}).insert(ignore_permissions=True)


def _ensure_example_dashboard():
    if frappe.db.exists("AIB Dashboard", {"is_example": 1}):
        return
    path = os.path.join(os.path.dirname(__file__), "examples", "sales_overview.json")
    if not os.path.exists(path):
        return
    with open(path) as f:
        spec = json.load(f)
    frappe.get_doc(
        {
            "doctype": "AIB Dashboard",
            "title": spec["title"],
            "spec": json.dumps(spec, indent=2),
            "is_example": 1,
            "is_public": 1,
        }
    ).insert(ignore_permissions=True)
