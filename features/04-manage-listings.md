# Feature: Manage Listings

**Personas:** New Lister (P3), Power Lister (P4), Dual User (P5)  
**Trigger:** Lister visits "My Listings" from their dashboard  
**Depends on:** 03-create-listing  
**Blocks:** Nothing downstream — this is an ongoing management workflow

---

## Goal

Give listers full visibility and control over their published gear. Quick toggling, bulk operations for Power Listers (P4), and clear status indicators for each listing.

---

## Listing States

| State | Meaning | Lister can... |
|---|---|---|
| **Draft** | Created but not submitted | Edit freely, delete, publish |
| **Pending Review** | Submitted for admin review (MSRP ≥ $5K) | View only; cannot edit until reviewed |
| **Active** | Published and searchable | Edit most fields, pause, archive |
| **Paused** | Hidden from search, not bookable | Edit freely, reactivate |
| **Booked** | Has an active confirmed booking | Limited editing (see below) |
| **Flagged** | Admin has flagged the listing | View flag reason; cannot edit until resolved |
| **Archived** | Removed from platform by lister | View history only; can restore within 30 days |

---

## Happy Path — Dashboard View

### Listings overview
- All listings shown as a list/table (not cards — Power Listers need density)
- Columns: Gear name, Type, Condition, Status, Daily rate, # bookings, Avg rating, Earnings (all-time)
- Sortable by: status, earnings, bookings, recently active
- Filter by: status, gear type

### Per-listing actions
Each listing row has inline actions:
- **Toggle active/paused** — single click, instant (no confirmation needed)
- **Edit** — opens edit flow (same as create, pre-filled)
- **View listing** — opens the public listing detail page
- **Block dates** — opens calendar directly for this listing
- **Archive** — confirmation required ("This will remove the listing from search")

---

## Happy Path — Edit a Listing

Most fields editable at any time except during an active booking:

| Field | Editable while booked? |
|---|---|
| Photos | No — locked during active booking |
| Daily rate | No — locked during active booking |
| Condition rating | No — locked; must request admin change |
| Specs | No — locked during active booking |
| Pickup location | No — locked during active booking |
| Notes for renters | Yes |
| Availability calendar | Yes — can add blocks for future dates |
| Deposit amount | No — locked during active booking |

When editing locked fields, show: "This listing has an active booking. These fields can be edited after [return date]."

---

## Happy Path — Availability Calendar

- Monthly calendar view with color coding:
  - White: available
  - Gray: blocked by lister
  - Green: booked (confirmed rental)
  - Yellow: pending booking request
- Click a date to block/unblock
- Drag to block a range
- Bulk block: "Block [date range] across all my listings" — Power Lister feature
- Sync with external calendar (iCal export) — Phase 2

---

## Happy Path — Listing Analytics

Per listing:
- Total bookings (all-time)
- Total earnings (all-time, last 30 days, last 90 days)
- Views in last 30 days
- Conversion rate (views → bookings)
- Average renter rating received
- Response rate and average response time

Aggregate (across all listings):
- Total monthly earnings
- Most-booked gear
- Utilization rate: days booked / days available

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Lister tries to edit a listing during active booking | Show locked fields with explanation and unlock date |
| Lister archives a listing with a future confirmed booking | Block archive; show "You have a booking on [date]. Resolve it first." |
| Lister tries to lower price below market floor (if enforced) | Warning prompt, not a hard block |
| Admin flags listing while it has bookings | Bookings already confirmed remain; new bookings blocked until resolved |
| Lister wants to change condition rating (e.g., gear degraded after heavy use) | Submit change request to admin — cannot self-change condition rating post-publish |
| Power Lister (Brad) wants to pause all listings for a trip | "Pause all" button with confirmation modal |

---

## Trust & Safety

- Condition rating changes require admin approval to prevent listers downgrading to avoid damage claims
- Archived listings retain all booking history and reviews — they don't disappear from renter booking records
- Flagged listings must be resolved before the lister can create new listings

---

## UI Notes

- Power Listers (P4) with 5+ listings need a table view, not cards — implement a density toggle
- Mobile: listings as swipeable cards with quick-action buttons (pause, edit, calendar)
- Bulk select + bulk action for Power Listers (pause all, block dates on all)
- "Pending Review" status should show estimated review time ("Admin review typically completes within 24 hours")
- Analytics are low-priority for Phase 1 — implement basic counts; defer advanced analytics to Phase 2

---

## Open Questions

- [ ] Should listers be able to set a minimum renter rating to auto-decline (e.g., "only accept renters with 4.5+")? This is a Turo feature.
- [ ] Instant book vs. manual approval per listing — can listers choose per listing or is it platform-wide?
- [ ] Should we allow geo-flexible pickup? (e.g., lister offers delivery within 30 miles for a fee)
