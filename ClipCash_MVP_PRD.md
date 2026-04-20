# ClipCash MVP — Product Requirements Document

| | |
|---|---|
| **Version** | 0.1 (Draft) |
| **Owner** | Shubh (PM) |
| **Eng lead** | TBD |
| **Design lead** | TBD |
| **Status** | Draft — pending engineering review |
| **Last updated** | 2026-04-20 |
| **Target release** | GA on 2026-07-13 (12 weeks from kickoff) |

---

## 1. TL;DR

ClipCash is a two-sided marketplace where brands pay creators **per verified view** for short-form content (clipping existing IP or original UGC) on TikTok and Instagram Reels.

The MVP ships the thinnest possible end-to-end loop: a brand can launch a per-view campaign in under 20 minutes, creators can discover and post against it, views are verified via platform OAuth, and payouts clear within 15 days. Fraud detection is basic-but-present from day one.

We are **not** building: YouTube Shorts support, ML matching, editor tools, mobile apps, non-US payouts, or agency sub-accounts. Those come post-MVP.

**We will know we succeeded when:** 50 brand accounts run a paying campaign, 500 creators earn a second payout, and dispute rate stays below 4%.

---

## 2. Background & Problem

### 2.1 The problem

- **Brands** overpay for influencer deals with unpredictable reach. Flat-fee creator contracts ($5K–$50K for a post) don't map to a performance outcome — a 50K-follower creator may generate 500 views or 5M. HubSpot (2024) reports **62% of marketers are unhappy** with influencer ROI visibility.
- **Creators** with small audiences can't monetize short-form effort. Platform creator funds require 10K+ followers and pay fractions of a cent per 1,000 views. Clippers who repurpose long-form IP (podcasts, streams) already get paid informally via spreadsheets and Discords — but the infrastructure is missing.

### 2.2 Why now

- Short-form dominates attention: TikTok 1.5B MAU, Reels 2B DAU.
- "Clipping economy" is already live at the top (MrBeast, Jake Paul, political campaigns) but non-programmatic.
- Creator ad spend projected to hit $33B globally by 2026 (Statista, IMH).

### 2.3 Evidence base

- 5 qualitative interviews (3 creators, 2 brand marketers, 1 podcast producer) — key themes: trust/verification, payment friction, rate transparency, campaign speed, creative freedom.
- Secondary data: HubSpot State of Marketing 2024, Influencer Marketing Hub Benchmark 2024, Statista Creator Economy.

Full context in the companion capstone deck: `ClipCash_PM_Capstone.pdf`.

---

## 3. Goals & Non-Goals

### 3.1 Goals (MVP)

| # | Goal | How we measure |
|---|---|---|
| G1 | Prove brands will pay ≥$0.035 effective CPV | Blended CPV within 15% of quote across ≥10 campaigns |
| G2 | Prove creators will post at ≥$0.015 CPV-to-them | ≥80 posts submitted across first 3 live campaigns in 14 days |
| G3 | Keep dispute rate below 4% | Disputes / total payouts by end of Week 12 |
| G4 | Brand time-to-live-campaign < 20 min | P50 signup-to-campaign-live stopwatch |
| G5 | Creator first payout within 15 days of first post | P90 calendar days post-to-payout |

### 3.2 Non-goals (explicit)

- YouTube Shorts integration (Q3 2026)
- Original brand content production (we are a marketplace, not a studio)
- ML-based creator/campaign auto-matching
- In-app video editor or template library
- Multi-currency & non-US payouts
- Native mobile apps (responsive web only)
- Real-time push notifications (email only for MVP)
- Programmatic API / agency sub-accounts
- Self-serve billing invoicing for agencies

---

## 4. Target Users

### 4.1 Primary persona — Brand (Maya, DTC Growth Lead)
- 31, Brooklyn, running $60K/mo paid across Meta + TikTok + creators
- Pains: flat-fee deals don't hit projections; 6+ hrs/week reconciling creator invoices
- Success criteria: known CPV per campaign <$0.05; half the ops time

### 4.2 Primary persona — Creator (Rohan, student clipper)
- 22, 14K TikTok followers across two clip accounts, 8–15 clips/day
- Pains: ghosted invoices, no platform-fund eligibility
- Success criteria: first payout in ≤15 days; visible campaign feed he qualifies for

Full personas in capstone deck (slides 11–12).

### 4.3 Exclusions from MVP
- Agencies buying on behalf of multiple brands (unsupported sub-accounts)
- Creators outside US (Stripe KYC + tax form blocker)
- Podcasters / long-form creators (out of platform scope)

---

## 5. Success Metrics

