"""Licence handling.

Two paths are supported:

1. **Frappe Cloud Marketplace plan** — Frappe Cloud injects ``sk_aibyters_charts`` into site
   config for Marketplace installs; the key is exchanged for the plan via Frappe Cloud's
   ``get_subscription_info`` API (same pattern as frappe/hrms ``subscription_utils.py``).
2. **Licence key** (self-hosted) — an Ed25519-signed JSON payload issued by AI Byters:
   ``{"licensee": "...", "plan": "pro", "sites": ["*"], "exp": "2027-01-01", "seats": 0}``.
   The public key is embedded below; the private key never leaves the vendor.

Without either, the site runs on the **free** tier (3 dashboards, 6 widgets each, no
white-label). Charts always render — a licence problem never breaks a customer's page.
"""
from __future__ import annotations

import base64
import json
from datetime import date

import frappe
from frappe.utils import getdate, nowdate

FREE_LIMITS = {"dashboards": 3, "widgets_per_dashboard": 6, "white_label": False}
PLAN_LIMITS = {
    "free": FREE_LIMITS,
    "starter": {"dashboards": 10, "widgets_per_dashboard": 12, "white_label": False},
    "pro": {"dashboards": 0, "widgets_per_dashboard": 0, "white_label": True},
    "enterprise": {"dashboards": 0, "widgets_per_dashboard": 0, "white_label": True},
}

# Replace with the real Ed25519 public key (base64, 32 bytes) before release.
PUBLIC_KEY_B64 = "REPLACE_WITH_BASE64_ED25519_PUBLIC_KEY"


FC_API = "https://frappecloud.com/api/method/press.api.developer.marketplace.get_subscription_info"


def _on_frappe_cloud() -> bool:
    try:
        from frappe.utils.frappecloud import on_frappecloud

        return bool(on_frappecloud())
    except Exception:
        return False


def _frappe_cloud_plan() -> str | None:
    """Plan of this site's Marketplace subscription.

    Frappe Cloud injects ``sk_<app>`` (a per-subscription secret key) into site config when the
    app is installed from the Marketplace (press: ``Site.install_marketplace_conf``). The plan name
    itself is not stored locally; the app exchanges the key for ``{plan, enabled, site}`` via the
    guest endpoint ``press.api.developer.marketplace.get_subscription_info``. The call is cached
    for an hour and fails open (free tier) so a Frappe Cloud outage never breaks a dashboard.
    """
    key = (frappe.conf or {}).get("sk_aibyters_charts")
    if not key:
        return None
    try:
        import requests

        res = requests.post(FC_API, json={"secret_key": key}, timeout=5)
        if res.status_code != 200:
            return None
        info = (res.json() or {}).get("message") or {}
        if not info.get("enabled", True):
            return "free"
        plan = str(info.get("plan") or "").strip().lower()
        # Plan titles on Frappe Cloud are free text; normalise to our tiers.
        for tier in ("enterprise", "pro", "starter"):
            if tier in plan:
                return tier
        return "pro" if plan else None
    except Exception:
        frappe.log_error(title="aibyters_charts: Frappe Cloud subscription check failed")
        return None


def _verify_key(key: str) -> dict | None:
    """Returns the payload when the signature is valid, else None."""
    try:
        from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

        payload_b64, sig_b64 = key.strip().split(".")
        payload = base64.urlsafe_b64decode(payload_b64 + "==")
        sig = base64.urlsafe_b64decode(sig_b64 + "==")
        pub = Ed25519PublicKey.from_public_bytes(base64.b64decode(PUBLIC_KEY_B64))
        pub.verify(sig, payload)
        data = json.loads(payload)
        if data.get("exp") and getdate(data["exp"]) < getdate(nowdate()):
            return None
        sites = data.get("sites") or ["*"]
        site = frappe.local.site
        if "*" not in sites and site not in sites and not any(site.endswith(s.lstrip("*")) for s in sites if s.startswith("*")):
            return None
        return data
    except Exception:
        return None


def get_license_state() -> dict:
    cached = frappe.cache().get_value("aibyters_charts:license")
    if cached:
        return cached
    state = {"plan": "free", "source": "none", "valid": True, "licensee": None, "expires": None, "limits": FREE_LIMITS}
    fc = _frappe_cloud_plan()
    if fc:
        state.update(plan=fc, source="frappe_cloud", limits=PLAN_LIMITS.get(fc, PLAN_LIMITS["pro"]))
    elif _on_frappe_cloud() and not (frappe.conf or {}).get("sk_aibyters_charts"):
        # Installed on Frappe Cloud without a Marketplace subscription key (e.g. bench get-app).
        state.update(source="frappe_cloud_unsubscribed")
    else:
        key = frappe.db.get_single_value("AIB Settings", "license_key") if frappe.db.exists("DocType", "AIB Settings") else None
        if key:
            data = _verify_key(key)
            if data:
                plan = str(data.get("plan", "pro")).lower()
                state.update(plan=plan, source="license_key", licensee=data.get("licensee"), expires=data.get("exp"), limits=PLAN_LIMITS.get(plan, PLAN_LIMITS["pro"]))
            else:
                state.update(valid=False, message="Licence key is invalid or expired; running on the free tier.")
    frappe.cache().set_value("aibyters_charts:license", state, expires_in_sec=3600)
    return state


def refresh_license_status():
    frappe.cache().delete_value("aibyters_charts:license")
    state = get_license_state()
    if frappe.db.exists("DocType", "AIB Settings"):
        frappe.db.set_single_value("AIB Settings", "plan", state["plan"])
        frappe.db.set_single_value("AIB Settings", "license_status", "Valid" if state["valid"] else "Invalid")
        frappe.db.set_single_value("AIB Settings", "licensee", state.get("licensee") or "")
        frappe.db.set_single_value("AIB Settings", "valid_until", state.get("expires"))


def enforce_widget_limit(spec: dict) -> dict:
    limits = get_license_state()["limits"]
    cap = limits.get("widgets_per_dashboard") or 0
    widgets = spec.get("widgets") or []
    if cap and len(widgets) > cap:
        spec = dict(spec)
        spec["widgets"] = widgets[:cap]
        spec["_truncated"] = len(widgets) - cap
    return spec


def check_dashboard_limit():
    limits = get_license_state()["limits"]
    cap = limits.get("dashboards") or 0
    if cap and frappe.db.count("AIB Dashboard", {"is_example": 0}) >= cap:
        frappe.throw(
            frappe._("The free tier allows {0} dashboards. Add a licence key in AIB Settings or choose a plan on Frappe Cloud to create more.").format(cap),
            title=frappe._("Upgrade required"),
        )
