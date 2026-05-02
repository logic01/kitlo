# Feature: Create a Listing

**Personas:** New Lister (P3), Power Lister (P4), Dual User (P5)  
**Trigger:** Lister clicks "Add listing" from their dashboard  
**Depends on:** 02-lister-onboarding (must be complete), 17-identity-verification  
**Blocks:** 05-search-discovery (listing must exist), 07-booking-request

---

## Goal

Allow a verified lister to publish a gear listing with enough detail that renters can make an informed booking decision. Accuracy and honesty are enforced by design, not by trust alone.

---

## Pre-conditions

- Lister has completed onboarding (identity verified, payout connected)
- Lister is not suspended or under review

---

## Happy Path

### Step 1 — Gear category
Select one:
- **Thermal Imaging** (monoculars, rifle scopes, clip-ons, binoculars, spotting scopes)
- **Night Vision** (goggles/head-mount, monoculars, rifle scopes, clip-ons)
- **Bundle** (thermal + NV combined — see 22-bundle-listing)
- **Camp & Support** (power stations, solar panels, ground blinds)

Subcategory selected narrows the spec fields shown in Step 3.

### Step 2 — Gear identity
- **Make** (text field with autocomplete: Pulsar, ATN, AGM, InfiRay, FLIR, L3Harris, etc.)
- **Model** (text field, autocomplete based on Make selection)
- **Year purchased** (optional — used to assess age)
- **MSRP** (required — drives deposit calculation and admin review threshold)
- Serial number (optional — for lister's own records, not shown publicly)

### Step 3 — Specs (category-specific fields)
*Thermal fields:*
- Sensor resolution (320×240 / 384×288 / 640×480 / 1280×1024)
- Detection range (meters)
- Magnification range
- Refresh rate (Hz)
- Battery life (hours)
- Reticle types (freeform)
- Accessories included (checkboxes: remote, mount, case, charger, lens cloth)

*Night Vision fields:*
- Generation (Gen 1 / Gen 2 / Gen 3 / Digital)
- Magnification
- Head-mount compatible (yes/no)
- Weapon-mount compatible (yes/no)
- IR illuminator included (yes/no)
- Accessories included (checkboxes)

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
- Pricing reference panel shown alongside (pulled from `docs/gear-catalogue.md` market rates):
  - "ATN ThOR thermal scopes: $199–$375/weekend on competitor platforms"
  - "PVS-14 Gen 3: $150–$300/weekend"
- Platform fee shown: "Kitlo charges renters a 5% service fee on top of your rate, and deducts a 5% payout fee from your earnings (Phase 1 launch pricing — see business-plan.md)"
- **Minimum rental period**: 1 day (default). Lister can set minimum (e.g., "3 days minimum").
- **Weekend rate**: option to set a different rate for Fri–Sun bookings

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
- Prohibited categories enforced at category selection (no firearms, no hunting bows or crossbows, no drone thermal, no NFA items). Weapons of any kind cannot be loaned through Kitlo — see `18-admin-listing-review.md` for the full list.

---

## UI Notes

- Step progress bar across top: "Step 3 of 10"
- Each step is a distinct screen on mobile; single long form on desktop with section anchors
- Pricing reference panel is collapsible — show it by default but don't force it
- Condition tooltip uses the exact brand language: Mint / Field-Ready / Battle-Scarred
- Spec fields use Roboto Mono font for numeric entries (resolution, range, magnification)
- Photo upload: drag-and-drop on desktop, native photo picker on mobile
- Draft indicator: "Draft saved" timestamp in header

---

## Dependent Features

- **22-bundle-listing** — if "Bundle" category selected, see that workflow
- **18-admin-listing-review** — triggered if MSRP ≥ $5,000
- **04-manage-listings** — all editing post-publish handled there

---

## Open Questions

- [ ] Should we auto-populate spec fields from a gear database (e.g., pull ATN ThOR 4 640 specs automatically from model selection)?
- [ ] Do we enforce a minimum daily rate? (prevents gear being listed at $1/day as a workaround)
- [ ] How long do drafts persist before deletion? (suggest 30 days)
- [ ] Video support for listings in Phase 1 or Phase 2?
