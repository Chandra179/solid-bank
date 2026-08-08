# Digital Bank Research: How Existing Digital Banks Operate (Europe, Asia, SEA)

*Research compiled August 2026 for the "digital bank" side project.*

## 1. Overview

Digital banks (neobanks) fall into two broad categories worldwide: e-money/API-first challengers built on a lighter license (Wise, early Revolut), and fully-licensed digital banks that take deposits and lend (N26, GXS, WeBank, Bank Jago). The underlying regulatory model shapes almost everything about the product — what interest can be offered, how fast onboarding can be, and how much lending/credit can be embedded. Below is a region-by-region look, followed by a direct comparison of whether behavior is actually consistent across regions.

## 2. Europe

Europe's neobanks operate under EU-wide passporting rules, so a single license (say, Lithuania for Revolut or Germany for N26) lets a bank serve most of the EU. Regulation here is centralized and document-heavy: AMLD6 (transposed into national law) plus the new AMLR rulebook, with the EU's new AMLA body coordinating supervision, and MiCA extending the same rigor to crypto assets. KYC leans on document verification (passport/ID scans, liveness checks) rather than a shared national identity database, since no pan-European equivalent exists.

Representative players:

- **Revolut** — Lithuanian banking license, ECB-supervised, 45M+ users. Multi-currency accounts (36+ currencies at interbank rates), stock/crypto trading, savings vaults up to ~4.1% EUR, tiered subscriptions (€0–€45/month).
- **N26** — German banking license (BaFin), 10M+ users. Minimalist UX, "Spaces" sub-accounts for goal-based saving, EUR/USD support, subscription tiers €0–€16.90/month.
- **Wise** — Belgian e-money license (not deposit-insured like a bank), 16M+ users. Focused purely on low-cost FX transfers (0.33–0.61%) and local account numbers in 10+ currencies; no monthly fee, priced per transaction.
- **Bunq** (Netherlands) and **Monzo** (UK) round out the field with sustainability and community-budgeting angles respectively.

Pattern: broad multi-product accounts, subscription-tier monetization, and a strong FX/travel use case reflecting a continent where cross-border spending is routine.

## 3. Asia (China / Korea — "tech company with a banking license")

China's virtual banks, especially **WeBank** (backed by Tencent) and **MYbank** (backed by Ant Group), represent the most extreme version of digital-first banking. WeBank calls itself "a technology company with a banking license" rather than a bank that added an app. Its architecture is fully distributed and cloud-native, processing 500M+ transactions in a single day with roughly 2,000 staff (56% in tech/R&D). Credit approval takes under 5 seconds by embedding lending directly into partner platforms (e.g., WeChat) and pre-underwriting using partner data; funds can disburse within minutes after biometric verification. Per-account operating cost is roughly $0.50 — 10-30x cheaper than incumbent banks — which is what makes serving very small, low-margin transactions and underbanked users profitable.

**Kakao Bank** (Korea) follows a similar embedded-distribution model, leveraging the KakaoTalk messaging app's user base for near-instant onboarding and cross-selling of loans and cards.

Pattern: banking as an embedded feature inside a massive existing platform (messaging/e-commerce), not a standalone destination app; heavy automation of credit decisions; extreme cost efficiency as the core strategy rather than fee/subscription tiers.

## 4. Southeast Asia

SEA regulators (Singapore's MAS, Indonesia's OJK, Philippines' BSP) created dedicated **digital bank license** categories in the last few years, deliberately capping early-stage risk (e.g., Singapore's Digital Full Bank license initially caps deposits at S$50M and requires S$15M paid-up capital) before lifting restrictions as banks prove themselves.

**Singapore** (3 digital banks compared):

- **GXS Bank** (Grab-backed) — Digital Full Bank license, requires Singpass MyInfo + SG residency, targets gig workers/Gen Z with gamified "pockets," ~1.68–1.98% savings rates.
- **Trust Bank** (Standard Chartered + NTUC-backed) — full bank license (can do ATM withdrawals, unlike DFB-only peers), up to 2.25% with salary-crediting/spend conditions, deep NTUC/FairPrice rewards integration.
- **MariBank** (Sea Group-backed) — Digital Full Bank license, integrates with Shopee/Garena ecosystem, flat 1.88% rate, accepts foreigners/PRs with just a SG mobile number + Singpass.

**Indonesia** (OJK-licensed):

- **Bank Jago** — instant digital onboarding, deep Gojek ecosystem integration, customizable "pockets."
- **SeaBank** (Sea Limited/Shopee-backed) — mobile-first, high-interest savings, QRIS integration, affordability-focused.
- **Jenius** (BTPN) — Flexi Saver/Dream Saver/Split Bill tools, popular with freelancers.
- **Blu by BCA Digital** — targets Gen Z/millennials, multiple savings pockets, zero fees within the BCA network.

**Philippines** (GoTyme, Maya, etc.) and other SEA markets follow the same general playbook: e-commerce or telco parent company, national ID/mobile-number-based onboarding, QR-payment rail integration (QRIS in Indonesia, PayNow in Singapore, InstaPay/PESONet in the Philippines).

Pattern: SEA digital banks are almost always spun out of (or tightly partnered with) a super-app/e-commerce/ride-hailing parent (Grab, Sea/Shopee, Gojek), and success depends heavily on that ecosystem integration plus local payment-rail (QR) support — more than on FX or investment features.

