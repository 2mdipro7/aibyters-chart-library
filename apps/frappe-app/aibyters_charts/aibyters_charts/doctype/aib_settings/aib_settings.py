import frappe
from frappe.model.document import Document


class AIBSettings(Document):
    def on_update(self):
        from aibyters_charts.license import refresh_license_status

        refresh_license_status()
        self.reload()
