> Superseded on 14 October 2026: the entire library is MIT licensed and free to use. This historical commercial-license proposal does not govern current use. Paid technical support and BI implementation are scoped separately.

# Licensing due diligence — what to ask a prospective licensee (and what they will ask you)

Use this as the intake questionnaire before quoting. Answers determine the tier, the contract
terms and the technical delivery (registry scope, build flags, support SLA).

## A. Who is the licensee and how will they deploy?

1. Legal entity, jurisdiction, and group structure. Will affiliates/subsidiaries use it? (Affects
   "enterprise-wide" vs "single entity" grant and price.)
2. Is the library going into an **internal tool**, a **customer-facing SaaS product**, an
   **on-prem product shipped to their customers**, or a **consultancy deliverable** for a third
   party? (Each is a different licence class: internal use → per-seat/per-developer; SaaS →
   per-application/MAU; redistribution → OEM/royalty; consultancy → project licence with
   named end-client.)
3. How many **applications / products** will embed it, and how many **developers** will touch
   the code? Do they need source access or is a compiled package sufficient?
4. Expected **end-user scale**: monthly active users or seats viewing the dashboards. Is there
   an anonymous/public audience?
5. Hosting: cloud, on-prem, air-gapped? (Air-gapped needs an offline registry tarball and an
   offline licence check — no phone-home.)
6. Which frameworks: React version, Next.js/Remix SSR, micro-frontends, Frappe, Vue/Angular
   islands, React Native/web views? Which browsers must be supported (minimum versions, IE-era
   Edge, embedded WebViews on kiosks)?

## B. Product and technical fit

7. Which packages do they actually need (`charts-bi`, `charts-ds`, `charts-kpi`, `charts-geo`,
   `charts-network`, `charts-ai`, `charts-flow`)? Geo pulls Leaflet/tile servers with their own
   attribution and usage terms — do they have a tile provider?
8. Data sensitivity: PII, financial data under MAS/FINMA/SEC/GDPR? (Confirms the library makes
   no network calls, no telemetry, no font fetching; document this in the security annex.)
9. Accessibility obligations: WCAG 2.1/2.2 AA, Section 508, EN 301 549? Do they require a VPAT?
10. Theming requirements: their design tokens, dark/light/high-contrast, RTL languages,
    number/date locales, currency formats.
11. Export requirements: CSV/XLSX (built in), PNG/SVG/PDF snapshot, server-side rendering of
    charts for reports/email?
12. Performance envelope: max points per series, number of charts per page, target devices
    (low-end Android, kiosks, wall displays). Do they need canvas/WebGL rendering for >50k points?
13. Do they need **new chart types** or custom components? Who owns IP on those (see D)?

## C. Commercial terms

14. Term: annual subscription (recommended) vs perpetual with maintenance. Auto-renew? Price caps
    on renewal (e.g. ≤ CPI + 5 %)?
15. Payment: annual upfront vs quarterly; currency; PO/invoicing requirements; withholding tax.
16. Volume trajectory: expected growth in apps/devs/MAU over 3 years (build step-ups into the
    contract rather than renegotiating).
17. Pilot / proof-of-concept: duration, scope, conversion terms, whether pilot fees credit toward
    year one.
18. Do they require **source code escrow** (Escrow London/NCC/Iron Mountain) as a condition?
    Who pays the escrow fees?
19. Most-favoured-customer or price-protection clauses requested? (Avoid; offer a renewal cap instead.)

## D. Intellectual property and usage boundaries

20. Grant: non-exclusive, non-transferable, worldwide? Any exclusivity ask (by vertical or
    region) — if so, price it separately and time-box it.
21. Redistribution: may they ship the library inside a product to *their* customers? If yes,
    OEM terms: royalty or flat fee, obligation to pass through your licence restrictions,
    no standalone extraction of the library.
22. Modifications: may they modify source? Do modifications revert to you (grant-back) or stay
    with them? Recommended: they may modify for internal use; you receive a non-exclusive
    licence to improvements they contribute back; no obligation to support modified builds.
23. Custom development commissioned by them: work-for-hire (they own) vs licensed (you own and
    can resell). Recommended: you own generic components, they get a perpetual licence to them;
    they own anything containing their proprietary logic/data.
24. Restrictions they must accept: no sublicensing, no competing chart product, no removal of
    licence notices, no use to train ML models on the source, no benchmarking publication
    without consent (optional).
25. Open-source components inside the library (React, Recharts (MIT), Leaflet (BSD-2), etc.):
    provide the third-party notices file; confirm no copyleft (GPL/AGPL) is bundled.
26. Trademark: may they mention "powered by AI Byters"? Do you *want* attribution (discounted
    tier for attribution)?

## E. Support, maintenance, warranty

27. Support tier: business hours vs 24×7; channels (email, Slack Connect, ticketing); response
    and resolution SLAs by severity (e.g. P1 4 h / P2 1 business day / P3 5 days).
28. Maintenance: how long are major versions supported after the next major ships (recommend
    12 months)? Security patch policy?
29. Warranty: conformance to documentation for 90 days; disclaimer of fitness; performance
    warranty only against a written benchmark.
30. Indemnity: IP indemnity from you (standard, capped at fees paid, with exclusions for their
    modifications/combinations); indemnity from them for their data/content.
31. Liability cap: 12 months' fees is market standard; carve-outs for IP indemnity and
    confidentiality.
32. Training / onboarding: workshops, migration assistance, design-system mapping — priced as
    services, not bundled.

## F. Compliance and procurement

33. Security questionnaire requirements (SIG Lite, CAIQ), pen-test reports, SBOM (CycloneDX) —
    the library can generate an SBOM from the lockfile; decide whether to provide it as standard.
34. Insurance requirements (professional indemnity / cyber) and minimum coverage.
35. Data-processing agreement — should be unnecessary (no data processed), but they may insist
    on a "no personal data" attestation.
36. Export control / sanctions screening of the licensee and end customers.
37. Audit rights: you should retain a right to verify usage (dev count, apps, MAU) once per year
    on 30 days' notice; they will want it limited to remote self-certification.
38. Termination: for breach (30-day cure), insolvency, change of control (to a competitor).
    Effect: cease use, but shipped products may continue for a wind-down period (OEM).

## G. Questions *they* will ask you — have answers ready

- Roadmap and release cadence; how breaking changes are communicated (semver + CHANGELOG + 12-month deprecation).
- Bundle size per package and tree-shaking evidence (`pnpm size`).
- Browser/device support matrix and the visual regression process (`scripts/visual-check.mjs`).
- Accessibility conformance statement.
- What happens if AI Byters ceases trading (escrow, perpetual fallback licence).
- Reference customers and case studies.
- Security: no network calls, no telemetry, CSP-compatible (no inline `<script>`, fonts opt-in).

## H. Delivery checklist once signed

- Create registry scope/token for the licensee (per contract), expiry aligned to term.
- Issue LICENSE-KEY.md into the tarball with licensee name, term, and permitted apps.
- Send third-party notices, SBOM, VPAT, and the adoption guide.
- Schedule onboarding session and set up the support channel.
- Calendar renewal 90 days ahead with usage review.
