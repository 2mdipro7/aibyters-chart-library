frappe.ui.form.on("AIB Dashboard", {
  refresh(frm) {
    if (!frm.is_new()) {
      frm.add_custom_button(__("Open dashboard"), () => frappe.set_route("aib-dashboard", frm.doc.name));
    }
    frm.add_custom_button(__("Load example"), () => {
      frm.call("example_spec").then((r) => {
        frm.set_value("spec", r.message);
        frappe.show_alert({ message: __("Example loaded. Edit and save."), indicator: "blue" });
      });
    });
    frm.add_custom_button(__("Validate"), () => {
      frappe.xcall("aibyters_charts.api.validate_spec", { spec: frm.doc.spec }).then((res) => {
        if (res.ok) frappe.show_alert({ message: __("Spec is valid"), indicator: "green" });
        else frappe.msgprint({ title: __("Spec problems"), indicator: "red", message: res.errors.map((e) => `• ${e}`).join("<br>") });
      });
    });
    frm.set_intro(
      __("Describe the dashboard as JSON: widgets with a <b>type</b>, a <b>source</b> (report, list, dashboard_chart, number_card, query, method) and optional encodings. Click <b>Load example</b> to start."),
      "blue"
    );
  },
});
