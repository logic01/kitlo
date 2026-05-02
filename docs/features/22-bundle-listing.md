# Feature: Bundle Listing

**Personas:** Lister (P3/P4), Dual User (P5), Renter (P1/P2)  
**Trigger:** Lister creates a bundle from their existing individual listings  
**Depends on:** 03-create-listing, 04-manage-listings  
**Blocks:** None (but feeds into 05-search-discovery and 06-listing-detail with special treatment)

---

## Goal

The thermal + night vision bundle is Kitlo's flagship product. No competitor offers combined booking of a thermal unit and a night vision unit as a single transaction. This is what makes Kitlo purpose-built for hunters rather than a general gear rental platform. The bundle must be easy to create, easy to find, and easy to book.

---

## What is a Bundle

A bundle is two or more listings packaged as a single bookable unit with:
- One combined price (typically discounted from the sum of individual prices)
- One booking transaction (single payment, single deposit)
- Shared availability (booking one blocks the others automatically)
- A distinct visual treatment in search and on the listing page

---

## Pre-conditions

- Lister has at least 2 active individual listings that are eligible for bundling
- Both listings must be lister's own gear (no cross-lister bundles in Phase 1)
- Listings must be in Active or Paused state (not Archived or Pending Review)

---

## Bundle Creation Flow

Accessed from: Lister dashboard → "My Listings" → "Create Bundle"

### Step 1 — Select listings

- Lister sees their Active listings in a checklist
- Selects 2–4 listings to include in the bundle
- Validation: selected listings must not have conflicting existing bookings
- Recommended starting point: thermal unit + NV unit (system suggests compatible pairs based on gear category)

### Step 2 — Bundle identity

- **Bundle name:** Pre-filled suggestion: "[Listing 1 Name] + [Listing 2 Name] Bundle" — lister can customize
- **Bundle description:** Free text (500 chars max). What does this setup enable? "Full night hunt capability — thermal for scanning, NV for close approach. Both zeroed."
- **Bundle photo:** Lister uploads a hero photo of both items together (required, 1 photo minimum). The visual of both units side-by-side communicates the value immediately.

### Step 3 — Pricing

- **Individual price breakdown shown:** 
  > ATN Thor 4 640: $135/day  
  > ATN X-Sight 4K Pro: $65/day  
  > Individual total: $200/day
- **Bundle daily rate:** Lister sets this. System shows a suggested bundle discount range (10–20% off individual total is the platform recommendation — not enforced).
- **Example:** $175/day (12.5% bundle discount)
- Bundle deposit: calculated as sum of individual deposits (or lister can set a custom bundle deposit, not below the sum)
- Protection plan: applied based on combined MSRP (highest-tier plan of the two items)

### Step 4 — Availability

- Bundle availability is the intersection of both listings' availability calendars
- Days where either individual listing is booked = bundle unavailable (shown as blocked)
- Lister can see a combined availability preview calendar before confirming
- When bundle is booked: both individual listings are blocked for those dates automatically

### Step 5 — Review & publish

- Summary of bundle: items, pricing, availability, deposit, protection
- Publish → bundle listing goes live as a separate listing entry (distinct from the two individual listings, which remain independently bookable)

---

## Bundle Listing Page (06-listing-detail variant)

The bundle listing page has the same structure as a standard listing but with bundle-specific sections:

### What's in the bundle section

Replaces the standard "Spec table" with a two-column card layout:

| ATN Thor 4 640 | ATN X-Sight 4K Pro |
|---|---|
| Thermal | Night Vision |
| 640×480 sensor | 4K day/night |
| [Condition: Mint] | [Condition: Field-Ready] |
| [Link to individual listing →] | [Link to individual listing →] |

Each card links to the individual listing so renters can see full specs and photos for each item.

### Pricing block

```
Bundle price:          $175/day
  ATN Thor 4 640:     ($135 individually)
  ATN X-Sight 4K Pro: ($65 individually)
  Bundle saves:        $25/day

5-day bundle:         $875.00
Service fee (5%):     +$43.75
Protection plan:      +$75.00
──────────────────────────────
Total charged:        $993.75
Deposit hold:         $500.00 (released on return)
```

### Trust signals

Bundle listings surface the lister's rating for BOTH component listings — reinforces that this is a trusted multi-item lender.

---

## Search & Discovery Treatment (05-search-discovery)

Bundle listings get distinct visual treatment in search results:

- **Bundle badge:** Amber pill "BUNDLE" overlaid on listing card (top-left, same position as condition badge)
- **Card layout:** Wider card showing both gear items side-by-side (not just one photo)
- **Price display:** Bundle price prominently shown; individual total shown smaller as "value comparison"
- **Filter:** Users can filter search results to show "Bundles only" — for renters who specifically want the full night hunt kit

