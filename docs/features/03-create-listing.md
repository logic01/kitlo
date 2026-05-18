# Feature: Create a Listing

**Personas:** New Lister (P3), Power Lister (P4), Dual User (P5), Overlander Lister (P9), Multi-Vertical Lister (P11)
**Trigger:** Lister clicks "Add listing" from their dashboard
**Depends on:** 02-lister-onboarding (must be complete), 17-identity-verification
**Blocks:** 05-search-discovery (listing must exist), 07-booking-request

> **v2.0 — overlanding pivot.** This flow now begins with a **vertical picker** (overlanding / hunting-optics / power-station / fly-fishing). The remaining steps adapt their field set to the selected vertical. See `feature-23-category-listing-rules.md` for per-vertical fields, and `gear-catalogue.md` for the canonical accept/decline matrix.

---

## Goal

Allow a verified lister to publish a gear listing with enough detail that renters can make an informed booking decision. Accuracy and honesty are enforced by design, not by trust alone.

---

## Pre-conditions

- Lister has completed onboarding (identity verified, payout connected)
- Lister is not suspended or under review

---

## Happy Path

### Step 1 — Vertical
Select one. **The vertical drives every subsequent field set.**

- **Overlanding** — RTTs, awnings, 12V fridges, recovery, dual-battery, navigation, full kits
- **Hunting Optics** — thermal monoculars/scopes/clip-ons, NV monoculars/scopes/clip-ons, binoculars, spotting scopes
- **Power Station** — Jackery, Goal Zero, EcoFlow, Bluetti, Anker Solix; solar panels (default to bundle mode)
- **Fly Fishing** — waders, wading boots, rod-reel setups, specialty weights, packs, float tubes
- **Bundle** — multi-item booking composed of two or more of the lister's existing items (overlanding kit; thermal+NV; oven+accessories). See `22-bundle-listing.md`.

> Smokers & pizza ovens are documented in `gear-catalogue.md` but the vertical is **not selectable** in the create-listing flow — Phase 2+ provisional. Listing form support lands when the vertical opens.

### Step 2 — Gear category & identity
Subcategory selection narrows the spec fields shown in Step 3.

**Per-vertical subcategory:**
- *Overlanding:* Rooftop tent (hardshell/softshell) · Awning · 12V fridge · Camp kitchen · Dual-battery · Recovery boards · Air compressor · Navigation/SATCOM · Full kit
- *Hunting Optics:* Thermal monocular · Thermal rifle scope · Clip-on thermal · Thermal binoculars · Thermal spotting scope · NV goggle/head-mount · NV monocular · NV rifle scope · Clip-on NV · Premium binoculars · Spotting scope
- *Power Station:* Large LFP (1500–3000Wh) · XL (3000Wh+) · Medium (500–1000Wh) · Solar panel · Solar generator combo
- *Fly Fishing:* Waders · Wading boots (sole material required) · Rod+reel setup · Specialty rod weight · Net · Sling/hip pack · Float tube/pontoon · Fly tying kit