### 5.1 North Star
**Paid Verified Views per Week (PVV/week)** — captures both-sided activity in a single number.

### 5.2 Input metrics (leading)

| Category | Metric | Target by Week 12 |
|---|---|---|
| Supply | Weekly Active Creators (posted ≥1 in last 7d) | 500 |
| Supply | Posts per active creator / week | ≥3 |
| Demand | Weekly Active Brand Accounts | 50 |
| Demand | Avg campaign budget at launch | $5,000 |
| Conversion | Brand signup → campaign-live | ≥22% |
| Conversion | Creator signup → first post | ≥35% |

### 5.3 Guardrails (must not regress)

- Dispute rate < 4%
- Fraud-flag rate < 8% of posts
- Payout SLA hit rate (net-15) > 98%
- p95 page load < 2.5s
- p95 view-polling latency < 30 min from platform update

---

## 6. MVP Scope

### 6.1 In-scope for MVP (ship for GA)

**Brand side**
1. Email + password signup, Stripe customer creation
2. Campaign builder: brief (text + asset upload), budget, target CPV, start/end dates, eligibility (min followers, platforms, geo)
3. Stripe escrow deposit (held until campaign close)
4. Moderation queue: see all submitted posts per campaign; approve / dispute with reason
5. Campaign dashboard: live view count, spend-to-date, effective CPV
6. Email notifications on key events (post submitted, dispute, payout released)

**Creator side**
1. Email + password signup
2. OAuth connection: TikTok + Instagram
3. Campaign discovery feed filtered to what the creator is eligible for
4. Submit post URL against a campaign (1 submission per creator per campaign)
5. Earnings dashboard: per-post view count, state (pending / approved / paid / disputed), payout date
6. Stripe Connect onboarding (KYC) before first payout

**System / ops**
1. View polling job: every 6 hours per active post via platform OAuth APIs
2. Fraud scoring v1: watch-time ratio, device fingerprint, IP velocity
3. Payout engine: net-15 from campaign close, automated via Stripe Connect
4. Auto-approve on 72-hour brand inaction
5. Admin console (internal only): impersonate, refund, pause campaign
6. Observability: Datadog dashboards + PagerDuty on payout failures

### 6.2 Out-of-scope for MVP (deferred)
See section 3.2.

### 6.3 Platforms
- **Web only** (desktop + mobile responsive)
- Supported browsers: Chrome, Safari, Firefox, Edge (latest 2 versions)
- US-only creators and brands at launch

---

## 7. Functional Requirements

### 7.1 Brand — Campaign Builder

**FR-B1.** The system shall allow a brand to create a campaign with the following required fields: name, brief (text, ≤2000 chars), product asset URLs (up to 5), platforms (TikTok and/or Reels), budget (USD, min $500), target CPV ($0.010–$0.200 range), start date, end date (max 90 days from start), eligibility rules (min followers, US-only Y/N).

**FR-B2.** The system shall require a brand to deposit the full campaign budget into Stripe escrow before the campaign transitions to the `LIVE` state.

**FR-B3.** The system shall auto-pause a campaign when 90% of the budget has been paid out and notify the brand via email 48 hours before pause.

**FR-B4.** The brand moderation queue shall list all submitted posts for a campaign in reverse-chronological order with columns: creator handle, post URL, current views, current earnings, fraud score, state, submitted-at.

**FR-B5.** For each post in the queue, the brand may `Approve` (releases payout eligibility) or `Dispute` (requires a free-text reason, freezes payout, notifies creator).

**FR-B6.** Posts with no brand action for 72 hours after campaign close shall auto-transition to `APPROVED` state.

### 7.2 Creator — Discovery, Submit, Earn

**FR-C1.** After creator signs up and connects TikTok via OAuth, the system shall verify follower count and geography using the OAuth token scopes.

**FR-C2.** The campaign feed shall display only campaigns for which the creator meets all eligibility rules (platforms connected, min followers met, geo match).

**FR-C3.** Creators may submit one post URL per campaign. The system shall parse the URL, verify ownership via OAuth, and reject posts created before the campaign start date.

**FR-C4.** For every pending post, the system shall poll the platform API every 6 hours to refresh `view_count`, `like_count`, `comment_count`, and `watch_time_median`.

**FR-C5.** The creator's earnings dashboard shall display, per post, the current verified view count, earnings (views × campaign CPV), state, and expected payout date.

**FR-C6.** Creators must complete Stripe Connect KYC before any payout is released. Payout is held if KYC incomplete.

### 7.3 System — Verification, Fraud, Payout

**FR-S1.** View polling shall retry on platform API failure with exponential backoff (5s, 30s, 5min, 30min) and alert on-call after 4 failures.

