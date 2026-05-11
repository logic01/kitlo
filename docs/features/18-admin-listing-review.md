# Feature: Admin — Listing Review

**Personas:** Admin
**Trigger:** New listing submitted with MSRP ≥ $5,000, **or any new listing in a vertical-specific gating tier (overlanding bundle ≥ $5,000 sum, hunting optics bundle, power station ≥ $2,000, fly fishing waders cross-state)**, or listing flagged by a user
**Depends on:** 03-create-listing, `gear-catalogue.md`
**Blocks:** Listing goes live only after admin approval (for high-value or vertical-gated items)

> **v2.0 — overlanding pivot.** Review tiers are now per-vertical. Overlanding bundles, hunting optics bundles, premium power stations, and felt-sole wading boots have specific review triggers in addition to the global $5K MSRP rule. The prohibited list is expanded with vehicles, non-empty propane, and uncertified Li-ion units.

---

## Goal

Catch fraudulent, unsafe, or mis-represented listings before they reach renters. High-value gear (≥ $5K MSRP) gets human review — the risk is too high to auto-approve. Flagged listings get fast review to protect renters already searching.

---

## Pre-conditions

- Listing submitted by a verified lister (02 complete)
- MSRP ≥ $5,000 OR listing flagged by a user

---

## Review Queue

### Admin dashboard view

Listing review queue shows:
- Listing name + **vertical** + gear category
- MSRP (or bundle total)
- Lister name + verification status + account age
- Submitted at timestamp
- Queue reason — see triggers below
- Priority flag: flagged listings prioritized over high-value new listings

**SLA targets:**
- High-value new listing: reviewed within 24 hours
- User-flagged listing: reviewed within 4 hours
- Vertical-gated review (per below): 24 hours

Queue is sorted by SLA deadline ascending (most urgent first).

### Vertical-specific review triggers

| Vertical | Trigger | Why |
|---|---|---|
| **Overlanding** | RTT/awning listing without vehicle-fit info; bundle total ≥ $5,000 | Vehicle-fit drives the dominant damage mode; bundles often exceed Thimble's $5k cap |
| **Hunting Optics** | MSRP ≥ $5,000; any bundle (thermal+NV); listing missing US-Person attestation | Bundles routinely exceed $15k value; ITAR US-Person status is mandatory |
| **Power Station** | MSRP ≥ $2,000; missing UL 9540 / 2743 cert; chemistry = NMC (not LFP) | Li-ion thermal-event coverage requires specialty rider; lower threshold than other tiers |
| **Fly Fishing** | Felt-soled wading boot listing where lister's state is FL/AK/MD or other restricted state | Cross-state booking risk — admin verifies sole-material declaration is correct |
| **Smokers & Pizza Ovens** | Vertical not yet open — submission blocked at form level (Phase 2+) | Provisional |

---

## Review Checklist

Admin reviews each of the following:

### 1. Identity & lister account
- Is the lister verified? (02)
- How long has this account existed?
- Any prior violations, disputes, or suspensions?
- Does the lister have any other listings? Are they in good standing?

### 2. Gear identity and MSRP
- Does the listed gear match an actual product?
- Is the MSRP accurate? (Admin cross-references against manufacturer list price)
- Does the category match the gear?

