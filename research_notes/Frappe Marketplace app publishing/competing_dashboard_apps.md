# Competing chart / dashboard / BI / reporting apps for Frappe & ERPNext (2024–2026)

> Research date: 2026-10-20. Method note: this sandbox could not open `frappecloud.com`, `cloud.frappe.io`, `frappe.io`, `docs.frappe.io`, `discuss.frappe.io`, `ecosire.com`, `g2.com` or `awesome-frappe.gavv.in` directly (proxy policy denial). Facts from those domains come from search-engine snippets of the page (quoted where possible) and are marked **[snippet]**. GitHub pages and raw.githubusercontent.com were fetched directly and are marked **[fetched]**. Treat [snippet] facts as "verified-by-excerpt", not full-page verified; install counts in particular vary by crawl date.

---

## KQ1. What exists today: the landscape, item by item (packaging, price, licence, versions, chart types, embedding, theming, export)

### Takeaway
The field is thin. There is one dominant first-party option (Frappe Insights: free, AGPL-3.0, separate Vue/ECharts SPA, not embeddable in Desk Workspaces without a public iframe), the built-in Dashboard/Dashboard Chart/Number Card doctypes (6 chart types, rigid), one notable new free third-party marketplace app (Lumen Reports, 19 widget types, v15/16), a paid BigQuery connector (Niyu Labs), and a tail of build-to-order vendor "apps" (ECOSIRE, from $249–$299) and stale GitHub projects. No marketplace app sells a React/"executive-grade" chart library or drop-in Workspace widgets.

### Cited Findings

