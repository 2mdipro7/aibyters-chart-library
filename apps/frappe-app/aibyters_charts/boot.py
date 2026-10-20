import frappe

from aibyters_charts.license import get_license_state


def extend_bootinfo(bootinfo):
    try:
        version = frappe.get_attr("aibyters_charts.__version__")
        # dist/ files are committed (not esbuild-hashed), so bust caches with the app version.
        bootinfo.aibyters_charts = {
            "license": get_license_state(),
            "bundle": f"/assets/aibyters_charts/dist/aib-dashboard.js?v={version}",
            "css": f"/assets/aibyters_charts/dist/aib-dashboard.css?v={version}",
            "version": version,
        }
    except Exception:
        frappe.log_error(title="aibyters_charts boot failed")
