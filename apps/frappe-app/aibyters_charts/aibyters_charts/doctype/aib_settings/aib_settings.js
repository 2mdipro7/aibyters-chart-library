frappe.ui.form.on("AIB Settings", {
  refresh(frm) {
    frm.add_custom_button(__("Re-check licence"), () => {
      frappe.xcall("aibyters_charts.license.refresh_license_status").then(() => frm.reload_doc());
    });
  },
});
