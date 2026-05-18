# Geographic Liquidity Model

What is the minimum supply density in a metro before Kitlo can turn on consumer marketing without burning trust? This document defines the liquidity threshold formula, computes per-vertical minimums, and assesses each Phase 1 metro from `docs/business-plan.md` §6 against those thresholds.

The Listing Propensity Score (`docs/listing-propensity-model.md`) tells us *whether* gear gets listed. The Rental Demand Score (`docs/rental-demand-model.md`) tells us *whether* gear gets booked. This doc bridges the two with the geographic constraint that determines whether listings and bookings actually find each other.

A renter who searches "rent a rooftop tent in Denver" and sees zero results in a 50-mile radius does not come back. The cold-start problem in marketplaces is *not* about total nationwide listings; it's about whether any single metro has enough density that *every common search returns something rentable within driving range*. This is the metric Kitlo has to clear before paid acquisition pays back.

---

## 1. Concept

A marketplace fails on the demand side when search-to-result conversion drops below the renter's patience threshold. Mature P2P marketplaces (Airbnb, Turo, Outdoorsy) target ≥85% "search returns something usable" rates in active metros. New marketplaces with no brand equity must clear ~70% before consumer marketing returns positive ROI — below that, the platform is paying to disappoint people.

Three forces interact:

1. **Travel-distance willingness.** A renter will drive 60 miles to pick up an RTT (transport on their own roof rack en route to the trail) but only 10 miles to pick up a pizza oven (party-night, can't easily make a detour). Per-SKU radius caps the addressable supply pool from any given query origin.
2. **Utilization.** A given listing rents some fraction of available days. Industry benchmarks from `gear-catalogue.md` and the per-niche briefs put healthy P2P utilization at 15–35% of *peak-season* days, varying by vertical.
3. **Search→rental conversion.** The probability a search query becomes a booking. Driven by RDS, AOV, and trust. Phase 1 Kitlo targets ~12–20% based on horizontal P2P benchmarks (Hygglo + FriendWithA category averages).

The composite question: **how many active listings does a metro need** for the typical search to hit at least one available, in-radius listing, often enough to clear a monthly bookings floor that pays for the marketing reach?

---

## 2. Per-gear travel-distance willingness

A renter will drive different distances for different gear. The radius caps the metro's effective supply pool. Estimates below combine the per-niche briefs in `C:/repo/p2p/` with the pickup-handoff frictions documented in `gear-catalogue.md`.

| Gear category | Renter willingness radius | Reasoning |
|---|---|---|
| **Rooftop tent (RTT)** | 30–60 mi | Transports on the renter's vehicle en route to the trail; pickup is on the way out of town. Hardshells skew lower (heavier install). |
| **12V fridge / freezer** | 30–50 mi | Bulky but fits any cargo space; en-route pickup feasible. |
| **Awning** | 25–45 mi | Vehicle-mounted at handoff; mount inspection adds 15 min. |
| **Recovery boards / kit** | 20–40 mi | Compact; renter usually packing the truck anyway. |
| **Air compressor** | 15–30 mi | Standalone unlikely to draw long drives; bundle with parent listing for shared pickup. |
| **Dual-battery system** | 20–35 mi | Install-sensitive; owner may insist on shorter radius for handoff inspection. |
| **Satellite communicator** | Nationwide (shipped) | Small, light, shippable in a padded mailer; plan-transfer tooling is the gating friction, not geography. |
| **Navigation tablet** | 25–40 mi | Personal device handoff; rare anyway (Q4 in `rental-demand-model.md`). |
| **Camp kitchen / chuck box** | 25–45 mi | Bulky, en-route pickup pattern. |
| **Premium 2-burner stove** | 20–35 mi | Bundle-fit. |
| **Handheld thermal monocular** | 50–120 mi (with shipping option) | High-value, small footprint; renters fly into hunting destinations and accept long pickup drives. Nationwide-shippable on insured carrier for premium tier. |
| **Thermal rifle scope** | 50–120 mi (with shipping option) | Same as monocular; bundle handoff often justifies a 2-hour drive each way. |
| **NV monocular / NV scope** | 50–120 mi (with shipping option) | Same TBYB / high-AOV dynamics. |
| **NV goggles / head-mounted** | 50–100 mi | Same dynamics, slightly tighter because of fragility / fitting. |
| **Clip-on thermal / NV** | 50–120 mi (with shipping option) | High-AOV justifies long drives; renters bring their host scope to verify compatibility. |
| **Thermal binoculars / spotting scope** | 50–80 mi | Lodge / guided-hunt destinations; renters travel to the gear. |
| **Hunting pack (Stone Glacier / Kifaru / Kuiu)** | 30–60 mi | Fit-sensitive; in-person try-on. |
| **Ground blind** | 20–40 mi | Bulky, in-trunk transport. |
| **Large LFP power station** | 25–45 mi | Heavy (40–80 lb), often bundled with overlanding pickup. Owner-driven local handoff per `gear-catalogue.md` (UN3480 hazmat over 1,000Wh). |
| **XL power station (3,000Wh+)** | 20–35 mi | Heavier still; bundled-only typically. |
| **Medium power station** | 25–40 mi | Cross-listed on horizontal P2P; price-sensitive renters compare driving distance. |
| **Portable solar panel** | 25–40 mi | Bundle-fit. |
| **Solar generator combo** | 25–40 mi | Single-SKU bundle; bulkier. |
| **Waders (premium)** | 30–60 mi | Size-specific; renter travels to ensure fit. |
| **Wading boots (rubber sole)** | 15–30 mi | Worn-fit item; shorter radius preferred but not strict. |
| **Wading boots (felt sole)** | 10–25 mi | Same as rubber + state-restriction check at handoff. |
| **Premium fly rod + reel** | 30–60 mi | Size + casting-stroke preference; willing to drive to the right rod. |
| **Specialty rod weight** | 30–60 mi | Rare SKU; renters travel to find it (the catalogue's exact "Owner-as-guide handoff is the value-add" pitch). |
| **Float tube / pontoon** | 30–60 mi | Bulky; vehicle-transport check. |
| **Mid-range fly rod + reel** | 25–40 mi | Bundle-fit. |
| **Loaded fly box / net / wading staff** | Bundle-only | Travels with the parent listing; not a standalone radius question. |
| **Premium pizza oven** | 10–20 mi | Party-host use case; ovens are heavy + need an immediate, unforgettable pickup window. Hyper-local. |
| **Premium kamado** | 10–20 mi | Same as pizza oven; even heavier (BGE Large = 162 lb). |
| **Premium pellet smoker** | 15–25 mi | Slightly larger radius; smokers often towed on a trailer. |
| **Catering trailer** | 30–80 mi | Commercial operator; willing to tow significant distance. |

**Three regimes emerge:**

- **Hyper-local (10–20 mi).** Pizza ovens, kamados, party-host gear. Liquidity threshold is metro-density-sensitive — a metro with 50 listings spread over 100 miles still fails because no single neighborhood crosses threshold.
- **Standard (20–50 mi).** Most overlanding kit, most fly-fishing kit, most power stations. Liquidity is a metro-area question.
- **Long-radius / nationwide (50–120 mi or shipped).** Night optics, sat communicators. Liquidity becomes a *regional* question, not a metro question. Bozeman optics supply serves Wyoming, Idaho, and parts of Montana simultaneously.

---

## 3. Density threshold formula

```
N_listings × utilization × P(rental_per_query) ≥ bookings_floor_per_month
```

Where:
- **N_listings** = active listings in the metro with the category turned on
- **utilization** = fraction of available days the gear actually rents (vertical-specific; peak-season figure)
- **P(rental_per_query)** = probability a renter search turns into a booking (RDS-driven prior; ~15% Phase 1 anchor)
- **bookings_floor_per_month** = the minimum activity Kitlo needs in a metro × category to keep the search experience healthy

### Picking bookings_floor

`business-plan.md` §6 models 500 listings/metro × 1.5 rentals/listing/month = 750 rentals/metro/month total. Spread across ~5 active categories per metro (overlanding wedge categories + a few optics + power-station bundles), that's ~150 rentals/category/month at maturity. The floor below which the *search experience* breaks is materially lower: a metro can sustain a healthy catalogue with **~4 rentals/category/month** so long as no popular search returns zero. This is the threshold this doc uses.

bookings_floor_per_month = **4 rentals/category/month** as the minimum-viable threshold for a category in a metro to be publicly marketable. Above that, search returns *something* on most queries; below that, the platform feels empty.

### Backing out N_listings

```
N_listings = bookings_floor / (utilization × P(rental_per_query))
           = 4 / (utilization × 0.15)
```

Per-vertical utilization estimates (peak-season, derived from the per-niche briefs and `gear-catalogue.md`):

| Vertical | Peak-season utilization | Source signal |
|---|---|---|
| Overlanding (RTT, fridge, awning) | 30–40% | Built to Roam B2C inventory at capacity in summer; Hygglo US roof-tent utilization implied at $234/week × ~40% summer fill |
| Overlanding (recovery, dual-battery) | 15–25% | Specialty kit, longer search cycles |
| Night optics (handheld thermal) | 25–35% | UNV / Feral Texas at near-capacity in TX year-round; Bozeman-MT seasonal Oct–Jan |
| Night optics (NV / scope / bundle) | 15–25% | Lower turn rate; higher AOV compensates |
| Power stations (bundled) | 35–50% | Rides on overlanding utilization; bundle attach rate ~40% |
| Power stations (standalone) | 10–20% | Hygglo / FriendWithA category averages; foreclosed on Kitlo |
| Fly fishing (waders + boots) | 20–35% | Spring hatch peaks; RentWaders.com fleet at capacity April–June |
| Fly fishing (premium rods) | 10–20% | Lower turn; AOV compensates |
| Pizza ovens / kamados | 5–10% | Sub-2x/year frequency per `CLAUDE.md`; lowest of all verticals |

---

## 4. Per-vertical liquidity threshold

Applying the formula at bookings_floor = 4/category/month and P(rental_per_query) = 0.15:

| Vertical | Peak utilization | **Min listings to open** | Notes |
|---|---|---|---|
| **Overlanding — RTT** | 35% | **~76** | Highest-utilization core SKU. Round to **80**. |
| **Overlanding — 12V fridge** | 35% | **~76** | Same. Round to **80**. |
| **Overlanding — awning** | 30% | **~89** | Round to **90**. |
| **Overlanding — recovery / dual-battery** | 20% | **~133** | Round to **130** but bundle-only listings collapse this onto the parent. |
| **Overlanding (composite, all categories)** | weighted avg ~28% | **~95** | Phase 1 target: **≥40 active listings** to *open* the metro for public marketing; **≥100** for sustainable mature operations. The 40 floor is enough that the most popular searches (RTT + fridge + awning) hit liquidity; deeper categories fill in over time. |
| **Night Optics — handheld thermal** | 30% | **~89** | Long-radius regional supply; **~30** suffices when supply is also shippable to adjacent states. |
| **Night Optics — NV / scope / bundle** | 20% | **~133** | Q3 supply (concierge-recruited per `rental-demand-model.md`); regional pooling helps. |
| **Night Optics (composite, all categories)** | weighted avg ~25% | **~107** | Phase 1 target: **≥15 active listings in the anchor metro** to open + **≥30 in regional pool** for shippable supply. The radius asymmetry lets a single anchor metro carry the load. |
| **Power Stations — bundled** | 40% | n/a | Liquidity rides on overlanding parent listings. No standalone threshold. |
| **Power Stations — standalone** | 15% | (foreclosed) | Not opened on Kitlo per `business-plan.md` §2. |
| **Fly Fishing — waders + boots** | 28% | **~95** | Bundle-listing dynamic; the composite is what matters. |
| **Fly Fishing — premium rods** | 15% | **~178** | Q3 concierge supply through TU chapters. |
| **Fly Fishing (composite, all categories)** | weighted avg ~22% | **~121** | Phase 2 vertical; layered onto overlanding's metro. Target **≥25 wader/boot listings** + **≥10 premium rod listings** before opening the vertical in a metro. |
| **Pizza Ovens / Smokers** | 7% | **~381** | Confirms Phase 2+ provisional status. The threshold is so high that no Phase 1 or Phase 2 metro can clear it without manufacturer / dealer seeded inventory. Catalogue policy already reflects this. |

**Reading the table:** the operational threshold for opening a metro to public marketing is roughly **40 overlanding listings + 15 night-optics listings**. Below that, even a perfect demand campaign produces a graveyard search experience.

---

## 5. Phase 1 metros assessment

`business-plan.md` §6 names six metros across the two anchor verticals. Assessing each against the liquidity thresholds in §4:

### Overlanding metros

| Metro | Phase | Estimated organic supply ceiling (Year 1) | Liquidity gap to clear | Seeding strategy |
|---|---|---|---|---|
| **Denver / Boulder, CO** | Phase 1 (anchor) | High — Highest ExpeditionPortal density per capita per `business-plan.md` §6; affluent transplants own RTTs/fridges; Borrowed Fly precedent shows P2P concierge demand exists. Estimated 200–400 prospective listers reachable in Year 1. | None at the 40-listing floor — supply-pull metro. May still need seeding to reach the **100-listing** mature-operations target inside 12 months. | **Supply-pull primary.** Run ExpeditionPortal vendor post + Overland Bound Denver chapter outreach + Overland Expo Mountain West presence. Concierge-recruit the first 20 listings to demonstrate the platform's UX. |
| **Seattle / Bellingham, WA** *or* Phoenix, AZ *or* Salt Lake City, UT (Phase 0a outcome) | Phase 1 | Variable. Seattle has PNW overlanding density (mid-high); Phoenix has year-round desert season (mid); SLC has Wasatch Front + national-park gateway (high). Estimated 100–250 in Year 1. | **Likely 10–30 listings short** at metro launch. Needs seeding for 6–9 months. | **Supply-pull + concierge hybrid.** Phase 0a result determines which metro. Plan for ~30 concierge listings + ~10 Side-Hustler poaches from Hygglo / FriendWithA before consumer marketing turns on. |
| **Bend, OR / Boise, ID** | Phase 2 | Mid — vanlife concentration high but smaller absolute population. 80–150 in Year 1 of Phase 2. | **Will start at ~10 listings.** Needs 6+ months of seeding. | **Seeded primary.** Adventure-Wagons-style outfitter partnership; Side-Hustler poaching from Hygglo / GeerGarage. |
| **Bay Area / LA** | Phase 3 | Very high in absolute terms; high competitive pressure from FriendWithA + Hygglo. Estimated 500+ in Year 1 of Phase 3. | None — supply-pull metro. | **Supply-pull only.** Brand-first; do not seed against horizontal P2P competition unless contribution margin clears. |

### Night-optics metros

| Metro | Phase | Estimated organic supply ceiling (Year 1) | Liquidity gap to clear | Seeding strategy |
|---|---|---|---|---|
| **Bozeman, MT** | Phase 1 (anchor) | Mid — MeatEater HQ + premium-optic ownership density. Smaller absolute population caps the ceiling. 60–120 prospective listers in Year 1. | **Will start at ~5–10 listings.** Needs seeding to reach the 15-listing floor; concierge supply for the NV / bundle half. | **Seeded primary.** Hand-recruit 20–30 owners via HuntTalk / Predator Masters / Bozeman guide network. Already wired in the existing codebase per `business-plan.md` §6. |
| **San Antonio / Austin, TX** | Phase 1 | High — Texas Hunting Forum + year-round hog hunting + no seasonality risk. Estimated 200–400 prospective listers in Year 1. | None at the 15-listing metro floor; concierge for the NVG / scope Q3 half. | **Supply-pull + concierge hybrid.** TX is the year-round revenue floor (per `business-plan.md` §6); concierge for premium NVGs through guide network. |
| **Minneapolis, MN** | Phase 2 | Mid — gateway to MN/WI/ND deer + predator seasons. Seasonal (Oct–Jan peak). Estimated 80–150 in Year 1 of Phase 2. | **Will start at ~5 listings.** Seasonally-bounded; needs seeding to clear before the Oct opener. | **Seeded primary.** Recruit in late summer before season opens; tie to Trout Unlimited / state hunting org events. |
| **Southeast states (AL, MS, SC, GA)** | Phase 2 | Mid-high — established thermal/NV ownership; strong night-hunting culture. Multiple regional sub-metros; treat as a *region* not a single metro thanks to long-radius shipping option. | None at the regional pool floor; per-metro depth varies. | **Regional-pool primary.** Anchor on a single Southeast metro (e.g., Birmingham, Charleston, or Atlanta) and pool supply via shipping for the rest. |

### Fly fishing metros (Phase 2 layered)

| Metro | Phase | Estimated organic supply ceiling | Notes |
|---|---|---|---|
| **Bozeman / Missoula, MT** | Phase 2 | High — Madison, Yellowstone, Bitterroot. Phase 1 optics metro overlap means infrastructure already in place. | Layer onto existing optics supply infrastructure. Guide network is the Semi-Pro Outfitter persona overlap. |
| **Salt Lake City, UT** | Phase 2 | Mid-high. | Avoids Borrowed Fly head-to-head. TU chapter network active. |
| **Bellingham / North Cascades, WA** | Phase 2 | Mid. Steelhead-specific. | Seasonal but concentrated demand. |
| **Denver / Boulder, CO** | Phase 3 | High. | Sequenced after Borrowed Fly competitive read. |

### Pizza ovens / smokers (Phase 2+ provisional)

Per the liquidity threshold in §4 (~381 listings to open), no current Phase 1 or Phase 2 metro can be opened. Confirms `gear-catalogue.md` policy. Re-evaluate when manufacturer / dealer seeded inventory becomes available.

---

## 6. Strategic implications

1. **Phase 1 launch requires ~75 hand-recruited listings before paid consumer marketing turns on.** Estimating across the three Phase 1 metros: Denver (~30 concierge + organic), second overlanding metro (~30 concierge), Bozeman (~20 concierge optics). This sequencing aligns with `business-plan.md` §6's "Wizard-of-Oz first 20 bookings" pattern but scales it to the *liquidity-floor* number, not the "first transaction" number. Phase 0a / 0b ad-test waitlists feed directly into this concierge cohort.

2. **Seeding vs. supply-pull is the metro-classification decision.** Denver, San Antonio, Bay Area, LA are supply-pull metros — owners are dense and reachable via community channels; the platform's job is to be visible. Bozeman, Bend, Minneapolis, Southeast cities are seeded metros — supply does not accumulate organically at Phase 1 scale; founder-time hand-recruiting is the dominant ops cost. Misclassifying a seeded metro as supply-pull is the #1 launch failure mode (it produces 6 months of empty search, abandoned consumer marketing budget, and brand damage).

3. **The night-optics long radius is a structural advantage.** With shippable / 100+ mi pickup willingness, a single anchor metro (Bozeman or San Antonio) can serve a multi-state region. Overlanding does not have this property — RTT pickup at 60 mi maximum forces per-metro liquidity. **Consequence:** night-optics liquidity can lead overlanding liquidity in any given launch window, and the optics vertical can be operated as 2 regional pools rather than 6 metros, materially cutting Phase 1 ops cost.

4. **Liquidity failure detection.** Three observable signals indicate a metro is failing to clear threshold:
   - Search-zero-results rate >25% on top-10 queries.
   - Listing-publish-to-first-booking time >45 days median.
   - Active-listing churn >30%/quarter (owners exiting because no bookings).
   Build dashboards for these from day one; the public-marketing trigger is "all three signals below threshold for 30 consecutive days," not a calendar date. Treat liquidity, not time, as the consumer-marketing gate.

5. **Power-station liquidity is bundle-derived, not standalone.** Because standalone is foreclosed (per `business-plan.md` §2), the power-station "metro readiness" question collapses into "does the parent overlanding category clear threshold?" When overlanding clears, power-station bundle attach can start at the next listing-form pass. No independent liquidity model required. Confirms the existing catalogue policy.

6. **Pizza-oven / smoker liquidity is structurally unachievable in Phase 1 metros.** The ~381-listing threshold at 7% utilization is the dominant blocker, *not* owner reluctance. Even if every Phase 1 metro generated 50 supply seeds, the search experience would not clear. This reinforces the Phase 2+ "provisional" status from `CLAUDE.md` and `gear-catalogue.md` as a *liquidity* call, not just an owner-acquisition call. Pizza-oven seasonality + frequency cannot be solved by recruiting harder; the math does not bend.

---

## 7. Cross-references and open questions

- `docs/listing-propensity-model.md` — supply-side propensity, which sets the upstream ceiling on the organic supply estimates in §5.
- `docs/rental-demand-model.md` — demand-side propensity; the **P(rental_per_query) = 0.15** anchor in §3 derives from RDS Phase 1 priors.
- `docs/owner-segmentation.md` — who to recruit when seeding; the seeded-metro classification in §6 implication 2 maps onto Semi-Pro Outfitter (Bozeman) and Side-Hustler (Bend/Minneapolis) persona campaigns.
- `docs/gear-catalogue.md` §"Pricing Reference" — daily rates that drive utilization assumptions.
- `docs/business-plan.md` §6 — metro selection and Phase 0a/0b ad test framing.

**Open questions:**

- **Utilization is the highest-leverage unknown.** A 5-percentage-point error in utilization moves the liquidity threshold by ~30%. The Phase 0 waitlist + first-20-bookings cohort should produce a real utilization estimate by month 4 of Phase 1; revise this doc once that data lands.
- **Radius willingness is route-dependent.** A renter driving from Denver toward Moab will accept a 90-mi RTT pickup; a renter driving from Denver toward Estes Park (opposite direction) will accept only 30 mi. Per-metro radius should eventually be *vector-aware* (point-toward-destination) rather than circular. Out of scope for Phase 1.
- **Shipping changes the geography for night optics.** UNV ships nationally with a $25–40 flat shipping fee. Kitlo's equivalent should be priced as a `delivery_method = shipped` option on optics listings, with insurance rider and signature-required carrier. The §5 regional-pool framing assumes this is available; if it's not, Bozeman + San Antonio operate as standalone metros only.
- **Sat communicators are a nationwide single-pool category, not metro-bound.** Plan-transfer friction (per `gear-catalogue.md`) is the gating constraint. Operationally treat as 1 nationwide pool with ~10 listings as the floor.
- **Bundle radius is min(component radius), not max.** A weekend overland bundle's effective radius is capped by the shortest-radius component (camp kitchen ~25 mi, not RTT 60 mi). The bundle-pricing logic should respect this; `gear-catalogue.md` §"Full-kit bundles" doesn't currently address radius — worth a follow-up.
