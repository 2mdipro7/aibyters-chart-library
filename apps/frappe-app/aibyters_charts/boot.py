import frappe

from aibyters_charts.license import get_license_state


def extend_bootinfo(bootinfo):
    try:
        bootinfo.aibyters_charts = {
            "license": get_license_state(),
            "bundle": "/assets/aibyters_charts/dist/aib-dashboard.js",
            "css": "/assets/aibyters_charts/dist/aib-dashboard.css",
            "version": frappe.get_attr("aibyters_charts.__version__"),
        }
    except Exception:
        frappe.log_error(title="aibyters_charts boot failed")
