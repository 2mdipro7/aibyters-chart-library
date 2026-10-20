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
    """Installs every bundled example once; existing examples are left untouched."""
    folder = os.path.join(os.path.dirname(__file__), "examples")
    if not os.path.isdir(folder):
        return
    for fname in sorted(os.listdir(folder)):
        if not fname.endswith(".json"):
            continue
        with open(os.path.join(folder, fname)) as f:
            spec = json.load(f)
        if frappe.db.exists("AIB Dashboard", spec["title"]):
            continue
        # Skip examples whose DocTypes are not installed (e.g. HRMS not present).
        needed = {w.get("source", {}).get("doctype") for w in spec.get("widgets", []) if w.get("source", {}).get("doctype")}
        if any(not frappe.db.exists("DocType", dt) for dt in needed):
            continue
        frappe.get_doc(
            {"doctype": "AIB Dashboard", "title": spec["title"], "description": spec.get("description"), "spec": json.dumps(spec, indent=2), "is_example": 1, "is_public": 1}
        ).insert(ignore_permissions=True)
