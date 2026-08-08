# Building a Digital Bank in Indonesia (SEA): Preparation Checklist

*Prepared August 2026 — companion to the market research doc, for the "digital bank" side project.*

## 0. The reality check first

Indonesia's OJK regulation for digital banks (POJK 12/POJK.03/2021) sets minimum paid-up capital at **IDR 10 trillion (~USD 600–650M)**, plus fit-and-proper board members with proven IT/banking competence, a full risk-management framework, and a two-stage licensing process (in-principle approval, then business license, each with ~60-day OJK review). That is not attainable for a side project — it's the tier that produced Bank Jago, SeaBank, and Blu, all backed by Gojek, Sea Limited, and BCA respectively.

So the realistic question isn't "how do I get an OJK digital bank license" — it's "which of the two non-license paths do I actually want":

1. **Fintech-on-BaaS path (recommended)**: build the app/UX layer and plug into a licensed Indonesian bank or e-money issuer's APIs (e.g., Brankas, Ayoconnect, or a direct sponsor-bank partnership) so real money movement, KYC, and deposit-taking legally sit with them. This is how the vast majority of Indonesian fintechs (not just banks) actually launch.
2. **Demo/portfolio path**: build the full UX (accounts, transfers, savings pockets, QR payments) as a simulated product with no real money movement — good for a portfolio piece or to pressure-test the product before ever touching a BaaS contract.

Everything below assumes you pick one of these two paths rather than pursuing a real banking license.

## 1. Documents & legal groundwork

Even without a banking license, launching a fintech-style app in Indonesia touches real regulation. Prepare:

- **Business entity**: PT (Perseroan Terbatas) or PT PMA if there's foreign ownership — needed before you can sign a BaaS/partner-bank agreement.
- **Data protection compliance**: Indonesia's PDP Law (UU No. 27/2022) — you'll need a privacy policy, data processing agreements with any vendor touching customer data, and a registered Data Protection Officer once you process data at scale.
- **OJK registration as a fintech operator** (if offering payments/e-wallet-like features) — Bank Indonesia (BI) regulates payment system operators separately from OJK's bank regulation; a wallet/payments feature may need BI's Payment System Service Provider (PJP) registration even if you never hold a banking license.
- **BaaS/sponsor-bank partnership agreement**: defines who owns the KYC decision, who's liable for fraud/AML, SLA for API uptime, and revenue split (interchange, FX, interest spread).
- **Terms of Service, Privacy Policy, AML/KYC policy documents** — required by any BaaS partner before they'll let you go live, not just good practice.
- **AML/CFT program**: even as a BaaS client, you'll be asked to show a transaction-monitoring and suspicious-activity-reporting process, since Indonesia follows FATF-aligned rules enforced via PPATK (Indonesia's financial intelligence unit).
- **IT security & business continuity documentation**: most BaaS partners require a security assessment (pen-test report, incident response plan) before integration — worth preparing this even pre-launch since it will be asked for.

## 2. Tech stack

