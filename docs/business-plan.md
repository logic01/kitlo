# Kitlo — Business Plan

> Version 2.0 · Effective 2026-05-10
>
> **v2.0 — overlanding pivot.** Kitlo is now an overlanding-led marketplace; hunting optics, fly fishing, power stations, and (Phase 2+) outdoor cooking are sub-verticals inside it. Source research: `C:/repo/p2p/concept-research.md` (Adventure Ventures top-4 matrix) and the per-niche briefs in `C:/repo/p2p/{camping-overlanding-gear,night-hunting-optics,fly-fishing-gear,portable-power-stations,smoker-and-pizza-oven-rental}/`.
>
> Owns: pricing, take rate, revenue model, phased rollout, vertical sequencing. Cross-references `docs/p2p-business-model.md` for general P2P theory and `docs/gear-catalogue.md` for inventory categories. Operational fee values used by the product live in `docs/features/03-create-listing.md`, `docs/features/07-booking-request.md`, and `docs/features/15-payouts-earnings.md` — those files defer to this document for the source of truth.

---

## 1. Mission

Kitlo is a peer-to-peer marketplace where overlanders list and rent the high-value gear that makes long trips possible. The anchor catalogue is **camping & overlanding kit** (rooftop tents, 12V fridges, awnings, recovery boards, dual-battery, full builds). Layered on top are the gear categories overlanders carry on the way: **night hunting optics**, **portable power stations**, **fly fishing**, and (Phase 2+, provisional) **outdoor cooking**.

We make underutilized gear earn its keep, and we make premium gear accessible without a $4,000 RTT or $5,000 thermal outlay.

## 2. Customer & Value

- **Renters** — overlanders, weekend campers, destination hunters and anglers, and outage-prep households who want to use premium gear without buying it. Same-day local pickup beats 2–3 day mail-order shipping; bundle rentals (RTT + fridge + awning, or thermal + NV) eliminate the multi-vendor coordination tax.
- **Listers** — owners whose specialty gear sits idle 60–95% of the year. Overlanders typically own 5–10 listable items per truck (RTT, fridge, awning, recovery boards, power station, navigation, camp kitchen). Hunters own thermal/NV stacks worth $5–15k that see 10–20 nights a season. Anglers own size-specific waders + specialty rod weights that travel poorly. We turn idle gear into income with no listing fee, identity-verified renters, and Stripe-backed payouts.

### Vertical sequencing

| # | Vertical | Phase | Why this order |
|---|---|---|---|
| 1 | **Camping & Overlanding** | Phase 1 anchor | Highest weighted score (8.65); easiest cold start (ExpeditionPortal 180K, r/overlanding 67,888); highest geographic distribution; best AOV-per-supply-acquisition. |
| 2 | **Night Hunting Optics** | Phase 1 (already wired) | Most defensible vertical (no national P2P competitor); highest unit economics ($500–900 bundle AOV); already implemented in the existing codebase. Sequenced as a parallel vertical, not a follow-on. |
| 3 | **Portable Power Stations** | Phase 1 bundle add-on only | Standalone is foreclosed by Hygglo / FriendWithA / ShareGrid (active US horizontal P2P). Bundled with overlanding kit, marginal CAC is near-zero and contribution margin is the highest in the portfolio. |
| 4 | **Fly Fishing** | Phase 2 layered vertical | Lowest standalone economics ($150–250 AOV); only viable layered onto overlanding's owner base, payments, and trust infrastructure. Trout Unlimited 300+ chapter network is the supply-side acquisition channel. |
| 5 | **Smokers & Pizza Ovens** | Phase 2+ provisional | Documented in `docs/gear-catalogue.md` but not built. Sub-2x/year frequency and Big Green Egg owner activation friction make it marginal. Re-evaluate after the first four verticals show liquidity. |

## 3. Revenue Model

Kitlo earns revenue through a **transaction take rate** split across both sides of the marketplace:

