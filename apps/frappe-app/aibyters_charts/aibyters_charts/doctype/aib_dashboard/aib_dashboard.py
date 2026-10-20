import json

import frappe
from frappe import _
from frappe.model.document import Document

from aibyters_charts.license import check_dashboard_limit

BLOCK_SCRIPT = """
(function () {
  // Custom HTML Blocks render inside an open shadow root (frappe.create_shadow_element):
  // stylesheets loaded into <head> do not reach it, so link the chart CSS inside root_element.
  const el = root_element;
  const boot = (frappe.boot && frappe.boot.aibyters_charts) || {};
  const js = boot.bundle || '/assets/aibyters_charts/dist/aib-dashboard.js';
  const css = boot.css || '/assets/aibyters_charts/dist/aib-dashboard.css';
  el.innerHTML = '<link rel="stylesheet" href="' + css + '"><div class="aib-block" style="min-height:120px"></div>';
  const target = el.querySelector('.aib-block');
  frappe.require(js).then(function () {
    window.aibyters.mountDashboardByName(target, %(name)s, { hideHeader: false, compact: true });
  });
})();
"""


class AIBDashboard(Document):
    def validate(self):
        self._validate_spec()
        if self.is_new() and not self.is_example:
            check_dashboard_limit()

    def _validate_spec(self):
        try:
            spec = json.loads(self.spec) if isinstance(self.spec, str) else (self.spec or {})
        except json.JSONDecodeError as e:
            frappe.throw(_("Spec is not valid JSON: {0}").format(e))
        if not isinstance(spec, dict) or not spec.get("widgets"):
            frappe.throw(_("Spec must be an object with a non-empty 'widgets' array"))
        spec.setdefault("title", self.title)
        spec.setdefault("version", 1)
        self.spec = json.dumps(spec, indent=2)

    def on_update(self):
        if self.create_workspace_block:
            self._ensure_custom_block()

    def _ensure_custom_block(self):
        if not frappe.db.exists("DocType", "Custom HTML Block"):
            return
        name = f"AIB: {self.title}"
        script = BLOCK_SCRIPT % {"name": json.dumps(self.name)}
        if frappe.db.exists("Custom HTML Block", name):
            block = frappe.get_doc("Custom HTML Block", name)
            block.script = script
            block.save(ignore_permissions=True)
        else:
            frappe.get_doc(
                {
                    "doctype": "Custom HTML Block",
                    "name": name,
                    "html": '<div class="aib-block-root"></div>',
                    "script": script,
                    "style": ".aib-block-root{min-height:120px}",
                    "private": 0,
                }
            ).insert(ignore_permissions=True)

    def on_trash(self):
        name = f"AIB: {self.title}"
        if frappe.db.exists("Custom HTML Block", name):
            frappe.delete_doc("Custom HTML Block", name, ignore_permissions=True)

    @frappe.whitelist()
    def example_spec(self):
        import os

        path = os.path.join(frappe.get_app_path("aibyters_charts"), "examples", "sales_overview.json")
        with open(path) as f:
            return f.read()


def has_permission(doc, ptype="read", user=None):
    """Role restriction: if roles are set, only those roles (and System Manager) may read."""
    user = user or frappe.session.user
    if ptype != "read" or "System Manager" in frappe.get_roles(user):
        return True
    if not getattr(doc, "roles", None):
        return True
    allowed = {r.role for r in doc.roles}
    return bool(allowed & set(frappe.get_roles(user)))
