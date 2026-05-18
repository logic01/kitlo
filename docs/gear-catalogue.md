# Kitlo — Gear Catalogue & Listing Policy

> Which gear belongs on the platform, which doesn't, and why.

**v2.0 — overlanding pivot.** Sourced from `C:/repo/p2p/concept-research.md` (Adventure Ventures top-4 weighted matrix) and the per-niche research briefs in `C:/repo/p2p/{camping-overlanding-gear,night-hunting-optics,fly-fishing-gear,portable-power-stations,smoker-and-pizza-oven-rental}/`.

Rent vs. own verdicts are based on four signals:
**unit cost** (high = rent appeal), **use frequency** (infrequent = rent appeal), **portability** (hard to travel with = rent appeal), **identity attachment** (becomes part of someone's kit = own preference).

**Listing Key:** ✅ Accept — strong rent candidate | ⚠️ Accept with caveats | ❌ Decline — own-preference item | 🚫 Prohibited — never listable

**LPS column** — Listing Propensity Score from the model in `docs/listing-propensity-model.md`. Higher = an owner of that gear is more likely to list it. Computed as `(R · I · Y) / (1 + K + L + F + V) × 100` using midpoint price, the per-vertical daily rate references in §"Pricing Reference", and category-typical estimates for idle fraction, demand, risk, love, friction, and overvaluation. Values are priors — they will be replaced with logistic-regression estimates once we have observed listing conversions. A combined ranked list across all gear sits at the bottom of this document.

**Bundle-required policy (Q2 Ghost Listings).** The LPS × RDS 2×2 in `docs/rental-demand-model.md` §6 identifies a set of SKUs where supply will accumulate easily (high LPS) but renters will not book them as standalone units (low RDS). These are flagged inline in the tables below as **Bundle-required (Q2 Ghost)** in the rationale column, and `docs/features/03-create-listing.md` enforces parent-bundle attachment when an owner tries to list one. Listing them standalone produces the "active but no bookings" graveyard that kills marketplace UX; do not bypass the enforcement without a metro-density override.

## Verticals (at a glance)

| # | Vertical | Phase | Anchor categories | Avg booking value |
|---|---|---|---|---|
| 1 | **Camping & Overlanding** | Phase 1 anchor | RTTs, 12V fridges, awnings, recovery boards, dual-battery, full kits | $400–800 |
| 2 | **Night Hunting Optics** | Phase 1 | Thermal monoculars / scopes / clip-ons, NV monoculars / scopes / clip-ons, bundles | $500–900 (bundle) |
| 3 | **Portable Power Stations** | Phase 1 (bundle add-on only) | 1,500–3,000Wh+ LFP units; solar panels | +$80–200 on top of overlanding bookings |
| 4 | **Fly Fishing** | Phase 2 (layered vertical) | Waders, wading boots, rod-reel setups, specialty weights, packs | $150–250 |
| 5 | **Smokers & Pizza Ovens** | **Phase 2+, provisional — documented but not built** | Premium pizza ovens ($800+ retail), kamado, pellet smoker, catering trailer | $120–500 |

---

## Prohibited (never listable on Kitlo)

Kitlo does not facilitate the loan or transfer of weapons of any kind. Listings in any of the following categories are blocked at submission and removed if discovered post-publish:

- 🚫 **Firearms** — rifles, shotguns, handguns, air rifles, and any complete firearm
- 🚫 **Firearm components & ammunition** — receivers, barrels, magazines, suppressors, ammunition, primers, powder
- 🚫 **Hunting bows** — compound bows, recurve bows, longbows
- 🚫 **Crossbows** — including pistol crossbows
- 🚫 **Arrows, bolts, broadheads, and bow-string accessories sold as a complete shooting kit**
- 🚫 **NFA / ITAR-controlled items** beyond civilian-export-allowed thermal/NV optics
- 🚫 **Vehicles** — campervans, trailers, rooftop rigs sold with vehicle. Kitlo lists gear, not vehicles. (Outdoorsy and BaseCamper own that surface; renting vehicles inherits commercial-auto-policy issues we deliberately avoid.)
- 🚫 **Gas cylinders with non-empty propane** — owners deliver tanks empty; renters fill locally. Platform default is empty-tank handoff.
- 🚫 **Uncertified Li-ion batteries / power stations without UL 9540 or UL 2743 cert** — major-brand units only (Jackery, Goal Zero, EcoFlow, Bluetti, Anker Solix); white-label imports decline.

**Optics that mount to a weapon are allowed.** Rifle scopes, clip-on thermals, and weapon-mounted NV are optics — the renter brings their own weapon. The platform never moves the weapon itself.

See `features/18-admin-listing-review.md` for full enforcement workflow.

---

## Camping & Overlanding (Phase 1 anchor)

**Source:** `C:/repo/p2p/camping-overlanding-gear/camping-overlanding-gear.md`. Weighted score 8.65 (#1 niche). The overlanding wedge is **specialty kit**, not generic camping — REI Rental owns generic.

**Catalogue purity:** High. The categories below filter for high-AOV specialty items where the rental ratio (rental price ÷ purchase price per use) clears 5–10%.

### Sleep & shelter

| Gear Category | Price Range | Listing Status | LPS | Rationale |
|---------------|-------------|---------------|-----|-----------|
| Rooftop tent (RTT) — hardshell (iKamper, Roofnest Falcon, Alu-Cab) | $2,500–$5,500 | ✅ Accept | 1.07 | The flagship overlanding rental. Used 30–60 nights/year by owners; rented out fills the rest. Vehicle-mount info required at listing. K and F drag hardshell below softshell — heavier install, vehicle-fit risk, careful handoff. |
| Rooftop tent — softshell (Tepui, ARB Esperance, Smittybilt) | $1,200–$2,800 | ✅ Accept | 1.56 | Same rental dynamics as hardshell at lower price point. Lower replacement cost lifts R; simpler mount lowers F. The strongest RTT lister profile. |
| Annex / changing room (RTT add-on) | $200–$500 | ⚠️ Accept with caveats | 0.94 | Bundle with RTT only; standalone listings unlikely to book. Decent R but low Y as solo SKU. **RDS: 14 — Bundle-required (Q2 Ghost).** |
| Ground tent (4-season, premium) | $400–$1,500 | ⚠️ Accept with caveats | 1.29 | Premium 4-season tents (Hilleberg, MSR Access) rent; entry tents fail price-ratio test — REI Rental territory. L runs hotter than RTTs — Hilleberg owners are attached. **RDS: 22 — Bundle-required (Q2 Ghost).** |
| Ground tent (3-season, standard) | $100–$400 | ❌ Decline | 1.13 | Cheap; REI rents these; rental ratio fails. LPS looks fine but Decline stands — Y collapses against REI's standing fleet. |
| Awning (270° / 180° / standard) | $300–$1,500 | ✅ Accept | 2.07 | Vehicle-mount specialty kit; ARB, Alu-Cab, 23ZERO are the rentable brands. Top-tier lister profile — high idle, low love, durable. **RDS: 18 — Bundle-required (Q2 Ghost) when standalone**, auto-attach to RTT parent. |
| Awning room / wall kit | $150–$500 | ⚠️ Accept with caveats | 0.69 | Bundle with awning. Y is the killer as a standalone SKU. |

### Galley & water

| Gear Category | Price Range | Listing Status | LPS | Rationale |
|---------------|-------------|---------------|-----|-----------|
| 12V fridge / freezer (Dometic, ARB, Iceco, Engel) | $700–$1,800 | ✅ Accept | 1.97 | Highest non-shelter overlanding rental category. Renter brings cooler ice math down to zero for a 7-day trip. Low L, low F — clean lister profile. **RDS: 38 — borderline Q1/Q2.** Standalone-allow in deep-density metros (Denver, Bozeman post-Phase-0); bundle-required elsewhere. |
| Camp kitchen / chuck box | $300–$1,200 | ✅ Accept | 1.23 | Gear-proud category; Front Runner / Goose Gear / custom builds. L runs higher than fridges (custom builds), drags LPS. **RDS: 20 — Bundle-required (Q2 Ghost)**, galley sub-bundle anchor. |
| Stove (premium 2-burner, Camp Chef Pro / Partner Steel) | $200–$600 | ⚠️ Accept with caveats | 1.25 | Borderline price; bundle with kitchen for higher AOV. R is strong; Y is the bottleneck. **RDS: 14 — Bundle-required (Q2 Ghost).** |
| Stove (single burner, basic) | $30–$120 | ❌ Decline | 1.19 | Cheap; REI territory. Numerical LPS is fine but Decline stands — operational friction at the price point makes the listing unviable. |
| Water tank / jerry / pressure system | $150–$500 | ⚠️ Accept with caveats | 0.80 | Bundle with kitchen; standalone unlikely. F and V both drag — owners value these higher than market would. |

### Power, recovery, navigation

| Gear Category | Price Range | Listing Status | LPS | Rationale |
|---------------|-------------|---------------|-----|-----------|
| Dual-battery system (portable / pre-wired box) | $600–$2,000 | ✅ Accept | 0.93 | Specialty kit not stocked by B2C rental shops; vehicle-fit info required. K and F both drag — electrical install complexity is real. |
| Recovery board set (MaxTrax, ARB TRED, X-Bull) | $200–$600 | ✅ Accept | 1.76 | Specialty kit; renter may not buy until trip 3+. Excellent profile — high idle, low love, durable. **RDS: 12 — Bundle-required (Q2 Ghost)**, auto-attach to Trailhead expedition parent. |
| Recovery kit (kinetic rope, snatch block, soft shackle) | $200–$800 | ⚠️ Accept with caveats | 0.83 | Liability concerns on misuse; require renter inspection at handoff. High K (misuse can injure or break vehicles) is the bottleneck. |
| Winch (portable, Warn / Smittybilt) | $400–$1,500 | ⚠️ Accept with caveats | 0.55 | Specialty install; verify renter capability or offer guided handoff. K=1.0 and F=0.7 — install-sensitive, vehicle-damage-capable. Low LPS confirms guided-handoff requirement. |
| Air compressor (ARB, MORRFlate, Viair) | $200–$600 | ✅ Accept | 2.27 | Common overlanding consumable rental. **RDS: 10 — Bundle-required (Q2 Ghost).** LPS rank #2 but standalone demand is thin; auto-attach to Trailhead expedition parent. The supply will accumulate; standalone bookings will not. |
| Hi-Lift jack / Pro Eagle jack | $100–$500 | ❌ Decline | 0.55 | Cheap, owner-preference, safety-sensitive misuse risk. Model agrees with Decline — K dominates. |
| Navigation tablet (Gaia / OnX-loaded iPad) | $400–$800 | ❌ Decline | 0.23 | Software-licensing complexity; renters use phones. Model strongly agrees with Decline — high L (personal device), high F (license transfer). |
| Satellite communicator (Garmin inReach, ZOLEO, Starlink Mini) | $400–$2,500 | ✅ Accept | 0.78 | Strong rental category for one-trip use; subscription transferred or pro-rated at booking. Lister verifies plan transfer is allowed by carrier. F drags — plan-transfer friction is real, model suggests building tooling to lower it. |

### Full-kit bundles

Bundle LPS is bottlenecked by the most reluctant component (provisional rule from `docs/listing-propensity-model.md` §7): `LPS(bundle) ≈ min(LPS(items))`. The number to watch is the lowest-LPS member.

| Bundle archetype | Typical contents | Listing Status | LPS | Bottleneck |
|------------------|-------------------|----------------|-----|------------|
| **Weekend overland** | RTT + awning + 12V fridge + camp kitchen + power station | ✅ Accept | 1.07 | RTT hardshell (1.07) — softshell variant lifts bundle to 1.19. |
| **Trailhead expedition** | Weekend bundle + recovery boards + air compressor + sat communicator | ✅ Accept | 0.78 | Sat communicator (0.78) — plan-transfer friction limits the whole bundle. |
| **Family ground camp** | Premium 4-season ground tent + camp kitchen + 12V fridge + power station | ✅ Accept | 1.19 | Large power station (1.19) — the 4-season tent's L rises with Hilleberg-tier owners; check pricing tier. |

**Listing requirements specific to this vertical:**

- **Vehicle-fit info** — RTT mount type (crossbar pattern, max load), awning compatibility (rail size), fridge slide footprint, dual-battery wiring layout. Required at listing publish.
- **Pickup walkthrough** — 15-minute mandatory handoff. Owner right-of-refusal if renter's vehicle doesn't match listing compatibility (e.g., no crossbars rated for RTT load).
- **Bundle pricing** — bundle SKU rents for ≥85% of summed component daily rates (5–15% bundle discount as the lister's choice).

---

## Night Hunting Optics (Phase 1)

**Source:** `C:/repo/p2p/night-hunting-optics/night-hunting-optics.md`. Weighted score 7.28 (#2 niche). Most defensible vertical: no national P2P competitor exists for either thermal or NV.

Thermal and night vision are complementary technologies used sequentially on the same hunt — thermal detects (heat signatures at distance), NV engages (visual detail for shot placement). The bundle rental covering both in one booking is the core product, with no equivalent offered by any B2C or P2P competitor today.

**Catalogue purity: Very High** — nearly every item at a meaningful price point is rent-favorable. Almost no own-preference noise at the price levels that matter.

### Thermal Imaging

| Gear Category | Price Range | Listing Status | LPS | Rationale |
|---------------|-------------|---------------|-----|-----------|
| Handheld thermal monocular | $400–$3,000 | ✅ Accept | 1.69 | Most common hunting thermal; used 10–20 nights per year; strong try-before-you-buy pattern. Highest LPS in the optics catalogue — strong R, low F (ITAR aside), low L vs scopes/NVGs. |
| Thermal rifle scope | $2,000–$10,000+ | ✅ Accept | 0.61 | Highest price point in the category; hunters want to test before committing $5k+. K is the killer — $6k average means mounting/handling care is paramount. |
| Clip-on thermal (attaches to daytime scope) | $1,500–$5,000 | ✅ Accept | 0.92 | Lets hunters test thermal on their existing rifle setup; very high TBYB signal. Better LPS than a full scope — same R band, less L (it isn't the scope itself). |
| Thermal binoculars | $3,000–$8,000 | ✅ Accept | 0.55 | Premium glassing tool; destination hunters and guides rent rather than own. K dominates at $5k+ replacement cost. |
| Thermal spotting scope | $2,000–$6,000 | ✅ Accept | 0.49 | Fixed-position tool; lodge/ranch operators may own one, individual hunters rent. Y is low (specialty use); supply-side prioritization should reflect this. |
| Body / trail camera (standard) | $100–$400 | ❌ Decline | 0.14 | Cheap; hunters set-and-forget on their own land; not a rental item. I collapses (they're deployed year-round on owner land) — model strongly agrees with Decline. |
| Drone-mounted thermal camera | $1,500–$5,000+ | ❌ Decline | 0.18 | FAA Part 107 regulatory complexity; operator-specific configuration; not a standalone rental item. F=0.9 dominates. Model agrees. |

### Night Vision

| Gear Category | Price Range | Listing Status | LPS | Rationale |
|---------------|-------------|---------------|-----|-----------|
| Night vision goggles / head-mounted units | $2,000–$10,000+ | ✅ Accept | 0.53 | Extreme price, used 5–15 nights per season; strongest TBYB dynamic in the entire catalogue. K=1.3 (fragile tubes) + L=0.7 (PVS-14 ownership identity) drag heavily — demand is real but supply-side reluctance is the bottleneck. |
| Night vision monoculars | $500–$3,000 | ✅ Accept | 1.24 | Same seasonal pattern; entry-level hunters rent before committing to $1–2k. Best-LPS night-vision SKU — owners less attached than at PVS-14 tier. |
| Night vision rifle scopes | $1,500–$8,000+ | ✅ Accept | 0.50 | Expensive, seasonal. **Note:** platform must verify renter's state hunting regulations at booking — legal for civilian use in most states (especially hog hunting in TX) but not universal. F=0.6 from state-reg checks; K=1.2 from price. |
| Clip-on night vision (attaches to daytime scope) | $1,500–$5,000 | ✅ Accept | 0.76 | High value, hunter-specific; renters test compatibility with their own scope before buying. |
| High-end binoculars (10x42+) | $500–$3,000 | ⚠️ Accept with caveats | 0.32 | Hunters develop strong glass preferences; one-off destination hunters rent, active hunters buy — accept but expect lower utilization than thermal/NV units. L=1.0 confirms catalogue's caveat. |
| Spotting scope | $400–$2,500 | ⚠️ Accept with caveats | 0.37 | Used from a fixed glassing position; hunters evaluating long-range setups rent to test weight class and reticle. |
| Rangefinder | $200–$1,500 | ❌ Decline | 0.40 | Hunters calibrate to their specific rifle; strong personal preference; cheap enough to own at mid-tier. The price-ratio test fails: $83/14-day on a $250 rangefinder = 33% of purchase price — confirmed rent-aversion threshold from forum research. L=0.9 + V=0.5 drag — model agrees with Decline. |
| Hunting headlamp / red-green hunting lights | $30–$150 | ❌ Decline | 0.57 | Too cheap to rent; consumable batteries; personal fit item. R looks fine but operational friction (hygiene, batteries) eliminates it. |

### Core Product

The **bundle rental** — thermal monocular for detection + NV scope for engagement — covers a complete night hunt in one booking. Avg booking value: **$500–900 for a 3–5 day hunt**. No B2C or P2P competitor offers this combined product today. This is the flagship listing type Kitlo should actively promote and optimize for.

---

## Hunting Camp & Support Gear

Secondary catalogue. These items are not the reason a hunter opens the app, but they increase booking value when bundled with optics or with overlanding kit.

| Gear Category | Price Range | Listing Status | LPS | Rationale |
|---------------|-------------|---------------|-----|-----------|
| Ground blind | $100–$500 | ⚠️ Accept with caveats | 1.50 | Hunters who hunt different property types each season see rental value; dedicated hunters own theirs. Surprisingly strong LPS — cheap to replace, low L. **RDS: 14 — Bundle-required (Q2 Ghost)**, bundle with hunting-trip optics or suppress. |
| Tree stand / climbing stand | $150–$500 | ❌ Decline | 0.39 | Liability score too high for P2P without inspection attestation infrastructure; safety-critical gear. K=1.2 + F=0.8 — model confirms Decline. |
| Hunting blind heater (propane) | $40–$150 | ❌ Decline | 0.59 | Too cheap; consumable propane; hygienic concerns with shared enclosed use. |
| Hunting pack (Stone Glacier, Kifaru, Kuiu) | $300–$700 | ⚠️ Accept with caveats | 0.53 | Premium destination-hunt rental; lower utilization than optics. Personal-fit identity item for active hunters. L=1.2 is the headline — backcountry hunting packs are deeply customized, sized, and identity-loaded. |

---

## Portable Power Stations (Phase 1 — bundle add-on only)

**Source:** `C:/repo/p2p/portable-power-stations/portable-power-stations.md`. Weighted score 6.55 (#4 niche). **Standalone is foreclosed** by Hygglo, FriendWithA, and ShareGrid (all active US horizontal P2P). The vertical exists on Kitlo as a bundle add-on to overlanding and hunting bookings — that's where the unbeaten contribution margin lives.

| Gear Category | Price Range | Listing Status | LPS | Rationale |
|---------------|-------------|---------------|-----|-----------|
| Large LFP power station (1,500–3,000Wh — Jackery 1500/2000, Goal Zero Yeti 1500X, EcoFlow Delta Pro, Bluetti AC200/AC300, Anker Solix F2000+) | $1,000–$3,000+ | ✅ Accept | 1.19 | Powers fridges, RTT lights, scope/binocular charging overnight on a 4–7 day overland trip. Bundle with overlanding kit. |
| XL power station (3,000Wh+ — Goal Zero 3000X, EcoFlow Delta Pro Ultra, Bluetti AC500) | $2,500–$5,000+ | ✅ Accept | 0.67 | Higher-deposit tier; mandatory Li-ion thermal-event rider. K from thermal-event rider drags. |
| Medium power station (500–1,000Wh — Jackery 1000, EcoFlow Delta 2, Anker Solix C1000) | $400–$1,000 | ⚠️ Accept with caveats | 1.08 | Rental window closing as battery prices fall (BNEF $108/kWh in 2025; LFP at $81/kWh). **RDS: 22 — Bundle-required (Q2 Ghost)**, listing form blocks standalone publish. V=0.3 reflects the closing arbitrage window. |
| Small power station / power bank (under 300Wh — Jackery 300, EcoFlow River 2 Mini) | $80–$300 | ❌ Decline | 0.45 | Impulse-buy price range; rental ratio fails. V=0.5 — too cheap, owners would rather sell than rent. |
| Portable solar panel (100–400W — Jackery SolarSaga, Goal Zero Boulder, EcoFlow 400W) | $150–$600 | ⚠️ Accept with caveats | 1.30 | Good bundle companion; durable for rental use. LPS suggests upgrading from caveat — strong R, low L, durable. **RDS: 16 — Bundle-required (Q2 Ghost)**, attach to power station parent. |
| Solar generator combo (panel + station bundled) | $1,200–$4,000 | ✅ Accept | 0.86 | Single-SKU bundle from owner; clean for renter. |

**Listing requirements specific to this vertical:**

- **UL 9540 / 2743 cert required** — major brands only. Uncertified white-label imports are prohibited per `Prohibited` section above.
- **Empty-tank / safe storage attestation** — owner attests no recent over-discharge or thermal-event damage; battery health % declared at listing.
- **Local pickup default** — renter-arranged shipping is disallowed for units > 1,000Wh (UN3480/UN3481 hazmat). Owner-driven local handoff only.
- **Bundle-default listing** — UI nudges new power-station listings into bundle mode with overlanding owners in the same metro.

---

## Fly Fishing (Phase 2 layered vertical)

**Source:** `C:/repo/p2p/fly-fishing-gear/fly-fishing-gear.md`. Weighted score 6.63 (#3 niche). Lowest standalone economics ($150–250 AOV) — only viable layered onto overlanding's owner base, payments, and trust infrastructure. Trout Unlimited 300+ chapter network is the supply-side acquisition channel.

| Gear Category | Price Range | Listing Status | LPS | Rationale |
|---------------|-------------|---------------|-----|-----------|
| Waders (premium — Simms G3/G4, Patagonia Swiftcurrent, Orvis Pro) | $400–$1,000 | ✅ Accept | 1.90 | The hardest item for a destination angler to pack; size-specific; wears modestly with care. Catalogue anchor — confirmed by model. |
| Wading boots (Korkers, Simms Freestone) — **rubber sole** | $150–$300 | ✅ Accept | 2.74 | Rubber sole travels across watersheds without invasive-species risk. **Highest LPS in the entire catalogue** — R is excellent (15/225 ≈ 6.7%), L is low, no regulatory drag. **RDS: 13 — Bundle-required (Q2 Ghost)**, must attach to wader parent. Standalone-allow only in active Trout Unlimited partner metros where wader supply is already deep. |
| Wading boots — **felt sole** | $150–$300 | ⚠️ Accept with caveats | 1.39 | Felt sole banned/restricted in MD, AK, others. Listing must declare sole material; cross-state rentals default to rubber. Y is the drag — regulatory limits the booking pool. **RDS: 8 — Bundle-required (Q2 Ghost)**, attach to wader parent + state-restriction check. |
| Premium fly rod + reel setup (Sage X / R8, Scott Centric, Winston Air, Hatch / Ross / Galvan reels) | $600–$1,800 | ✅ Accept | 0.99 | Premium rod-rental partner (Rent This Rod) validates B2C demand; P2P wedge is variety + delivery. L=1.3 — anglers' attachment to their rod is the #1 reason this vertical drags. |
| Specialty rod weight (2/3-wt small stream; 8wt+ steelhead/saltwater) | $400–$1,500 | ✅ Accept | 0.95 | Weights B2C shop fleets don't stock. Owner-as-guide handoff is the value-add. L still high but I is higher (rarely-used weights). |
| Mid-range fly rod + reel (Echo, Redington, TFO) | $200–$500 | ⚠️ Accept with caveats | 1.38 | Borderline rental ratio; bundle with waders to clear AOV threshold. Lower L than premium rods (less prestige item) — actually a *better* lister profile than premium rods. Surprising finding. **RDS: 20 — Bundle-required (Q2 Ghost)**, attach to wader/boot parent. |
| Loaded fly box / hatch kit | $50–$200 | ⚠️ Accept with caveats | 0.56 | Bundle add-on only; standalone unlikely to book. Hygiene-managed (sealed box at handoff). L=0.8 — curated personal collection. |
| Net (premium — Fishpond Nomad, Brodin) | $100–$300 | ⚠️ Accept with caveats | 0.54 | Bundle add-on. |
| Wading staff | $50–$200 | ⚠️ Accept with caveats | 0.58 | Bundle add-on. |
| Sling pack / hip pack (premium — Patagonia, Fishpond, Simms Freestone) | $150–$350 | ⚠️ Accept with caveats | 0.44 | Personal-fit identity item; modest demand. L=1.0 — model confirms catalogue's note. |
| Float tube / pontoon | $300–$1,200 | ⚠️ Accept with caveats | 1.01 | Specialty kit; vehicle-transport check; common Mountain West rental demand. Strongest non-wader/boot fly-fishing SKU — should consider promoting from caveat. |
| Tippet, leader, fly line, fly tying material | <$50 | ❌ Decline | n/a | Consumable; hygiene; rental ratio fails. LPS not meaningful for consumables. |
| Fly tying kit (full bench, premium vise) | $400–$1,500 | ⚠️ Accept with caveats | 0.19 | Niche but real for try-before-you-buy. Hygiene and consumables managed. L=1.5 — tying benches are intensely personal, model strongly drags. Probably shouldn't be promoted. |

**Listing requirements specific to this vertical:**

- **Wading boot sole material declared** at listing — felt vs. rubber. Cross-state booking defaults to rubber.
- **Between-rental cleaning attestation** — both owner and renter confirm decontamination protocol (didymo, whirling disease, NZ mudsnail) at handoff and return.
- **State fishing-license attestation** at booking — renter confirms current state license (kitlo does not sell licenses).
- **Owner-as-guide intel field** — optional free-text on listing for hatch/access notes; surfaces in pickup messaging.

---

## Smokers & Pizza Ovens (Phase 2+ — provisional, not built)

**Source:** `C:/repo/p2p/smoker-and-pizza-oven-rental/smoker-and-pizza-oven-rental.md`. Provisional weighted score 6.10. Documented here for completeness. **Listing-form support is not built and not scheduled** — the vertical is held until the first four show liquidity.

**Why provisional, not built:**
- Sub-2x/year frequency (yellow-flag per methodology); CAC payback is structurally fragile.
- BGE / Kamado owner activation friction is real — premium grill ownership is identity-driven, not utility-driven, and the eggheadforum.com community is fiercely possessive of their gear.
- Big Green Egg's 70–80% secondhand value retention makes buy-use-resell competitive with rental for once-a-year hosts.

**Catalogue policy when (if) the vertical opens:**

| Gear Category | Price Range | Listing Status | LPS | Rationale |
|---------------|-------------|---------------|-----|-----------|
| Premium pizza oven (Gozney Dome / Dome S1, Alfa Forni, Chicago Brick Oven) | $1,500–$3,500 | ✅ Accept | 0.27 | Rental ratio clears; party-host AOV $200–300 weekend. Model strongly drags Y (sub-2x/year frequency) — confirms the Phase 3 "provisional" call. |
| Mid pizza oven (Gozney Roccbox, Ooni Karu 16, Solo Stove Pi Prime) | $400–$700 | ⚠️ Accept with caveats | 0.66 | Borderline ratio; entry-level Ooni fails. Highest-LPS SKU in this vertical — R is strong at this price tier. |
| Entry pizza oven (Ooni Karu 12, Ooni Fyra, Solo Stove Pi non-Prime) | $200–$400 | ❌ Decline | 0.51 | Rental ratio fails; "I'll just buy one" territory. V=0.5 — owner valuation exceeds rental math. |
| Premium kamado (Big Green Egg Large/XL, Kamado Joe Big Joe, Primo Oval XL) | $1,000–$2,500 | ✅ Accept | 0.29 | High-value, party-host rental wedge — but anticipate owner reluctance per research. L=1.8 — BGE owner identity is the structural blocker, model confirms. |
| Standard kamado (BGE Medium, Kamado Joe Classic) | $700–$1,200 | ⚠️ Accept with caveats | 0.34 | At rental-ratio threshold. L=1.5 still drags. |
| Entry kamado (BGE MiniMax, knockoff brands) | $300–$700 | ❌ Decline | 0.32 | Buy-use-resell loop is strictly cheaper; owners don't list. |
| Premium pellet smoker (Traeger Ironwood/Timberline, Yoder YS640) | $1,000–$2,500 | ✅ Accept | 0.23 | Try-before-you-buy demand documented. F=0.7 (heavy, electricity, towing) + L=1.2 (Traeger loyalty) — supply-side reluctance is the bottleneck. |
| Entry pellet smoker (Traeger Pro 22/575, Pit Boss starter) | $300–$700 | ❌ Decline | 0.32 | Rental ratio fails. |
| Catering trailer (custom offset, full setup) | $5,000–$25,000+ | ⚠️ Accept with caveats | 0.25 | Caterer/pop-up operator class; specialty insurance rider; not casual P2P. F=1.0 — model treats this as effectively non-listable for the typical owner. |
| Pizza oven accessories (peel, dough scraper, infrared thermometer) | $20–$150 | ⚠️ Accept with caveats | n/a | Bundle-only with parent oven. LPS not meaningful as a standalone SKU. |

**Listing requirements specific to this vertical (when opened):**

- **≥$800 retail price floor** for primary listings — entry-level Ooni and Solo Stove blocked at submission.
- **Empty-tank propane handoff** — owner delivers tank empty; renter sources locally. Tank fill is never platform-mediated.
- **HOA / location attestation** — renter confirms authority to operate at the use location (NFPA 1 §10.10.6 prohibits open-flame on combustible balconies in some jurisdictions).
- **Mandatory cooldown attestation** at return — equipment returned cold, ash removed.

---

## Pricing Reference

Pulled from active B2C and P2P rental operators (May 2026 research). Use these as market-rate anchors for suggested list prices.

### Camping & Overlanding

| Operator | Gear | Daily / Weekend Rate | Source |
|---|---|---|---|
| Built to Roam Rental Co. (Austin/Florence TX, B2C) | Specialty overlanding kit | $125/day specialty; $29/day accessory | builttoroamrentalco.com |
| Hygglo US (P2P) | Roof tent | ~$47/day, ~$234/week | hygglo.com/us/category/8977-roof-tent |
| GeerGarage (P2P, multi-metro) | Generic camping inventory | Variable | geergarage.com |

### Night Hunting Optics

| Operator | Gear | 3-Day Rate | TBYB Incentive |
|----------|------|------------|----------------|
| Ultimate Night Vision (ships nationwide) | ATN ThOR thermal, PVS-14 NVG, full catalogue | $199 (ATN ThOR); $200–500/weekend NVG | 100% of rental fee applies toward purchase |
| Feral Texas Outdoors (Holland, TX — local + ships) | AGM Rattler, Nocpix, RIX Storm, InfiRay, ObservIR | $120–$375 scopes; $150–$350 handhelds | Rental fee waived if unit purchased within 15 days |
| optics4rent.com (ships nationwide) | Swarovski and premium daytime spotters | Not confirmed | Not confirmed |

### Portable Power Stations

| Operator | Gear | Daily Rate | Source |
|---|---|---|---|
| FriendWithA (P2P) | Jackery 1000 Pro | $40/day | friendwitha.com (Brea CA listing) |
| FriendWithA (P2P) | Goal Zero 3000X | $70/day | composite |
| Hygglo US (P2P) | Power station median | ~$38/day | hygglo.com/us/category/9471-power-station |

### Fly Fishing

| Operator | Gear | Daily Rate | Source |
|---|---|---|---|
| RentWaders.com (B2C) | Waders + boots | $40–50/day | rentwaders.com |
| Anglers All (B2C, Bozeman gateway) | Per-piece | $25/day | anglersall.com |
| Breckenridge Outfitters (B2C) | Full kit / waders+boots | $100/day full; $40/day W+B | breckenridgeoutfitters.com |
| Borrowed Fly (Denver/CO Springs B2C concierge) | Full outfit hand-delivered | $80–120/day | borrowedfly.com |

### Smokers & Pizza Ovens (Phase 2+ provisional)

| Operator | Gear | Daily Rate | Source |
|---|---|---|---|
| Hygglo US (P2P, ~4 listings nationally) | Pizza oven (median) | ~$28/day | hygglo.com/us/category/9232-pizza-oven |
| Rent Heron (B2C multi-city) | Ooni Koda 16 | Per-event | rentheron.com |
| Forno Gourmet (NYC B2C) | Pizza oven + delivery + food | Bundled | fornogourmet.com |

**Key pricing insight (carries across verticals):** Rent-aversion disappears when the gear is expensive enough. A hunter balked at $83/14-day for a $250 rangefinder (33% of purchase price). The same hunter accepts $199/weekend for a $5,000 thermal scope (4% of purchase price). The same logic applies to overlanding ($300/weekend on a $4,000 RTT = 7.5%), fly fishing ($120 on a $1,000 wader+boot setup = 12%), and pizza ovens ($300/weekend on a $2,000 Gozney Dome = 15%). Filter the catalogue toward high-value units — the price-ratio math works in Kitlo's favor.

---

## Insurance & Deposit Policy

Tier policy applies across all verticals; per-vertical adders below.

| Gear Value | Deposit (card hold) | Renter Protection Plan | Coverage Notes |
|------------|--------------------|-----------------------|----------------|
| Under $1,000 | 25% of MSRP | Optional, $5–15/day | Thimble Business Equipment Protection (up to $5k/item) covers adequately |
| $1,000–$5,000 | 20% of MSRP | Required, $15–25/day | Thimble adequate; negotiate higher limits as volume grows |
| Over $5,000 | 15% of MSRP (held on card) + identity verification | Required, $25+/day | Thimble's $5k cap is inadequate — needs electronics-specific high-value policy (K&K Insurance, or specialist film/AV equipment insurer; same approach LensRentals uses). **Do not accept premium unit listings until this policy is in place.** |

### Per-vertical adders

| Vertical | Adder |
|---|---|
| **Camping & Overlanding** | RTT/awning vehicle-fit attestation. Owner right-of-refusal at handoff if vehicle doesn't match listing compatibility. Bundle listings >$5k follow the over-$5k tier. |
| **Night Hunting Optics** | US-Person attestation at signup (ITAR §120.15). No international transport. Bundle listings (thermal+NV) commonly exceed Thimble's $5k cap — specialty rider mandatory. |
| **Portable Power Stations** | Li-ion thermal-event rider mandatory on >$2k units. UL 9540 / 2743 cert required at listing. No renter-arranged shipping >1,000Wh (UN3480 hazmat). |
| **Fly Fishing** | Standard tier; Thimble adequate. Wading-boot sole material declared. Between-rental decontamination attestation. |
| **Smokers & Pizza Ovens** (Phase 2+) | Empty-tank propane handoff. HOA / location-authority attestation. Catering trailers ($5k+) need specialty commercial rider. |

---

## Community & Supply Acquisition (per vertical)

Each vertical has its own supply community. Cold outreach to the wrong forum converts at zero. Match channel to vertical.

### Camping & Overlanding
- **ExpeditionPortal** (180,000+ members, 2.5M+ posts) — the canonical overlanding forum
- **r/overlanding** (67,888 subscribers)
- **Overland Bound** community (forum + chapter network)
- **r/4Runner**, **r/Tacoma**, **r/CherokeeXJ**, **r/Wrangler** — vehicle-specific overlanding subreddits
- Overlanding YouTube creators and the Overland Expo events (West/East/Mountain West)
- Local 4WD shops and overlanding outfitters (Adventure Wagons, RoamRig, Cascadia 4x4, Goose Gear, Front Runner)

### Night Hunting Optics
- **HuntTalk** (38,657 members, 2.2M messages)
- **Predator Masters** (verbatim P2P thermal-rental thesis posted by a member)
- **Texas Hunting Forum** (TX hog hunting is the year-round revenue floor)
- **Sniper's Hide** ("Thermal Rental Suggestions" thread is a sourced demand signal)
- **Airgunnation**, **RokSlide**, **GON Forum**, **Varmint Hunters**
- State-level hunting Facebook groups (TX, AL, MS, WI, MN)

### Portable Power Stations
- Riding overlanding's channels — supply community is identical. No separate acquisition spend.

### Fly Fishing
- **r/flyfishing** (290,000 subscribers)
- **Trout Unlimited 300+ chapter network** — CastBack/TU partnership (2025) is the precedent; chapter-by-chapter sponsorship is the channel
- **The Fly Fishing Forum**, **Westfly**, **Spey Pages**
- Local fly shops in non-destination towns (the riverbank gap, not the gateway gap)

### Smokers & Pizza Ovens (Phase 2+ provisional)
- **r/smoking** (783K), **r/BBQ** (661K), **eggheadforum.com** (~30K active BGE owners), **r/Ooni**, **Forno Bravo Forum**, **Pizza Making Forum**

**Trust note:** Every one of these communities is trust-insular and skeptical of new platforms. Cold outreach converts poorly. Warm introductions through community-native voices, content creators, and existing-platform partnerships outperform any paid social campaign for supply acquisition.

---

## Go-to-Market Geography

Two anchor verticals → two beachhead pairs. Sequenced and validated separately in Phase 0 (see `business-plan.md` §6).

### Camping & Overlanding (Phase 1 anchor)

| Market | Why | Launch Phase |
|--------|-----|-------------|
| Denver / Boulder, CO | Highest ExpeditionPortal-active overlander density per capita; gateway to Rocky Mountain routes; affluent transplants own RTTs/fridges/dual-battery that sit idle | Phase 1 (validated in Phase 0a) |
| Seattle / Bellingham, WA *or* Phoenix, AZ *or* Salt Lake City, UT | Second metro, picked from Phase 0a results. Seattle: PNW overlanding density. Phoenix: year-round desert season. SLC: Wasatch Front overlanding + national park gateway. | Phase 1 |
| Bend, OR / Boise, ID | Vanlife operator concentration; bridges into power-station bundle supply | Phase 2 |
| Bay Area / LA | Specialty kit demand high; competition from horizontal P2P (FriendWithA) tighter | Phase 3 |

### Night Hunting Optics (Phase 1 parallel anchor)

| Market | Why | Launch Phase |
|--------|-----|-------------|
| Bozeman, MT | Pre-existing validated hunting beachhead; MeatEater HQ + premium-optic-heavy transplants | Phase 1 (validated in Phase 0b) |
| San Antonio / Austin, TX | Highest single-market thermal/NV density; TX hog hunting is year-round (no seasonality risk) | Phase 1 |
| Minneapolis, MN | Gateway to MN/WI/ND deer + predator seasons | Phase 2 |
| Southeast states (AL, MS, SC, GA) | Strong night-hunting culture; established thermal/NV ownership | Phase 2 |

### Fly Fishing (Phase 2 layered vertical)

| Market | Why | Launch Phase |
|--------|-----|-------------|
| Bozeman, MT / Missoula, MT | Madison, Yellowstone, Bitterroot. Already a Phase 1 optics market — layering gear shares supply infrastructure. | Phase 2 |
| Salt Lake City, UT | Provo, Green, Weber. Avoids Borrowed Fly head-to-head in Denver. | Phase 2 |
| Bellingham / North Cascades, WA | Skagit, Stillaguamish steelhead. | Phase 2 |
| Denver / Boulder, CO | Front Range tailwaters. Sequenced after Borrowed Fly competitive read; later than other fly-fishing metros. | Phase 3 |

### Smokers & Pizza Ovens (Phase 2+, if/when opened)

| Market | Why | Launch Phase |
|--------|-----|-------------|
| Charleston / Atlanta corridor | Big Green Egg HQ; highest premium-grill ownership per capita | Phase 2+ |
| Austin / Dallas / Houston | TX BBQ culture; high backyard-party frequency | Phase 2+ |

---

## Combined LPS Ranking

Every catalogued SKU ranked from most-likely-to-list (highest LPS) to least, ignoring listing status. Bundles use the bottleneck (min-LPS) rule; consumables and pure bundle add-ons (fly line, pizza-oven accessories) are excluded from the ranking. Use this as the master prioritization list for supply-side outreach, listing-form UX investment, and vertical sequencing.

| Rank | Gear | Vertical | LPS | Listing Status |
|------|------|----------|-----|----------------|
| 1 | Wading boots — rubber sole | Fly Fishing | 2.74 | ✅ |
| 2 | Air compressor | Overlanding | 2.27 | ✅ |
| 3 | Awning (270° / 180° / standard) | Overlanding | 2.07 | ✅ |
| 4 | 12V fridge / freezer | Overlanding | 1.97 | ✅ |
| 5 | Waders (premium) | Fly Fishing | 1.90 | ✅ |
| 6 | Recovery board set | Overlanding | 1.76 | ✅ |
| 7 | Handheld thermal monocular | Night Optics | 1.69 | ✅ |
| 8 | Rooftop tent — softshell | Overlanding | 1.56 | ✅ |
| 9 | Ground blind | Hunting Support | 1.50 | ⚠️ |
| 10 | Wading boots — felt sole | Fly Fishing | 1.39 | ⚠️ |
| 11 | Mid-range fly rod + reel | Fly Fishing | 1.38 | ⚠️ |
| 12 | Portable solar panel | Power Stations | 1.30 | ⚠️ |
| 13 | Ground tent (4-season, premium) | Overlanding | 1.29 | ⚠️ |
| 14 | Premium 2-burner stove | Overlanding | 1.25 | ⚠️ |
| 15 | Night vision monoculars | Night Optics | 1.24 | ✅ |
| 16 | Camp kitchen / chuck box | Overlanding | 1.23 | ✅ |
| 17 | Large LFP power station | Power Stations | 1.19 | ✅ |
| 18 | Single burner stove (basic) | Overlanding | 1.19 | ❌ |
| 19 | Ground tent (3-season, standard) | Overlanding | 1.13 | ❌ |
| 20 | Medium power station | Power Stations | 1.08 | ⚠️ |
| 21 | Rooftop tent — hardshell | Overlanding | 1.07 | ✅ |
| 22 | Float tube / pontoon | Fly Fishing | 1.01 | ⚠️ |
| 23 | Premium fly rod + reel setup | Fly Fishing | 0.99 | ✅ |
| 24 | Specialty rod weight | Fly Fishing | 0.95 | ✅ |
| 25 | Annex / changing room | Overlanding | 0.94 | ⚠️ |
| 26 | Dual-battery system | Overlanding | 0.93 | ✅ |
| 27 | Clip-on thermal | Night Optics | 0.92 | ✅ |
| 28 | Solar generator combo | Power Stations | 0.86 | ✅ |
| 29 | Recovery kit | Overlanding | 0.83 | ⚠️ |
| 30 | Water tank / jerry / pressure system | Overlanding | 0.80 | ⚠️ |
| 31 | Satellite communicator | Overlanding | 0.78 | ✅ |
| 32 | Clip-on night vision | Night Optics | 0.76 | ✅ |
| 33 | Awning room / wall kit | Overlanding | 0.69 | ⚠️ |
| 34 | XL power station (3,000Wh+) | Power Stations | 0.67 | ✅ |
| 35 | Mid pizza oven | Smokers/Pizza | 0.66 | ⚠️ |
| 36 | Thermal rifle scope | Night Optics | 0.61 | ✅ |
| 37 | Hunting blind heater (propane) | Hunting Support | 0.59 | ❌ |
| 38 | Wading staff | Fly Fishing | 0.58 | ⚠️ |
| 39 | Hunting headlamp / red-green lights | Night Optics | 0.57 | ❌ |
| 40 | Loaded fly box / hatch kit | Fly Fishing | 0.56 | ⚠️ |
| 41 | Winch (portable) | Overlanding | 0.55 | ⚠️ |
| 42 | Thermal binoculars | Night Optics | 0.55 | ✅ |
| 43 | Hi-Lift / Pro Eagle jack | Overlanding | 0.55 | ❌ |
| 44 | Net (premium) | Fly Fishing | 0.54 | ⚠️ |
| 45 | Hunting pack (Stone Glacier / Kifaru / Kuiu) | Hunting Support | 0.53 | ⚠️ |
| 46 | Night vision goggles / head-mounted | Night Optics | 0.53 | ✅ |
| 47 | Entry pizza oven | Smokers/Pizza | 0.51 | ❌ |
| 48 | Night vision rifle scopes | Night Optics | 0.50 | ✅ |
| 49 | Thermal spotting scope | Night Optics | 0.49 | ✅ |
| 50 | Small power station (under 300Wh) | Power Stations | 0.45 | ❌ |
| 51 | Sling pack / hip pack | Fly Fishing | 0.44 | ⚠️ |
| 52 | Rangefinder | Night Optics | 0.40 | ❌ |
| 53 | Tree stand / climbing stand | Hunting Support | 0.39 | ❌ |
| 54 | Spotting scope (daytime) | Night Optics | 0.37 | ⚠️ |
| 55 | Standard kamado | Smokers/Pizza | 0.34 | ⚠️ |
| 56 | Entry kamado | Smokers/Pizza | 0.32 | ❌ |
| 57 | Entry pellet smoker | Smokers/Pizza | 0.32 | ❌ |
| 58 | High-end binoculars (10x42+) | Night Optics | 0.32 | ⚠️ |
| 59 | Premium kamado (BGE Large/XL) | Smokers/Pizza | 0.29 | ✅ |
| 60 | Premium pizza oven | Smokers/Pizza | 0.27 | ✅ |
| 61 | Catering trailer | Smokers/Pizza | 0.25 | ⚠️ |
| 62 | Premium pellet smoker | Smokers/Pizza | 0.23 | ✅ |
| 63 | Navigation tablet | Overlanding | 0.23 | ❌ |
| 64 | Fly tying kit | Fly Fishing | 0.19 | ⚠️ |
| 65 | Drone-mounted thermal camera | Night Optics | 0.18 | ❌ |
| 66 | Body / trail camera | Night Optics | 0.14 | ❌ |

### Bundles (bottleneck rule applied)

| Bundle | LPS | Bottleneck |
|--------|-----|------------|
| Weekend overland (softshell variant) | 1.19 | Large LFP power station |
| Weekend overland (hardshell variant) | 1.07 | RTT hardshell |
| Family ground camp | 1.19 | Large LFP power station |
| Trailhead expedition | 0.78 | Satellite communicator |

### Reading the ranking

1. **The top 8 are the supply-side priority.** Wading boots, air compressors, awnings, fridges, waders, recovery boards, thermal monoculars, softshell RTTs. These are the listings that owners actually *want* to put on the market. Outreach, listing-form UX, and onboarding incentives should all be optimized around this set first.

2. **The "✅ Accept" status at the bottom is a flag.** Premium pizza ovens (0.27), premium kamados (0.29), premium pellet smokers (0.23), thermal rifle scopes (0.61), NVGs (0.53) — these are catalogued as Accept but score low. They are demand-rich and supply-poor: renters want them, but owners are reluctant. **Treat as a different acquisition problem** — premium concierge onboarding, lister incentives (free first-month protection plan, white-glove photo shoot), or partnerships with manufacturers / retailers willing to seed inventory. Don't expect organic supply.

3. **The ⚠️ Accept rows that score high deserve a status upgrade.** Ground blind (1.50), portable solar panel (1.30), mid-range fly rod (1.38), float tube (1.01). Worth a catalogue revisit — they're easier listers than their caveat suggests.

4. **The ❌ Decline rows with high LPS are interesting.** Single-burner stoves (1.19) and 3-season ground tents (1.13) score well in the model but stay Decline because REI Rental already owns the surface — that's a market-structure veto the model doesn't see. Note the model's blind spot here: it captures owner-side propensity but not competitive crowd-out.

5. **Fly fishing's vertical median LPS** ≈ 1.0; **Overlanding median** ≈ 1.2; **Night Optics median** ≈ 0.65; **Power Stations median** ≈ 0.86; **Smokers/Pizza median** ≈ 0.30. This matches the Phase 1 / Phase 2 / Phase 3 sequencing in `CLAUDE.md` and validates the "smokers/pizza is provisional" call. Night Optics' median is dragged by NVGs and scopes — the handheld thermal at 1.69 is the gateway SKU and should anchor optics-side acquisition.

6. **Caveat on the precision.** These LPS values are priors, not measurements. The R inputs use midpoint replacement cost and published comp rental rates; K, L, F, V are category-level estimates. Expect ±20% movement per row once we have actual listing-conversion data and fit the logistic form from §3 of the model doc. The *ranking* should be more stable than the absolute values.

---

## Bundle-Required SKUs (Q2 Ghost Listings)

Derived from the LPS × RDS 2×2 in `docs/rental-demand-model.md` §6. These SKUs have high listing propensity (LPS > 1.0) but low demand as standalone bookings (RDS < 30). Listing them standalone produces dead inventory. The listing-creation flow (`docs/features/03-create-listing.md` §"Bundle-attachment check") enforces parent attachment before publish.

| SKU | LPS | RDS | Required parent bundle | Standalone override |
|---|---|---|---|---|
| Air compressor | 2.27 | 10 | Trailhead expedition | None — always bundle |
| Awning (270°/180°/standard) | 2.07 | 18 | Weekend overland / RTT parent | None — always bundle |
| 12V fridge / freezer | 1.97 | 38 | Weekend overland | Allowed in deep-density metros (Denver, Bozeman post-Phase-0) |
| Recovery board set | 1.76 | 12 | Trailhead expedition | None — always bundle |
| Ground blind | 1.50 | 14 | Hunting optics bundle | None — always bundle |
| Wading boots — felt sole | 1.39 | 8 | Fly fishing destination kit (wader parent) | None + state-restriction check |
| Mid-range fly rod + reel | 1.38 | 20 | Fly fishing destination kit | None — always bundle |
| Wading boots — rubber sole | 2.74 | 13 | Fly fishing destination kit (wader parent) | Allowed in active TU-partner metros only |
| Portable solar panel | 1.30 | 16 | Power station parent | None — always bundle |
| Ground tent (4-season, premium) | 1.29 | 22 | Family ground camp | None — always bundle |
| Premium 2-burner stove | 1.25 | 14 | Galley sub-bundle (camp kitchen parent) | None — always bundle |
| Camp kitchen / chuck box | 1.23 | 20 | Weekend overland (galley anchor) | None — always bundle |
| Medium power station | 1.08 | 22 | Power station + overlanding bundle | None — always bundle |
| Annex / changing room | 0.94 | 14 | RTT parent | None — always bundle |

**Operational rules:**

1. **Listing creation blocks standalone publish** for SKUs marked "None — always bundle". The lister must attach the listing to an eligible parent bundle they own, or the publish button stays disabled.
2. **Deep-density metro override** applies only to 12V fridge (Denver, Bozeman, and any metro that has cleared the ≥80 overlanding listings threshold per `docs/geographic-liquidity-model.md` §4). The override flag is metro-scoped and managed by ops.
3. **TU-partner override** applies only to wading boots rubber sole in active Trout Unlimited chapter metros (per `docs/owner-segmentation.md` Phase 2 layered-vertical channel notes).
4. **Felt-sole boots** never get the override — the state-restriction check (MD, AK, others) requires a parent listing where the renter has already accepted decontamination protocol.
5. **Override revocation:** if a metro falls below liquidity threshold (per geographic-liquidity-model.md §6 implication 4 detection signals), all overrides for that metro auto-revoke until threshold re-clears.
