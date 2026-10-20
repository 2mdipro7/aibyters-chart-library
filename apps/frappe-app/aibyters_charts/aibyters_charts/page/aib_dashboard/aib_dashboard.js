frappe.pages["aib-dashboard"].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({ parent: wrapper, title: __("Dashboards"), single_column: true });
  wrapper.aib = { page, mount: null, current: null };
  const $body = $(page.body);
  $body.html('<div class="aib-dashboard-root" style="min-height: 60vh"></div>');

  page.set_secondary_action(__("Refresh"), () => render(wrapper, wrapper.aib.current, true), "refresh");
  page.add_menu_item(__("Edit dashboard"), () => wrapper.aib.current && frappe.set_route("Form", "AIB Dashboard", wrapper.aib.current));
  page.add_menu_item(__("New dashboard"), () => frappe.new_doc("AIB Dashboard"));
};

frappe.pages["aib-dashboard"].on_page_show = function (wrapper) {
  const name = frappe.get_route()[1];
  render(wrapper, name, false);
};

function render(wrapper, name, force) {
  const target = wrapper.querySelector(".aib-dashboard-root");
  if (!name) {
    frappe.xcall("aibyters_charts.api.list_dashboards").then((rows) => {
      wrapper.aib.page.set_title(__("Dashboards"));
      const items = rows
        .map((r) => `<a class="list-group-item list-group-item-action" href="/app/aib-dashboard/${encodeURIComponent(r.name)}"><b>${frappe.utils.escape_html(r.title)}</b><div class="text-muted small">${frappe.utils.escape_html(r.description || "")}</div></a>`)
        .join("");
      target.innerHTML = rows.length
        ? `<div class="list-group" style="max-width: 720px">${items}</div>`
        : `<div class="text-muted">${__("No dashboards yet.")} <a href="/app/aib-dashboard/new">${__("Create one")}</a></div>`;
    });
    return;
  }
  if (wrapper.aib.current === name && !force) return;
  wrapper.aib.current = name;
  const boot = (frappe.boot && frappe.boot.aibyters_charts) || {};
  const js = boot.bundle || "/assets/aibyters_charts/dist/aib-dashboard.js";
  const css = boot.css || "/assets/aibyters_charts/dist/aib-dashboard.css";
  frappe.require([css, js]).then(() => {
    window.aibyters.mountDashboardByName(target, name, {
      onTitle: (title) => wrapper.aib.page.set_title(title),
    });
  });
}