## 5. Is the behavior the same across regions? No — three genuinely different models

| Dimension | Europe | China/Korea (Asia) | Southeast Asia |
|---|---|---|---|
| Core identity | Standalone multi-currency "super app" for banking + travel + investing | Banking embedded inside a massive existing platform (WeChat, KakaoTalk) | Banking spun out of / bundled with a local super-app (Grab, Shopee, Gojek) |
| Monetization | Subscription tiers + FX spread | Micro-transaction volume at near-zero marginal cost | Interest-rate competition + ecosystem cross-sell (rewards, e-commerce credit) |
| KYC/onboarding | Document + liveness checks, GDPR-bound, no shared ID database | National ID databases + embedded platform data pre-underwrite users in seconds | Mix: national ID/e-KYC (Singpass, OJK-approved e-KYC, Aadhaar-style rails where available) + mobile-number verification |
| Regulatory posture | Passportable EU-wide license, strict/centralized (AMLD6, AMLR, AMLA) | Licensed but regulator tolerates radical tech-first architecture | New dedicated "digital bank" license category with deliberate early caps (deposit/capital limits) that loosen over time |
| Lending speed | Days (still fairly traditional underwriting for loans) | Seconds (pre-underwritten via partner data before the user even asks) | Minutes to same-day, improving as ecosystems mature |
| Primary use case people reach for | Cross-border spending/FX, investing | Everyday micro-payments and instant micro-loans | Savings interest rate shopping + everyday QR payments |

The short answer: no, it is not the same. Europe optimized for a borderless, multi-currency, subscription-funded product because its regulatory environment permits EU-wide passporting and its customers cross borders often. China/Korea optimized for near-zero-cost, embedded, split-second lending because their platforms already own billions of daily interactions and huge behavioral datasets. Southeast Asia optimized for ecosystem bundling and local payment-rail integration because regulators created a brand-new capped license category and the strongest go-to-market is piggybacking on an existing super-app's user base, not building a standalone destination.

## 6. Implications for a side-project digital bank app

Given the project is described as based in Indonesia (Asia/Jakarta timezone) and being built as a side project (i.e., without a super-app parent or a real banking license), the SEA and Indonesian playbook is the most directly relevant reference, but a real license is very unlikely to be attainable for a side project — worth deciding early whether this is:

1. A **fintech/neobank-style app on top of a licensed BaaS (Banking-as-a-Service) partner** (most realistic path — similar to how many SEA fintechs launch before/without their own banking license), or
2. A **portfolio/demo project** that mimics digital-bank UX (account, transfers, savings pockets, QRIS-style QR payments) without real money movement.

Either way, the SEA patterns worth borrowing are: mobile-first onboarding via national ID + selfie liveness (OJK e-KYC style), "pockets"/sub-accounts for goal-based saving (Jago, GXS, Blu all do this), QR-payment integration as the default payment rail, and reward/cashback mechanics tied to an ecosystem rather than heavy FX features (which matter far more in Europe than in Indonesia).

## Sources

- [Neobank Comparison 2026: Revolut vs Monzo vs N26 — MobiBank](https://www.mobibank.fi/neobank-comparison-2026-revolut-vs-monzo-vs-n26-vs-mobibank/)
- [Best Neobanks Europe 2026 — Revolut vs N26 vs Wise — Freenance](https://freenance.io/fintech/neobanks-europe-comparison-2026/)
- [Revolut vs N26 vs Wise vs Bunq 2026 — Banks.eu](https://banks.eu/blog/revolut-vs-n26-vs-wise-vs-bunq)
- [WeBank: Insights From The World's Top Digital Bank — The Financial Brand](https://thefinancialbrand.com/news/banking-trends-strategies/digital-banking-transformed-podcast-china-webank-henry-ma-104213)
- [The State of Digital Banking in China: WeBank and MYbank — Medium](https://alexlewyl.medium.com/the-state-of-digital-banking-in-china-a-look-at-mybank-and-webank-b9a7c1bd5c87)
- [Joining the next generation of digital banks in Asia — McKinsey](https://www.mckinsey.com/industries/financial-services/our-insights/joining-the-next-generation-of-digital-banks-in-asia)
- [GXS Bank Vs Trust Bank Vs MariBank — DollarsAndSense](https://dollarsandsense.sg/gxs-bank-vs-trust-bank-digital-bank-choose/)
- [Best Digital Bank Savings Accounts: Trust vs GXS vs MariBank 2026 — Seedly](https://blog.seedly.sg/digital-banks-singapore/)
- [Digital Bank Singapore: Top 5 MAS-Licensed Banks 2026 — Airwallex](https://www.airwallex.com/sg/blog/digital-bank-singapore)
- [The Full List of Digital Banks in Indonesia 2026 — Fintech News Indonesia](https://fintechnews.id/107676/digital-banking-news-indonesia/list-of-digital-banks-in-indonesia/)
- [Global KYC in 2026: Region-wise Compliant Onboarding Rules — HyperVerge](https://hyperverge.co/blog/global-kyc/)
- [Global KYC Standards 2025 — AU10TIX](https://www.au10tix.com/blog/understanding-global-kyc-standards/)