### 3. Photos
- Are photos genuine (not stock photos or taken from manufacturer's website)?
- Do photos show the actual unit, including serial number if visible?
- Is condition consistent with the listed condition rating (Mint / Field-Ready / Battle-Scarred)?
- Minimum 3 photos required — is this met?

### 4. Specs
- Are specs accurate for the listed model?
- Any impossible or suspicious specs? (e.g., listing a thermal as having 1,000m range when the model doesn't achieve that)

### 5. Pricing
- Is the daily rate within a plausible range for this gear category and MSRP?
- Is the deposit amount set appropriately? (Platform sets minimum deposit floors by MSRP tier)
- Is the protection plan selected correctly?

### 6. Description
- Is the description coherent and accurate?
- Any red flags in lister notes (e.g., "gear available for cash-only rental" — off-platform solicitation)?

---

## Admin Actions

After review, admin chooses:

### Approve
- Listing status: Active
- Lister notified: "Your listing is live"
- No annotation required for standard approval

### Approve with note
- Listing goes live but admin attaches an internal note (not visible to lister)
- Example: "MSRP seems slightly overstated but within range — flag if this lister submits more high-value listings"

### Request changes
- Listing remains in Pending Review state
- Admin specifies exactly what needs to change:
  - "Photos appear to be from manufacturer's website — please add photos of your actual unit"
  - "Serial number should be visible in at least one photo"
  - "MSRP of $8,500 is higher than the current list price of $7,499 — please correct"
- Lister notified with specific change requests
- Lister makes changes and resubmits — goes back to review queue
- SLA resets on resubmission

### Reject
- Listing rejected and not published
- Lister notified with reason
- Listing is archived (not deleted — preserved for audit trail)
- Rejection reasons:
  - Fraudulent (gear does not exist or cannot be verified)
  - Prohibited gear category (firearms, hunting bows/crossbows, ammunition, illegal NV equipment)
  - Lister account in bad standing
  - Terms of service violation in description

### Escalate
- Admin escalates to senior admin or legal if:
  - Potential legal issue (export-controlled gear, NFA items)
  - Lister shows signs of organized fraud
  - Gear appears to be stolen (cross-referenced via community reports)

---

## Flagged Listing Review

A user reports a live listing via "Report listing" on listing detail (06).

### Flag reasons available to users
- "Photos appear to be stolen from the internet"
- "Gear listed doesn't exist / is discontinued"
- "Listing description is misleading"
- "Lister is soliciting off-platform payment"
- "I believe this gear is stolen"
- "Other"

### Admin response to flag

1. Flag received → admin alerted (4h SLA)
2. Admin reviews live listing using same checklist above
3. Options:
   - **Dismiss flag** (flag was unfounded) → listing stays live; flag logged
   - **Pause listing** for further investigation → lister notified; active bookings not cancelled
   - **Reject listing** → see Reject flow above
   - **Suspend lister account** → 20-admin-user-management

Flagging user receives no notification of outcome — their flag is anonymous from the lister's perspective.

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Lister submits same listing twice (impatient) | Deduplicated by gear identity + lister ID — second submission rejected automatically |
| High-value listing submitted Friday 5pm | Admin must still meet 24h SLA — admin team covers weekends for review queue |
| Admin approves a fraudulent listing that later causes harm | Internal audit triggered. Approval decision + admin ID logged permanently. |
| Lister resubmits after rejection with same photos | Admin flags account — pattern of rejection + identical resubmission is a fraud indicator |
| Listing MSRP is $4,900 (just under threshold) | Auto-approved; no queue. But user flags can still pull it into review. |
| Admin is reviewing; another user flags the same listing simultaneously | Flags merge into single review item. Admin sees all flags when reviewing. |

---

## Prohibited Gear

Kitlo does not allow listings for:

- **Firearms** — rifles, shotguns, handguns, air rifles, ammunition, and firearm components
- **Hunting bows** — compound bows, recurve bows, longbows, crossbows, arrows, and broadheads
- NFA items (suppressors, SBRs, etc.) — even if lister claims they're legal in their state
- Export-controlled night vision equipment beyond civilian-export-allowed thermal/NV optics with US-Person attestation (ITAR-restricted)
- **Vehicles** — campervans, trailers, full rigs sold with vehicle. Kitlo lists gear, not vehicles. Outdoorsy and BaseCamper own that surface.
- **Non-empty propane tanks** — gas cylinders must be delivered empty; renter sources fuel locally.
- **Uncertified Li-ion power stations / batteries** — UL 9540 / UL 2743 cert required; major brands only (Jackery, Goal Zero, EcoFlow, Bluetti, Anker Solix). White-label imports decline.
- **Smokers & pizza ovens** — vertical not yet open (Phase 2+ provisional). Form-level block on submission.
- Counterfeit or knockoff gear listed as genuine
- Any gear with evidence of tampering, modification for illegal use

Note: optics that mount to a renter's own weapon (rifle scopes, clip-ons, weapon-mounted thermal/NV) are **allowed**. The platform does not transfer the weapon itself.

Admin maintains the canonical prohibited gear list in `docs/gear-catalogue.md`. Updates flow from gear-catalogue → here, not the reverse.

---

## Audit Log

All admin review actions are logged:

- Admin user ID
- Action taken (approve / reject / request changes / flag dismissed)
- Timestamp
- Notes entered
- Listing ID + lister ID

Audit log is retained permanently. Kitlo legal has access. Exportable for compliance reporting.

---

## UI Notes (Admin Interface)

- Review queue: table view, sortable by SLA deadline, category, MSRP, queue reason
- Listing review view: split screen — listing preview (left) + admin action panel (right)
- Photo review: lightbox with zoom, swipe between photos
- Lister account sidebar: account age, verification status, total listings, dispute history, review scores
- "Request changes" form: structured reason + free text field — structured reasons populate the notification template automatically
- All admin actions require confirmation ("Approve this listing?" → confirm button) — no one-click approvals on a $10K item

---

## Open Questions

- [ ] MSRP threshold for review: $5,000 is the starting point — adjust based on fraud rates seen in Phase 1
- [ ] Should we require serial number photos for all high-value items? (Helps verify gear isn't stolen, aids insurance claims)
- [ ] Auto-approve for trusted Power Listers (P4) with clean track records? (Reduces admin load — risk is they submit a fraudulent new listing once established)
- [ ] Reverse image search on listing photos to detect stock/stolen images? (Automated flag for admin review, not auto-rejection)
