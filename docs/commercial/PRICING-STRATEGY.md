> Superseded on 14 October 2026: the entire library is MIT licensed and free to use. This historical commercial-license proposal does not govern current use. Paid technical support and BI implementation are scoped separately.

# Pricing strategy

## 1. Positioning

The library sits between open-source charting (Recharts, Chart.js, ECharts — free, but you
assemble dashboards and fight layout bugs yourself) and enterprise visualisation suites
(Highcharts, amCharts, Syncfusion, AG Charts Enterprise, FusionCharts — $500–$10k+ per developer
or per app). Its differentiators, which the pricing should monetise:

1. **Dashboard-ready components**, not primitives: cards, legends, responsive rules, KPI tiles,
   executive framework cards (SWOT, PESTLE, risk matrix), reconciliation-style charts (ranked
   bars, waffles, diverging, paired, status strips).
2. **Zero-config portability**: theme by CSS variables, no Tailwind, no font/network calls,
   SSR-safe, device-adaptive — the cost a buyer avoids is integration engineering, typically
   2–6 developer-weeks per dashboard product.
3. **Domain packs** (BI, data-science, geo, network, AI cards) that can be sold separately.

Reference points (public list prices, 2025–26, for calibration only):

| Product | Model | Indicative price |
|---|---|---|
| Highcharts | per developer, perpetual + annual advantage | ~$600 per dev (single product), suites $1.5–4k |
| amCharts 5 | per developer or per site | $180–$1.5k+ |
| Syncfusion Essential Studio | per developer per year | ~$1k–$3k |
| AG Charts Enterprise | per developer per year | ~$799+ |
| FusionCharts | per developer / per app | $499–$9k+ |
| Tremor / shadcn charts | free/open | $0 (competes on "good enough") |

The library is not yet a brand; price below Highcharts-suite level for the first 10 customers,
then move up as references accumulate.

## 2. Metric

Recommended primary metric: **per application per year**, with developer seats as a secondary
gate. Rationale: buyers understand "one product, one licence"; it avoids policing developer
counts; and it scales with the value created (each embedded app is a revenue-bearing product for
them). MAU-based pricing is better aligned with value for SaaS but harder to audit — offer it only
as an enterprise option.

## 3. Tiers (list prices, USD, annual subscription)

| Tier | Who | Includes | Price |
|---|---|---|---|
| **Starter** | Internal tools, startups, single app, ≤ 5 devs | `charts-bi`, `charts-kpi`, `layout`, `theme`; community support; attribution badge required | **$1,500 / app / year** |
| **Professional** | One customer-facing product, ≤ 15 devs | All packages incl. `charts-ds`, `charts-geo`, `charts-network`, `charts-ai`; email support 2-business-day SLA; no attribution | **$6,000 / app / year** |
| **Business** | Up to 5 apps, ≤ 40 devs, one legal entity | Professional + priority support (P1 8 h), theming workshop, quarterly roadmap call | **$18,000 / year** |
| **Enterprise** | Unlimited apps in one group, on-prem/air-gapped, OEM redistribution | Business + 24×7 P1, source access, escrow, custom chart credits (5 days), security annex/VPAT/SBOM, named CSM | **from $45,000 / year**, typically $45–120k depending on MAU/OEM |
| **OEM / Redistribution add-on** | ISVs embedding the library in a product they sell | Right to ship to their customers; pass-through restrictions | **+40 % of tier fee or 3–5 % royalty on product revenue attributable, min $25k / year** |

Perpetual option (some procurement teams insist): 2.5× the annual fee, plus 20 % of that per
year for updates and support; without maintenance they are frozen at the last version.

Services (never bundled): custom chart development $1,200–1,800/day; migration/onboarding
packages $5k/$15k; design-system mapping $3k.

## 4. Discount policy

- Annual upfront: list. Quarterly: +8 %.
- Multi-year: 10 % for 2 years, 15 % for 3, price locked.
- Non-profit / education: 50 % on Starter/Professional.
- Design partner (first 5 logo customers): 40 % year one in exchange for a case study, a
  reference call and monthly feedback; renewal at ≤ list −15 %.
- Never discount below 60 % of list; walk away instead — a low anchor is permanent.

## 5. Packaging mechanics

- Registry scopes per tier (`@aibyters/*` with a token that expires at term end). Packages not
  in the tier are simply not resolvable — no runtime licence checks, no phone-home (this is a
  selling point to security teams). Enforcement is contractual plus registry access.
- Version policy: semver; majors at most once a year; 12-month support on the previous major.
- Bundle a `THIRD_PARTY_NOTICES` file and an SBOM with every release.

## 6. Go-to-market sequence

1. **Months 0–3 — prove it on your own products.** Use it inside your consulting deliverables
   (e.g. the UBS × Valuefy-style reconciliation dashboards). Each engagement becomes a case study
   and a licence-in-kind.
2. **Months 3–9 — 5 design partners** at the discounted Professional/Business tier. Target
   fintech ops teams, wealth-tech, and consultancies who build dashboards for clients (they buy
   multiple app licences).
3. **Months 9–18 — public pricing page with Starter self-serve** (Stripe checkout, token
   issued automatically), Professional and above via sales.
4. **Year 2 — Enterprise/OEM** once you have references, a VPAT and a security annex.

## 7. Unit economics sanity check

- Break-even for a 1-FTE maintainer (~$120k fully loaded): 20 Professional licences *or*
  7 Business *or* 3 Enterprise. A realistic year-2 mix (20 Starter, 12 Professional, 4 Business,
  2 Enterprise) is ≈ $264k ARR.
- Gross margin is software-like (>85 %) provided support is tiered and services are billed.
- Churn risk is concentrated in Starter; mitigate with an easy upgrade path rather than
  fighting churn there.

## 8. What to measure

- Activation: time from token issue to first chart in production (target < 1 day; the adoption
  guide exists for this).
- Expansion: apps per account, upgrade rate Starter → Professional.
- Support load per account (drives whether tiers are priced right).
- Feature requests by tier — feed the roadmap; price genuinely new domain packs (e.g. finance
  pack: candlesticks, order-book, P&L attribution) as add-ons at $2–4k/app/year.
