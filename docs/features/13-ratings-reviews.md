# Feature: Ratings & Reviews

**Personas:** Renter (P1/P2), Lister (P3/P4), Dual User (P5)  
**Trigger:** Booking moves to "Completed" state (both parties confirmed return)  
**Depends on:** 12-return-confirmation  
**Blocks:** None (but feeds into 05-search-discovery ranking and 06-listing-detail trust signals)

---

## Goal

Build a trust layer that gives future renters and listers real signal — not inflated 5-star averages. Reviews should feel like advice from someone who's been there, not a loyalty-program checkbox.

---

## Pre-conditions

- Booking is in "Completed" state
- No open dispute on the booking (dispute must resolve before reviews unlock — see 14)
- 48-hour dispute window has cleared (payout released)

---

## Happy Path

### Prompt to review

Both parties receive a push notification + email immediately after booking closes:

- **Renter:** "How was renting [Gear Name] from [Jake R.]? Leave a quick review — it helps the next hunter."
- **Lister:** "How was [Marcus W.] as a renter? Your review helps the community."

Review prompt is also shown as a persistent banner on the booking detail page until review is submitted or the 14-day window closes.

---

### Renter Review (of lister + gear)

Two-part review:

**Part 1 — Gear review**

Shown first because gear quality is the primary concern.

- **Star rating:** 1–5 stars (required)
- **Condition accuracy:** "Did the gear match its listed condition?" — Yes / Somewhat / No (required)
- **Written review:** Free text, 20–500 characters (optional but strongly encouraged)
- **Gear-specific tags** (tap to add, optional):
  - Worked perfectly
  - Battery life was poor
  - Glass was cleaner than expected
  - Missing accessory (minor)
  - Zeroing was off
  - Better than described
  - Exactly as described

**Part 2 — Lister review**

- **Star rating:** 1–5 stars (required)
- **Written review:** Free text, 20–500 characters (optional)
- **Lister tags** (optional):
  - Quick to respond
  - Flexible on pickup
  - Gear was ready on arrival
  - Hard to reach
  - Went above and beyond
  - Professional handoff

**Submit:** Single submit button after both parts complete.

---

### Lister Review (of renter)

Simpler — listers review the renter, not the gear.

- **Star rating:** 1–5 stars (required)
- **Written review:** Free text, 20–500 characters (optional)
- **Renter tags** (optional):
  - Returned on time
  - Gear returned clean
  - Easy to coordinate with
  - Communicated well
  - Returned late
  - Gear returned dirty
  - Caused a dispute

Renter tags with negative connotations (returned late, dispute) are shown to future listers only — not on the renter's public profile visible to the general public.

---

### Review visibility

- Reviews are **not shown to either party until both have submitted**, or until the 14-day window closes — whichever comes first. This prevents retaliatory reviews.
- After reveal: both reviews are public on their respective profiles.
- Renter's review of gear appears on the listing page (06) with the booking date.
- Renter's review of lister appears on the lister's profile.
- Lister's review of renter appears on the renter's trust profile (visible to listers evaluating a booking request).

---

### Review window

- 14 days after booking closes to submit a review.
- After 14 days: review prompt disappears, no review can be submitted.
- No extensions. No exceptions. (Disputed bookings: 14-day window starts when dispute resolves.)

---

## Rating Calculations

### Listing rating
- Weighted average of all gear star ratings for that listing
- Shown as: ★ 4.8 (23 reviews)
- Displayed on listing card (05), listing detail (06), booking request (07)

### Lister profile rating
- Weighted average of all renter reviews of the lister
- Shown as: ★ 4.9 (41 rentals)
- Displayed on lister profile block in listing detail (06)

### Renter trust score
- Average of lister reviews of the renter
- Not displayed publicly as a numeric score — shown to listers as a qualitative tier:
  - **New renter** (0–2 completed rentals)
  - **Trusted renter** (3+ completed rentals, avg ≥ 4.0)
  - **Flagged** (avg < 3.5 or dispute history) — admin-set flag

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Renter leaves review before lister | Renter's review held until lister submits or window closes |
| Lister leaves review before renter | Same — held until renter submits or window closes |
| Neither party leaves a review | No reviews shown; booking marked as completed without review |
| Dispute resolved in renter's favor | Lister can still leave a review; renter can too. Both reviews are real. |
| Renter leaves a retaliatory review after a dispute | Both reviews revealed simultaneously — but admin can flag a review as "filed during dispute context" |
| Review contains personal identifying information (address, phone) | Admin-reviewed before publish; redacted if found |
| Review is clearly fake / incentivized | Admin can remove. Listers cannot solicit specific ratings. |
| Renter had a perfect trip but gear had minor issue they didn't report | Review is their honest account — no edit after submission |
| Booking was cancelled | No review opportunity (cancellation, not completed booking) |

---

## Trust & Safety

- **Blind review system**: neither party sees the other's review until both submit or the window closes. This is the most important design decision in this feature — without it, the lower-rated party holds the review hostage or retaliates.
- **Admin override**: admin can remove a review that violates review policy (personal attacks, false statements, threatening content). Removing a review is logged and flagged to the platform — patterns of lister-reported reviews are tracked (listers who repeatedly flag reviews may be attempting to suppress legitimate feedback).
- **No anonymous reviews**: all reviews are tied to a verified account and a confirmed booking. Fake reviews are possible but traceable.
- **Gear condition tags**: the "Condition accuracy" field is the most trust-relevant data point for future renters. If a lister has a pattern of "Condition was worse than listed" responses, admin is notified.

---

## UI Notes

- Review prompt is a full-screen modal on mobile — not a push notification that redirects to a form
- Star input: large, tap-friendly stars — not a slider
- Tags are pills with tap-to-select behavior; selected = filled amber/slate
- Written review: character counter shown below textarea ("143 / 500")
- "Why can't I see the review yet?" tooltip: "We show reviews after both parties submit so neither feels pressure to match the other's rating."
- On listing page: reviews shown in reverse chronological order; most recent first
- Review card includes: star rating, condition accuracy badge, tags, review text, renter first name + last initial, booking month/year
- No "helpful / not helpful" voting on reviews in Phase 1 — adds complexity, gaming risk

---

## Open Questions

- [ ] Should we weight recent reviews more heavily in the star average? (Gear condition changes over time — a 4-year-old 5-star review matters less)
- [ ] What is the minimum review count before a star average is shown? (Show "No reviews yet" vs. showing a 5.0 from one booking)
- [ ] Should listers be able to respond publicly to reviews? (Airbnb allows this — adds accountability but also adds noise)
- [ ] Condition accuracy field: should this be structured enough to feed back into the listing's condition rating? (If 10 renters say condition was worse than listed, maybe the listing auto-downgrades)
