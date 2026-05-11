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
| Marketing / CAC | Variable | Phase 1 relies on community-led growth (forums, hunting subreddits, in-person at gun shows / archery shops). |
| Engineering / G&A | Founders' time through Phase 1 | First engineering hire upon clearing $25k MRR. |

**Net margin at 10% take rate is roughly 6–7%** of GMV after Stripe and infrastructure — thin but viable when ops are kept lean.

## 6. Phase Modeling & Profit Targets

### Phase 0: Two-market validation (overlanding + hunting optics)

Before committing engineering and capital to a multi-metro Phase 1 rollout, Kitlo runs **two parallel validations**, one per anchor vertical. The two verticals have different supply communities and different beachhead geographies — validating them together avoids over-fitting the platform to either.

#### Phase 0a — Denver overlanding validation

**Test bed:** Denver / Boulder, CO. Highest concentration of ExpeditionPortal-active overlanders per capita; gateway to high-elevation routes; affluent transplants who own RTTs, 12V fridges, and dual-battery setups that sit idle 60% of the year.

**$100 Meta ad spend:**

| Field | Value |
|---|---|
| Budget | $100 over 10 days ($10/day) |
| Geo | Denver + Boulder + 30 mi radius |
| Demographic | Men + women 28–50 |
| Interest stack (AND) | ExpeditionPortal OR Overland Bound OR ARB OR iKamper OR Dometic OR Goose Gear + (Toyota 4Runner OR Tacoma OR Lexus GX OR Jeep Wrangler OR Land Cruiser) |
| Objective | Leads (instant form) — supply-side waitlist |
| Creative | Truck + RTT photo at trailhead. Headline: "Your iKamper sits in the garage 8 months a year." Subhead: "List it on Kitlo. Keep 95%. Denver overlanders launching first." CTA: "Get early access." |

#### Phase 0b — Bozeman hunting optics validation

**Test bed:** Bozeman, MT. Already wired in the existing codebase. The existing supply-side framing carries over verbatim:

| Field | Value |
|---|---|
| Budget | $100 over 10 days ($10/day) |
| Geo | Bozeman + 30 mi radius |
| Demographic | Men 28–55 |
| Interest stack (AND) | MeatEater + (Sitka OR Kuiu OR First Lite OR Stone Glacier OR Vortex Optics OR Pulsar) + OnX Hunt |
| Objective | Leads (instant form) — supply-side waitlist |
| Creative | Real tailgate/truck-bed photo of a thermal monocular. Headline: "Your $3,000 thermal sits in a closet 11 months a year." Subhead: "List it on Kitlo. Keep 95%. Bozeman hunters launching first." CTA: "Get early access." |

**Why test the supply side, not the demand side:**
Demand ("overlanders want to rent gear" / "hunters want to rent gear") is plausible by default and can be validated through forums (ExpeditionPortal, r/overlanding, HuntTalk, Predator Masters, Texas Hunting Forum) and shop visits at zero cost. Supply ("overlanders will lend their $4,000 RTT to a stranger" / "hunters will lend their $3,000 thermal to a stranger") is the actual business risk. The $100 per market buys signal on the harder question.

**Decision criteria (per market):**

| Outcome (10-day window) | Signal | Action |
|---|---|---|
| ≥ 10 email signups | Lister-side intent confirmed | Scale to $500 spend; begin onboarding waitlist into closed beta. |
| 3–9 signups | Ambiguous | Rerun with renter-side framing; if still weak, revisit creative, not thesis. |
| 0–2 signups | Targeting/creative likely broken | Diagnose; do not kill thesis on $100 of data. |

**Parallel zero-cost validation (run alongside the ad tests):**

- **Overlanding:** posts in ExpeditionPortal Vendor section (with permission), r/overlanding, r/CherokeeXJ, r/4Runner, Overland Bound forum asking "would you list/rent your kit?"
- **Hunting optics:** posts in HuntTalk, Predator Masters, Texas Hunting Forum, RokSlide, ArcheryTalk.
- **In person:** 3 visits each to overlanding outfitters (Adventure Wagons, RoamRig, local 4WD shops) and hunting/archery shops in the respective beachheads. RMEF/DU/ExpeditionPortal Big Thing event attendance where the timing fits.

**What Phase 0 informs:**

- Go / no-go on the Phase 1 plan below ($100k profit at 3 active metros).
- Determines whether overlanding or optics is the stronger primary vertical to lead Phase 1 launch comms with.
- Overlanding result determines the second overlanding metro (candidates: Seattle/Bellingham, Phoenix, Salt Lake City).
- Optics result determines the second optics metro (candidates: San Antonio/Austin, Minneapolis).

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
| **Smokers & Pizza Ovens** | Hygglo (~4 listings), FriendWithA (sparse), regional B2C catering operators | **Strong** but supply-activation friction is high (BGE-owner reluctance) | Phase 2+ — re-evaluate after primary verticals show liquidity. |

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