**FR-S2.** The fraud score for a post shall be computed on every polling cycle and stored as a floating-point value 0.0–1.0. Posts with score ≥ 0.8 shall be auto-flagged for manual review.

**FR-S3.** The fraud score v1 inputs: (a) watch-time ratio vs. platform median, (b) device fingerprint diversity of viewers (if available via platform API), (c) IP velocity from referring traffic (if available), (d) sudden view spikes (z-score > 3 in rolling window).

**FR-S4.** Payouts shall be computed as `verified_views × campaign.cpv` and triggered via Stripe Connect 15 calendar days after campaign close, excluding disputed posts.

**FR-S5.** If a campaign's actual delivered CPV diverges >15% from `target_cpv`, the system shall notify PM + eng via Slack alert.

### 7.4 Admin

**FR-A1.** Admins can: search any user, impersonate, pause a campaign, force-refund a payout, override a fraud flag, and view audit log.

**FR-A2.** All admin actions shall be logged with actor, action, target, timestamp, and reason (required).

---

## 8. User Stories & Acceptance Criteria

### US-1 — Brand launches a campaign  [P0]

> As a **DTC growth marketer**, I want to go from signup to a live campaign in under 20 minutes, so that I can test ClipCash against my existing Meta spend this week.

**Acceptance criteria:**
- **Given** I am signed up and verified, **when** I complete the campaign builder form with all required fields and deposit the budget via Stripe, **then** the campaign transitions to `LIVE` and is visible in eligible creators' feeds within 60 seconds.
- **Given** my deposit fails, **then** the campaign remains in `DRAFT` state and I see an inline Stripe error message with retry CTA.
- **Given** I set a budget below the $500 minimum, **then** I cannot submit the form and see inline validation messaging.

### US-2 — Creator discovers and submits a clip  [P0]

> As a **clipper with 14K TikTok followers**, I want to see only campaigns I qualify for and submit a post in ≤90 seconds, so that I don't waste time on ineligible or fake-looking offers.

**Acceptance criteria:**
- **Given** I've connected TikTok and Instagram, **when** I open the campaign feed, **then** I see only campaigns where my follower count, geography, and platforms match.
- **Given** I've clicked "Submit" on an eligible campaign and pasted a TikTok URL I posted after campaign start, **then** the post is accepted and appears in my earnings dashboard in `PENDING_VIEWS` state within 10 seconds.
- **Given** I paste a URL for a post created before the campaign start date, **then** the submission is rejected with the reason "Post must be created after campaign start."
- **Given** I've already submitted one post to a campaign, **then** the "Submit" button is disabled with the tooltip "Only one post per campaign."

### US-3 — System verifies views  [P0]

> As the **platform**, we want to verify views via authenticated platform APIs so that brands trust the view counts and creators trust the payout math.

**Acceptance criteria:**
- **Given** a post is in `PENDING_VIEWS` state, **when** the 6-hour poll cycle runs, **then** the post's `verified_views`, `watch_time_median`, `like_count`, `comment_count`, and `fraud_score` are updated.
- **Given** the platform API returns an auth error, **then** the poll retries with exponential backoff up to 4 times, then alerts on-call.
- **Given** a post's fraud score crosses 0.8, **then** the post transitions to `FLAGGED` state, is hidden from earnings totals, and an admin review ticket is created.

### US-4 — Brand moderates posts  [P0]

> As a **brand marketer**, I want to approve or dispute each submitted post before payout so that I don't pay for off-brand content.

**Acceptance criteria:**
- **Given** a post is in `PENDING_APPROVAL` state, **when** I click "Approve", **then** the post transitions to `APPROVED` and is eligible for payout at campaign close.
- **Given** I click "Dispute", **then** a modal requires a free-text reason (10–500 chars), and on submit the post transitions to `DISPUTED`, the creator receives an email, and payout is frozen pending resolution.
- **Given** I have not acted on a post for 72 hours after the campaign closes, **then** the post auto-transitions to `APPROVED` and the creator is notified.

### US-5 — Creator gets paid  [P0]

> As a **creator**, I want my payout to land in my bank within 15 days of the campaign closing so that I can rely on ClipCash as recurring income.

**Acceptance criteria:**
- **Given** I have completed Stripe Connect KYC AND I have ≥1 approved post, **when** 15 calendar days pass after campaign close, **then** the payout is initiated via Stripe Connect and I receive an email with the Stripe transfer ID.
- **Given** I have NOT completed Stripe Connect KYC, **then** the payout is queued in `HELD_KYC` state and I receive an email prompting KYC.
- **Given** my payout fails at Stripe (e.g., bank account rejected), **then** the payout transitions to `FAILED`, I receive an email with instructions, and the on-call eng is paged.

