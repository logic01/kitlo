# Feature: Category-Specific Listing Rules

**Personas:** All listers (P3, P4, P5, P9, P11), all admin reviewers (P7)
**Trigger:** Listing creation (`03-create-listing`) or admin review (`18-admin-listing-review`)
**Depends on:** `gear-catalogue.md` (canonical accept/decline matrix)
**Blocks:** None directly — this is the per-vertical rule reference that the create-listing form and admin queue both read from.

> **v2.0 — overlanding pivot.** Each Kitlo vertical has different field requirements, deposit tiers, attestations, and pickup walkthrough rules. Centralized here so the create-listing wizard, admin queue, and listing detail page all read from one source. Source research: `C:/repo/p2p/{camping-overlanding-gear,night-hunting-optics,fly-fishing-gear,portable-power-stations,smoker-and-pizza-oven-rental}/`.

---

## Goal

A single reference for everything that varies by vertical: required listing fields, deposit math, insurance requirements, prohibited combinations, pickup walkthrough script, and return inspection criteria. The create-listing form (`03`), admin queue (`18`), pickup workflow (`10`), and return workflow (`12`) all source rules from here.

---

## Vertical Matrix (Phase 1)

| Vertical | Status | Required identity fields | Required spec fields | Attestations | Pickup walkthrough min | Return inspection focus |
|---|---|---|---|---|---|---|
| **Overlanding** | Phase 1 anchor | Make, Model, Year, MSRP | RTT mount type + load rating + crossbar pattern; awning size; fridge capacity + power draw; recovery rating | Vehicle-fit info present; right-of-refusal acknowledged | 15 min | RTT canopy/struts; mount torque; fridge cycle test |
| **Hunting Optics** | Phase 1 | Make, Model, Year, MSRP, Serial (optional) | Sensor resolution; detection range; magnification; refresh rate; battery life; mount type | US-Person attestation (ITAR §120.15); no international transport | 10 min | Glass clarity; battery cycle; reticle calibration; mount integrity |
| **Power Station** | Phase 1 (bundle add-on) | Make, Model, Year, MSRP | Capacity (Wh); AC continuous/surge; chemistry (LFP/NMC); cycle count %; UL 9540/2743 cert # | UL cert verified; chemistry-specific rider for NMC; no renter shipping >1000Wh | 5 min | Battery health %; port function; visible damage |
| **Fly Fishing** | Phase 2 | Make, Model, Year, MSRP | Wader/boot size; sole material (boots); rod weight + length + action; reel weight class | Sole-material declaration; cross-state default-to-rubber; license attestation at booking | 5 min | Wader leak check; rod sections / ferrules; reel drag; line condition |
| **Smokers & Pizza Ovens** | **Phase 2+ provisional — not selectable in form** | n/a (vertical not open) | n/a | n/a | n/a | n/a |

---

## Per-Vertical Detail

### Overlanding

**Source:** `C:/repo/p2p/camping-overlanding-gear/camping-overlanding-gear.md`. Anchor vertical, weighted score 8.65.

**Required listing fields (in addition to global Make/Model/Year/MSRP):**

- *RTT:* mount type (universal crossbar / Front Runner Slimline / pioneer / vehicle-specific rail), mount load rating (lbs static + dynamic), crossbar pattern compatibility, setup time (min), sleeping capacity, fabric type
- *Awning:* size (270° / 180° / standard), mount type + side (driver/passenger), pole or freestanding
- *12V fridge:* capacity (qt/L), power draw (Ah/24h at 90°F ambient), voltage compatibility, internal compartments
- *Camp kitchen:* footprint, included accessories
- *Dual-battery:* portable vs. pre-wired, capacity (Ah/Wh), vehicle compatibility notes
- *Recovery boards:* set count, MaxTrax / TRED / X-Bull
- *Air compressor:* CFM rating, duty cycle, plug type
- *Navigation/SATCOM:* model + plan transferability (Garmin inReach, ZOLEO, Starlink Mini)

**Attestations at listing publish:**
- Vehicle-fit info present (RTT mount type, awning compatibility, fridge slide footprint, dual-battery wiring)
- Lister acknowledges right-of-refusal at handoff if renter's vehicle doesn't match

**Pickup walkthrough (15 minutes, mandatory):**
1. Vehicle-fit confirm — verify renter's crossbars/rails match listing
2. RTT deploy + retract demo (renter performs)
3. Awning deploy + secure
4. Fridge: power-on, temperature set, internal divider position
5. Recovery: rope/strap inspection, attachment-point demo if requested
6. Photo of mounted/installed kit on renter's vehicle (joint record)

