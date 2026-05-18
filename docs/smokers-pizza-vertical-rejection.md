# Smokers & Pizza Ovens — Structural Rejection

**Status:** Vertical not built, not scheduled. Held until at least three other verticals show liquidity per `docs/business-plan.md` §2.

**Purpose of this doc:** Three independent models reject this vertical for different structural reasons. Without a single consolidated record, future Kitlo operators (or future-me) will relitigate the decision against incomplete arguments. This doc is the citation. If the vertical is ever re-evaluated, all three rejection conditions must be addressed — not just one.

---

## The three independent rejections

### 1. Frequency floor — sub-2x/year use

**Source:** `CLAUDE.md` §"Verticals", `docs/gear-catalogue.md` §"Smokers & Pizza Ovens (Phase 2+ — provisional, not built)".

Premium pizza ovens and kamado-style smokers are used **fewer than two times per year** by the median owner. Below that frequency, two things break:

- **CAC payback is structurally fragile.** A renter who hosts one backyard party a year does not accumulate enough rentals to amortize the platform's cost of acquiring them. Even at perfect conversion, the per-renter lifetime value sits below blended CAC for any non-organic channel.
- **Owner mental model collapses.** An owner who has used their oven twice this year does not perceive it as idle "inventory" — they perceive it as a centerpiece of the two events they care about. The behavioural reframe from "I own this" to "I rent this out" never happens because there's no meaningful idle window to repurpose.

The Phase 1 LPS model's idle-fraction term (I) is mechanically high for these SKUs (>0.95) — but **high I without sufficient Y (annual booking potential) does not produce a viable lister**. The LPS values for premium pizza ovens (0.27) and premium kamados (0.29) reflect this. See `docs/listing-propensity-model.md` §4.

### 2. Owner identity friction — BGE / Kamado loyalty

**Source:** `docs/gear-catalogue.md` §"Why provisional, not built", per-niche brief `C:/repo/p2p/smoker-and-pizza-oven-rental/smoker-and-pizza-oven-rental.md`.

Premium grill ownership is **identity-driven, not utility-driven**. The eggheadforum.com community (~30K active BGE owners) is fiercely possessive of their gear. The L (love) variable in the LPS model peaks at 1.8 for premium kamados — the highest in the entire gear catalogue, exceeding even fly tying kits (1.5) and premium fly rods (1.3).

The community-level signal: BGE's 70–80% secondhand value retention. Owners who tire of their gear sell it for nearly what they paid; they don't loan it. The "rent it out" use case competes with "sell it" rather than with "let it sit idle" — and selling wins on dignity, control, and cash-in-hand. This is structurally different from overlanding gear, where the resale market is weaker and the idle-time problem is more salient.

This is the rejection condition the LPS model captures most clearly. It is also the only condition that is *theoretically* solvable by founder time (white-glove onboarding, custom protection plans, identity-tier insurance) — but the solvable price tag exceeds the contribution margin from a sub-2x/year SKU. The math does not bend, even with effort.

### 3. Liquidity threshold — ~381 listings per metro

**Source:** `docs/geographic-liquidity-model.md` §4 and §6 implication 6.

The geographic liquidity model computes a per-vertical minimum-viable listing density per metro. For smokers/pizza, the parameters are:

- Peak-season utilization: **7%** (lowest of any vertical)
- Search→rental conversion (Phase 1 anchor): 15%
- Bookings floor for search-experience health: 4 rentals/category/month

```
N_listings = bookings_floor / (utilization × P(rental_per_query))
           = 4 / (0.07 × 0.15)
           ≈ 381 listings per metro
```

**No Phase 1 or Phase 2 metro can clear this threshold.** Even if every Phase 1 metro generated 50 supply seeds (a generous estimate given BGE owner reluctance), the search experience would not return enough results to clear the cold-start failure mode that kills marketplace UX.

This is the rejection condition that is **not solvable by recruiting harder**. The Frequency Floor and Owner Identity arguments could theoretically be brute-forced with capital. The liquidity math could not. The 7% utilization is upstream of every operational lever Kitlo controls.

---

## Why the three rejections matter together, not in isolation

Any one rejection alone could be argued against:

- **Frequency floor** could be solved with a high-AOV premium tier (catering trailers, $5k+ rigs).
- **Owner identity** could be solved with manufacturer partnerships (BGE-direct seeded inventory; ownership stays with the brand).
- **Liquidity threshold** could be solved with manufacturer / dealer seeded inventory (skip P2P supply, run a B2C fleet under the Kitlo brand).

Each "solution" requires departing from the P2P thesis. And **each solution addresses only one rejection condition.** A high-AOV premium tier still hits owner identity friction at the BGE-XL price point. Manufacturer seeded inventory still hits the 381-listing/metro liquidity wall. A B2C fleet skips the P2P thesis entirely and becomes a different company.

The vertical is rejected because **three independent models, each with different inputs and assumptions, converge on the same conclusion**. That convergence is the strongest signal the catalogue produces.

---

## What would need to change to re-evaluate

If the smokers/pizza vertical is ever re-opened, all three conditions need addressing — not just one. A re-evaluation memo would need to demonstrate:

1. **Frequency floor cleared.** Some new use case has emerged that drives sub-2x/year SKUs above 5x/year median frequency. E.g., a commercial-class catering operator persona enters the platform at scale, or pop-up food businesses standardize on rented kit. The 2025 cottage-food-law expansion in TX/FL is the closest current signal — re-check 2027.
2. **Owner identity friction cleared OR sidestepped.** BGE/Kamado loyalty has measurably softened (secondhand value retention drops below 50%), OR an alternative ownership model (manufacturer-owned fleet on the Kitlo platform) becomes viable without compromising the P2P thesis for other verticals.
3. **Liquidity threshold cleared.** Either utilization rises (frequency floor solved, condition 1 above), or P(rental_per_query) rises substantially via brand maturity (Phase 4+), or the 4-rentals/month bookings floor drops because Kitlo has accumulated enough demand-side gravity to sustain a sparser supply pool. All three are downstream of multi-year Phase 1–3 execution.

**Recommendation:** Do not re-evaluate before Phase 3 (15+ active metros, $5M+ ARR, four other verticals live and clearing their own liquidity thresholds). Earlier re-evaluation is opportunity cost against Phase 1 / 2 execution and produces decision churn without new information.

---

## Cross-references

- `CLAUDE.md` §"Verticals" — Phase 2+ provisional status
- `docs/business-plan.md` §2 "Vertical sequencing" — phasing rationale
- `docs/gear-catalogue.md` §"Smokers & Pizza Ovens (Phase 2+ — provisional, not built)" — listing policy when (if) opened
- `docs/listing-propensity-model.md` — supply-side LPS values for all smoker/pizza SKUs
- `docs/rental-demand-model.md` §6 Q4 "Ignore" — every smoker/pizza SKU lands here
- `docs/geographic-liquidity-model.md` §4 and §6 implication 6 — the ~381-listing threshold derivation
- `docs/features/03-create-listing.md` — vertical not selectable in the create-listing flow
- `C:/repo/p2p/smoker-and-pizza-oven-rental/smoker-and-pizza-oven-rental.md` — original per-niche research brief