- **Renter service fee** — added to the renter's checkout total
- **Lister payout fee** — deducted from the lister's payout

A single percentage applies to each side. There are no listing fees, no monthly fees, and no charges to browse, message, or favorite. Optional revenue lines (Renter Protection Plan, featured listings, premium subscriptions) are explicitly out of scope for Phase 1 — see Section 8.

## 4. Pricing — Phased Rollout

Fees scale up as the platform earns trust and adds value. Each phase has a clear trigger.

| Phase | Trigger | Renter fee | Lister fee | Total take | Positioning |
|---|---|---|---|---|---|
| **1 — Launch** | 1–3 metro launch markets | **5%** | **5%** | **10%** | "Lowest fees in P2P rental." |
| **2 — Growth** | Active in 4–15 metros, GMV > $2M/yr | 7% | 8% | 15% | At parity with Airbnb host+guest combined. |
| **3 — Scale** | Active in 15–50 metros, GMV > $20M/yr | 9% | 10% | 19% | At market with established competitors. |
| **4 — Peak** | Nationwide, GMV > $100M/yr | 10% | 12% | 22% | Premium positioning, with brand loyalty earned. |

### Why split the fee 5% / 5%

- **Renter sees** "Daily rate × days + 5% service fee" — the cheapest checkout in the category.
- **Lister sees** "Keep 95% of every booking" — the highest payout rate in the category.
- Putting all of the take on one side creates sticker shock; splitting it lets each side feel the platform is favoring them.
- Each lever can be raised independently in later phases (e.g., raise the renter fee to 7% in Phase 2 while leaving listers untouched).

### Lock-in promise (early listers)

The first 1,000 listers on the platform receive a **24-month rate lock at the Phase 1 fee structure** — even after general pricing scales to Phase 2/3. Cost to Kitlo: small. Trust earned with the people who power the supply side: very large.

## 5. Cost Structure

Every transaction must clear these costs before it generates margin:

| Cost | Magnitude | Notes |
|---|---|---|
| Stripe Connect processing | ~3.2–3.5% of GMV | 2.9% + $0.30 per transaction + Connect platform/payout fees. Non-negotiable. |
| Chargeback / fraud reserve | ~0.5–1.0% of GMV | Industry-standard reserve for marketplace platforms. |
| Cloudinary, hosting, tooling | ~1–2% of GMV early; declines with scale | Cloudinary tier escalates with image volume. Backend hosts on a single VPS in early phases. |
| Customer support | $0–$80k/yr through Phase 1 | Founders cover support in Phase 1. First support hire mid-Phase 2. |
| **Concierge Supply Acquisition (Q3 SKUs)** | **~$5–10k direct + 80–120 founder hours over Phase 1** | Dedicated workstream for supply where renter demand is high but owner listing propensity is low — NV goggles, thermal rifle scopes, premium fly rods, sat communicators. See §"Concierge Supply Acquisition workstream" below. |
| Marketing / CAC (Q1 organic supply + renter-side) | Variable; Phase 1 deliberately low | Community-led growth (ExpeditionPortal, HuntTalk, r/overlanding). Cold outreach to Q1 wedge SKU owners converts at near-zero CAC. |
| Engineering / G&A | Founders' time through Phase 1 | First engineering hire upon clearing $25k MRR. |

**Net margin at 10% take rate is roughly 6–7%** of GMV after Stripe and infrastructure — thin but viable when ops are kept lean.

### Concierge Supply Acquisition workstream

Per `docs/rental-demand-model.md` §6 (the LPS × RDS 2×2), a distinct class of SKUs sits in the **Q3 quadrant**: low listing propensity (LPS), high rental demand (RDS). Without intervention, these SKUs do not appear on the platform organically — and the night-optics flagship bundle (thermal-detect + NV-engage) depends on Q3 supply for the NV half. Treating Q3 as "founder time" inside marketing or ops obscures the fact that it is a separate workstream with its own playbook and budget.

**Phase 1 Q3 targets (per `docs/geographic-liquidity-model.md`):**