Bundles rank above individual listings in search results when the renter's search query implies a bundled need (e.g., searching "thermal night vision" or "hog hunting kit") — this is a relevance signal, not a paid placement.

---

## Identity Verification for High-Value Bundles

If the combined MSRP of the bundle exceeds $3,000, renter identity verification (17-identity-verification) is required before booking in Phase 2. In Phase 1, it is optional but encouraged.

Bundle MSRP is the sum of both individual listing MSRPs. A $2,000 thermal + $1,500 NV unit = $3,500 combined — triggers verification requirement in Phase 2.

---

## Booking a Bundle

Booking flow follows 07-booking-request and 08-payment-checkout with these differences:

- **Booking request screen:** Shows both items with their photos, specs, and individual condition ratings
- **Single payment:** One Stripe charge covers both items
- **Single deposit hold:** Combined deposit for both items (one authorization)
- **Messaging thread:** One thread between renter and lister — not separate threads per item
- **Pickup:** Both items handed over at the same time, same location (bundle requires same pickup location — validated at bundle creation)
- **Return:** Both items returned together; lister inspects both at return (12)

---

## Managing a Bundle

### From the lister dashboard

Bundle appears in "My Listings" with a distinct bundle icon.

Lister can:
- Edit bundle description, photo, pricing
- Pause the bundle (individual listings remain independently available)
- Delete the bundle (individual listings remain active)
- View bundle-specific earnings and rental history separately from individual listings

### Individual listings when bundle is booked

- Both individual listings show "Unavailable — booked as part of [Bundle Name]" on their availability calendar
- Other renters trying to book the individual listing see: "This item is unavailable for those dates — it's booked as part of a bundle."
- Individual listings remain bookable for dates outside the bundle booking window

### When individual listing gets booked independently

- Bundle availability for those dates is automatically blocked
- If bundle and individual listing are both available and a renter books the individual listing: bundle becomes unavailable for those dates
- First-come-first-served: no priority given to bundle bookings

---

## Edge Cases

| Scenario | Handling |
|---|---|
| One item in bundle is damaged and out of service | Lister should pause the bundle and update the individual listing. System does not auto-pause bundles when individual listing is paused — lister must do this manually (flag for Phase 2 automation). |
| Renter wants only one item from a bundle | They book the individual listing directly. Bundle is a separate listing from the individuals. |
| Lister wants to add a third item to an existing bundle | Edit bundle flow — add item, update pricing, revalidate availability. Existing bookings unaffected. |
| Bundle is booked and one item is damaged at return | Damage dispute is filed against the bundle booking — both items' return photos can be attached. Admin determines liability per item. |
| Renter books bundle but lister has a subsequent individual booking conflict | Bundle booking blocks individual listings — so subsequent bookings should have been blocked. If not (race condition): admin resolves. The earlier booking (bundle or individual) stands. |
| Lister wants to delete individual listing that's part of a bundle | Individual listing cannot be deleted while it's part of an active bundle. Lister must dissolve the bundle first. |
| Two listers want to create a cross-lister bundle | Not supported in Phase 1. Each lister is responsible for the gear they hand over — cross-lister bundles create complex liability scenarios. |

---

## Trust & Safety

- Both items in a bundle must pass individual listing requirements (condition rating, photos, MSRP disclosure)
- If either individual listing is in Pending Review (admin hold), the bundle cannot be published until both are approved
- Dispute coverage extends to the entire bundle — renter's deposit is held for both items until both are confirmed returned in acceptable condition
- Bundle discount is at lister's discretion — no platform-enforced minimum. Listers who set bundle prices above individual total will have poor conversion; market forces correct this.

---

## UI Notes

- "Create Bundle" is discoverable from the lister dashboard but not forced — it's an optional power feature
- Bundle creation wizard is 5 steps maximum — lister should be able to create a bundle in under 5 minutes
- Bundle card in search has the "BUNDLE" badge in Safety Amber — it should stand out on scroll
- On the bundle listing page: "What's in the bundle" section comes before the pricing block — renter needs to understand the value before seeing the price
- Bundle pricing block shows the savings clearly — "Bundle saves: $25/day" — this is the value prop
- Mobile: bundle card in search is a full-width card (not a grid card) — two items don't fit well in a grid format

---

## Open Questions

- [ ] Should bundles be allowed across different pickup locations? (Thermal at lister's ranch, NV at a different address — logistically messy but possible)
- [ ] Cross-lister bundles in Phase 2? (Two friends with complementary gear could offer a bundle — but liability, payout, and dispute handling become complex)
- [ ] Should Kitlo feature curated bundles on the homepage? ("Top thermal + NV bundles in TX") — editorial curation as a trust signal
- [ ] Bundle-specific reviews: should the review cover the bundle experience, or are reviews left on each individual listing separately?
- [ ] Minimum bundle discount requirement: should Kitlo require that bundle price is at most 90% of individual total, to ensure bundles are genuinely better deals?
