# Feature: Cancellation

**Personas:** Renter (P1/P2), Lister (P3/P4), Dual User (P5)  
**Trigger:** Renter or lister initiates cancellation of a confirmed booking  
**Depends on:** 08-payment-checkout  
**Blocks:** None (cancellation ends the booking lifecycle)

---

## Goal

Make cancellations fair. Renters and listers need to back out sometimes — life happens. But a last-minute cancellation by either side has real cost to the other party. The policy needs to be clear before anyone pays, applied consistently, and enforce consequences proportionate to timing.

---

## Pre-conditions

- Booking is in Confirmed state (payment processed)
- Rental has NOT yet started (pickup not yet confirmed — once rental is Active, different rules apply)
- OR rental is Active but cancellation is initiated by the lister

---

## Cancellation Policy — Renter-Initiated

### Before pickup (confirmed booking, rental not yet started)

| Time before pickup | Refund to renter | Lister keeps |
|---|---|---|
| 7+ days before pickup | 100% refund | $0 |
| 48h–7 days before pickup | 50% refund | 50% of rental charge |
| Under 48h before pickup | 0% refund | 100% of rental charge |

Service fee (Kitlo's take) is non-refundable in all cases — renter knew this at checkout.

Protection plan is refunded proportionally (if cancellation is before pickup, no coverage period has started).

Deposit hold is cancelled (released to renter) in all cancellation scenarios — deposit is for damage, not cancellation risk.

### During active rental

If renter cancels mid-rental (early termination, different from early return):
- No refund for days already elapsed
- Early return refund applies for remaining unused days (80% of remaining daily rate — see 11-active-rental)
- Lister must confirm the early return via the return confirmation flow (12)

---

## Cancellation Policy — Lister-Initiated

Lister cancellations are more consequential — renter planned a hunt around this gear.

| Time before pickup | Renter receives | Lister penalty |
|---|---|---|
| 7+ days before pickup | 100% refund | Warning on account |
| 48h–7 days before pickup | 100% refund + $25 inconvenience credit | Warning + listing temporarily paused |
| Under 48h before pickup | 100% refund + $50 inconvenience credit | Warning + listing paused 30 days |
| After pickup confirmed (mid-rental) | Full remaining value refund + $75 credit | Suspension review |

Inconvenience credits are Kitlo credits applied to the renter's next booking — not cash.

Lister-initiated cancellations are tracked. Three cancellations in 12 months triggers an account review. Chronic cancelers (listers who accept bookings and then cancel) are restricted from new bookings.

---

## Cancellation Flow — Renter

1. Renter opens booking detail page
2. Taps "Cancel booking" (shown in booking detail, below primary actions)
3. Cancellation policy shown with refund amount calculated at that moment:
   > "Cancelling now — you will receive a refund of $X. The remaining $X is non-refundable per our cancellation policy."
4. Renter confirms cancellation
5. System:
   - Initiates Stripe refund for the refund amount
   - Cancels deposit hold
   - Releases lister's dates on availability calendar (immediately — another renter can book)
   - Notifies lister: "[Renter Name] has cancelled their booking for [dates]."
6. Renter sees: "Booking cancelled. Refund of $X will appear in 5–10 business days."

---

## Cancellation Flow — Lister

1. Lister opens booking detail page
2. Taps "Cancel this booking" — shown as a secondary action (not prominently displayed — listers should feel some friction before cancelling)
3. Lister shown:
   - Full refund amount that will be returned to renter
   - Inconvenience credit that will be issued to renter (if applicable)
   - Penalty that will be applied to their account
   > "Cancelling 3 days before pickup: renter receives full refund + $25 credit. Your listing will be temporarily paused. A warning will be added to your account."
4. Required: lister must provide a cancellation reason (dropdown):
   - Gear is damaged / no longer available
   - Personal emergency
   - Scheduling conflict
   - Renter requested cancellation but used wrong flow
   - Other (requires text)
5. Lister confirms
6. System processes refund, issues credit, applies penalty, notifies renter

Lister cannot cancel after pickup is confirmed by both parties — at that point, the rental is Active and lister responsibilities are different.

---

## Mutual Cancellation

Both parties agree to cancel (e.g., renter asks, lister agrees):

1. Renter (or lister) initiates cancellation request through the app
2. Other party receives: "[Name] has requested to cancel booking [reference]. Do you agree?"
3. Other party confirms mutual cancellation
4. Result:
   - 100% refund to renter (regardless of timing — mutual = no penalty)
   - No penalty to lister
   - No cancellation counts against either party's record
5. If the other party does not respond within 24 hours: treated as a standard cancellation by the initiating party (normal policy applies)

The mutual flow prevents renters from asking listers to cancel so the renter avoids the cancellation policy.

---

## Cancellation vs. No-Show

No-shows are handled differently from cancellations:

- **Renter no-show** (at pickup location, per 10): 50% of first day's rate charged; deposit released. Not a "cancellation" — handled in 10-pickup-inspection.
- **Lister no-show** (renter arrives, lister doesn't): Full refund + inconvenience credit; lister warning/suspension. Handled in 10-pickup-inspection.

Cancellations are when someone proactively cancels before the scheduled pickup.

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Renter cancels because listing was materially misrepresented | Renter can file a pre-rental condition dispute (10) instead of cancelling — this may result in full refund without cancellation penalty regardless of timing |
| Lister cancels because they misread the dates | Still applies standard lister cancellation penalty — lister should have confirmed dates before accepting the booking |
| Renter requests cancellation, lister agrees, but renter doesn't confirm mutual cancellation | 24h for renter to confirm; after that, initiating-party policy applies |
| Partial cancellation (renter wants to shorten trip, not cancel entirely) | Not a cancellation — this is an early return request (11-active-rental). Early return refund policy applies. |
| Force majeure (wildfire, flood, severe weather cancels the hunt) | Admin can override cancellation policy in documented emergency conditions. Lister and renter both get a neutral outcome. Admin discretion. |
| Renter finds cheaper gear and wants to cancel their confirmed booking | Standard cancellation policy applies. No exception for "found a better deal." |
| Lister accepts a private (off-platform) booking for the same dates | Lister must cancel on-platform booking. Standard lister cancellation penalty applies plus potential account flag for off-platform activity. |

---

## Refund Processing

- Stripe refunds post to the original payment method within 5–10 business days (Stripe standard)
- Kitlo service fee is non-refundable in all cases — this is disclosed at checkout (08)
- Deposit holds are cancelled (not refunded — they were never charged): appear as removed "pending" on renter's card within 1–5 business days depending on bank
- Partial refunds (50%) are processed as a single Stripe refund for the partial amount

---

## Trust & Safety

- The cancellation policy is shown at booking request (07) and checkout (08) — no surprises
- Lister penalty structure exists specifically to prevent listers from accepting bookings speculatively and cancelling when something better comes along
- Mutual cancellation loophole prevention: the system tracks who initiated the mutual request — if a pattern emerges (renter always initiating mutual requests just inside the 48h window), admin is flagged
- Force majeure override is admin-only — not user-requestable — to prevent abuse

---

## UI Notes

- "Cancel booking" is visible on the booking detail page but not in the primary action area — below the fold (intentional friction)
- Cancellation confirmation modal shows the exact refund amount and any penalty — not just "are you sure?"
- After cancellation: booking card in renter's history shows "Cancelled" state (not removed from history)
- Refund status shown on cancelled booking card: "Refund of $X processing" → "Refund of $X issued"
- Lister's cancelled bookings shown in their history with the cancellation reason logged

---

## Open Questions

- [ ] Should we offer "flexible" vs. "standard" cancellation policies as lister options? (Airbnb does this — more flexible policy attracts more renters, listers decide their own risk tolerance)
- [ ] $25/$50/$75 inconvenience credit amounts — are these right? Too low to matter? Too high to sustain?
- [ ] Force majeure: who decides? Is there a formal process, or entirely admin discretion?
- [ ] Should cancelled bookings from the same renter on the same gear re-open the dates immediately? (Yes — blocking the calendar hurts the lister unnecessarily)
