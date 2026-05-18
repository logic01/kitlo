# Owner Segmentation

Who actually lists gear on Kitlo? The Listing Propensity Score (`docs/listing-propensity-model.md`) gives a category-level prior; this doc decomposes that prior by *owner type*. The five personas below differ on the same six LPS variables (R, I, Y, K, L, F, V) plus their personal threshold θ. Two owners of the same Dometic fridge can have wildly different LPS scores depending on which persona they belong to. Targeting the wrong persona for a given vertical wastes acquisition budget.

The 2×2 in `rental-demand-model.md` identifies which SKUs have both supply willingness and renter pull. This doc identifies *who to call* to convert that supply willingness into actual listings.

---

## 1. The five personas

| Persona | One-line | Phase 1 priority |
|---|---|---|
| **The Side-Hustler** | Bought gear as cash-flow inventory; treats listing as a business | **High** — fastest conversion, lowest L, but ceiling on volume per individual |
| **The Weekend Warrior** | 30–60 nights/year on gear, idle the rest, mildly attached | **High** — the volume profile we model around |
| **The Gearhead / Hobbyist** | Passionate, knowledgeable, customized gear, fierce attachment | **Low** — high L tanks LPS; supply that walks away after one bad booking |
| **The Semi-Pro Outfitter** | Guides on the side, surplus gear, semi-commercial mindset | **Medium-High** — bundle anchor, owner-as-guide value-add, but compliance overhead |
| **The Accidental Owner** | Inherited, gifted, or one-trip-purchase that never got used again | **Medium** — high I, low L, but supply is shallow and one-shot |

The LPS multipliers below quantify how each persona shifts the category-median LPS in `gear-catalogue.md` §"Combined LPS Ranking." Apply the multiplier to the catalogue LPS to get the persona-conditional LPS for any given SKU.

---

## 2. Persona deep dives

### 2.1 The Side-Hustler

**Profile.** 28–42, often male, often urban or exurban, treats their gear as inventory the same way an Airbnb host treats a second property. Tracks bookings in a spreadsheet, prices competitively, will list the same fridge across Kitlo, Hygglo, and FriendWithA simultaneously. Often owns 3–8 listable items they actively cycle through rental platforms. Has run a Turo car or an Airbnb at some point — comfortable with marketplace ops, deposit holds, and renter screening.

**LPS multiplier: × 1.4–1.6.** Driven by:
- **L ≈ 0** (no emotional attachment; gear is inventory). Removes the dominant drag on premium fly rods, NVGs, kamados.
- **F ≈ 0.1** (already lists on at least one other platform; listing form is muscle memory). Catalogue assumes F ≈ 0.3–0.5 for typical owners.
- **V ≈ 0** (prices to market; checks competitor listings before publishing).
- Lower θ threshold — will list at LPS values that other personas walk away from.

Concretely: a Side-Hustler's premium fly rod (catalogue LPS 0.99) climbs to ~1.5; a Side-Hustler's NVG (catalogue LPS 0.53) climbs to ~0.85 — still soft, but listable.

**Acquisition channels.**
- Subreddits: **r/sidehustle** (1.5M+), **r/Entrepreneur**, **r/passive_income**, **r/turo**, **r/AirBnBHosts**. Cross-platform marketplace operators concentrate here.
- Facebook groups: "Turo Host Hub," "RV Share Hosts," "Equipment Rental Owners." Several have 10–50K members.
- **Hygglo / FriendWithA existing listers in target metros.** Cold-DM their profile with a "Kitlo gives you 95% payout" pitch. Highest-conversion channel because they've already crossed the listing-form friction barrier once.
- Local 4WD / outfitter shop bulletin boards (Adventure Wagons, RoamRig, Goose Gear) — Side-Hustlers shop there for their inventory.

**CAC range.** **$8–25 per listed owner.** Lowest CAC of any persona. Hygglo-poaching costs ~$5 per cold DM with ~15% reply rate and ~30% list-rate, implying ~$110 per listing — but the volume per Side-Hustler (3–8 listings) drops effective CAC to $14–35 per *listing*. Paid social on r/sidehustle-style audiences runs ~$3–6 CPM, ~1% list conversion = ~$25 per owner.

