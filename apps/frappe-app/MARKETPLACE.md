# Marketplace listing kit

The Frappe Cloud Marketplace (and the newer PR-based registry at github.com/frappe/marketplace)
requires a **standalone public GitHub repository** per app, **MIT or GPL-compatible** licence,
root `pyproject.toml` with a `[tool.bench.frappe-dependencies]` *range*, a README that works as
the long description **without installation instructions or links**, screenshots, and five links.

## Release procedure (from this monorepo)

```bash
# 1. Build the Desk bundle (commits into aibyters_charts/public/dist)
pnpm --filter aibyters-charts-frappe-bundle build

# 2. Export the app to its own repository (history-preserving subtree split)
node scripts/release-frappe-app.mjs --remote git@github.com:aibyters/aibyters_charts.git --branch main

# 3. Tag the release in that repo; the audit requires the pyproject version to match
git -C ../aibyters_charts tag v0.1.0 && git -C ../aibyters_charts push --tags
```

## Listing fields

| Field | Value |
|---|---|
| Title | AI Byters Charts |
| Summary (≤140 chars) | Executive-grade dashboards and 60+ responsive chart widgets that inherit your Desk theme and respect permissions. |
| Category | Analytics |
| Supported versions | derived from pyproject: Frappe 15, 16 |
| Website | https://aibyters.com |
| Documentation | https://aibyters.com/charts/docs |
| Support | https://aibyters.com/charts/support |
| Privacy policy | https://aibyters.com/privacy |
| Terms of service | https://aibyters.com/terms |
| Screenshots | `docs/screenshots/*.png` — light and dark, desktop and phone |

## Plans (Marketplace App Plan, monthly, USD / INR)

| Plan | Price | Features |
|---|---|---|
| Free | $0 | 3 dashboards · 6 widgets each · all chart types · export |
| Starter | $19 / ₹1,599 | 10 dashboards · 12 widgets · email support |
| Pro | $49 / ₹3,999 | Unlimited · white-label · role-restricted dashboards · priority support |
| Enterprise | $149 / ₹11,999 | Pro + custom chart work (2 h/month) · SLA · onboarding call |

Frappe Cloud retains the first USD 500 of lifetime revenue, then 20 %. Plans are recurring monthly
and pro-rated on the customer's Frappe Cloud invoice. Payouts monthly (PayPal outside India).

## Audit checklist (Submission Gate)

- [ ] `pyproject.toml` version == `aibyters_charts/__init__.__version__`
- [ ] `frappe-dependencies` is a range; frappe/erpnext not in `[project.dependencies]`
- [ ] `hooks.py` `app_name` equals the package directory; `required_apps` is a plain list
- [ ] No symlinks; no side-effects in `__init__.py`
- [ ] Semgrep: no raw SQL from user input (all queries go through `frappe.get_list`), no `ignore_permissions` on user-reachable paths
- [ ] Prebuilt assets committed (`public/dist`) and, for the v2 registry, published by the `app-assets` workflow
- [ ] README has no install steps / deployment wording; five links present; screenshots uploaded
