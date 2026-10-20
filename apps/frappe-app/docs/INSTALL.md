# Installing AI Byters Charts

## Frappe Cloud
Marketplace → *AI Byters Charts* → Install on a bench. Pick a plan; the Free plan needs no payment method.

## Self-hosted bench
```bash
bench get-app https://github.com/aibyters/aibyters_charts --branch main
bench --site <site> install-app aibyters_charts
bench --site <site> migrate
```
Prebuilt assets are committed in `aibyters_charts/public/dist`, so no Node toolchain is required on the bench.

## Upgrading
```bash
bench update --apps aibyters_charts
```
## Licence key (self-hosted paid tier)
AIB Settings → *Licence key* → paste the key from your order confirmation → Save. The status, plan and expiry fields fill in; use *Re-check licence* after renewals.