**Most likely to list.** Cross-vertical, but indexes toward:
- Overlanding: 12V fridges, air compressors, power stations, recovery boards (durable, low-L SKUs from Q2 of the 2×2 in `rental-demand-model.md`).
- Power stations: standalone listings on horizontal P2P, bundled-listings opportunity on Kitlo.
- Less likely: night optics (ITAR + price floor + state-reg friction is operationally heavy), premium fly rods (the L drop is real, but the population overlap with the fly-fishing community is low).

**Trigger moments.** Side-Hustlers don't have a trigger; they have an *operating cadence*. They scan rental platforms quarterly for new geographies and new categories. The trigger is **Kitlo's metro launch announcement** — if they hear about us, they list. Their acquisition is a function of our marketing reach, not their life events.

---

### 2.2 The Weekend Warrior

**Profile.** 32–48, dual-income household, owns specialty kit they use 30–60 nights/year (the textbook overlander). The catalogue's LPS values are calibrated to this persona; they are the modal owner Kitlo is built around. Income $100–250k; suburban or exurban; daily-driver is the truck the RTT mounts to. Not a marketplace operator — listing requires real onboarding effort the first time. After the second successful booking they become quasi-Side-Hustlers (F decays).

**LPS multiplier: × 1.0 (baseline).** This is the catalogue assumption. Variables sit at the published mid-points: I = 0.85–0.95, K = 0.4–0.7, L = 0.3–0.6, F = 0.3–0.5, V = 0.0–0.2. Their LPS *rises over time* — F decays from ~0.4 (first listing) to ~0.1 (fifth listing), pushing a catalogue-LPS-1.5 SKU to ~1.8 after 5–10 bookings.

**Acquisition channels.**
- **ExpeditionPortal** (180K+ members, 2.5M+ posts) — vendor section posts with forum-moderator permission; trip-report comment engagement.
- **r/overlanding** (67,888), **r/4Runner**, **r/Tacoma**, **r/CherokeeXJ**, **r/Wrangler** — vehicle-specific subs concentrate the demographic.
- **Overland Bound** community chapters (regional clusters; trip events).
- **Overland Expo** (West/East/Mountain West) booth presence + on-site lister recruitment.
- Local overlanding meetup groups (Meetup.com + Facebook event groups in Denver, Bozeman, Bend, Salt Lake City).
- Vehicle-specific gear shop direct partnerships (Adventure Wagons, RoamRig).
- For hunters: **HuntTalk**, **Predator Masters**, **Texas Hunting Forum**, state-level FB groups (TX, AL, MS, WI, MN). Catalogue's "Community & Supply Acquisition" section is the source list.

**CAC range.** **$30–80 per listed owner.** Higher than Side-Hustler because the first-time-lister friction is real. Best-CAC channels: ExpeditionPortal vendor-section permission post (~$15 effective CAC if moderator allows), Overland Expo booth ($60–120 per recruited lister at typical event attendance). Worst-CAC channels: paid social on broad outdoor-interest audiences (~$200+, demographic-mismatch problem).

**Most likely to list.** The Q1 launch wedge SKUs from `rental-demand-model.md`:
- Softshell + hardshell RTTs, 12V fridges, awnings, recovery boards, dual-battery, air compressors.
- Handheld thermal monoculars and NV monoculars (the hunting Weekend Warrior subset).
- Premium waders and wading boots (the fly-fishing Weekend Warrior subset).
- Less likely: catering trailers, fly tying benches, anything Q4 — they own these too, but they don't reach the listing-propensity threshold.

**Trigger moments.** Specific and predictable:
- **Post-trip plus return-from-trip downtime** — gear is in the garage, owner is reflecting on the cost of the trip. This is the window the catalogue's "Your iKamper sits in the garage 8 months a year" ad copy (`business-plan.md` §6 Phase 0a) is targeting.
- **New-model purchase** — bought the new Roofnest, the old Tepui needs to earn its keep or be sold. Buy-resell competes with rental here.
- **Tax season / income-tax filing** — passive-income framing resonates Jan–April.
- **Partner pressure on garage space** — recurring annual trigger; correlates with seasonal organizing peaks.

---

### 2.3 The Gearhead / Hobbyist

**Profile.** 35–55, deeply invested in one vertical, owns top-tier customized gear, joined the forum a decade ago, has strong opinions about brand hierarchy (Sage vs. Hardy, BGE vs. Kamado Joe, Pulsar vs. Trijicon). Identity is *defined* by the gear. Has typically modified or tuned at least one item (cerakoted scope, hand-built rod, BGE platesetter rotation). LPS dragged hard by L.

