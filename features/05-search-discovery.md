# Feature: Search & Discovery

**Personas:** First-Time Renter (P1), Repeat Renter (P2), Dual User (P5), Visitor (P6)  
**Trigger:** User enters a location, clicks "Browse gear", or lands on search results from an external link  
**Depends on:** Nothing (works for unauthenticated users)  
**Blocks:** 06-listing-detail

---

## Goal

Surface the right gear to the right hunter as fast as possible. Search must work for the anonymous visitor (P6) and the experienced renter (P2) equally. Bundles are the flagship product and should be discoverable first.

---

## Pre-conditions

- At least one active listing exists in the searched geography
- User may be authenticated or anonymous

---

## Happy Path

### Entry points
1. **Homepage search bar** — location + gear type → results
2. **"Browse gear" nav link** → results page with location auto-detected from browser
3. **Direct URL with params** — `/gear?location=san-antonio-tx&type=thermal` (shareable links)
4. **Map view** — geographic browse without a text search

### Search inputs
- **Location** (required): ZIP code, city/state, or "near me" (browser geolocation)
  - Autocomplete: type "San" → "San Antonio, TX", "San Marcos, TX"
  - Default search radius: 50 miles
- **Gear type** (optional): Thermal / Night Vision / Bundle / Camp & Support / Any
- **Dates** (optional): date range picker — filters out unavailable listings
  - If no dates entered, show all listings with availability indicator
- **Search button** → results

### Results page

**Layout:**
- Left panel: filters (collapsible on mobile)
- Right: results grid (3-column desktop, 1-column mobile)
- Map toggle: switches to map view with listing pins

**Default sort:** Distance (nearest first), then weighted by rating and booking count.

**Listing card shows:**
- Hero photo
- Gear type badge (Thermal / Night Vision / Bundle)
- Condition badge (Mint / Field-Ready / Battle-Scarred)
- Gear name and model
- Lister: avatar initial, name, Verified Hunter badge (if verified), rating (e.g., 4.9)
- Daily rate (Roboto Mono)
- Distance from searched location
- Availability indicator (green dot = available for searched dates)

**Bundle listings** shown with a distinct "Bundle" badge and slightly larger card treatment — they are the flagship product.

### Filters sidebar
- **Price range**: slider, min/max per day
- **Condition**: checkboxes — Mint, Field-Ready, Battle-Scarred
- **Verified listers only**: toggle
- **Instant book only**: toggle (if instant book feature is live)
- **Gear type**: radio — Thermal, Night Vision, Bundle, Camp & Support
- **Distance radius**: 25mi / 50mi / 100mi / Any
- **Minimum rating**: dropdown — 4.0+, 4.5+, 5.0 only

### Map view
- Dark-mode topo-inspired map (Mapbox)
- Listing pins showing price at location
- Click pin → mini listing card popover
- Click card → listing detail
- Map moves as user pans → results update to visible area

---

## Empty States

| Scenario | UI Response |
|---|---|
| No results in selected radius | "No gear available within 50 miles of San Antonio, TX. [Expand to 100 miles] or [notify me when gear is listed here]." |
| Location not yet served (outside TX/MN) | "Kitlo is launching in your area soon. [Get notified when we go live near you.]" |
| Dates filter returns no available gear | "All listed gear in this area is booked for those dates. Try different dates or [browse without dates]." |
| No results for specific gear type | "No [thermal scopes] near you right now. [Browse all gear types instead]." |

---

## Edge Cases

| Scenario | Handling |
|---|---|
| User searches with dates that overlap a booking | Those listings are filtered out automatically |
| User on mobile uses geolocation but denies permission | Fall back to manual location entry with prompt |
| Listing becomes booked mid-search session | Availability refreshed on listing detail open; stale results don't block — handled at booking step |
| User searches very broad (e.g., "Texas") | Return results from all TX markets sorted by distance from TX centroid |
| Anonymous user tries to message or book | Prompt to sign in / create account, return to listing after |

---

## Trust & Safety

- Only Active listings appear in results — Paused, Flagged, Pending, and Archived listings are excluded
- Listings with admin flags are excluded from search results
- Lister rating displayed on card — renters self-select by quality

---

## UI Notes

- Homepage search bar is prominent above the fold — two inputs (location, gear type) and a button
- Show real listing counts in the search bar placeholder: "Search 47 listings near San Antonio"
- Condition badge uses brand colors from style.css: Mint green, Field-Ready olive, Battle-Scarred amber
- Bundle listings get a subtle visual treatment to stand out (slightly wider card or "Bundle" banner)
- Filter state persists in URL params so users can share filtered searches
- "Notify me" for out-of-area captures email for go-to-market expansion

---

## Open Questions

- [ ] Should we rank listings by utilization rate (busier listers ranked higher) or purely by proximity + rating?
- [ ] Do we surface "new listings" with a badge to encourage early renters?
- [ ] Should the map be live in Phase 1 or Phase 2? (Mapbox has a cost at scale)
- [ ] Saved searches — allow users to save a search and be notified when new gear is listed that matches?
