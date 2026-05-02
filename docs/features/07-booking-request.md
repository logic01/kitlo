# Feature: Booking Request

**Personas:** First-Time Renter (P1), Repeat Renter (P2), Dual User (P5)  
**Trigger:** Renter clicks "Request this gear" on a listing detail page  
**Depends on:** 06-listing-detail, 01-registration-onboarding  
**Blocks:** 08-payment-checkout

---

## Goal

Confirm the renter's intent and show a complete, honest cost breakdown before any payment is taken. No surprise fees. No buried terms. Clear what happens if something goes wrong.

---

## Pre-conditions

- Renter is authenticated
- Date range is selected
- Listing is in Active state and available for the selected dates

---

## Happy Path

### Step 1 — Booking summary screen

**Gear block:**
- Photo thumbnail + gear name + condition badge
- Lister name + rating

**Date block:**
- Pickup date and return date
- Total days

**Cost breakdown (full transparency):**
```
Daily rate:         $225.00 × 3 days    = $675.00
Renter service fee: 5%                  = $33.75
Renter Protection Plan:                 = $45.00
──────────────────────────────────────────────────
Total charged today:                      $753.75

Deposit hold (returned on return):        $150.00
(Your card is authorized for $150 but not charged)
```

The 5% renter service fee is the Phase 1 default per `docs/business-plan.md`. It scales with the phased rollout — Phase 2 raises it to 7%, Phase 3 to 9%, Phase 4 to 10%.

- "Why is there a deposit?" — expandable tooltip explaining escrow, when it's released, what happens in a dispute
- "What does the Protection Plan cover?" — expandable: damage up to $5,000, exclusions (intentional damage, loss)

**Message to lister (optional):**
- Text area: "Tell [Jake R.] about your hunt or ask a question"
- Character limit: 500
- Recommended but not required

**Pickup details confirmation:**
- Pickup location shown: "San Antonio, TX area — exact address shared after booking"
- Pickup date/time: defaulting to 8:00am; renter notes if they need different time

**CTA:** "Continue to payment" → Step 2 (08-payment-checkout)

---

### Booking modes

**Instant Book (default for Phase 1):**
- Booking is confirmed immediately upon payment
- Lister is notified; renter gets confirmation
- Lister cannot cancel without penalty

**Approve First (optional per listing, Phase 2):**
- Renter submits request; no payment taken yet
- Lister has 24 hours to accept or decline
- If accepted → payment taken → confirmed
- If declined or no response → renter not charged, notified

Phase 1 recommendation: Default all listings to Instant Book to minimize friction. Approve First is a Phase 2 option.

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Listing becomes unavailable for selected dates between detail view and booking | Detected at this step. "Sorry — these dates were just booked. [See other listings]" |
| Renter is also a lister trying to book their own listing | Block with message: "You can't rent your own gear." |
| Renter has an unresolved dispute or is suspended | Block with: "Your account has a restriction. [Contact support]." |
| Renter has no reviews and is booking high-value gear (> $3K MSRP) | Soft prompt: "This lister typically rents to verified members. Consider adding a note." — not a hard block in Phase 1 |
| Selected dates span a calendar month boundary | No special handling needed — just display correctly |
| Renter changes their mind about dates after seeing total | Allow editing dates inline on this screen; recalculates total |

---

## Trust & Safety

- Cost breakdown must show every fee before payment is taken — no surprises at checkout
- Deposit displayed as "held, not charged" — this distinction matters to renters
- Platform service fee and Protection Plan are non-negotiable and non-removable
- Message to lister stored on platform — available as evidence in dispute

---

## UI Notes

- This screen is a summary, not a form — minimal user input
- Fee breakdown uses Roboto Mono for all numbers
- Deposit hold shown in a visually distinct treatment (lighter background, "held" label) — not mixed with the charge total
- Expandable tooltips for deposit and protection plan — don't make them read fine print, but it must be accessible
- "Back" takes them to the listing detail with dates preserved
- Mobile: full-screen, scrollable, sticky "Continue to payment" at bottom

---

## Open Questions

- [x] What is Kitlo's renter service fee percentage? **Phase 1: 5%.** See `docs/business-plan.md` for the phased rollout.
- [ ] What is the Protection Plan daily rate? ($15/day for under-$5K gear per gear-catalogue.md — confirm)
- [ ] Do we show the lister's take on this screen? (Airbnb doesn't; transparency builds trust but may cause sticker shock on the fee split)
- [ ] Should renters be able to add a "tip" for exceptional listers? (unusual for equipment rental, but common in service P2P)