**A. Frappe Insights (first-party BI)**
- Licence: AGPL-3.0; repo describes itself as "Open Source Business Intelligence Tool"; ~1.0k stars, 526 forks — [frappe/insights GitHub](https://github.com/frappe/insights) **[fetched]**. AlternativeTo also lists it as AGPL-3.0 / free — [AlternativeTo](https://alternativeto.net/software/frappe-insights/about).
- Architecture: built on Frappe Framework; UI uses Frappe UI (Vue-based); Ibis composes SQL via dataframe APIs; renders charts with Apache ECharts; data sources "currently" MySQL, PostgreSQL, DuckDB, BigQuery — [frappe/insights README](https://github.com/frappe/insights) **[fetched]**; README via raw: same, plus "Server Scripts must be enabled" for self-host — [README raw](https://raw.githubusercontent.com/frappe/insights/develop/README.md) **[fetched]**.
- Why ECharts not frappe-charts: forum thread asks exactly this; a reply says Frappe Charts is "a convenient but relatively simple library" while ECharts is "significantly more elaborate" (commenter inference, not official) — [discuss thread 143948](https://discuss.frappe.io/t/why-doesnt-frappe-insights-use-frappe-charts/143948) **[snippet]**.
- Version support matrix: `main` → Frappe v15; `version-3` → v15 and v16 (Node 18/24, Python 3.10/3.14); `develop` → Frappe develop — [README](https://github.com/frappe/insights) **[fetched]**.
- Release cadence (very active): v3.15.1 (20 Oct), v3.15.0 (15 Oct: `json_value`, whitelisted write methods restricted to POST, "match ERPNext dashboard templates to ERPNext reports"), v3.14.4 (13 Oct: "passed the marketplace Semgrep check" #1497), v3.14.3 (13 Oct: bypass pagination in `download_results` to prevent truncated exports; capped Frappe version range), v3.14.2 (29 Sep) — [insights releases](https://github.com/frappe/insights/releases) **[fetched]**. Note: "marketplace Semgrep check" implies Frappe Cloud runs a Semgrep gate on marketplace apps (inference).
- Earlier v3 features: v3.13.0 reference line + migration of v2 dashboards to v3 workbooks; v3.7.0 favorites, stored-table refresh, deprecation warning for Insights v2; v3.5.0 fiscal-year granularity, table column width/text-wrap; v3.0.15 filter widget, text widget, download button — [newreleases.io / GitHub releases](https://newreleases.io/project/github/frappe/insights/release/v3.13.0) **[snippet]**.
- Chart types: "a dozen chart options including bar, pie, line, and trend charts"; Number chart for KPIs with "% change from previous period (needs date column)"; Number charts recommended at top of dashboards, with sparklines — [docs.frappe.io chart-types-explained](https://docs.frappe.io/insights/charts/chart-types-explained) **[snippet]**; Number chart details (prefix/suffix, "Show comparison") — [docs workbooks/charts](https://docs.frappe.io/insights/workbooks/charts) **[snippet]**.
- Sharing/embedding: dashboards can be Private / Organization / Public; public link active until revoked; Share dialog has "Get Embed Code" producing iframe code "to paste into websites or internal portals"; viewers can apply filters but not change layout — [docs sharing-and-access-control](https://docs.frappe.io/insights/dashboards/sharing-and-access-control) **[snippet]**.
- Embedding into Desk limitation: a user needed to make the dashboard **public with no authentication** to iframe it into a Workspace Custom HTML block; reply: role-based sharing "won't be possible" because permissions not implemented (date of thread not shown) — [discuss 115788](https://discuss.frappe.io/t/frappe-insights-embedding-or-sharing-dashboard-just-for-frappe-users-or-to-a-certain-role/115788) **[snippet]**; dynamic per-user filtering of embedded charts via JS was refused as a data-leak risk — [discuss 118908](https://discuss.frappe.io/t/dynamic-filters-in-custom-html-block-iframe/118908) **[snippet]**.
- Marketplace listing: free; install count shown as **15.0k** on the app page vs **31.5k** on the marketplace search page (different crawl dates) — [cloud.frappe.io/marketplace/apps/insights](https://cloud.frappe.io/marketplace/apps/insights) and [marketplace search](https://cloud.frappe.io/marketplace/search) **[snippet]**.
- Pricing: no Insights-specific price found anywhere; Frappe Cloud hosting is per-site/compute, "Sites from $5/mo", servers from $20/mo, "no per-user" fees on sibling product pricing pages (CRM/Helpdesk/HR) — [frappe.io/cloud/sites](https://frappe.io/cloud/sites), [frappe.io/helpdesk/pricing](https://frappe.io/helpdesk/pricing) **[snippet]**.
- G2: only 2 reviews, 3.3/5; reviewers praise dashboard-building ease but cite "limitations in storage and slow performance on large datasets" and "some advanced analytics features are still limited" — [G2 Frappe Insights](https://www.g2.com/products/frappe-insights/reviews) **[snippet]**.

**B. Built-in Dashboard / Dashboard Chart / Number Card (Frappe Framework v15)**
- Dashboard Chart doctype (`version-15`): `chart_type` ∈ {Count, Sum, Average, Group By, Custom, Report}; `type` ∈ {Line (default), Bar, Percentage, Pie, Donut, Heatmap}; `timespan` ∈ {Last Year, Last Quarter, Last Month, Last Week, Select Date Range}; `time_interval` ∈ {Yearly, Quarterly, Monthly, Weekly, Daily}; `group_by_type` ∈ {Count, Sum, Average}; `number_of_groups` Int; single `color` field; `is_public`; `use_report_chart`; `dynamic_filters_json` (JSON); `roles` child table; `custom_options` (example `"colors": ["#d1d8dd", "#ff5858"]`) — [dashboard_chart.json](https://raw.githubusercontent.com/frappe/frappe/version-15/frappe/desk/doctype/dashboard_chart/dashboard_chart.json) **[fetched]**.
- Number Card doctype (`version-15`): `type` ∈ {Document Type, Report, Custom}; `function` ∈ {Count, Sum, Average, Minimum, Maximum}; `show_percentage_stats` (default on) with `stats_time_interval` ∈ {Daily, Weekly, Monthly, Yearly}; `color` + `background_color`; `is_public`; Custom requires a whitelisted `method` returning `value`, `fieldtype`, `route_options`, `route` — [number_card.json](https://raw.githubusercontent.com/frappe/frappe/version-15/frappe/desk/doctype/number_card/number_card.json) **[fetched]**.
- Custom chart sources: "New Chart Sources can only be created by the Administrator in Developer Mode" — [ERPNext manual dashboard](https://docs.frappe.io/erpnext/user/manual/en/dashboard) **[snippet]**. On Frappe Cloud, Number Cards/Charts can use a doctype or Query Report; only Script Reports are blocked — [discuss 163555](https://discuss.frappe.io/t/how-to-create-summarized-grouped-reports-and-dashboards-in-frappe-cloud/163555) **[snippet]**.
- Group By quirks: `Number of Groups` folds the rest into "Other"; users reported custom fields missing from "Group By Based On" and link fields showing raw IDs (v12-era) — [discuss 56136](https://discuss.frappe.io/t/v12-new-dashboard-chart-type-group-by/56136) **[snippet]**.
- Report-based chart widgets "always use the report's default filters and cannot be modified by dashboard users at runtime, unlike Number Cards" — [frappe/frappe #43352](https://github.com/frappe/frappe/issues/43352) **[snippet]**.
- Printing: "printing of charts and dashboards just like doctype is not available in ERPNext… try printing it directly via the browser" (v13 thread) — [discuss 65243](https://discuss.frappe.io/t/v13-print-dashboard/65243) **[snippet]**.

**C. frappe-charts (the rendering library behind built-in charts)**
- MIT licence (copyright Prateeksha Singh 2017) — [LICENSE](https://raw.githubusercontent.com/frappe/charts/master/LICENSE) **[fetched]**; package.json version 1.6.3, zero runtime dependencies — [package.json](https://raw.githubusercontent.com/frappe/charts/master/package.json) **[fetched]**.
- 15.1k stars, 754 forks, 129 open issues, 19 open PRs, 503 commits; chart types: Axis, Area/Trends, Bar, Line, Pie, Percentage, Mixed Axis, Heatmap (+ scatter in usage example); description "Simple, responsive, modern SVG Charts with zero dependencies" — [frappe/charts](https://github.com/frappe/charts) **[fetched]**. Latest releases v1.6.3 (27 Apr), v1.6.1 (18 Apr), v1.6.0 (11 Apr), year not shown on page — [charts releases](https://github.com/frappe/charts/releases) **[fetched]**.
- Known limits: pie/donut "support only hover" (no data-select event, 2020 maintainer reply); SMIL animations unsupported in IE; no runtime type switching; "many APIs talked about in Issues are not available in the docs" — [Lightrun mirror](https://lightrun.com/answers/frappe-charts-how-do-you-change-the-chart-type-at-runtime-) **[snippet]**. Forum: "Is frappe charts a good option for Frappe apps? Not looking good" — [discuss 62597](https://discuss.frappe.io/t/is-frappe-charts-a-good-option-for-frapp-apps-not-looking-good/62597) **[snippet]**; "Frappe Charts currently is not a first class citizen in ERPNext" — [discuss 43372](https://discuss.frappe.io/t/which-plans-does-the-community-frappe-have-to-integrate-frappe-charts-natively-and-intuitively-into-erpnext/43372) **[snippet]**.

**D. Third-party Frappe Cloud Marketplace apps**
- **Lumen Reports** (publisher Mahmood Husam): free; v15 & v16; "No-code dashboards for Frappe and ERPNext", drag-and-drop widgets, stackable filters, computed metrics, "19 widget types in light and dark themes, including trends, comparisons, composition, progress, patterns, and tables", plain-English/AI mode that picks doctypes and writes the query; claims "Lumen never runs raw SQL — not from the browser, and not from the AI… compiles through Frappe's own permission layer"; English and Arabic — [cloud.frappe.io/marketplace/apps/lumen_reports](https://cloud.frappe.io/marketplace/apps/lumen_reports) **[snippet]**. No GitHub repo surfaced in search (gap).
- **BigQuery Connector / frappe_bigquery** (publisher Niyu Labs): **paid** (amount not visible in snippet); v15 & v16; "One Click to BigQuery, Infinite Insights — PowerBI, Looker, Tableau from there"; near-real-time sync — [cloud.frappe.io/marketplace/apps/frappe_bigquery](https://cloud.frappe.io/marketplace/apps/frappe_bigquery) **[snippet]**.
- **Report Builder** (community app): "build table reports via drag-and-drop UI — columns, filters"; tabular, not charts; price/installs not visible — [marketplace search](https://cloud.frappe.io/marketplace/search) **[snippet]**.
- **Price Lookup**: free, tagged *Analytics* category, quotation-history lookup (shows how loosely "Analytics" is used) — [marketplace apps/price_lookup](https://cloud.frappe.io/marketplace/apps/price_lookup) **[snippet]**.
- **Frappe SEO**: dashboard with donut charts for SEO health (niche) — [marketplace apps/frappe_seo](https://cloud.frappe.io/marketplace/apps/frappe_seo) **[snippet]**.
- Marketplace rules: apps must be open source under MIT or a GPL-compatible licence; both free and paid allowed; a ~2025 crawl showed 374 apps total — [docs.frappe.io/cloud/marketplace](https://docs.frappe.io/cloud/marketplace), [marketplace search](https://cloud.frappe.io/marketplace/search) **[snippet]**.
- No marketplace listing found for a Metabase, Superset, Power BI or Grafana connector; Frappe's own docs only offer a "connect Metabase to your site's MySQL with read-only user + SSL" guide — [docs.frappe.io/cloud/connect-metabase](https://docs.frappe.io/cloud/connect-metabase) **[snippet]**.

**E. Off-marketplace vendor "apps" (build-to-order, not downloads)**
- ECOSIRE **Advanced BI Dashboards Pack**: "from $249.00 USD", indicative, quote required, 2–4 week delivery, built for ERPNext/Frappe v15 & v16 — [ecosire.com advanced-bi-dashboards-pack](https://ecosire.com/apps/erpnext/advanced-bi-dashboards-pack) **[snippet]**.
- ECOSIRE **ERPNext Power BI Connector**: "from $299.00 USD", whitelisted REST endpoints, scheduled refresh + near-live feed, prebuilt finance/sales semantic models, v15/v16 — [ecosire.com erpnext-powerbi-connector](https://ecosire.com/apps/erpnext/erpnext-powerbi-connector) **[snippet]**.
- ECOSIRE **Metabase Embedded Analytics**: "from $249", embeds signed Metabase dashboards inside Desk with per-user row filtering, v15/v16 — [ecosire.com metabase-embedded-analytics](https://ecosire.com/apps/erpnext/metabase-embedded-analytics) **[snippet]**.
- Peliqan: hosted ELT platform that syncs ERPNext into a warehouse for Metabase/Superset/Power BI — not a Frappe app — [peliqan.io ERPNext→Metabase](https://peliqan.io/connectors/Metabase/ERPNext/) **[snippet]**.
- Tridots Tech sells "Frappe Insights & Reporting" implementation services (partner marketing) — [tridotstech.com](https://www.tridotstech.com/frappe-insights-&-reporting) **[snippet]**.

**F. GitHub / community projects**
- `pipech/frappe-plotly-dash` ("Build analytical web apps through the Desk with Plotly Dash") and `pipech/frappe-metabase` ("Access your Metabase instance from Desk") are the only dashboard/BI integrations in awesome-frappe besides Insights; no Superset/Power BI/Grafana/report-builder/KPI entries — [awesome-frappe README](https://raw.githubusercontent.com/gavindsouza/awesome-frappe/main/README.md) **[fetched]**.
- `Athenolabs/dashboard`: legacy widget dashboard app, chart widget on Flotr2 — [GitHub](https://github.com/Athenolabs/dashboard) **[snippet]**.
- `ummartoor/erpnext-dashboard` and `ayush2004patel/ERPNext-Project-Dashboard` (React over REST API, Kanban/analytics) — separate SPAs, not Desk apps — [GitHub](https://github.com/ummartoor/erpnext-dashboard) **[snippet]**.
- AI copilots that *generate* dashboard charts rather than render them: ERPSmith (free, MIT, v15/v16, MCP) — [discuss 165256](https://discuss.frappe.io/t/erpsmith-an-ai-dev-copilot-for-erpnext-free-mit-frappe-v15-and-v16/165256); ERPNext Copilot, changAI — [awesome-frappe](https://raw.githubusercontent.com/gavindsouza/awesome-frappe/main/README.md) **[fetched]**.
- Mobile: unofficial "ERPNext Mobile" iOS app advertises a dashboard of key metrics; DATUREX Connect lets users "create Bar, Line, and Pie charts for every document type" — [App Store](https://apps.apple.com/ca/app/erpnext-mobile/id6479046579), [DATUREX](https://apps.apple.com/qa/app/daturex-connect-for-erpnext/id1659837767?l=ar) **[snippet]**.

### Inferences
- Insights is effectively "free + hosting cost"; Frappe monetises it only through Frappe Cloud compute, so a competitor cannot win on price against Insights, only on fit (Desk-native, executive polish, mobile, print).
- Insights' Semgrep-gate fix and "capped Frappe version range" commits imply marketplace review enforces static-analysis and explicit version ranges; a React app must pass the same gate.
- Every third-party paid offer found ($249–$299) is a services engagement dressed as an app; there is **no self-serve paid dashboard app with a monthly plan** visible on the marketplace in this research.
- Built-in Dashboard Chart has exactly 6 visual types, one colour, no combo/stacked/waterfall/funnel/gauge/bullet, no annotations, no PDF export; this is the obvious functional gap a React library fills.

### Gaps
- Could not open the live marketplace to enumerate all Analytics/Reporting-category apps, exact install counts, ratings (the marketplace does not visibly show ratings in snippets), or the BigQuery Connector's price.
- Lumen Reports' licence, chart library, GitHub repo and install count not found.
- Insights' full chart-type list and theming/white-label options not verified from docs (blocked domain).
- frappe-charts release years not shown on GitHub page.

---

## KQ2. What ERPNext users use for executive dashboards and recurring pain points

### Takeaway
Users default to built-in Dashboard Charts/Number Cards, graduate to Insights, and the power users bolt on Metabase/Superset against the DB. The recurring complaints (2024–2026) are: charts can't live inside Workspaces, rigid axis/field configuration, no drill-down with filters, Insights slowness on ~250k-row tables, v2→v3 migration losing work, embedding requires making dashboards public, and no print/PDF of dashboards.

### Cited Findings
- Workspaces cannot display Dashboards or Insights charts; feature request for a "Dashboard / Chart" workspace block so users get "charts, KPI widgets, and reports" on their home workspace; opened 28 Oct 2025, moved from erpnext to frappe 6 Oct 2026, still open — [frappe/frappe #44001](https://github.com/frappe/frappe/issues/44001) **[fetched]**.
- "Interactive and dynamic dashboards": ERPNext "lacks dynamic filtering, drill-down analysis, cross-module data visualization, and BI-style interactive reports… chart configuration is too rigid, with no way to choose or customize X- and Y-axis fields, labels, or data representation"; opened 14 Jul 2026, open — [frappe/frappe #44059](https://github.com/frappe/frappe/issues/44059) **[fetched]**.
- Report-based chart widgets cannot take runtime filters — [frappe/frappe #43352](https://github.com/frappe/frappe/issues/43352) **[snippet]**.
- Insights performance: "queries are taking a very long time to fetch data, and eventually they time out… approximately 2.5 lakh (250,000) rows"; still listed in the Insights forum category as of Apr 2026 — [discuss 157562](https://discuss.frappe.io/t/frappe-insights-query-loading-extremely-slow-and-timing-out/157562) **[snippet]**.
- Insights v3 chart "limits presented data to first 10" — [discuss 142954](https://discuss.frappe.io/t/insights-v3-chart-limits-presented-data-to-first-10/142954) **[snippet]**.
- Insights drill-down ignores dashboard filters (Nov 2025, closed) — [frappe/insights #688](https://github.com/frappe/insights/issues/688); global filter not applied in drill-down — [frappe/insights #529](https://github.com/frappe/insights/issues/529); public chart links can no longer filter a table — [frappe/insights #1394](https://github.com/frappe/insights/issues/1394) **[snippet]**.
- Insights v2→v3: user with 100+ saved queries; "the underlying query structure is completely different in v3"; reply: "there's no way to migrate queries/dashboards from v2 to v3" (community account) — [discuss 147503](https://discuss.frappe.io/t/export-queries-from-v2-to-v3/147503) **[snippet]**. (v3.13.0 later added a v2-dashboard→v3-workbook migration — [releases](https://github.com/frappe/insights/releases) **[fetched]**.)
- Insights install friction: works on v15 but not v14; "incompatibility and dependency mismatch errors" — [discuss 110640](https://discuss.frappe.io/t/error-while-installing-insights-along-with-erpnext-15/110640) **[snippet]**.
- "Dashboards in Frappe that offer Power BI like interactive and visual experience?" — answers: use Insights ("Frappe's own version of Power BI-like app") or Apache Superset, which "offers a lot of graphs and charts which are not natively available in Frappe Insights" — [discuss 163120](https://discuss.frappe.io/t/dashboards-in-frappe-that-offer-power-bi-like-interactive-and-visual-experience/163120) **[snippet]**.
- Earlier sentiment: "Frappe and ERPNext lack advanced analytics tools… still fall short of full BI tools like PowerBI or Metabase" — [discuss 40404](https://discuss.frappe.io/t/simple-management-dashboard/40404) **[snippet]**; Metabase co-hosting guides — [discuss 53075](https://discuss.frappe.io/t/guide-how-to-install-metabase-dashboard-along-with-erpnext-on-ubuntu-18-04-server/53075), [discuss 32500](https://discuss.frappe.io/t/visualizing-erpnext-data-using-metabase-step-by-step-guide/32500) **[snippet]**.
- Public dashboards without login are awkward; one user swapped to Google Charts — [discuss 62963](https://discuss.frappe.io/t/public-dashboard-charts-without-login/62963) **[snippet]**.
- Role-specific dashboards: "a single dashboard may not serve different roles" — [discuss 47287](https://discuss.frappe.io/t/introducing-dashboard/47287/25) **[snippet]**.
- Chart-source breakage across upgrades: "Account Balance Timeline" broken v13.2.1; 404 on chart-source endpoint v12 — [discuss 75390](https://discuss.frappe.io/t/chart-account-balance-timeline-broken-v13-2-1/75390), [discuss 69847](https://discuss.frappe.io/t/some-dashboard-charts-are-not-working-in-latest-v12/69847) **[snippet]**.
- Mobile: v16 responsive layout hid the module switcher on Android browsers; fix promised "in v16.60" — [discuss 165239](https://discuss.frappe.io/t/access-modules-of-erpnext-in-sidebar-on-mobile/165239) **[snippet]**. No dashboard-specific mobile complaint from 2025 found.
- Executive-dashboard scope (what buyers ask for): finance KPIs, customer/project health, manufacturing/inventory risk, approval visibility, drill-downs, responsive desktop/tablet/mobile — [Sarathi-AI-Labs/ERPNext #501](https://github.com/Sarathi-AI-Labs/ERPNext/issues/501) **[snippet]**.
- Consultant view: Number Cards no-code, Dashboard Charts low-complexity, custom report charts need SQL+Python — [invento.com.bd guide](https://invento.com.bd/erpnext-dashboard-customization-make-your-data-work-for-you/) **[snippet]**; "teams request a management dashboard without identifying what management must decide" — [craftinteractive.ae](https://craftinteractive.ae/erpnext-reporting-and-dashboards/) **[snippet]**.
- General ERPNext reviews: Capterra 4.5 (137), Software Advice 4.6 (138); Gartner Apr 2026 review 3.0 "learning curve is steep" — [Capterra](https://www.capterra.com/p/164441/ERPNext/), [Gartner](https://www.gartner.com/reviews/product/erpnext) **[snippet]**.

### Inferences
- The two most upvote-worthy framework issues of 2025–2026 (#44001, #44059) are precisely "charts inside Workspaces" and "richer, configurable charts" — a React widget app that registers as a Workspace block (or Custom HTML block helper) targets both without waiting for core.
- Insights' pain is mostly *data-layer* (query speed, migrations, filter/drill-down semantics), not rendering; a presentation-layer library that consumes existing Reports/Number Cards/Insights queries avoids competing on the hard part.

### Gaps
- No Reddit r/ERPNext threads surfaced in any search (two attempts); YouTube reviews of Insights v3 not found.
- No quantified data (poll/survey) on which tool ERPNext companies actually use for exec dashboards.

---

## KQ3. Price points of paid dashboard/reporting offerings

### Takeaway
Self-serve paid marketplace dashboard apps are essentially absent; the only paid analytics listing found (BigQuery Connector) hides its price. Off-marketplace vendors charge $249–$299+ one-off/quote for dashboard packs and connectors. Marketplace mechanics: monthly recurring plans only, pro-rated, Frappe keeps the first $500 then 80/20.

### Cited Findings
- Marketplace plans: "Currently, only monthly recurring plans are available", pro-rated ($30/mo plan used 10 days → $10) — [docs.frappe.io/cloud/app-plan](https://docs.frappe.io/cloud/app-plan) **[snippet]**.
- Payouts: "Frappe Cloud takes the first $500 of the revenue the app makes. After that… 80-20"; PayPal only outside India; effective since 1 Apr 2023; docs updated Feb 2026 — [docs.frappe.io/cloud/marketplace/payouts](https://docs.frappe.io/cloud/marketplace/payouts) **[snippet]**.
- Revenue sharing for *free* apps announced May 2024 — [frappe.io blog](https://frappe.io/blog/announcements/revenue-sharing-with-3rd-party-apps-on-frappe-cloud-marketplace) **[snippet]** (terms not captured).
- Publisher dashboard has a Subscriptions tab summarising app subscriptions — [frappecloud.com/blog/marketplace](https://frappecloud.com/blog/marketplace) **[snippet]**.
- ECOSIRE Advanced BI Dashboards Pack from $249; Power BI Connector from $299; Metabase Embedded Analytics from $249 (all quote-based) — [ecosire.com](https://ecosire.com/apps/erpnext/advanced-bi-dashboards-pack), [powerbi](https://ecosire.com/apps/erpnext/erpnext-powerbi-connector), [metabase](https://ecosire.com/apps/erpnext/metabase-embedded-analytics) **[snippet]**.
- Reference anchors for buyer price sensitivity: Frappe Cloud sites from $5/mo; ERPNext Small Business plan $50/mo incl. support; enterprise hosting cited at $200/mo — [frappe.io/erpnext/pricing](https://frappe.io/erpnext/pricing), [frappe.io small-business plan](https://frappe.io/blog/announcements/introducing-the-erpnext-small-business-plan) **[snippet]**.
- Insights, Lumen Reports: free. BigQuery Connector: paid, amount not visible — [marketplace](https://cloud.frappe.io/marketplace/apps/frappe_bigquery) **[snippet]**.

### Inferences
- A $10–$30/site/month plan would sit well below the $249–$299 services anchors and above the $5 hosting floor; first $500 of revenue goes to Frappe regardless, so early pricing should optimise for installs, not margin.
- Because licences must be MIT/GPL-compatible to list, monetisation of a React chart app on the marketplace must come from plans/support/enterprise packs, not proprietary code (inference from the listing rule).

### Gaps
- No observed monthly price of any live paid marketplace dashboard app; unable to open listings.

---

## KQ4. Unfilled gaps

### Takeaway
Confirmed-by-evidence gaps: (1) charts/KPIs inside Workspaces without public iframes; (2) configurable, executive-grade visuals beyond 6 built-in types; (3) dashboard/chart print/PDF; (4) role-scoped embedded dashboards; (5) runtime filters on report-based charts; (6) mobile-first dashboards. Partially addressed by Lumen Reports (19 widgets, dark mode, no-code) — so "no-code widgets" alone is not a gap; the open space is **a themed, Desk-native, exportable, enterprise-licensed chart/widget layer** that renders existing Frappe data sources.

### Cited Findings
- Workspace embedding gap — [frappe/frappe #44001](https://github.com/frappe/frappe/issues/44001) **[fetched]**; Insights embed needs public link; no role sharing — [discuss 115788](https://discuss.frappe.io/t/frappe-insights-embedding-or-sharing-dashboard-just-for-frappe-users-or-to-a-certain-role/115788) **[snippet]**.
- Rigid chart config / few types — [frappe/frappe #44059](https://github.com/frappe/frappe/issues/44059) **[fetched]**; built-in `type` list = Line, Bar, Percentage, Pie, Donut, Heatmap — [dashboard_chart.json](https://raw.githubusercontent.com/frappe/frappe/version-15/frappe/desk/doctype/dashboard_chart/dashboard_chart.json) **[fetched]**; Superset recommended because it "offers a lot of graphs and charts which are not natively available in Frappe Insights" — [discuss 163120](https://discuss.frappe.io/t/dashboards-in-frappe-that-offer-power-bi-like-interactive-and-visual-experience/163120) **[snippet]**.
- Print/PDF: not available natively — [discuss 65243](https://discuss.frappe.io/t/v13-print-dashboard/65243) **[snippet]**; Frappe branding docs target documents (letterhead, print formats), not dashboards — [docs.frappe.io/erpnext/print](https://docs.frappe.io/erpnext/print.md) **[snippet]**; ECOSIRE's print product covers documents only — [ecosire advanced-print-designer](https://ecosire.com/apps/erpnext/advanced-print-designer) **[snippet]**.
- Runtime filters on report charts — [frappe/frappe #43352](https://github.com/frappe/frappe/issues/43352) **[snippet]**.
- Mobile layouts named as requirement in exec-dashboard epic — [Sarathi #501](https://github.com/Sarathi-AI-Labs/ERPNext/issues/501) **[snippet]**; v16 mobile shell still being fixed — [discuss 165239](https://discuss.frappe.io/t/access-modules-of-erpnext-in-sidebar-on-mobile/165239) **[snippet]**.
- Already-covered territory: Lumen Reports offers 19 widget types, light/dark themes, AI query mode, free — [marketplace lumen_reports](https://cloud.frappe.io/marketplace/apps/lumen_reports) **[snippet]**; AI chart generation covered by ERPSmith/ERPNext Copilot — [awesome-frappe](https://raw.githubusercontent.com/gavindsouza/awesome-frappe/main/README.md) **[fetched]**.
- Reconciliation visuals, white-label, licensed enterprise packs: **no sources found** offering or requesting these specifically in the Frappe ecosystem (searched; nothing surfaced).

### Inferences
- Lumen Reports is the closest competitor to a "drop-in widget" pitch; differentiate on (a) design quality/typography of executive visuals, (b) print/PDF and scheduled exports, (c) Workspace-native registration, (d) theming tokens matching Desk light/dark, (e) reconciliation/waterfall/bridge/funnel/bullet types absent from both built-ins and Lumen's described set.
- "White-label" and "enterprise licensed pack" are unproven demand in this ecosystem (no evidence either way); treat as hypothesis to validate, not a confirmed gap.

### Gaps
- No evidence for demand for reconciliation visuals or white-label dashboards specifically; no vendor sells them.

---

## KQ5. How successful publishers position and name listings

### Takeaway
Observed listing patterns: short product-noun name + one-line benefit tagline ("No-code dashboards for Frappe and ERPNext"; "One Click to BigQuery, Infinite Insights"), explicit v15/v16 badges, free/paid badge, a category tag (Analytics is one of the filter categories), and security/trust claims in the description ("never runs raw SQL", "Frappe's permission layer"). Listing requires a publisher account, GitHub-sourced app, review, MIT/GPL-compatible licence.

### Cited Findings
- Marketplace categories include Analytics, Business, Communication (filter list) — [marketplace search](https://cloud.frappe.io/marketplace/search) **[snippet]**; Price Lookup tagged *Analytics* — [price_lookup](https://cloud.frappe.io/marketplace/apps/price_lookup) **[snippet]**.
- Lumen Reports copy: "No-code dashboards for Frappe and ERPNext"; "19 widget types in light and dark themes"; "plain-English mode"; "Lumen never runs raw SQL… compiles through Frappe's own permission layer"; English & Arabic; v15/16; free — [lumen_reports](https://cloud.frappe.io/marketplace/apps/lumen_reports) **[snippet]**.
- BigQuery Connector copy: "One Click to BigQuery, Infinite Insights — PowerBI, Looker, Tableau from there"; v15/16; paid; publisher Niyu Labs — [frappe_bigquery](https://cloud.frappe.io/marketplace/apps/frappe_bigquery) **[snippet]**.
- Insights copy: "completely open-source Business Intelligence (BI) tool aimed at… technical and non-technical users"; install counter prominent (15.0k/31.5k) — [insights listing](https://cloud.frappe.io/marketplace/apps/insights) **[snippet]**.
- Appe – Frappe Mobile App is another listing name pattern (brand + "Frappe Mobile App") — [appe](https://cloud.frappe.io/marketplace/apps/appe) **[snippet]**.
- Publishing flow: "Become a Publisher" in dashboard settings → Marketplace tab → "+ Add App" from own apps or GitHub → team review — [docs publishing](https://docs.frappe.io/cloud/marketplace/publishing-an-app-to-marketplace), [FC blog](https://frappecloud.com/blog/features/introducing-frappe-cloud-marketplace) **[snippet]**; licence must be MIT or GPL-compatible — [docs marketplace](https://docs.frappe.io/cloud/marketplace) **[snippet]**; Insights needed a fix "to pass the marketplace Semgrep check" — [releases](https://github.com/frappe/insights/releases) **[fetched]**.
- Off-marketplace vendors (ECOSIRE) use multilingual landing pages (en/es/de/zh/ja/pt/tr/ar/ur/hi) with "from $X" + "request a quote" and "built and tested for v15 and v16" — [ecosire](https://ecosire.com/apps/erpnext/advanced-bi-dashboards-pack) **[snippet]**.
- Community forum "App Development" launch posts follow "<Name>: <what it is> (free, MIT, Frappe v15 and v16)" — [ERPSmith post](https://discuss.frappe.io/t/erpsmith-an-ai-dev-copilot-for-erpnext-free-mit-frappe-v15-and-v16/165256) **[snippet]**.

### Inferences
- Name formula that works: `<Brand> <Noun>` (Lumen Reports, Frappe SEO, Price Lookup) + tagline with "for Frappe and ERPNext"; put "v15 · v16", licence and "free/paid" in the first line; lead screenshots with dark+light dashboards (Lumen explicitly markets dark mode).
- Keywords to own in listing text (from issue/forum language): "dashboard", "KPI", "charts in Workspace", "executive dashboard", "drill-down", "PDF export", "no-code", "permission-aware".

### Gaps
- Could not view screenshots, ratings or review counts on listings; the marketplace appears not to expose star ratings in search snippets.
- No data on which third-party analytics listings have the most installs besides Insights.