**LPS multiplier: × 0.4–0.6.** Driven by:
- **L ≈ 1.5–2.0** — the dominant drag. Doubles or triples the denominator vs. catalogue assumption.
- **K ≈ 1.0–1.5** — "would a stranger know how to season cast iron" / "would a stranger snap a $1,200 rod fighting a 22-inch brown" risk weighting.
- **V ≈ 0.3–0.5** — Hobbyists overvalue their gear (custom builds, signature items, modifications). Predictably ghost-list.
- Higher θ threshold — will hold listings to a higher economic bar before clearing.

A Hobbyist's premium fly rod (catalogue LPS 0.99) collapses to ~0.4. A Hobbyist's BGE (catalogue LPS 0.29) collapses to ~0.12 — effectively unlistable. This is the structural blocker `gear-catalogue.md` flags on premium kamado supply.

**Acquisition channels.**
- **Trout Unlimited 300+ chapter network** (fly fishing). CastBack/TU partnership precedent (2025) is the channel proof — chapter-level conservation sponsorships in exchange for chapter newsletter listings. Slow but credible.
- **eggheadforum.com** (~30K BGE owners), **Pizza Making Forum**, **Forno Bravo Forum** — fierce but reachable through long-tenured member identity.
- **Sniper's Hide**, **RokSlide**, **GON Forum**, **Airgunnation** — premium-optics Hobbyists.
- Specialty shop dealer networks — owners trust shop owners more than they trust marketplaces.
- High-friction, high-trust channels only. Cold paid acquisition fails outright.

**CAC range.** **$80–250 per listed owner.** Very high. The Trout Unlimited chapter-sponsorship channel is the only one that can reach this persona at scale, and chapter sponsorships run $500–2,500 for chapter-level access converting to 5–15 listings. eggheadforum.com conversion is currently near zero without a community-native voice (per the smoker brief).

**Most likely to list.** Counter-intuitive: the Q3 "Concierge Supply" quadrant from `rental-demand-model.md` is *exactly* where this persona owns the gear renters want. Premium fly rods, NVGs, thermal scopes, BGE kamados, Hilleberg tents, Gozney Dome ovens. Hobbyists own the high-RDS, low-LPS SKUs. The acquisition problem isn't *finding* them; it's *converting* them. Their LPS multiplier × their gear's catalogue LPS often still doesn't clear the listing threshold.

**Trigger moments.** Rare and weak. The strongest trigger is **community legitimization** — when a respected community member (a TU chapter president, a thermal-optics review-channel host, a podium-finishing competition shooter) lists on Kitlo first. The Hobbyist's threshold drops only when listing has been socially sanctioned. *Money is not the trigger; permission is.* This is why concierge supply (`rental-demand-model.md` §6 Q3) for this persona is a 6–12 month, community-led campaign — not a paid-acquisition exercise.

---

### 2.4 The Semi-Pro Outfitter

**Profile.** 40–60, runs side guiding (fishing guide, hunting guide, overlanding tour operator, BBQ catering pop-up) as a second income. Owns 2–3× more gear than they need for personal use because they outfit clients. Has surplus capacity 60–80% of the calendar. Often has an LLC, a Schedule C, and a commercial-grade insurance policy. Can list with semi-commercial intent: minimum-rental-period rules, weekday discounts, owner-as-guide handoff included.

**LPS multiplier: × 1.2–1.4.** Driven by:
- **I ≈ 0.6–0.7** (lower than catalogue because they actually use the gear more — but the *surplus* gear they own beyond personal use sits closer to I ≈ 0.95).
- **L ≈ 0.2–0.4** (commercial mindset suppresses attachment for the *surplus* tier; their personal Sage R8 stays off-platform).
- **F ≈ 0.4–0.6** (compliance overhead — LLC docs, commercial insurance rider, sales-tax registration — but they can amortize over multiple listings).
- **Y ≈ 1.8–2.5** (their gear is rented out semi-commercially already; the demand pool is wider).

A Semi-Pro Outfitter's spare premium fly rod (catalogue LPS 0.99) climbs to ~1.3; their spare NVG (0.53) climbs to ~0.7.

**Acquisition channels.**
- **Trout Unlimited chapters** (most TU chapter presidents are or know guides).
- **Federation of Fly Fishers**, **American Professional Hunters Association**, **MeatEater** ecosystem (Bozeman concentration).
- **Overland Expo** vendor / exhibitor lists — Adventure Wagons-style operators have surplus gear from prior model years.
- **Local hunting / fishing outfitters** in beachhead metros — Bozeman, San Antonio, Salt Lake City.
- Direct outreach via state guide licensing databases (publicly listed in most Western states).