**Return inspection focus:**
- RTT canopy and struts intact; mount torque check
- Awning fabric, hardware, freestanding poles
- Fridge cycle test (power on, cools to 38°F within 30 min)
- Recovery gear cleanliness (mud is fine; structural damage is not)

**Deposit / insurance tier:**
- Per `gear-catalogue.md` — 25% / 20% / 15% MSRP tiers. Bundle deposit = sum of components.
- Bundles >$5k MSRP follow over-$5k tier; admin review required (`feature 18`).

---

### Night Hunting Optics

**Source:** `C:/repo/p2p/night-hunting-optics/night-hunting-optics.md`. Phase 1, weighted score 7.28.

**Required listing fields (in addition to global Make/Model/Year/MSRP):**

- *Thermal:* sensor resolution (320×240 / 384×288 / 640×480 / 1280×1024), detection range (m), magnification range, refresh rate (Hz), battery life (hr), reticle types, accessories included
- *Night Vision:* generation (Gen 1/2/3/Digital), magnification, head-mount compatible, weapon-mount compatible, IR illuminator included, accessories included
- Serial number (optional, recommended for high-value)

**Attestations at listing publish:**
- US-Person attestation (lawful permanent resident, US citizen, or US-organized entity per ITAR §120.15)
- No international transport; no transfer to non-US Person; no shipping to APO/FPO outside US
- Federally non-prohibited possessor
- No firearms or rifle/optic combos in listing — optics only; renter mounts on their own rifle

**Renter side at booking:**
- US-Person attestation
- State night-hunting legality acknowledgment (only legal-use jurisdictions surface listings; rule shown at booking)

