# Rental Demand Model

How likely is a renter to actually book a given piece of gear on Kitlo? This document is the demand-side mirror of `docs/listing-propensity-model.md`. It defines the scoring formula, the variables that feed it, and the logistic form we will switch to once we have observed booking-conversion data. The terminal artifact is the **LPS × RDS 2×2** at the bottom of this doc — that matrix decides which SKUs Kitlo spends supply-acquisition dollars on, which it concierge-sources, and which it walks away from.

The Listing Propensity Score (LPS) tells us which gear *owners will list*. RDS tells us which gear *renters will book*. Neither score in isolation is actionable. Together they produce a launch wedge and a kill list.

---

## 1. Conceptual formula (utility form)

```
RentalDemand = NetExpectedRenterUtility / (PerceivedFriction + ε)

NetExpectedRenterUtility = NeedIntensity × TripFitProbability − OwnershipValue
PerceivedFriction        = SubstituteCost + AccessFriction + TrustCost
```

A renter books when `RentalDemand ≥ θ_renter`, a personal threshold that drops sharply when ownership is impractical (size-specific waders for a destination trip, $5k thermal for one season's test) and rises when the gear is a cheap impulse buy (a $40 stove, a $250 rangefinder).

The model captures four insights from the per-niche briefs (`C:/repo/p2p/{...}/`):

1. **Rent-aversion is price-elastic.** A hunter balks at $83/14-day on a $250 rangefinder (33% of purchase price) and accepts $199/weekend on a $5,000 thermal (4%). RDS must reflect this asymmetry.
2. **Substitutes compress demand asymmetrically.** REI Rental owns generic camping; specialty overlanding kit has no national B2C competitor. RDS must penalize SKUs where the substitute is well-distributed.
3. **Try-before-you-buy (TBYB) is a distinct demand mode.** Premium thermal scopes, NV goggles, Hilleberg tents, BGE kamados — these are *researched* rentals where the renter intends to buy. TBYB demand is real but seasonally concentrated.
4. **Trust friction kills demand even when need is real.** A $5k bundle rental requires identity verification, deposit holds, and condition documentation that the renter must tolerate. Friction drags the score.

---

## 2. Scoring formula (0–100, usable today without data)

```
        (D · S · A)
RDS = ───────────────────── × 100
       1 + P + C + T
```

| Symbol | Meaning | How to estimate | Range |
|---|---|---|---|
| **D** | Demand signal density | normalized search/forum mentions per 1k category posts | 0–3 |
| **S** | Seasonality concentration | inverse Herfindahl on monthly bookings; 1.0 = uniform year-round, 0.3 = single-quarter peak | 0.3–1.0 |
| **A** | AOV / willingness-to-pay | `expected_booking_value / $250` (Phase 1 blended AOV anchor) | 0.5–4.0 |
| **P** | Substitute pressure | REI / Hygglo / FriendWithA / specialty B2C presence in target metros | 0–1.5 |
| **C** | Competitor crowd-out | direct P2P with same SKU in same metro at lower price | 0–1.0 |
| **T** | Trust / regulatory friction | ID verification + state-reg checks + identity-verified deposits + handoff complexity | 0–1.5 |

The numerator captures pull (intent × time-spread × economics). The denominator captures friction that makes the renter close the tab.

### Variable detail

**D — Demand signal density.** Use the per-niche briefs as the empirical floor. Strong signals from `C:/repo/p2p/`:
- Overlanding: ExpeditionPortal 180K members / 2.5M+ posts; r/overlanding 67,888 subs; ARB awning + iKamper RTT mentioned organically in trip reports.
- Night optics: Texas Hunting Forum has 4 separate multi-year threads asking for thermal rental; Predator Masters has the verbatim "P2P thermal rental" thesis; UNV charges $489/2–3 days and still runs at capacity.
- Fly fishing: r/flyfishing 290K; recurring "where can I rent waders for [river]" threads on the Fly Fishing Forum.
- Power stations: van life + outage prep both pull from the same demand pool; FriendWithA Jackery 1000 Pro at $40/day in Brea is the floor.
- Pizza ovens / smokers: Forno Bravo + Pizza Making Forum exist but cluster around ownership advice, not rental queries. Hygglo US has ~4 pizza-oven listings nationally — supply density evidence, but demand is thin.

D is scored 0–3: 3 = "people ask for this gear by SKU in forum threads"; 1 = "category interest exists but renters substitute or buy"; 0 = "no organic demand signal found."

**S — Seasonality concentration.** Pulled from the per-niche brief's seasonality scores. Year-round demand (power stations: 8/10 seasonality; van life + outage demand) earns S ≈ 0.9. Concentrated demand (ice augers Dec–Feb; awnings May–Sep) earns S ≈ 0.35–0.5. A SKU with strong but *long* seasons (overlanding May–Oct, ~6 months) sits at S ≈ 0.65.

**A — AOV / WTP.** Daily rate × typical trip duration ÷ $250. The $250 anchor is the Phase 1 blended AOV target from `docs/business-plan.md` §6. A $500 bundle = A 2.0; a $90 wader rental = A 0.36. This variable is the same dimension as LPS's R but inverted in framing: LPS asks whether rent clears the owner's price-ratio threshold; RDS asks whether the booking is large enough that a renter will tolerate the platform's friction to capture it.

**P — Substitute pressure.** REI Rental's 115 stores own generic camping (P ≈ 1.2 for cheap stoves and 3-season tents). Hygglo + FriendWithA + ShareGrid own US horizontal P2P (P ≈ 1.0 for power stations standalone). No national substitute exists for night optics, RTTs, awnings, or specialty rod weights (P ≈ 0–0.3).

**C — Competitor crowd-out.** Differs from P by being *local*: a specialty B2C in the target metro at a lower price. Borrowed Fly in Denver crowds out fly-fishing demand in that single metro (C ≈ 0.7); UNV ships nationally with TBYB credit (C ≈ 0.5 for thermal scopes). When competitors don't exist at all (e.g., NV monoculars in any P2P channel), C = 0.

**T — Trust / regulatory friction.** Stacks four sub-components:
- ID verification & deposit holds ($300–$500 typical, $5k+ on bundles).
- State-regulation checks (NV scopes legal in TX, not in CA; felt-sole boots banned in MD/AK).
- ITAR / US-Person attestation (night optics only).
- Handoff complexity (RTT mount inspection, sat-comm plan transfer, BGE owner's "you don't know how to season cast iron" gatekeeping).

T ≈ 1.5 for premium NV goggles (ITAR + state-reg + $5k deposit + bundle handoff). T ≈ 0.2 for wading boots (ID check, walk-up handoff). T ≈ 1.0 for thermal scopes (ITAR + handling care).

---

## 3. Logistic form (once we have booking-conversion data)

```
logit P(book | search) = γ₀
                       + γ₁ · log(category_query_volume)
                       + γ₂ · season_index
                       + γ₃ · log(AOV)
                       − γ₄ · substitute_density
                       − γ₅ · local_competitor_count
                       − γ₆ · trust_friction_score
                       + γ_v · vertical_dummy
                       + γ_m · metro_dummy
                       + γ_r · renter_traits (prior-bookings, identity-tier, urbanicity)
```

Fit on observed search→booking conversions. Use this section's RDS as the prior so the model is well-behaved before booking data accumulates. Bookings conversion data won't be meaningful for 12–18 months; the scoring form above is what we run on through Phase 1.

---

## 4. Worked examples

Rough numbers, illustrative — to be refined once we have category booking conversions. All SKUs taken from `gear-catalogue.md`.

| Gear | D | S | A | P | C | T | **RDS** |
|---|---|---|---|---|---|---|---|
| **Rooftop tent — softshell** (Tepui/ARB Esperance, $1.8k retail, $85/day × 5 days = $425) | 2.5 | 0.7 | 1.7 | 0.4 | 0.2 | 0.5 | **141** |
| **Handheld thermal monocular** (Pulsar Axion, $2k retail, $90/day × 3 days = $270) | 2.8 | 0.6 | 1.1 | 0.0 | 0.3 | 1.0 | **80** |
| **12V fridge / freezer** (Dometic CFX3, $1.1k retail, $25/day × 5 days = $125) | 2.2 | 0.7 | 0.5 | 0.5 | 0.2 | 0.3 | **38** |
| **Waders (premium)** (Simms G3, $650 retail, $35/day × 4 days = $140) | 2.4 | 0.5 | 0.56 | 0.6 | 0.7 | 0.2 | **27** |
| **Wading boots — rubber sole** ($225 retail, $20/day × 4 days = $80) | 2.0 | 0.5 | 0.32 | 0.6 | 0.7 | 0.2 | **13** |
| **Night vision goggles** (PVS-14, $4k retail, $120/day × 3 days = $360) | 2.6 | 0.6 | 1.44 | 0.0 | 0.4 | 1.4 | **94** |
| **Air compressor** (ARB twin, $350 retail, $15/day × 3 days = $45) | 1.8 | 0.7 | 0.18 | 0.6 | 0.3 | 0.2 | **10** |
| **Large LFP power station** (EcoFlow Delta Pro, $1.6k retail, $70/day × 5 days = $350) | 2.4 | 0.9 | 1.4 | 1.0 | 0.7 | 0.4 | **101** |
| **Premium pizza oven** (Gozney Dome, $2.5k retail, $90/day × 2 days = $180) | 1.0 | 0.4 | 0.72 | 0.5 | 0.3 | 0.6 | **12** |
| **Premium fly rod + reel** (Sage R8 + Hatch, $1.4k retail, $50/day × 4 days = $200) | 2.0 | 0.5 | 0.8 | 0.3 | 0.5 | 0.3 | **44** |

### Reading the examples

- **Softshell RTT (141)** and **NV goggles (94)** lead the pack. Both are large bookings the renter can't easily substitute for and that are too expensive to buy on impulse. These are the strongest pull SKUs in the catalogue.
- **Air compressor (10)** and **wading boots (13)** score low on demand even though their LPS is high. They will *list* easily and *book* rarely as standalone SKUs — exactly the bundle add-on profile. This is consistent with the catalogue's "bundle only" framing for compressor/jerry/staff items.
- **Premium pizza oven (12)** confirms `business-plan.md` §2's Phase 2+ provisional call. Demand-side signal is thin even before owner reluctance enters the picture.
- **Power station (101)** scores high because year-round demand (S = 0.9) and bundle-fit AOV multiply, even with P = 1.0 substitute pressure from Hygglo. The standalone foreclosure in the business plan is about *unit economics*, not about renter demand — renters do want power stations; we just can't profitably acquire them as standalone bookings. Bundle them.

---

## 5. Variable estimation table

How to score each variable today, without booking data. All proxies trace to the per-niche briefs in `C:/repo/p2p/`.

| Variable | Strong (≥ upper-third) | Weak (≤ lower-third) | Where to find the signal |
|---|---|---|---|
| **D** | Named-SKU forum threads ("rent a Gozney Dome in Austin?"); active rental-platform listings with bookings; ExpeditionPortal trip-report mentions | "Should I buy or rent?" framing with no rental option; SKU not mentioned in any rental query | r/overlanding, r/flyfishing, HuntTalk, Predator Masters, eggheadforum, Texas Hunting Forum |
| **S** | Year-round trail use or outage-driven (power stations); long-tail seasons (overlanding May–Oct) | Single-quarter peaks (ice fishing, hatch weeks, holiday hosting) | Niche brief seasonality scores; Google Trends monthly index |
| **A** | Daily × trip duration > $300 (overlanding bundles, optics bundles) | Daily × trip < $100 (single-burner stoves, fly boxes) | `gear-catalogue.md` "Pricing Reference" tables; Built to Roam, Hygglo, RentWaders price lists |
| **P** | National B2C or P2P with same SKU at lower price (REI for generic camping, Hygglo for power stations) | No B2C or P2P competitor exists (NV monoculars, ARB awnings) | `business-plan.md` §7 "Competitive Context"; niche brief Competitive Landscape sections |
| **C** | Established single-metro B2C with hand-delivery (Borrowed Fly in Denver) | No metro-level competitor in target market | `gear-catalogue.md` "Pricing Reference"; metro-by-metro scan |
| **T** | ITAR attestation + bundle $5k+ deposit + state-reg checks | Walk-up cash handoff with $50 deposit | `gear-catalogue.md` "Insurance & Deposit Policy" and per-vertical adders |

---

## 6. The LPS × RDS 2×2 — the headline artifact

Every catalogued SKU is plotted below. Thresholds: **LPS > 1.0** (above the platform median of "easy lister") and **RDS > 30** (above the implied break-even for a $250 AOV at 10% take rate covering Stripe + minimal ops, derived from `business-plan.md` §5). The four quadrants are the operating playbook.

### Q1 — Launch Wedge (High LPS / High RDS)

Spend everything here. These are the SKUs where supply will accumulate organically *and* renters will book. Phase 1 marketing, listing-form UX investment, and concierge-onboarding effort should be ordered by this quadrant first.

| SKU | LPS | RDS | Vertical | Why it wins |
|---|---|---|---|---|
| Rooftop tent — softshell | 1.56 | 141 | Overlanding | Bundle anchor, no national substitute, high AOV |
| Handheld thermal monocular | 1.69 | 80 | Night Optics | Gateway SKU; TBYB demand; no P2P competitor |
| Large LFP power station | 1.19 | 101 | Power Stations | Year-round demand (S=0.9); bundle-fit; the contribution-margin engine |
| Waders (premium) | 1.90 | 27\* | Fly Fishing | High LPS; RDS just below cutoff but lifts to ~35 when bundled with boots/rod |
| Rooftop tent — hardshell | 1.07 | 130 | Overlanding | Same dynamics as softshell, slightly tighter R |
| Night vision monoculars | 1.24 | 70 | Night Optics | TBYB anchor for NV; cheaper than NVGs |

\*Waders sits at the Q1/Q3 border standalone (RDS 27) and lifts cleanly into Q1 as a bundled wader+boot+rod listing (RDS ≈ 50). Treat as Q1 in bundle mode, Q3 in standalone listing form.

### Q2 — Ghost Listings (High LPS / Low RDS)

Owners want to list these. Renters won't book them as standalone SKUs. **Suppress** at listing-form time: nudge the owner into a bundle, or auto-attach to a parent listing. Standalone listings here turn into the "active but no bookings in 90 days" graveyard that kills marketplace UX.

| SKU | LPS | RDS | Vertical | Suppression strategy |
|---|---|---|---|---|
| Air compressor | 2.27 | 10 | Overlanding | Auto-bundle into "Trailhead expedition" parent |
| Awning (270°/180°) | 2.07 | 18 | Overlanding | Bundle with RTT; standalone-disallow under $100 daily rate |
| 12V fridge / freezer | 1.97 | 38 | Overlanding | Borderline — keep standalone in Denver/Bozeman where overlanding density is high; bundle elsewhere |
| Recovery board set | 1.76 | 12 | Overlanding | Auto-bundle |
| Wading boots — rubber sole | 2.74 | 13 | Fly Fishing | Bundle with waders; standalone-allow in TU-partner metros only |
| Ground blind | 1.50 | 14 | Hunting Support | Bundle with hunting-trip optics or suppress |
| Mid-range fly rod + reel | 1.38 | 20 | Fly Fishing | Bundle with wader/boot kit |
| Wading boots — felt sole | 1.39 | 8 | Fly Fishing | Bundle + state-restriction check |
| Portable solar panel | 1.30 | 16 | Power Stations | Bundle with power station parent |
| Ground tent (4-season, premium) | 1.29 | 22 | Overlanding | Bundle with overlanding kit or downweight in search |
| Premium 2-burner stove | 1.25 | 14 | Overlanding | Bundle with camp kitchen |
| Camp kitchen / chuck box | 1.23 | 20 | Overlanding | Bundle anchor for galley sub-bundle |
| Medium power station | 1.08 | 22 | Power Stations | Bundle-only per existing catalogue rule |

### Q3 — Concierge Supply (Low LPS / High RDS)

Renters want these. Owners are reluctant. Organic supply will not appear. This is a **different acquisition problem entirely**: direct-source from manufacturers, run lister-incentive programs (free first-month protection, white-glove photo shoot, fee waivers), partner with retailers willing to seed inventory. Without intervention these SKUs are zero-listing failures.

| SKU | LPS | RDS | Vertical | Acquisition play |
|---|---|---|---|---|
| Night vision goggles / head-mounted | 0.53 | 94 | Night Optics | Manufacturer seeding (Sionyx, Steiner); guide outfitter partnerships |
| Thermal rifle scope | 0.61 | 78 | Night Optics | Feral Texas Outdoors / UNV co-branded inventory; lister incentives for hunters who own ≥$3k optics |
| Premium fly rod + reel setup | 0.99 | 44 | Fly Fishing | Trout Unlimited chapter sponsorship; guide-as-lister seeding |
| Satellite communicator | 0.78 | 38 | Overlanding | Garmin / Starlink retailer partnership; plan-transfer tooling |
| Clip-on thermal | 0.92 | 55 | Night Optics | Bundle inducement (rent the host scope alongside) |
| Clip-on night vision | 0.76 | 48 | Night Optics | Same as clip-on thermal |
| Night vision rifle scopes | 0.50 | 64 | Night Optics | State-reg-aware listing pipeline; TX-first seeding |
| Thermal binoculars | 0.55 | 42 | Night Optics | Lodge/ranch operator semi-pro lister channel |
| XL power station (3,000Wh+) | 0.67 | 55 | Power Stations | EcoFlow / Bluetti seeding; outage-prep audience cross-list |
| Float tube / pontoon | 1.01 | 36 | Fly Fishing | Borderline Q1/Q3; promote to Q1 in Mountain West |

### Q4 — Ignore (Low LPS / Low RDS)

De-prioritize or remove from the catalogue. Engineering, support, and marketing time spent here is opportunity cost against Q1–Q3.

| SKU | LPS | RDS | Vertical | Action |
|---|---|---|---|---|
| Premium pizza oven | 0.27 | 12 | Smokers/Pizza | Already provisional; confirms Phase 2+ hold |
| Premium kamado (BGE Large/XL) | 0.29 | 14 | Smokers/Pizza | Confirms Phase 2+ hold |
| Premium pellet smoker | 0.23 | 11 | Smokers/Pizza | Confirms Phase 2+ hold |
| Standard kamado | 0.34 | 9 | Smokers/Pizza | Confirms Phase 2+ hold |
| Mid pizza oven | 0.66 | 14 | Smokers/Pizza | Confirms Phase 2+ hold |
| Catering trailer | 0.25 | 6 | Smokers/Pizza | Remove from catalogue or move to "Operator Tier" (commercial) |
| Rangefinder | 0.40 | 8 | Night Optics | Already ❌ Decline; confirms |
| Tree stand | 0.39 | 10 | Hunting Support | Already ❌ Decline; confirms |
| Hunting headlamp | 0.57 | 4 | Hunting Support | Already ❌ Decline; confirms |
| Drone-mounted thermal | 0.18 | 8 | Night Optics | Already ❌ Decline; confirms |
| Body / trail camera | 0.14 | 6 | Night Optics | Already ❌ Decline; confirms |
| Fly tying kit | 0.19 | 7 | Fly Fishing | Already ⚠️; move to ❌ |
| Sling pack / hip pack | 0.44 | 9 | Fly Fishing | Confirms caveat |
| Hi-Lift / Pro Eagle jack | 0.55 | 7 | Overlanding | Already ❌ Decline; confirms |
| Navigation tablet | 0.23 | 6 | Overlanding | Already ❌ Decline; confirms |
| Hunting blind heater | 0.59 | 5 | Hunting Support | Already ❌ Decline; confirms |
| Hunting pack (Stone Glacier / Kifaru) | 0.53 | 12 | Hunting Support | Confirms caveat |
| Loaded fly box | 0.56 | 8 | Fly Fishing | Bundle-only or remove |
| Wading staff | 0.58 | 6 | Fly Fishing | Bundle-only |
| Net (premium) | 0.54 | 7 | Fly Fishing | Bundle-only |
| Annex / changing room | 0.94 | 14 | Overlanding | Bundle-only (catalogue already requires this) |
| Awning room / wall kit | 0.69 | 9 | Overlanding | Bundle-only |
| Recovery kit | 0.83 | 18 | Overlanding | Borderline Q2/Q4; bundle |
| Water tank / jerry system | 0.80 | 10 | Overlanding | Bundle-only |
| Winch | 0.55 | 14 | Overlanding | Guided-handoff caveat; low-volume |
| Small power station (<300Wh) | 0.45 | 13 | Power Stations | Already ❌ Decline; confirms |
| Solar generator combo | 0.86 | 32 | Power Stations | Borderline Q3 — manufacturer-seedable |
| Spotting scope (daytime) | 0.37 | 18 | Night Optics | Confirms caveat |
| Thermal spotting scope | 0.49 | 24 | Night Optics | Borderline Q3 — lodge/guide seeding only |
| High-end binoculars | 0.32 | 16 | Night Optics | Confirms caveat |
| Specialty rod weight | 0.95 | 24 | Fly Fishing | Borderline Q1/Q4; bundle with guide context |
| Single burner stove | 1.19 | 6 | Overlanding | Borderline Q2/Q4; REI competition kills it — confirms catalogue's market-structure veto |
| Ground tent (3-season) | 1.13 | 12 | Overlanding | Same — REI Rental crowds out |
| Entry pizza oven | 0.51 | 8 | Smokers/Pizza | Confirms ❌ |
| Entry kamado | 0.32 | 6 | Smokers/Pizza | Confirms ❌ |
| Entry pellet smoker | 0.32 | 7 | Smokers/Pizza | Confirms ❌ |

---

## 7. Strategic implications (drawn from the 2×2)

1. **Phase 1 marketing should index on Q1 SKUs only.** Softshell RTT, handheld thermal monocular, large LFP power station (bundled), NV monocular, hardshell RTT, premium waders (bundled). Every Q1 SKU has both a willing lister and a willing renter — these are the eight rentals that pay for the next eight. Q2 SKUs ride along as bundle components; Q3 SKUs are *founder-time* work, not *paid-acquisition* work.

2. **Listing-form UX should auto-suppress Q2 standalone listings.** Air compressor, awning, recovery boards, wading boots: when an owner tries to list one of these alone, the form should detect it and prompt "do you also own a [parent SKU]? Bundle it for 3× more bookings." Standalone-allow only in metros where overlanding density is already deep (Denver, Bozeman post-Phase-0). Everywhere else, Q2 standalone = a guaranteed ghost listing.

3. **Q3 needs a separate playbook with a separate budget line.** The night-optics flagship product (thermal + NV bundle) sits in Q1 only on the thermal half. The NV half is in Q3. Without concierge supply on NV goggles + scopes, the bundle product doesn't exist. Phase 1 should explicitly fund a "concierge listings" cohort: ~30 hand-recruited owners in San Antonio/Austin (per `business-plan.md` §6) with fee waivers, white-glove photography, and identity-tier protection on day one. Mirror this for Trout Unlimited chapter supply on premium fly rods.

4. **Vertical sequencing is reinforced, not changed.** Overlanding contributes the most Q1 SKUs (5 of the top 10). Night optics contributes the highest-AOV Q1 SKU (NV monocular) and the highest-AOV Q3 SKU (NV goggles). Fly fishing's Q1 entries are bundle-dependent, confirming Phase 2 layered-vertical positioning. Power stations land in Q1 only as a bundle add-on — exactly the foreclosure logic from `business-plan.md` §2.

5. **The smokers/pizza vertical is a Q4 vertical, not just a Q4 SKU.** Every smoker/pizza SKU lands in Q4 except a couple of borderline kamado/mid-oven items that don't clear Q3. This is the strongest demand-side confirmation of the Phase 2+ "provisional, not built" stance in `CLAUDE.md`. Re-evaluate after the first four verticals show liquidity; do not build listing-form support until at least three other verticals clear Q1 listing density per metro.

6. **Watch the Q1/Q3 borderline migrations.** Float tube (LPS 1.01, RDS 36), specialty rod weight (LPS 0.95, RDS 24), solar generator combo (LPS 0.86, RDS 32), 12V fridge (LPS 1.97, RDS 38 — Q1 only in deep metros). These move between quadrants depending on metro liquidity and bundle attachment. Re-score quarterly once we have booking data; expect ±20% RDS movement.

---

## 8. Open questions

- **D normalization.** Forum-mention counts vary in scale by vertical (HuntTalk 2.2M messages vs. r/overlanding ~70K subs). Worth normalizing D within-vertical before cross-comparing, or accept that vertical sequencing absorbs the bias?
- **RDS for bundles.** RDS for the Phase 1 weekend-overland bundle is the *sum* of component RDS (renter books one bundle, captures multiple SKU demands), not the min. This is the opposite aggregation rule from LPS bundles (min, per `listing-propensity-model.md` §7). Document and codify the asymmetry in the bundle pricing/promotion logic.
- **Trust-friction T decays over time.** Returning renters absorb less friction. The logistic form should treat T as time-varying or as a per-renter-cohort dummy.
- **Metro dummy is non-trivial.** Denver/Bozeman/Austin renters have different friction tolerances and different substitute densities. The Phase 1 RDS values implicitly assume "Denver in Year 1." Expect ±30% drift when extending to colder-start metros.
- **Cross-references:** see `gear-catalogue.md` §"Combined LPS Ranking" for owner-side priority; `geographic-liquidity-model.md` for the minimum supply density per metro that turns RDS-implied demand into actual bookings; `owner-segmentation.md` for which owner persona to recruit for each Q3 supply gap.