### Core architecture layers
1. **Customer-facing app** — mobile-first (iOS/Android), ideally React Native or Flutter for a solo/small team to ship both platforms from one codebase.
2. **Backend / BFF (backend-for-frontend)** — Node.js/NestJS, Go, or Kotlin — orchestrates calls to your BaaS provider, applies your own business logic (pockets, budgeting, rewards), and owns your app-side database.
3. **Ledger** — do not build your real-money ledger yourself if you're on a BaaS path; the BaaS/sponsor bank owns the authoritative ledger. Keep a local "shadow ledger" (double-entry, immutable, event-sourced) in your own DB for reconciliation and UX speed, but treat the partner's ledger as source of truth.
4. **KYC/eKYC** — Indonesia-specific providers: Privy, VIDA, or the identity-verification module of your BaaS provider (Brankas/Ayoconnect) — typically KTP (national ID) OCR + selfie liveness + Dukcapil (national population database) verification.
5. **Payments rail** — QRIS integration is non-negotiable for Indonesia (Bank Indonesia's mandated QR standard); also plan for BI-FAST for real-time transfers.
6. **Compliance & risk layer** — transaction monitoring/AML screening (e.g., via your BaaS partner or a specialist like Sumsub/ComplyAdvantage), fraud detection, sanctions/PEP screening.
7. **Observability & reconciliation** — daily reconciliation jobs against the partner bank's ledger, monitoring/alerting (Datadog/Grafana), audit logging — regulators and BaaS partners will both want to see this.

### Infrastructure
- Cloud: AWS or GCP with a presence/data residency plan (Indonesian financial data increasingly expected to be processed/stored with local data-residency consideration — check current BI/OJK data localization rules before committing to a region).
- Containerized services (Docker/Kubernetes) for the backend once beyond MVP scale.
- Secrets/PCI-adjacent handling: even without full PCI-DSS scope (since a BaaS partner likely handles card issuance), treat all financial data with encryption at rest/in transit, strict access controls, and secrets management (Vault/KMS).

### Vendor shortlist for Indonesia specifically
- **BaaS/Open finance**: Brankas, Ayoconnect (both integrate with Indonesian banks like BRI) — start here for account creation, payments, and data APIs.
- **KYC**: Privy, VIDA, or embedded BaaS-provider KYC.
- **Payments**: Xendit or Midtrans for broader payment-gateway needs (cards, e-wallets, VA) alongside QRIS/BI-FAST from your bank partner.

## 3. Product & UX priorities (based on the earlier SEA research)

- **Savings pockets/goal-based sub-accounts** — the single most-copied feature across Jago, GXS, Blu.
- **QR-first payments** — QRIS as default, not an afterthought.
- **Instant e-KYC onboarding** — KTP scan + selfie liveness, targeting under 5 minutes end-to-end.
- **Ecosystem hook** — since you likely won't have a Gojek/Shopee-scale parent, decide what your "hook" is (a specific underserved segment — freelancers, students, a niche community) rather than trying to out-feature Jago/SeaBank directly.

## 4. Team & operating considerations

- Minimum realistic team even for a lean MVP: 1 product/founder, 1-2 backend engineers, 1 mobile engineer, fractional compliance/legal counsel (Indonesian fintech lawyer — non-optional given PDP Law + BI/OJK touchpoints), fractional security review before go-live.
- Budget expectation for an API-orchestration-style MVP (per the broader neobank-building research): roughly **3–9 months and low-to-mid six figures USD** even on the lean/BaaS path — plan around a narrower wedge (one feature, one segment) to fit a side-project budget and timeline, then expand.
- Plan for ongoing compliance headcount/cost (AML monitoring, KYC review, customer support for disputes) — this tends to be underestimated and grows faster than the initial build cost.

## 5. Suggested next steps

1. Decide: BaaS-integrated fintech vs. non-money demo product (this determines almost everything downstream).
2. If BaaS: shortlist and start conversations with Brankas and Ayoconnect (both serve exactly this "fintech wants to launch banking-like features in Indonesia" use case) to understand their onboarding requirements and timeline.
3. Engage an Indonesian fintech/PDP-law-savvy lawyer early — even a short consult will clarify which BI/OJK registrations actually apply to your specific feature set.
4. Define your wedge (one underserved segment + one killer feature) rather than trying to replicate Jago/GXS/SeaBank's full feature set.
5. Prototype the app UX and KYC flow before signing any BaaS contract, so you go into vendor conversations with a validated flow rather than a blank slate.

## Sources

- [OJK Sets New Provisions on Digital Banks — Assegaf Kawilarang & Associates](https://aklaw.co.id/ojk-sets-new-provisions-on-digital-banks/)
- [Indonesia's digital banking boom — IFLR](https://www.iflr.com/article/2app73pxuqyd6oje59erk/sponsored/indonesias-digital-banking-boom)
- [Indonesia Banking Regulation: Share Ownership, Capitalization — Mondaq](https://www.mondaq.com/financial-services/1145128/indonesia-banking-regulation-share-ownership-capitalization-and-management-of-commercial-banks-based-on-ojk-regulation-no12pojk032021)
- [Build your API Ecosystem with Open Finance Suite — Brankas](https://www.brankas.com/open-finance-suite)
- [About Banking as a Service (BaaS) — Brankas Docs](https://docs.brankas.com/docs/about-banking-as-a-service)
- [4 FinTechs powering Open Banking in Indonesia — IBS Intelligence](https://ibsintelligence.com/ibsi-news/4-fintechs-offering-open-banking-solutions-in-indonesia/)
- [Ayoconnect partners with Bank Rakyat Indonesia (BRI) on open banking](https://www.ayoconnect.com/blog/ayoconnect-partners-with-bank-rakyat-indonesia-bri-on-open-banking-to-boost-financial-inclusion)
- [How to Build a Neobank in 2026: Technology, Vendors, and Licensing — DashDevs](https://dashdevs.com/blog/how-to-build-a-neobank-using-vendors-platforms-or-apis/)
- [The Neobanking Tech Stack in 2026 — Zymr](https://www.zymr.com/blog/neobanking-tech-stack)