### US-6 — Creator sees earnings  [P1]

> As a **creator**, I want to see per-post earnings and payout dates at a glance so that I can plan my week.

**Acceptance criteria:**
- **Given** I have active posts, **when** I open the earnings dashboard, **then** I see a list of all posts with columns: campaign name, current views, earnings, state, expected payout date.
- **Given** any post's view count updates, **then** the dashboard reflects the new earnings value within 5 minutes of the polling job completing.

### US-7 — Brand sees campaign performance  [P1]

> As a **brand marketer**, I want a live campaign dashboard so that I can judge whether to increase the budget mid-flight.

**Acceptance criteria:**
- **Given** my campaign is `LIVE`, **when** I open the campaign dashboard, **then** I see: total posts, total verified views, spend-to-date, effective CPV, top 5 creators by views.
- **Given** effective CPV diverges >15% from target, **then** I see an inline warning banner suggesting actions (pause, increase CPV, tighten eligibility).

### US-8 — Brand increases budget mid-campaign  [P2 — post-GA]

Deferred.

---

## 9. Non-Functional Requirements

### 9.1 Performance
- p95 page load < 2.5s on 4G mobile
- p95 API response time < 400ms
- View polling job completes for all active posts within 30 min of cycle start

### 9.2 Security
- All OAuth tokens encrypted at rest with KMS
- OAuth scopes minimized: `user.info.basic`, `video.list`, `video.insights`
- No raw platform passwords stored; OAuth only
- TLS 1.3 for all external traffic
- PII access logged; SSO required for admin console
- Secrets rotated quarterly

### 9.3 Privacy & compliance
- CCPA + GDPR-ready data export & deletion endpoints
- Stripe Connect handles US KYC (SSN-last-4, DOB, address)
- 1099-NEC generation for creators earning >$600/yr
- Clear user consent for OAuth scopes with plain-language copy
- Data retention: 7 years for tax, 90 days for raw view polls, 2 years for aggregated analytics

### 9.4 Reliability
- 99.5% monthly uptime for brand and creator apps
- 99.9% uptime for payout engine (tier-1 service)
- RTO 4h, RPO 1h (daily snapshots + 1h WAL)
- Incident response runbook for payout failures, OAuth outages, fraud surges

### 9.5 Accessibility
- WCAG 2.1 AA for all user-facing pages
- Keyboard navigation for all primary flows
- Color-contrast ratio ≥4.5:1 (except large decorative text)

---

## 10. UX Flows

### 10.1 Brand flow: signup → campaign live
```
Sign up (email) → Verify email → Stripe customer create → Campaign builder
  → Brief + assets → Budget + CPV → Dates + eligibility → Review
  → Stripe deposit → LIVE
```

### 10.2 Creator flow: signup → first payout
```
Sign up (email) → Verify email → Connect TikTok OAuth → Connect IG OAuth
  → Campaign feed → Select eligible campaign → Submit post URL
  → 6h polling cycles → Brand approves (or auto-approve @ 72h)
  → Stripe Connect KYC → Net-15 payout → Email with Stripe txn ID
```

### 10.3 Dispute flow
```
Brand disputes → Creator notified (email + in-app) → Creator can reply
  → Admin review queue → Admin resolves (pay / no-pay) → Both parties notified
```

Wireframes for the top three screens are in the capstone deck (slide 32): Brand campaign builder, Creator campaign feed, Creator earnings dashboard. Hi-fi designs TBD by design lead.

---

## 11. Dependencies

### 11.1 External
| Dependency | Purpose | Risk |
|---|---|---|
| Stripe Connect | Escrow + creator payouts + KYC | Stripe outage = no payouts |
| TikTok Developer API | OAuth + view polling | API rate limits; policy change |
| Instagram Graph API | OAuth + view polling | API rate limits; policy change |
| AWS (RDS, S3, SQS) | Infra | Regional outage |
| SendGrid | Transactional email | |
| Datadog | Observability | |
| PagerDuty | Alerting | |

### 11.2 Internal
None (greenfield build).

### 11.3 Legal / compliance
- ToS + Privacy Policy signed off by counsel
- Creator agreement (payout terms, 1099, content license-back to brand)
- Brand agreement (escrow terms, dispute SLA, refund policy)

---

## 12. Risks & Open Questions