**CAC range.** **$50–150 per listed owner.** Mid-tier. Lower than Hobbyist because the value prop ("turn surplus gear into off-season revenue") is rational, not emotional. Higher than Side-Hustler because compliance overhead requires founder time on each onboarding. The Bozeman + San Antonio launch metros from `business-plan.md` §6 are the right starting density for this persona.

**Most likely to list.** Bundle anchors — exactly the products Kitlo wants to feature:
- Overlanding kits (full Weekend Overland and Trailhead Expedition bundles).
- Night optics bundles (thermal + NV; the flagship product).
- Fly-fishing full kits (waders + boots + rod + reel + access intel).
- BBQ catering trailer (if/when Phase 2+ opens).

**Trigger moments.** **Off-season cash flow.** Hunting guides have 6 dead months (Feb–Aug for Western big game); fly guides have 4–5 dead months (Nov–March outside the Mountain West); overlanding tour operators have a winter trough. The trigger is the predictable annual cash-flow gap. Phase 1 outreach should align to these calendars — recruit Bozeman optics guides in late winter (post-hunting-season), Western fly guides in fall (post-summer-season).

---

### 2.5 The Accidental Owner

**Profile.** 25–65, broad range. Owns one or two pieces of high-value gear that arrived without intent — inherited from a parent, gifted by a partner, bought for a one-time trip and never used again, won at a raffle, picked up at an estate sale. Has no community membership, doesn't read the forums, doesn't identify with the vertical. The catalogue's I = 0.95+ assumption is *exceeded* here — these items literally never get used.

