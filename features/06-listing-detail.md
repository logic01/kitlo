# Feature: Listing Detail

**Personas:** First-Time Renter (P1), Repeat Renter (P2), Dual User (P5), Visitor (P6)  
**Trigger:** User clicks a listing card in search results or follows a direct listing URL  
**Depends on:** 05-search-discovery (or direct link)  
**Blocks:** 07-booking-request

---

## Goal

Give the renter everything they need to make a confident booking decision without ever needing to contact the lister first. Trust is established here before a cent is spent.

---

## Pre-conditions

- Listing is in Active state
- User may be authenticated or anonymous

---

## Page Structure

### 1 — Photo gallery
- Full-width hero image (lister's primary photo)
- Thumbnail strip below or swipeable gallery on mobile
- At least 3 photos required (enforced at listing creation)
- Photos are honest — any visible wear should be documented here

### 2 — Gear identity block
- Gear type badge (Thermal / Night Vision / Bundle)
- Gear name and model (bold, condensed font — e.g., "PULSAR THERMION 2 XP50")
- Condition badge + indicator bar: Mint / Field-Ready / Battle-Scarred
- Lister notes about condition (displayed prominently if present)

### 3 — Spec table
Displayed in Roboto Mono — this is data, not prose.

*Thermal:*
| Spec | Value |
|---|---|
| Sensor resolution | 640×480 VOx |
| Detection range | 1,800 m |
| Magnification | 2–16× |
| Refresh rate | 50 Hz |
| Battery life | 8 hrs |
| Accessories | Remote, mount, hard case, charger |

*Night Vision:*
| Spec | Value |
|---|---|
| Generation | Gen 3 |
| Magnification | 1× |
| Head-mount compatible | Yes |
| Weapon-mount compatible | Yes |
| IR illuminator | Included |
| Accessories | J-arm, lens cap, pouch |

### 4 — Lister profile block
- Avatar (initial if no photo)
- Name + Verified Hunter badge (if verified)
- Location: City, State
- Stats: Rating (e.g., 4.9★), Total rentals, Member since [year]
- Response time: "Typically responds within 2 hours"
- Link to full lister profile (all their listings + all reviews)

### 5 — Pricing & booking block
Sticky on desktop (right sidebar), anchored below gallery on mobile.

- Daily rate (large, Roboto Mono)
- Date range picker (start → end)
- Calculated total:
  - Subtotal: $225 × 3 days = $675
  - Renter service fee (X%): $67.50
  - Renter Protection Plan: $45
  - **Total charged**: $787.50
  - Deposit hold: $150 (returned on confirmed return)
- CTA: "Request this gear" (→ 07-booking-request)
- If unauthenticated: CTA shows "Sign in to book" (→ 01-registration, then returns here)

### 6 — Availability calendar
- Full month view showing available (white) and blocked (gray) dates
- If dates already selected in search, pre-populated here
- Booked dates shown as grayed-out/unavailable

### 7 — Lister notes
- Free-text field the lister fills in at listing creation
- Shown as-is — not paraphrased or hidden
- Examples: "Scope has been zeroed at 100 yards for .308. Will re-zero for you if needed." / "Charge to full before pickup — cable included."

### 8 — Reviews
- Summary bar: average rating + breakdown by sub-category (gear accuracy, communication, punctuality)
- Individual reviews: reviewer avatar, name, date, rating, written review
- Sort: newest first (default), highest rated, lowest rated
- Pagination: show 5, load more
- Empty state: "No reviews yet — be the first to rent this gear."

### 9 — Pickup location
- Shown as City, State + distance from searched location
- Full address NOT shown until booking is confirmed
- "Meet at a neutral location" note shown if lister has set that preference

### 10 — Report listing
- Small "Report this listing" link in footer of listing
- Options: inaccurate condition, wrong specs, suspicious, prohibited gear

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Listing was paused or deleted since user opened it | "This listing is no longer available." with related listings shown |
| Selected dates become unavailable while on detail page | Detected on booking request submission — handled in 07 |
| Lister has < 4.0 rating | Show an advisory below the lister block: "This lister's rating is below our recommended threshold. Review their history carefully before booking." |
| Listing has 0 reviews | Show empty state — never hide the reviews section |
| Unauthenticated user tries to view full address | Not shown pre-booking regardless of auth state |
| Bundle listing | Show both items' spec tables; see 22-bundle-listing |

---

## Trust Signals Hierarchy (most important first)

1. Verified Hunter badge on lister
2. Condition badge + lister's own notes about wear
3. Lister rating + number of completed rentals
4. Honest condition photos (wear visible)
5. Escrow and deposit explanation (inline, not buried in FAQ)
6. Reviews (specifically "was the gear as described?")

---

## UI Notes

- Spec table is the most important content block for Kitlo's audience — put it above the fold on desktop
- Pricing block must show the deposit hold clearly separate from the rental charge. Renters often confuse the two.
- "Request this gear" button is amber (`--color-amber`) — this is a renter conversion action
- Condition indicator bar uses the three brand colors inline
- Mobile: sticky bottom bar with price + "Request this gear" CTA
- Page title for SEO: "[Model Name] Rental — [City, State] | Kitlo"

---

## Open Questions

- [ ] Should we show lister's response time on the listing? (Turo and Airbnb do — helps renters set expectations)
- [ ] Favorite/save listing functionality — useful for P2 (Repeat Renter)?
- [ ] Should reviews be separated into "renter reviewed lister" vs "other renters reviewed this specific gear"?
- [ ] Video support in gallery — Phase 1 or defer?