**Identity fields (all verticals):**
- **Make** (text field with autocomplete; vertical-specific brand list — Pulsar/ATN for optics; iKamper/Roofnest/Dometic/ARB for overlanding; Jackery/Goal Zero/EcoFlow/Bluetti/Anker for power; Simms/Patagonia/Orvis/Sage for fly fishing)
- **Model** (autocomplete)
- **Year purchased** (optional)
- **MSRP** (required — drives deposit calculation and admin review threshold)
- Serial number (optional — lister's records only, not public)

### Step 2.5 — Bundle-attachment check (Q2 Ghost SKUs)

Triggered when the subcategory selected in Step 2 appears on the **Bundle-Required SKU list** in `docs/gear-catalogue.md` §"Bundle-Required SKUs (Q2 Ghost Listings)". The list is derived from the LPS × RDS 2×2 in `docs/rental-demand-model.md` §6 — these are SKUs with high listing propensity but low standalone booking demand. Standalone listings of these SKUs sit unrented and damage marketplace UX; this step enforces parent-bundle attachment before the form will publish.

**Affected subcategories (canonical list — keep synced with `gear-catalogue.md`):**

- *Overlanding:* Air compressor · Awning (270°/180°/standard) · 12V fridge · Recovery board set · Camp kitchen / chuck box · Premium 2-burner stove · Annex / changing room · Ground tent (4-season, premium)
- *Power Station:* Medium power station (500–1,000Wh) · Portable solar panel
- *Fly Fishing:* Wading boots (rubber sole) · Wading boots (felt sole) · Mid-range fly rod + reel
- *Hunting Support:* Ground blind

**Flow:**

1. **Detect Q2 Ghost subcategory.** When the lister picks a subcategory on the canonical list, the form pivots into bundle-attachment mode before showing Step 3 specs.

2. **Surface eligible parent bundles owned by the lister.** Query the lister's existing Active listings for an eligible parent per the catalogue's "Required parent bundle" column. Examples:
   - Air compressor → Trailhead expedition bundle
   - Awning → Weekend overland or RTT parent
   - Wading boots → Fly fishing destination kit (wader parent)
   - Portable solar panel → Power station parent
   - Mid-range fly rod → Fly fishing destination kit
   - Ground blind → Hunting optics bundle

3. **Two paths from here:**

   - **(a) Eligible parent exists.** Show "Attach to existing bundle: [parent name]" with one-click attach. Lister can preview the bundle composition and adjust before continuing to Step 3. After attach, the new SKU is created as an Active listing in standalone form *and* added as a component to the bundle.

   - **(b) No eligible parent.** Show "Bundle required: this SKU rents 3× more often as part of a [parent bundle type]. Create the parent listing first, or attach to one of your existing listings:" with two CTAs:
     1. **Create parent first** — saves the current draft, redirects to a new create-listing flow for the parent SKU. The Q2 draft resumes after the parent is published.
     2. **Continue as standalone** — disabled by default. Only enabled when the metro override applies (see §"Metro overrides" below).

4. **Block standalone publish for Q2 Ghost SKUs unless override applies.** The publish button (Step 10) is gated on either (i) bundle attachment confirmed, or (ii) a metro override flag from ops.

**Metro overrides (ops-managed):**

Two overrides exist, both narrow:

- **Deep-density metro override** — applies to 12V fridge only, in metros that have cleared the ≥80 active overlanding listings threshold per `docs/geographic-liquidity-model.md` §4. Ops manages the metro list; when a metro qualifies, the override flag turns on automatically and standalone 12V fridge listings unlock. When the metro falls below threshold (per geographic-liquidity-model.md §6 implication 4 detection signals: search-zero-results >25%, listing-publish-to-first-booking >45 days, or active-listing churn >30%/quarter), the override auto-revokes and new standalone fridge listings are blocked.
- **TU-partner override** — applies to wading boots (rubber sole) only, in metros with active Trout Unlimited chapter partnerships per `docs/owner-segmentation.md`. Felt-sole boots are *not* eligible for this override — they always require parent attachment because of the cross-state decontamination protocol.

**Why this exists.** Without enforcement, a side-hustler with a closet full of low-RDS gear (air compressors, wading boots, recovery boards) will create six standalone listings, all of which sit unrented, and the lister churns out within 90 days. The bundle-required policy converts that scenario into one parent bundle + five high-RDS attachments that actually book. See `docs/rental-demand-model.md` §7 implication 2 for the strategic framing.

---

### Step 3 — Specs (vertical + category specific)

*Overlanding — Rooftop tent / awning:*
- Mount type (universal crossbar / Front Runner Slimline / pioneer platform / vehicle-specific rail)
- Mount load rating (lbs static / dynamic)
- Crossbar pattern compatibility (multi-select)
- Setup time (min)
- Sleeping capacity (RTT)
- Awning size (270° / 180° / standard)
- Power requirements (none / 12V cigarette / hardwired)

*Overlanding — 12V fridge:*
- Capacity (qt / L)
- Power draw (Ah/24h at 90°F ambient)
- Voltage compatibility (12V / 24V / 110V)
- Internal compartments (single / dual zone)

*Overlanding — Recovery / dual-battery:*
- Vehicle compatibility notes (free text)
- Wiring: portable / pre-wired
- Capacity (Ah / Wh)

*Hunting Optics — Thermal:*
- Sensor resolution (320×240 / 384×288 / 640×480 / 1280×1024)
- Detection range (meters)
- Magnification range
- Refresh rate (Hz)
- Battery life (hours)
- Reticle types (freeform)
- Accessories included (checkboxes: remote, mount, case, charger, lens cloth)

*Hunting Optics — Night Vision:*
- Generation (Gen 1 / Gen 2 / Gen 3 / Digital)
- Magnification
- Head-mount compatible (yes/no)
- Weapon-mount compatible (yes/no)
- IR illuminator included (yes/no)
- Accessories included (checkboxes)

*Power Station:*
- Capacity (Wh)
- Continuous AC output (W); surge (W)
- Battery chemistry (LFP/LiFePO4 required to publish; NMC accepted with Li-ion thermal-event rider)
- Cycle count remaining (declared %)
- UL 9540 / UL 2743 cert number (required)
- Output ports (AC count, USB-A, USB-C PD wattage, 12V cigarette, Anderson)
- Recharge time (AC, solar)
- Approximate AC load capacity for common appliances (fridge / CPAP / WiFi router / induction burner)

*Fly Fishing — Waders / boots:*
- Wader size (S / M / L / XL / XXL — and stout / king variants)
- Boot size (US men's / women's)
- **Sole material (felt / rubber)** — required; cross-state booking defaults to rubber
- Last decontamination date

*Fly Fishing — Rod / reel:*
- Rod weight (1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 / 10 / 11 / 12+)
- Length (ft / pieces)
- Action (slow / medium / fast / extra fast)
- Reel weight class
- Line included (yes/no — type and weight)

### Step 4 — Condition rating
Three options with tooltip explanations:
- **Mint** — Barely used. No visible wear. Functions as new.
- **Field-Ready** — Used on real hunts. Body wear possible. Glass clear. Fully functional.
- **Battle-Scarred** — Shows its history. Priced accordingly. No performance compromise.

Lister must select one. Cannot skip. Tooltip shown for each before selecting.

After selecting condition, text field: "Notes for renters" — describe specific wear, quirks, or things to know. Required if Battle-Scarred selected.

### Step 5 — Photos
- Minimum: 3 photos required to publish
- Maximum: 12 photos
- Upload guidelines shown inline:
  - Gear in a field/outdoor context preferred (not white background studio)
  - Photograph any visible wear honestly — this protects you in a dispute
  - Include accessories in at least one photo
- Photos can be reordered (drag to set hero image)
- No AI-generated images, no stock photos — honesty enforced by community reporting

### Step 6 — Pricing
- **Daily rate** (lister sets this)
- Pricing reference panel shown alongside (per-vertical, pulled from `docs/gear-catalogue.md` market rates):
  - *Overlanding:* "Built to Roam B2C: $125/day specialty kit; Hygglo US roof tents: ~$47/day, ~$234/week"
  - *Hunting optics:* "Ultimate Night Vision: $199 (ATN ThOR)/weekend, $200–500/weekend NVG"
  - *Power stations:* "FriendWithA: Jackery 1000 Pro $40/day; Goal Zero 3000X $70/day; Hygglo US median $38/day"
  - *Fly fishing:* "Anglers All $25/day per piece; Breckenridge Outfitters $40/day waders+boots, $100/day full kit"
- Platform fee shown: "Kitlo charges renters a 5% service fee on top of your rate, and deducts a 5% payout fee from your earnings (Phase 1 launch pricing — see business-plan.md)"
- **Minimum rental period**: 1 day (default). Lister can set minimum (e.g., "3 days minimum"). Overlanding bundles default to a 2-day minimum.
- **Weekend rate**: option to set a different rate for Fri–Sun bookings.
- **Bundle discount** (bundle listings only): 5–15% off summed component daily rates, lister's choice.

### Step 7 — Deposit & insurance
- Deposit amount auto-suggested based on MSRP:
  - Under $1,000: 25% of MSRP
  - $1,000–$5,000: 20% of MSRP
  - Over $5,000: 15% of MSRP (held as card authorization)
- Lister can adjust deposit within a range (± 10% of suggested)
- Renter Protection Plan: explained — required for all bookings over $1,000 MSRP
- Insurance coverage cap displayed: "Items over $5,000 MSRP require admin review before listing — higher-value insurance policy applies"

### Step 8 — Availability
- Default: all dates available
- Lister blocks dates using a calendar interface (click or drag to block)
- Recurring blocks: "Block every [day] for [X months]" — useful for Brad (P4) who hunts specific weekends
- Buffer days between bookings: optional (e.g., 1 day after each rental for inspection/cleaning)

### Step 9 — Pickup location
- ZIP code required (shown publicly on listing)
- Full address optional at listing creation — can be set to reveal only after booking confirmed
- State shown automatically from ZIP
- "Meet at a neutral location" toggle — for listers who prefer not to share home address
- **Per-vertical attestations** (gates "Continue"):
  - *Overlanding* (RTT/awning/dual-battery): vehicle-fit info present in Step 3; lister acknowledges right-of-refusal at handoff
  - *Hunting optics:* US-Person attestation (ITAR §120.15); lister will not ship internationally; renter must also be a US Person
  - *Fly fishing wading boots:* sole-material declaration confirmed; cross-state defaults to rubber acknowledged
  - *Power station:* UL 9540 / 2743 cert confirmed; no renter-arranged shipping >1,000Wh

### Step 10 — Review & publish
- Full listing preview shown in listing-card and listing-detail formats
- Summary of: gear, condition, specs, price, deposit, location, photos
- Warning if any field looks off (e.g., price significantly above/below market)
- Publish button:
  - MSRP < $5,000 → published immediately, searchable within 5 minutes
  - MSRP ≥ $5,000 → submitted to admin review queue (feature 18); shown as "Pending Review" in lister's dashboard

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Lister picks a Q2 Ghost subcategory but owns no eligible parent | Step 2.5 disables "Continue as standalone" unless metro override applies. Two CTAs: create parent first, or attach to existing listing. |
| Lister tries to bypass Step 2.5 by submitting a Q2 Ghost SKU without parent | Publish button stays disabled at Step 10; tooltip explains bundle requirement and links to catalogue policy |
| Metro override revokes mid-draft (deep-density metro falls below liquidity threshold) | Draft is preserved; on resume, Step 2.5 re-evaluates and now requires bundle attachment. Lister is notified inline. |
| Lister submits < 3 photos | Cannot proceed to publish; prompt to add more |
| Lister claims Mint condition but uploads photos showing heavy wear | Cannot auto-detect; relies on renter reporting and community flagging post-rental |
| MSRP entered as $0 or suspiciously low | Warning prompt: "MSRP affects deposit amount — are you sure?" |
| Duplicate listing detected (same make/model, same lister) | Alert: "You may already have a similar listing — view it here" (not blocked) |
| Prohibited gear category selected | Category not available in dropdown; if somehow submitted, caught in admin review |
| Lister saves draft and returns later | Draft auto-saved after each step; resume from last completed step |
| Network failure during photo upload | Retry UI; photos saved client-side until confirmed |

---

## Trust & Safety

- Condition rating is a binding representation — misrepresentation is grounds for listing removal
- Photo honesty: disputes where pickup condition doesn't match listing photos result in lister rating penalty and potential suspension
- MSRP > $5,000: admin review before publishing — prevents fraudulent listings for premium gear
- Serial number (optional): recommended for high-value items to help with insurance claims
- Prohibited categories enforced at vertical / category selection (no firearms, no hunting bows or crossbows, no drone thermal, no NFA items, no vehicles, no non-empty propane tanks, no uncertified Li-ion power stations, no smokers/pizza ovens — Phase 2+ provisional). Weapons of any kind cannot be loaned through Kitlo — see `18-admin-listing-review.md` and `gear-catalogue.md` for the full list.

---

## UI Notes

- Step progress bar across top: "Step 3 of 10" (Step 2.5 only shown when a Q2 Ghost subcategory is selected; renders as a sub-step within Step 2's progress segment, not its own pill)
- Each step is a distinct screen on mobile; single long form on desktop with section anchors
- Pricing reference panel is collapsible — show it by default but don't force it
- Condition tooltip uses the exact brand language: Mint / Field-Ready / Battle-Scarred
- Spec fields use Roboto Mono font for numeric entries (resolution, range, magnification)
- Photo upload: drag-and-drop on desktop, native photo picker on mobile
- Draft indicator: "Draft saved" timestamp in header

---

## Dependent Features

- **22-bundle-listing** — if "Bundle" category selected, see that workflow. Also referenced from Step 2.5 when a Q2 Ghost SKU triggers the "Create parent first" path.
- **18-admin-listing-review** — triggered if MSRP ≥ $5,000
- **04-manage-listings** — all editing post-publish handled there
- **23-category-listing-rules** — defines Q2 Ghost SKU list and metro override flags; Step 2.5 reads from this source

---

## Open Questions

- [ ] Should we auto-populate spec fields from a gear database (e.g., pull ATN ThOR 4 640 specs automatically from model selection)?
- [ ] Do we enforce a minimum daily rate? (prevents gear being listed at $1/day as a workaround)
- [ ] How long do drafts persist before deletion? (suggest 30 days)
- [ ] Video support for listings in Phase 1 or Phase 2?