**LPS multiplier: × 1.1–1.3.** Driven by:
- **I ≈ 0.98** (functionally idle).
- **L ≈ 0.0–0.2** (no attachment; the gear is in the way).
- **V ≈ 0.3** (no market awareness; tends to overestimate or, more often, underestimate value).
- **F ≈ 0.6–0.8** (no forum / community familiarity; needs full white-glove onboarding).
- **Y ≈ 0.5–0.8** (gear may be older / less rentable than the catalogue's modal owner).

Net multiplier: positive, but supply is **shallow and one-shot**. An Accidental Owner lists one item, rents it 3–5 times, then sells it on Facebook Marketplace and exits the platform. No repeat-listing LTV. Treat as a one-time supply event, not a recurring relationship.

**Acquisition channels.**
- **Estate sale + auction networks** — partnerships with local estate-sale operators in Denver, Bozeman, Bend (gear-rich Western markets).
- **Facebook Marketplace + Craigslist scraping** — listings of high-value gear (RTTs, NVGs, kamados) priced below market are often Accidental Owners. Direct-message offer: "list on Kitlo for 60 days before selling; we'll handle the listing for you."
- **Probate / divorce attorney networks** — long-tail channel, low volume, but high-LPS supply when it hits.
- **Local outdoor consignment shops** (e.g., Boulder Sports Recycler, Mountain Recyclery) — referral relationships.

**CAC range.** **$40–120 per listed owner.** Variable. Estate-sale partnerships have near-zero direct cost but require ops time. Marketplace-scraping outreach scales but converts low (~2–5% reply rate). Concierge-onboard cost is high per owner because of the F friction.

**Most likely to list.** Any high-value Q1 or Q3 SKU. Strong concentration in:
- Hardshell RTTs (inherited or post-divorce gear).
- Premium kamados (gifted but never figured out how to use).
- NVGs and thermal scopes (military or LE retirement; estate items).
- Hilleberg tents, premium fly setups (one-trip purchases).

**Trigger moments.** **Inheritance event** (the gear arrives), **divorce / move** (the gear can't come along), **new partner** (the gear is unwelcome in the new household), **job loss** (the gear must produce income). The trigger is sharp and time-bound — Kitlo has to be visible *at the moment of the trigger event*, which is why estate-sale and marketplace-scraping channels matter more than any forum outreach for this persona.

---

## 3. Persona × Vertical priority matrix

Which persona to target first for each Phase 1 vertical. Read the matrix as the *acquisition order* within a metro launch.

| Vertical | 1st priority | 2nd | 3rd | Notes |
|---|---|---|---|---|
| **Overlanding** | Weekend Warrior | Side-Hustler | Accidental Owner | Weekend Warriors are the modal owner; Side-Hustlers fill volume; Accidentals seed inherited RTTs. Semi-Pros and Hobbyists are minor in this vertical because overlanding gear is less identity-loaded than fly rods or optics. |
| **Night Optics** | Semi-Pro Outfitter | Weekend Warrior | Hobbyist (concierge) | Hunting guides supply the bundle (thermal + NV); Weekend Warriors fill standalone monocular supply; Hobbyists are the concierge program for NVGs and premium scopes. Side-Hustler and Accidental are minor — ITAR friction filters them out. |
| **Power Stations** | Side-Hustler | Weekend Warrior | — | Bundle-only listings, so supply rides on the overlanding lister; no dedicated acquisition campaign. Side-Hustlers are the cross-platform horizontal P2P listers we poach. |
| **Fly Fishing** | Semi-Pro Outfitter | Weekend Warrior | Hobbyist (concierge) | Guides own surplus rod/wader inventory and ARE the owner-as-guide handoff Kitlo monetizes. Weekend Warriors supply the rubber-sole boot + wader volume. Hobbyists supply premium-rod concierge inventory through TU chapters. |
| **Smokers / Pizza Ovens** (Phase 2+) | Accidental Owner | Side-Hustler | Hobbyist (no) | Phase 2+ provisional only. Accidentals are the only persona where L doesn't kill BGE supply. Hobbyists are the explicit structural blocker. Defer the vertical until first four show liquidity. |

### Reading the matrix

- **Phase 1 acquisition concentrates on Weekend Warriors and Side-Hustlers.** Together they cover the overlanding wedge, the power-station bundle, and the standalone optics monoculars. CAC stays in the $15–80 range and the volume profile is the one `business-plan.md` §6 models against (500 listings × 3 metros).
- **Semi-Pro Outfitter is the unlock for night-optics bundles and the fly-fishing layer.** Without 30–50 hunting guides in San Antonio + Bozeman seeding bundle listings, the flagship night-optics product doesn't exist. This is a founder-time campaign — `business-plan.md` §6 calls it the "Wizard-of-Oz first 20 bookings" pattern.
- **Hobbyist is a Phase 2 problem.** Concierge programs through Trout Unlimited chapters and eggheadforum.com take 6–12 months to mature. Build the muscle in Phase 2 once Phase 1 has liquidity and a reputation to leverage. Trying to recruit Hobbyists in Phase 0 will fail; the platform has no community standing.
- **Accidental Owner is a complement to every vertical, not a primary channel.** Estate-sale + marketplace-scraping partnerships should run continuously in the background across all metros. Low ops cost, sporadic supply, but every recovered NVG or RTT is a high-LPS listing with no acquisition spend.

---

## 4. Cross-references and open questions

- `docs/listing-propensity-model.md` — the LPS formula this doc multiplies against.
- `docs/rental-demand-model.md` — the 2×2 that identifies *which SKUs* each persona should be recruited to list. Q3 ("Concierge Supply") is the Hobbyist + Semi-Pro problem; Q1 is the Weekend Warrior + Side-Hustler problem.
- `docs/gear-catalogue.md` §"Community & Supply Acquisition" — the channel list per vertical maps directly onto persona × channel here.
- `docs/business-plan.md` §6 — Phase 0a/0b ad creative is implicitly Weekend-Warrior-targeted ("Your iKamper sits in the garage 8 months a year"). Side-Hustler creative needs a separate variant ("Run gear like an Airbnb — keep 95%") for the cross-platform poaching channel.

**Open questions:**

- **Threshold θ varies by persona income.** Cash-strapped Weekend Warriors list at lower LPS than affluent ones. The logistic-form model in `listing-propensity-model.md` §3 should include an `owner_traits` income term — this is the place to learn it.
- **F decay rate by persona.** Side-Hustlers start at F ≈ 0.1; Accidentals start at F ≈ 0.8. After 5 bookings, do they converge? Track per-owner listing-form completion time as the empirical proxy.
- **Persona migration over time.** A Weekend Warrior who lists 8 items and earns $4k/year becomes a Side-Hustler. Track the conversion — it's likely the cheapest LTV expansion lever in the platform.
- **Cross-vertical persona overlap.** A hunting Weekend Warrior often is also an overlanding Weekend Warrior (same truck, same garage). Bundle their listings at onboarding — a single owner listing across optics + overlanding is worth more than two owners listing in one vertical each.