### 12.1 Top risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | TikTok/IG revokes/restricts OAuth view access | Medium | Critical | Multi-source verification v2; creator-uploaded screenshots as fallback |
| R2 | Fraud ring uses bot views at scale | Medium | High | Fraud scoring v1 in MVP; manual review >0.8; rate-limit per creator |
| R3 | Stripe Connect KYC blocks too many creators | Low | High | Partner with Stripe support rep; in-app KYC walkthrough |
| R4 | Brand churns after 1 campaign | Medium | High | Case-study content + post-campaign CSM outreach |
| R5 | Payout engine bug causes double-pay | Low | Critical | Idempotency keys; daily reconciliation; on-call paged on payout failures |
| R6 | Low creator density kills campaigns | Medium | High | Seed supply via Discord partnerships before inviting brands |

### 12.2 Open questions

- **OQ1:** Should we require creators to include a disclosure hashtag (`#ad`, `#sponsored`)? — Legal review needed by 2026-05-15.
- **OQ2:** Do we reveal individual creator handles to brands pre-approval, or anonymize? — UX research needed.
- **OQ3:** What happens if a creator deletes their post mid-campaign? Lock earnings at deletion time vs. zero them? — Policy decision needed.
- **OQ4:** Tax treatment: is ClipCash a marketplace facilitator (collects sales tax) or a payment agent? — Tax counsel needed.
- **OQ5:** Minimum payout threshold — $25 or $10? — Trade-off between creator retention and Stripe per-payout fees.

---

## 13. Release Criteria

### 13.1 Alpha (end of Sprint 4 — internal only)
- 3 internal team members can end-to-end create campaign → submit post → see payout queued
- 100% of FR-S1, FR-S4 automated tests passing
- Stripe test-mode integration working

### 13.2 Private Beta (end of Sprint 5 — 10 creators + 5 brands, concierge-assisted)
- All P0 user stories passing manual QA
- Fraud scoring v1 deployed
- On-call rotation live; runbooks drafted
- Privacy policy + ToS signed off by counsel

### 13.3 Invite-only launch (end of Sprint 6)
- All P0 + P1 user stories passing
- 100 creators + 20 brands onboarded without eng intervention
- Dispute rate <5% in private beta
- p95 page load < 2.5s verified on production
- Datadog dashboards + PagerDuty fully configured

### 13.4 GA (Week 12, 2026-07-13)
- ≥ 30-day soak on invite-only with no P0 bugs
- Case study from at least 2 private-beta brands
- Open signup enabled; ProductHunt + creator-community launch campaign ready
- Scalability verified at 10x expected load

---

## 14. Timeline & Milestones

12 weeks total. Six 2-week sprints.

| Sprint | Dates | Theme | Key deliverables |
|---|---|---|---|
| S1 | Apr 20 – May 3 | Foundations | Auth, DB, Stripe Connect, brand signup |
| S2 | May 4 – May 17 | Campaigns | Campaign builder, escrow deposit, campaign list view |
| S3 | May 18 – May 31 | Creators | OAuth (TT + IG), feed, creator profile, eligibility |
| S4 | Jun 1 – Jun 14 | Loop | Post submission, view polling, fraud v1, alpha milestone |
| S5 | Jun 15 – Jun 28 | Payouts | Moderation queue, dispute flow, Stripe Connect payouts, private beta |
| S6 | Jun 29 – Jul 12 | Harden | A/B infra, observability, load testing, invite-only launch |
| — | Jul 13 | **GA** | Open signup, press push |

Execution cadence: daily async standup, weekly ship review, bi-weekly sprint planning, monthly OKR scoring.

---

## 15. Out of PRD

- Marketing / GTM plan — see capstone deck phase 14
- Pricing structure — see capstone deck phase 8 (0 platform fee on Starter, 10% take on Growth, negotiated on Enterprise; finalized before GA)
- Hiring plan
- Post-MVP roadmap (Q3+)

---

## Appendix A — Glossary

- **PVV** — Paid Verified View. A view confirmed via platform OAuth polling that is eligible for payout.
- **CPV** — Cost Per View. Brand pays (target_cpv) × (verified_views) per post.
- **Clipping** — Repurposing long-form content (podcasts, streams) into short-form clips.
- **UGC** — User-Generated Content. Original short-form content made by creators.
- **Fraud score** — 0.0–1.0 per-post signal; ≥0.8 triggers manual review.
- **Net-15** — Payout initiated 15 calendar days after campaign close.

## Appendix B — Links

- Capstone deck: `ClipCash_PM_Capstone.pdf`
- Figma wireframes: `TBD`
- Eng design doc: `TBD` (to be written by eng lead during S1)
- OKRs: capstone deck slide 39

---

*End of PRD v0.1 — feedback welcome before Sprint 1 kickoff.*