**Pickup walkthrough (10 minutes, mandatory):**
1. Power-on demo; battery state at handoff (joint photo)
2. Glass / lens condition check
3. Reticle calibration (if applicable; on lister's bench/range only)
4. Mount/clip-on attachment if renter brought their rifle
5. ITAR/US-Person re-confirmation by both parties

**Return inspection focus:**
- Glass clarity, no internal fogging
- Battery cycle count (if device reports it)
- Reticle calibration (re-check on bench)
- Mount integrity, no scope-ring slippage marks

**Deposit / insurance tier:**
- Per `gear-catalogue.md` — Thimble adequate for sub-$5k items.
- Bundle (thermal + NV) routinely exceeds $5k combined value — specialty rider mandatory (LensRentals' film/AV insurer playbook; K&K specialty pursuit ongoing).
- Theft / non-return protocol: deactivation + police report at 48 hours past booking end; deposit forfeited; insurance claim opened.

---

### Portable Power Stations

**Source:** `C:/repo/p2p/portable-power-stations/portable-power-stations.md`. Phase 1 — **bundle add-on only**. Standalone foreclosed by Hygglo/FriendWithA/ShareGrid.

**Required listing fields:**

- Capacity (Wh)
- Continuous AC output (W); surge (W)
- Battery chemistry (LFP/LiFePO4 required to publish; NMC accepted with Li-ion thermal-event rider)
- Cycle count remaining (declared %)
- **UL 9540 / UL 2743 cert number** (required, verified at admin review)
- Output ports (AC count, USB-A, USB-C PD wattage, 12V cigarette, Anderson)
- Recharge time (AC, solar)
- Approximate AC load capacity for common appliances (fridge / CPAP / WiFi router / induction burner)

**Attestations at listing publish:**
- UL cert confirmed
- No recent over-discharge or thermal-event damage
- Battery health % declared
- No renter-arranged shipping for >1,000Wh units (UN3480/UN3481 hazmat — local handoff only)

**UI behavior:**
- New power-station listings default to bundle mode — UI nudges lister to attach to an existing overlanding listing (their own or, with consent, a co-listed metro neighbor).

**Pickup walkthrough (5 minutes):**
1. Battery health % at handoff (joint photo of display)
2. Port function test (renter plugs in their device)
3. AC inverter test (renter plugs in their highest-load appliance — within published capacity)
4. Charging cable + carrier present

**Return inspection focus:**
- Battery health % vs. handoff
- Visible damage (cracked cases, port wear)
- Port function (random sample 2–3 ports)

**Deposit / insurance tier:**
- Standard MSRP tier per `gear-catalogue.md`
- **>$2k unit:** Li-ion thermal-event rider mandatory
- **>$5k unit (XL stations):** specialty insurer; admin review (`feature 18`)

---

### Fly Fishing

**Source:** `C:/repo/p2p/fly-fishing-gear/fly-fishing-gear.md`. Phase 2 layered vertical.

**Required listing fields:**

- *Waders:* size (S / M / L / XL / XXL — and stout / king variants), material (breathable nylon, neoprene), construction (stocking-foot vs. boot-foot), patches/repairs disclosed
- *Wading boots:* size (US men's / women's), **sole material (felt / rubber)** — required; cross-state booking defaults to rubber, last decontamination date
- *Rod:* weight (1–12+), length (ft / pieces), action (slow / medium / fast / extra fast)
- *Reel:* weight class, drag system, arbor size
- *Line included:* yes/no — if yes, type and weight
- *Net:* size, material
- *Sling/hip pack:* capacity (L), waterproof rating
- *Float tube/pontoon:* capacity, propulsion (kick fins / oars), vehicle-transport check

**Attestations at listing publish:**
- Sole-material declaration confirmed (boots)
- Cross-state default-to-rubber acknowledged (boots)
- Between-rental decontamination protocol documented (didymo, whirling disease, NZ mudsnail)

**Renter side at booking:**
- State fishing-license attestation (renter confirms current license; Kitlo does not sell licenses)
- Decontamination protocol acknowledged

**Pickup walkthrough (5 minutes):**
1. Wader try-on (renter confirms fit; lister confirms no leaks during fitting)
2. Boot fit (renter wears for 60 seconds — strap, lace, sole confirmation)
3. Rod assembly + reel attachment + line through guides
4. Lister-as-guide intel transfer (current hatch, access points, water level)

**Return inspection focus:**
- Wader leak check (test on driveway with hose if possible)
- Rod sections / ferrules clean and snug
- Reel drag function
- Line condition (no tangles, no observable knicks)
- Boots clean and decontaminated (renter attestation; lister verification)

**Deposit / insurance tier:**
- Standard MSRP tier; Thimble fully adequate (premium waders <$1k, premium rods <$1k, top reels <$1.2k — all under cap)

---

### Smokers & Pizza Ovens (Phase 2+ provisional — NOT BUILT)

**Source:** `C:/repo/p2p/smoker-and-pizza-oven-rental/smoker-and-pizza-oven-rental.md`. Provisional weighted score 6.10 (would rank #5).

**Status:** Vertical is **not selectable** in the create-listing form. Documented here so that when the vertical opens (after Phase 1 traction is established), the rules are pre-defined. Re-evaluation criteria in `business-plan.md` §6.

**When the vertical opens:**

- ≥$800 retail price floor on primary listings (filters out entry-level Ooni / Solo Stove that fail rental-ratio test)
- Empty-tank propane handoff mandatory (renter sources fuel locally)
- HOA / location-authority attestation by renter
- Mandatory cooldown attestation at return (cool, ash removed)
- Catering trailers ($5k+) follow specialty commercial rider tier (K&K / Markel)

---

## Cross-cutting rules

These apply to every vertical:

- **Minimum 3 photos** to publish (`03-create-listing` Step 5).
- **MSRP required** to drive deposit calc (`gear-catalogue.md` Insurance & Deposit Policy).
- **Vertical picker first** at listing creation (`03-create-listing` Step 1) — drives all subsequent field validation.
- **Vehicle / use-location attestations** apply where listed above. Failed attestations block publish.
- **Prohibited categories** are enforced both at form (cannot select) and at admin review (caught even if smuggled through). See `gear-catalogue.md` Prohibited section and `18-admin-listing-review.md` Prohibited Gear.
- **No bundles cross verticals in Phase 1** except the sanctioned overlanding + power-station bundle. Hunting-optics + overlanding bundles are not currently supported (no demand signal).

---

## Open Questions

- [ ] Should overlanding bundles offer a "delivery to trailhead" option for an additional fee? (Demand signal exists; logistical complexity for Phase 2.)
- [ ] Auto-block listings if lister's metro doesn't match the vertical's GTM phase (e.g., fly fishing in a non-Phase-2 metro)? Or accept everywhere and defer demand-side seeding to marketing?
- [ ] Hunting-optics bundle + overlanding cross-vertical bundle — defer to Phase 2 explicitly, or open if a Phase 1 lister requests it?
- [ ] Vertical-specific photo minimums (e.g., RTT listings require a "deployed on vehicle" photo specifically)? Currently global 3-photo minimum.
- [ ] When the smoker/pizza vertical opens, should the form expose the >$800 filter as a hard block, or allow lister entry with a marketing-priority deboost?