- Bozeman: ~7–8 seeded NV / scope listings (the Q3 half of the 15-listing optics open threshold)
- San Antonio / Austin: ~7–8 seeded NV / scope listings (parallel)
- Cross-metro: ~2–3 sat-communicator listings (nationwide-shippable single pool)
- **Total Phase 1 seeded units: ~15–20**

**Cost components:**

| Component | Phase 1 budget | Notes |
|---|---|---|
| Lister incentives (first-month protection, white-glove photo, identity-tier insurance) | ~$200 × 15–20 units = $3–4k | Reimbursed to listers; not platform overhead. |
| Manufacturer / dealer partnership outreach | ~$0–2k cash | Founder time dominates; possible co-marketing spend if a partnership closes. |
| Guide / outfitter partnership outreach | ~$0–500 | Relationship + onboarding; cash cost minimal. |
| Founder time | 80–120 hours over 6 months | Direct calls / DMs to high-end-gear-community members; ride-alongs at Overland Expo / hunting shows. |

**Why this is its own line item:** generic marketing spend does not buy Q3 supply. A $1k Meta ad campaign targeting "NV scope owners" produces near-zero listings because the LPS-driving barriers (attachment, ITAR friction, deposit anxiety, $4k+ replacement cost) are not removed by impressions. They are removed by direct concierge handling — phone calls, custom protection terms, white-glove onboarding, manufacturer-co-signed trust. Phase 1 success depends on this workstream being staffed and budgeted as such, not absorbed into "marketing" or "ops". See `docs/marketing.md` §4.5 for the operational playbook.

## 6. Phase Modeling & Profit Targets

### Phase 0: Two-market supply-side validation (overlanding + hunting optics)

Before committing engineering and capital to a multi-metro Phase 1 rollout, Kitlo runs **two parallel paid-ad validations**, one per anchor vertical, to test the load-bearing supply-side assumption: that owners of $1k–$15k specialty gear will list it on a new platform. Demand is plausible by default and can be validated for free through forums and shop visits; supply is the actual business risk and merits a small paid spend.

**Phase 0a — Denver overlanding validation.** $100 Meta ad campaign targeting RTT/fridge/dual-battery owners in the Denver/Boulder metro. Objective: supply-side waitlist signups.

**Phase 0b — Bozeman hunting optics validation.** $100 Meta ad campaign targeting thermal/NV optics owners in the Bozeman metro. Objective: supply-side waitlist signups.

**What Phase 0 informs:**

- Go / no-go on the Phase 1 plan below ($100k profit at 3 active metros).
- Determines whether overlanding or optics is the stronger primary vertical to lead Phase 1 launch comms with.
- Overlanding result determines the second overlanding metro (candidates: Seattle/Bellingham, Phoenix, Salt Lake City).
- Optics result determines the second optics metro (candidates: San Antonio/Austin, Minneapolis).

**Execution detail — ad specs, creative copy, targeting interest stacks, decision criteria per market, and the parallel zero-cost validation playbook (forums + in-person shop visits) — lives in `docs/marketing.md` §3.** This document owns the *strategic framing* (Phase 0 exists, what it validates, what it informs); marketing.md owns the *campaign execution*.

### Phase 1: $100k profit at 3 active metros

Conservative model for a launch sequenced as **Denver (overlanding anchor) + a second overlanding metro + Bozeman (hunting optics anchor)**, with the second overlanding metro selected based on Phase 0 outcomes (Seattle/Bellingham, Phoenix, or SLC):

| Input | Value |
|---|---|
| Active listings per metro | 500 |
| Number of metros | 3 |
| Total active listings | 1,500 |
| Rentals / listing / month | 1.5 |
| Annual rentals | 27,000 |
| Average rental GMV | $250 |
| **Annual GMV** | **$6.75M** |

> **AOV up from v1.x ($150) to $250.** Overlanding specialty kit ($400–800 booking) and the optics bundle ($500–900) lift the blended AOV well above the hunting-optics-only model. Power-station bundle adds 20–40% on top of qualifying overlanding bookings.

