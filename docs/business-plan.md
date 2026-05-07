# Kitlo — Business Plan

> Version 1.1 · Effective 2026-05-06
>
> Owns: pricing, take rate, revenue model, phased rollout. Cross-references `docs/p2p-business-model.md` for general P2P theory and `docs/gear-catalogue.md` for inventory categories. Operational fee values used by the product live in `docs/features/03-create-listing.md`, `docs/features/07-booking-request.md`, and `docs/features/15-payouts-earnings.md` — those files defer to this document for the source of truth.

---

## 1. Mission

Kitlo is a peer-to-peer marketplace where hunters list and rent hunting equipment to and from each other. We make underutilized gear (thermal optics, NV, spotters, treestands, packs, power stations) earn its keep, and we make premium gear accessible without a $5,000 outlay.

## 2. Customer & Value

- **Renters** — hunters who want to use premium gear (especially thermal/NV optics) without buying it. We offer access at a fraction of MSRP, with verified listers and escrowed payments.
- **Listers** — hunters whose gear sits unused 47 weeks a year. We turn that gear into income with no listing fee, identity-verified renters, and Stripe-backed payouts.

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
| Marketing / CAC | Variable | Phase 1 relies on community-led growth (forums, hunting subreddits, in-person at gun shows / archery shops). |
| Engineering / G&A | Founders' time through Phase 1 | First engineering hire upon clearing $25k MRR. |

**Net margin at 10% take rate is roughly 6–7%** of GMV after Stripe and infrastructure — thin but viable when ops are kept lean.

## 6. Phase Modeling & Profit Targets

### Phase 0: Bozeman Market Validation

Before committing engineering and capital to a 3-metro Phase 1 rollout, Kitlo runs a controlled validation in a single beachhead market. **Bozeman, MT** is the test bed.

**Why Bozeman:**

- High concentration of serious, gear-heavy hunters (MeatEater HQ; transplant population overweighted on premium optics, packs, and thermals).
- Strong digital adoption — Meta ad targeting reaches a real audience, unlike pure rural markets.
- Tight, outdoors-focused community that rewards word-of-mouth and forms trust loops faster than a major metro.
- Affluent transplants own expensive gear that sits unused 11 months a year — exactly the supply-side persona Kitlo's economics depend on.

**Test design — $100 Meta ad spend:**

| Field | Value |
|---|---|
| Budget | $100 over 10 days ($10/day) |
| Geo | Bozeman + 30 mi radius |
| Demographic | Men 28–55 |
| Interest stack (AND) | MeatEater + (Sitka OR Kuiu OR First Lite OR Stone Glacier OR Vortex Optics) + OnX Hunt |
| Objective | Leads (instant form) or Traffic to landing page with email capture |
| Side tested | **Supply** (lister side) — the harder side of the marketplace |
| Creative | Real tailgate/truck-bed photo of a pack or spotter. Headline: "Your $2,000 spotter is sitting in a closet 11 months a year." Subhead: "List it on Kitlo. Keep 95%. Bozeman hunters launching first." CTA: "Get early access." |

**Why test the supply side, not the demand side:**
Demand ("hunters want to rent gear") is plausible by default and can be validated through forums and gun-shop visits at zero cost. Supply ("hunters will lend their $3,000 thermal to a stranger") is the actual business risk. If supply doesn't exist, demand doesn't matter. The $100 buys signal on the harder question.

**Decision criteria:**

| Outcome (10-day window) | Signal | Action |
|---|---|---|
| ≥ 10 email signups | Lister-side intent confirmed | Scale to $500 spend; begin onboarding waitlist into closed beta. |
| 3–9 signups | Ambiguous | Rerun with renter-side framing; if still weak, revisit creative, not thesis. |
| 0–2 signups | Targeting/creative likely broken | Diagnose; do not kill thesis on $100 of data. |

**Parallel zero-cost validation (run alongside the ad test):**

- Posts in r/Bozeman, r/Hunting, r/Wyoming, RokSlide, and ArcheryTalk asking "would you list/rent this?" — qualitative signal that often writes the next ad's copy.
- In-person visits to 3 archery shops + 1 RMEF or DU banquet in the Bozeman area for direct lister-side conversations.

**What Phase 0 informs:**

- Go / no-go on the Phase 1 plan below ($100k profit at 3 active metros).
- Determines the order of the second and third Phase 1 metros (Casper vs. Boise vs. Denver) based on what the Bozeman validation reveals about lister persona.
- If validation succeeds, Bozeman becomes the first of the three Phase 1 metros, not a separate market.

### Phase 1: $100k profit at 3 active metros

Conservative model for a Mountain West regional launch led by **Bozeman, MT** as the validated beachhead, with the second and third metros (candidates: Casper WY, Boise ID, Denver CO) selected based on Phase 0 outcomes:

| Input | Value |
|---|---|
| Active listings per metro | 500 |
| Number of metros | 3 |
| Total active listings | 1,500 |
| Rentals / listing / month | 1.5 |
| Annual rentals | 27,000 |
| Average rental GMV | $150 |
| **Annual GMV** | **$4.05M** |

| Output | Value |
|---|---|
| Revenue at 10% take rate | $405,000 |
| Less Stripe (3.5% of GMV) | −$142,000 |
| Less ops (hosting, tooling, 1–2 FTE) | −$150,000 |
| **Profit** | **~$113,000** ✅ |

The model still works at half this volume if Phase 2 fees (15%) ship by then.

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

| Platform | Combined take rate | Notes |
|---|---|---|
| Fat Llama (general P2P) | ~25% | Closest analogue (general rental). |
| Outdoorsy (RV) | ~30% | Higher because of insurance bundling. |
| Turo (cars) | 15–40% | Range driven by protection plan tier. |
| Airbnb | ~17% | 14% guest + 3% host (newer pricing model varies). |
| GetMyBoat | 16–21% | Boat-specific P2P. |
| Hipcamp | 10% (host only) | Outdoor-adjacent. |

Kitlo at 10% in Phase 1 is **the lowest combined take rate of any P2P rental marketplace in our category.** This is a marketing wedge, not a permanent commitment — it's how we win the supply side fast.

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
