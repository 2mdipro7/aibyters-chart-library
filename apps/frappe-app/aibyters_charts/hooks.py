app_name = "aibyters_charts"
app_title = "AI Byters Charts"
app_publisher = "AI Byters"
app_description = "Executive-grade dashboards and 60+ responsive chart widgets for Frappe / ERPNext"
app_email = "aibytersdev@gmail.com"
app_license = "mit"
app_logo_url = "/assets/aibyters_charts/images/logo.svg"
app_icon = "octicon octicon-graph"
app_color = "#6366f1"

required_apps = ["frappe"]

# The React bundle is NOT included globally (keeps every other Desk page light); the Desk page
# and workspace blocks load it on demand with frappe.require().
# app_include_js = []

# Nothing is injected into website pages either.
# web_include_js = []

after_install = "aibyters_charts.install.after_install"
after_migrate = "aibyters_charts.install.after_migrate"

scheduler_events = {
    "daily": ["aibyters_charts.license.refresh_license_status"],
}

# Fixtures keep the demo workspace and example dashboard in sync across installs.
fixtures = [
    {"dt": "Workspace", "filters": [["name", "in", ["AI Byters Charts"]]]},
]

# Desk: register the dashboard page as a standard page.
standard_pages = ["aib-dashboard"]

has_permission = {"AIB Dashboard": "aibyters_charts.aibyters_charts.doctype.aib_dashboard.aib_dashboard.has_permission"}

# Boot info exposes licence state so the bundle can decide what to render without a round trip.
extend_bootinfo = "aibyters_charts.boot.extend_bootinfo"

# Treat the JSON spec safely in Desk search.
global_search_doctypes = {"Default": [{"doctype": "AIB Dashboard"}]}
