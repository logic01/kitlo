# Feature: Payment & Checkout

**Personas:** First-Time Renter (P1), Repeat Renter (P2), Dual User (P5)  
**Trigger:** Renter clicks "Continue to payment" on booking request screen  
**Depends on:** 07-booking-request  
**Blocks:** 09-pre-pickup-messaging (booking must be confirmed before messaging unlocks)

---

## Goal

Collect payment with zero confusion about what is being charged, what is being held, and when each amount moves. PCI-compliant via Stripe. Booking confirmed within seconds.

---

## Pre-conditions

- Booking request summary reviewed and accepted
- Renter is authenticated
- Listing still available for the selected dates (re-validated at payment submission)

---

## Happy Path

### Step 1 — Payment entry

**What Stripe collects:**
- Card number, expiry, CVC
- Billing ZIP (for AVS fraud check)

Stripe Elements embedded — Kitlo never touches raw card data.

**Saved cards (returning renters, P2):**
- "Pay with saved card ending in 4242" — one-tap checkout
- Option to add a new card
- Card saved by default (checkbox, pre-checked) — can uncheck

**Order summary (repeated from booking request — no surprises):**
```
Rental charge (charged now):
  $675.00 + $81.00 fee + $45.00 protection = $801.00

Deposit hold (authorized, not charged):
  $150.00 — released when gear is returned
```

**CTA:** "Confirm booking — charge $801.00"

The button states the exact charge amount. No ambiguity.

### Step 2 — Payment processing

- Stripe processes:
  1. Charges $801.00 to card (rental + fees + protection plan)
  2. Authorizes $150.00 hold on same card (deposit)
- Funds from rental charge held in Stripe escrow — not released to lister until pickup confirmed
- If either transaction fails → see edge cases

### Step 3 — Confirmation screen

**Shown immediately on success:**
- Booking reference number (Roboto Mono, e.g., `KTL-2026-00847`)
- Gear name and dates
- Lister name + contact info now revealed (first name + phone number)
- Pickup location: full address now shown
- "Add to calendar" button (generates .ics)
- "Message [Jake R.]" — opens messaging thread (→ 09-pre-pickup-messaging)

**Sent simultaneously:**
- Renter: confirmation email with all booking details + receipt
- Lister: "New booking" notification with renter name, dates, message (if any)

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Card declined | Show Stripe's decline reason ("Insufficient funds", "Card declined") — allow retry with different card |
| Rental charge succeeds but deposit hold fails | Cancel entire transaction, refund rental charge, prompt renter to use a card with sufficient available credit |
| Listing becomes unavailable between booking request and payment | Detect at payment submission. Refund if charge went through. "Sorry — this gear was just booked by someone else. You have not been charged." |
| Network failure after charge but before confirmation screen | Idempotency key on Stripe request prevents double-charge; show confirmation on retry |
| Renter's card has a low credit limit that can't accommodate both charge + hold | Inform upfront on booking request screen: "You'll need [total + deposit] available on your card." |
| 3D Secure (bank authentication required) | Stripe handles redirect/modal natively; booking pending until 3DS confirmed |
| Renter closes browser after payment but before seeing confirmation | Confirmation email is the source of truth; dashboard shows confirmed booking on next login |

---

## Trust & Safety

- Rental charge goes to Stripe escrow — lister cannot receive it until pickup is confirmed by renter
- Deposit hold is a card authorization, not a charge — it shows on the renter's statement as "pending" and disappears when released
- Kitlo does not store card numbers — Stripe handles all PCI compliance
- All transactions logged with Stripe payment intent ID for dispute resolution
- Receipt email sent to renter regardless of confirmation screen state (email is the fallback)

---

## UI Notes

- Button text must include the dollar amount: "Confirm booking — charge $801.00" — not just "Confirm"
- Deposit hold explained inline with a tooltip: "What's a deposit hold?" → one-sentence explanation
- Do not use the word "escrow" on this screen — too technical. Say "we hold your payment until the lister confirms pickup."
- Stripe Elements should be styled to match Kitlo brand (Bone White bg, Slate border, DM Sans font) — Stripe allows custom styling via their Appearance API
- Mobile: full-screen checkout, no distractions. Keyboard-aware so card entry doesn't hide below keyboard.
- After payment: do not immediately redirect — show the confirmation in-place first, let the renter read it.

---

## Open Questions

- [ ] Do we support Apple Pay / Google Pay on mobile? (Stripe supports both natively — high-impact for conversion)
- [ ] Should the deposit hold be on the same card as the rental charge, or allow a different card? (simpler to require same card)
- [ ] What is the dispute window before deposit is auto-released if no dispute is filed? (suggest 48h after confirmed return)