| Output | Value |
|---|---|
| Revenue at 10% take rate | $675,000 |
| Less Stripe (3.5% of GMV) | −$236,000 |
| Less ops (hosting, tooling, 1–2 FTE) | −$150,000 |
| **Profit** | **~$289,000** ✅ |

The model clears the $100k profit target with substantial headroom. It still passes at half the volume (15K rentals @ $250 AOV) and at half the AOV ($125, ~hunting-only-equivalent) thanks to the take-rate scaling — Phase 2 fees (15%) recover the model if either lever lags.

#### Open → mature trajectory (the 55 → 500 listing runway)

The 500 listings/metro figure above is the **mature operations** target, not the launch threshold. Per `docs/geographic-liquidity-model.md` §4, the **minimum-viable density to open a metro to public marketing** is materially lower:

| Milestone | Listings per metro | What it means |
|---|---|---|
| **Open** | ~55 (≈40 overlanding + ~15 night-optics) | Search-zero-results rate stays under 25% on top-10 queries; consumer marketing can turn on without producing a graveyard search experience. |
| **Sustainable** | ~100 | Listing-publish-to-first-booking time medianizes under 45 days; active-listing churn drops under 30%/quarter. |
| **Mature** | 500 (this section's model input) | The 27,000 annual rentals × $250 AOV × 10% take rate figure used above. |

#### The 55 listings are not homogeneous — split by acquisition origin

Per `docs/rental-demand-model.md` §6 (LPS × RDS 2×2) and `docs/geographic-liquidity-model.md` §5, the Open-threshold listing count needs to be **split by acquisition channel** because Q1 and Q3 supply require different cost structures and different workstreams:

| Metro | Q1 organic (overlanding wedge) | Q1 organic (night-optics gateway) | Q3 concierge-recruited (NV / scope / sat-comm) | Total |
|---|---|---|---|---|
| **Denver / Boulder** (overlanding anchor) | ~40 (RTT softshell + hardshell, awning, 12V fridge, kitchen, dual-battery — community-pull) | n/a | n/a | ~40 |
| **Second overlanding metro** (Phase 0a outcome) | ~30 organic + ~10 concierge | n/a | n/a | ~40 |
| **Bozeman** (optics anchor) | n/a | ~7–8 organic handheld thermal + NV monocular | ~7–8 concierge NV goggles / thermal rifle scope / clip-ons | ~15 |
| **San Antonio / Austin** (Phase 0b outcome) | n/a | ~7–8 organic handheld thermal + NV monocular | ~7–8 concierge NV goggles / thermal rifle scope / clip-ons | ~15 |
| **Cross-metro pool** (shippable) | n/a | n/a | ~2–3 sat-communicators (single nationwide pool) | ~3 |

Roughly **80% of Phase 1 Open-threshold listings come from organic Q1 outreach** (cold conversations with RTT and handheld thermal owners on ExpeditionPortal / HuntTalk — high response rate, near-zero CAC). The remaining ~20% requires the **Concierge Supply Acquisition workstream** defined in §5 above. Without the concierge work, Q3 supply does not appear, and the night-optics flagship bundle (thermal-detect + NV-engage) cannot exist on the platform — leaving Kitlo with thermal-only listings that compete head-to-head against UNV and Feral Texas.

The implied runway is **6–12 months from "open" to "mature" per metro**, financed by the concierge-recruitment effort (~75 hand-recruited listings across the three Phase 1 metros) described in `docs/owner-segmentation.md`. The public-marketing gate is liquidity, not calendar time — turn on consumer acquisition only when a metro is past the Open threshold *and* the three detection signals (search-zero-results, time-to-first-booking, listing churn) have stayed in healthy bands for 30 consecutive days. See `docs/geographic-liquidity-model.md` §6 implication 4.

This trajectory matters for cash modeling: Phase 1 contribution margin is back-loaded toward month 9–12 per metro, not linear from month 1. Earlier consumer-marketing spend buys disappointment, not bookings.

### Phase 4: $1M–$2M profit nationwide

Mature-state scenario at peak operation:

| Input | Value |
|---|---|
| Metros active | 50 |
| Active listings per metro | 1,000 |
| Total active listings | 50,000 |
| Rentals / listing / month | 2.0 |
| Annual rentals | 1,200,000 |
| Average rental GMV | $200 |
| **Annual GMV** | **$240M** |

| Output | Value |
|---|---|
| Revenue at 18% take rate (mid-Phase 4) | $43.2M |
| Less Stripe (3.5% of GMV) | −$8.4M |
| Less ops (~30 FTE, marketing, infra) | −$25M |
| **Profit** | **~$10M** |

Even capturing only **20% of this scale** (≈10 metros), the math comfortably clears the $1–2M target.

## 7. Competitive Context

### Platform take rates (general P2P benchmark)

| Platform | Combined take rate | Notes |
|---|---|---|
| Hygglo (formerly Fat Llama) | ~25% | Re-entered US Nov 2025; horizontal P2P with thin overlanding/cooking depth. |
| FriendWithA | ~20% | US horizontal P2P; some power-station and grill listings; not vertical. |
| Outdoorsy (RV) | ~30% | Higher because of insurance bundling. |
| Turo (cars) | 15–40% | Range driven by protection plan tier. |
| Airbnb | ~17% | 14% guest + 3% host. |
| GetMyBoat | 16–21% | Boat-specific P2P. |
| Hipcamp | 10% (host only) | Outdoor-adjacent. |

Kitlo at 10% in Phase 1 is **the lowest combined take rate of any P2P rental marketplace in our category.** Marketing wedge, not a permanent commitment — it's how we win the supply side fast against Hygglo's horizontal-but-thin presence.

### Per-vertical competition (May 2026 snapshot, full source in `C:/repo/p2p/`)

| Vertical | Direct competitors | P2P gap | Kitlo's wedge |
|---|---|---|---|
| **Camping & Overlanding** | REI Rental (115 stores, generic), GeerGarage (multi-metro P2P, generic), Hygglo (US horizontal), BaseCamper (rig-heavy), Built to Roam (single-market B2C) | **Strong** — no national overlander-tribe-native P2P; specialty-kit catalogue gap is open | Specialty kit (RTTs, 12V fridges, dual-battery, recovery, awnings) + community-native sourcing on ExpeditionPortal / r/overlanding. |
| **Night Hunting Optics** | Ultimate Night Vision (B2C national mail-order), Feral Texas Outdoors (TX local + ships), ~10 other B2C, no P2P | **Strong** — no P2P competitor for either thermal or NV; bundle does not exist anywhere | Same-day local pickup; bundle (thermal-detect + NV-engage) as a single booking; community-native via HuntTalk / Predator Masters / Texas Hunting Forum. |
| **Portable Power Stations** | Hygglo, FriendWithA, ShareGrid (all active US horizontal P2P) | **Standalone foreclosed; bundled gap is strong** | Rolled into overlanding bookings. Zero standalone marketing spend. Highest contribution margin in the portfolio. |
| **Fly Fishing** | RentWaders.com (B2C national), Borrowed Fly (Denver/CO Springs B2C concierge), CastBack (P2P resale, not rental), gateway-town shops | **Partial** — gateway towns covered; non-destination rivers and riverbank delivery open | Owner-as-guide local intel; specialty rod weights; Trout Unlimited 300+ chapter sourcing. |
| **Smokers & Pizza Ovens** | Hygglo (~4 listings), FriendWithA (sparse), regional B2C catering operators | **Strong** but supply-activation friction is high (BGE-owner reluctance) | Phase 2+ — re-evaluate after primary verticals show liquidity. See `docs/smokers-pizza-vertical-rejection.md` for the consolidated rejection. |

### Night-optics regional pooling — structural cost advantage

Per `docs/geographic-liquidity-model.md` §2 and §6 implication 3, night optics has a property no other vertical shares: **renter pickup-radius willingness is 50–120 mi, and premium units are shippable via insured carrier**. Overlanding gear maxes out at ~60 mi (vehicle-fit constraints, en-route pickup) and is not practically shippable (RTTs and 12V fridges don't fit in a padded mailer).

The consequence is geometric:

| Vertical | Per-metro liquidity required | How many metros to cover Mountain West + Texas + Southeast |
|---|---|---|
| **Overlanding** | ~80 listings per metro at sustainable density; each metro serves its own 60-mi radius | 6–8 metros |
| **Night optics** | ~30 listings in a regional pool (with shipping); one anchor metro serves a multi-state region | **2 anchor metros (Bozeman + San Antonio) cover Mountain West + Southwest + adjacent states** |

**Implication for Phase 1 cost structure:** the night-optics vertical is structurally cheaper to scale than overlanding on a per-region basis. Bozeman serving WY/ID/eastern MT and San Antonio serving TX/OK/LA/AR/southern Southeast is feasible at the Phase 1 listing count (~30 active optics listings across the two metros + sat-communicator nationwide pool). Overlanding does not have this property — Denver does not serve Phoenix's renter base.

This advantage feeds into the Phase 2 metro-expansion sequencing: optics expansion can run ahead of overlanding expansion because each new optics metro carries marginal supply cost, not full-stack supply cost. Plan optics Phase 2 metro additions (Minneapolis, Southeast anchor) before overlanding Phase 2 metro additions (Bend, Boise) for cost-efficient regional coverage.

## 8. What We Are NOT Charging For (Phase 1)

Discipline matters early. We will not introduce these revenue lines until after Phase 1 is closed and the core take rate is proven:

- **Listing fees** — would choke supply growth. Always free.
- **Subscription tiers** — adds complexity and conversion friction at a stage where every lister matters.
- **Featured / promoted listings** — search relevance is the wrong place to monetize while supply density is being built.
- **Renter Protection Plan as required revenue** — the product spec calls for it on > $1,000 MSRP gear; in Phase 1 it is offered at cost (no Kitlo margin), to avoid the appearance of fee stacking.
- **Damage protection insurance markup** — pass-through pricing in Phase 1; revenue line introduced in Phase 2 once underwriter relationship is established.
- **Float on held funds** — material only at $50M+ GMV. Out of scope until Phase 3.
- **Instant payout fee** — Stripe supports it (~1% additional fee); offer it free through Phase 1 to drive lister adoption.

## 9. Trust Levers Tied to Pricing

Pricing is part of trust, not separate from it. Specific commitments:

- **Cost transparency** — every fee line displayed at booking time and on the lister's payout receipt. No buried charges, no asterisks.
- **Phase schedule published** — listers can see in their Lister Agreement that the rate they signed up at lasts 24 months even if general pricing rises.
- **Free cancellation** — under the flexible policy, no platform cut on refunds. The fee follows the rental, not the customer.
- **No listing-fee surprises** — listing remains free forever. Only completed bookings generate revenue for Kitlo.

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Disintermediation** — listers and renters transact off-platform to avoid the 10% | Hold deposits + protection through Kitlo only. Reviews + dispute resolution + escrow only available for on-platform bookings. Lock the rate so listers don't have a fee-driven incentive to leave. |
| **Race to the bottom** — competitor undercuts at 5% total | At 5% combined we no longer cover Stripe + infra. Defend with brand, supply density, and the lock-in promise instead of dropping the rate further. |
| **Stripe platform fee changes** | Stripe Connect platform fees have been stable, but a 1% increase eats meaningfully into Phase 1 margin. Monitored quarterly; trigger Phase 2 transition if Stripe terms degrade materially. |
| **Renter sticker shock at higher fees in Phase 2** | Communicate the change months ahead; honor existing booking's fee on extensions. |
| **Lister churn when fee rises in Phase 2** | The 24-month lock-in promise covers Phase 1 listers. New listers see the higher rate at signup — no rug-pull. |
| **CAC outpacing take rate** | Phase 1 deliberately avoids paid acquisition. Community-led growth keeps CAC near zero until take rate covers it. |

## 11. Operational Implementation Notes

For engineering and product to consume:

- The **renter service fee** is stored on each `Listing` as `serviceFeeBp` (basis points). Phase 1 default: **500 (5%)**.
- The **lister payout fee** is calculated at the same percentage and deducted from the lister's payout in `PayoutService`. The two values being equal is a Phase 1 simplification; the schema must allow them to diverge in Phase 2 (separate `listerFeeBp` field will be added then).
- All UI copy that references a percentage (booking sidebar, lister onboarding agreement, public legal pages, "list your gear" marketing stat) must read from a single source of truth. Phase 1 strings are hard-coded to 5%; a config-driven approach lands when Phase 2 is scheduled.
- Mock data fixtures (`frontend/src/app/core/mock-data/listings.fixture.ts`, `payouts.fixture.ts`) reflect Phase 1 fees.
- Backend default in `Kitlo.Core/Models/Listing.cs` (`ServiceFeeBp = 500`) sets the default for new listings created without an explicit override.

## 12. Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-02 | Adopted 5% renter + 5% lister = 10% total take rate for Phase 1 | Cheapest credible take rate that still covers Stripe + minimal ops. Establishes Kitlo as lowest-fee marketplace in category. |
| 2026-05-02 | Phased rollout to 22% by nationwide peak | Industry-norm pricing once brand and liquidity are established. Scales linearly with market presence. |
| 2026-05-02 | 24-month lock-in for first 1,000 listers | Cheap trust-building; protects supply during fee transitions. |
| 2026-05-02 | No listing fees, ever | P2P supply growth beats short-term margin extraction. |
| 2026-05-06 | Phase 0 added: $100 Meta ad validation in Bozeman before Phase 1 commit | De-risk the supply-side assumption with cheap, fast signal before scaling engineering and capital into a 3-metro launch. |
| 2026-05-06 | Bozeman selected as the test-bed market | Best combination of digital adoption, gear-heavy hunting population, and culture density in the Mountain West. Replaces the vague "CO/MT/WY" Phase 1 framing with a concrete starting point. |
| 2026-05-06 | Supply-side framing for the Phase 0 ad test | Supply is the harder side of a P2P marketplace; demand can be validated for free via forums and shop visits. The $100 is allocated to the question that actually carries business risk. |
| 2026-05-10 | **Pivot: Kitlo is now overlanding-led, not hunting-led** | Adventure Ventures research (`C:/repo/p2p/concept-research.md`) ranks camping/overlanding #1 (8.65 weighted) on cold-start, geographic reach, and unit economics. Hunting optics remains the most defensible vertical (#2, 7.28) and stays as a Phase 1 parallel anchor. Fly fishing and power stations layer in. |
| 2026-05-10 | Phase 0 split into 0a (Denver overlanding) + 0b (Bozeman optics) | Two anchor verticals have different supply communities and different beachheads — single-market validation would over-fit. $200 total spend; same supply-side question, two demographic targets. |
| 2026-05-10 | Power stations bundled-only, never standalone | Hygglo, FriendWithA, ShareGrid foreclose standalone US P2P. Bundled with overlanding, marginal CAC is near zero and the $80–200 add-on is the highest contribution margin in the portfolio. |
| 2026-05-10 | Smokers & pizza ovens documented as Phase 2+ provisional, not built | Sub-2x/year frequency and BGE-owner activation friction make standalone marginal. In catalogue for completeness; no listing-form support until first four verticals show liquidity. |
| 2026-05-10 | Phase 1 AOV revised from $150 → $250 | Overlanding specialty kit ($400–800) and the optics bundle ($500–900) shift the blended booking value materially upward vs. the hunting-optics-only model. |
