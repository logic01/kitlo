# Feature: Dispute Resolution

**Personas:** Renter (P1/P2), Lister (P3/P4), Dual User (P5), Admin  
**Trigger:** Condition flag at pickup (10), damage claim at return (12), or late return escalation (12)  
**Depends on:** 10-pickup-inspection, 12-return-confirmation  
**Blocks:** 13-ratings-reviews (reviews unlock only after dispute resolves), 15-payouts-earnings (payout held during dispute)

---

## Goal

Resolve disputes fairly and quickly. The platform is the trusted third party — not a tool for either side to game. Most disputes are honest disagreements about pre-existing condition. A small number are fraudulent. The system must handle both without punishing the majority.

---

## Dispute Types

| Type | Trigger | Deposit status | Payout status |
|---|---|---|---|
| Pre-rental condition dispute | Renter flags condition at pickup (10) | Released to renter | N/A (rental never started) |
| Damage claim | Lister flags damage at return (12) | Held | Held |
| Late return | Return date passes, renter unreachable (12) | Held | Held |
| Cancellation dispute | Renter disputes cancellation policy application | Partial hold | N/A |

---

## Pre-conditions

- Active booking in progress (or just completed)
- One party has filed a claim through the in-app flow

---

## Happy Path — Damage Dispute

Most common dispute type.

### Step 1 — Claim filed (by lister at return)

Lister submits:
- Damage description (required text)
- Return photos showing damage (min 2, required)
- Which items are damaged
- Estimated repair/replacement cost (optional — admin determines final amount)

System immediately:
- Holds deposit
- Holds lister payout
- Notifies renter ("A damage claim has been filed on your recent rental of [Gear Name]. Review the claim.")
- Notifies admin (15-minute SLA for first look)
- Locks the booking (no reviews until resolved)

### Step 2 — Renter response

Renter receives notification and has **72 hours** to respond.

Options:
- **Accept responsibility:** "I caused the damage." → Admin determines payout from deposit; any excess billed to renter's card. Renter can include a statement.
- **Dispute the claim:** Renter provides counter-evidence:
  - Written statement (required)
  - Photos (optional — pickup photos already in system)
  - References to pre-existing condition noted at pickup

### Step 3 — Admin review

Admin reviews:
1. Claim photos (return) vs. pickup photos (if taken) — side-by-side comparison
2. Pre-rental listing photos
3. Pickup inspection message thread (09)
4. Pickup condition flag (if any — logged even if renter "accepted with noted condition")
5. Renter's dispute statement and any counter-photos

Admin has access to the full booking timeline and all messages.

### Step 4 — Admin decision

Admin rules one of:

| Ruling | Deposit | Payout |
|---|---|---|
| **Damage confirmed — renter responsible** | Applied to lister payout up to deposit amount; excess billed to renter | Released after deduction applied |
| **Damage confirmed — pre-existing / not renter's fault** | Released to renter | Released to lister |
| **Damage disputed — partial liability** | Split per admin determination | Released partially |
| **Fraudulent claim (lister fabricated damage)** | Released to renter | Released to lister; lister penalized |

Admin decision is final in Phase 1. Appeal process is a Phase 2 feature.

### Step 5 — Notification and close

Both parties notified of decision with reasoning. Booking closed. Reviews unlock (13).

---

## Pre-Rental Condition Dispute

Triggered when renter flags a condition issue at pickup (10) and does not accept the gear.

### Flow

1. Renter submits condition flag (description + photos)
2. Admin alerted (15-minute SLA)
3. Lister notified — given 2 hours to respond (offer remedy: drive a replacement accessory, meet renter at a different location with the correct gear)
4. If lister remedies the issue → rental proceeds, flag logged
5. If no remedy → booking cancelled:
   - Full refund to renter
   - Deposit released to renter
   - Lister receives a warning (repeated flags → suspension review)

---

## Late Return Escalation Dispute

Triggered when renter has not returned gear 24+ hours past due date (12).

### Flow

1. Admin alerted at 24h mark
2. Admin attempts to contact renter via phone + in-app message
3. Lister notified of escalation
4. If renter reachable: coordinate return, apply late fees
5. If renter unreachable at 72h:
   - Deposit applied to lister's claim
   - Insurance claim initiated via Thimble (see lister onboarding — 02)
   - Police report advised to lister
   - Renter account suspended

---

## Evidence Hierarchy

When admin evaluates a damage dispute, evidence is weighted in this order:

1. **Return photos submitted by lister** (primary — timestamped, in-app)
2. **Pickup photos** (if taken by either party)
3. **Listing photos** (shows condition at time of listing)
4. **Pickup inspection message thread** (any condition notes exchanged)
5. **Condition flag at pickup** (even "accepted with noted condition" is logged)
6. **Written statements** (least objective — considered but not determinative)

The absence of pickup photos does not automatically favor the renter. It's neutral — admin uses what evidence exists.

---

## Admin Tools

Admin dispute interface (19-admin-dispute-management) provides:
- Side-by-side photo comparison (pickup vs. return)
- Full message thread viewer
- Booking timeline (all state transitions with timestamps)
- Evidence log (all uploaded photos, condition flags, statements)
- Dispute ruling form with required reasoning field
- Stripe controls: release deposit, charge renter card, adjust payout
- Communication tools: message both parties, schedule a call

---

## Fraud Detection

Patterns that trigger admin review for fraud:

**Lister-side fraud indicators:**
- Multiple damage claims across bookings
- Claims filed on bookings where renter has strong review history
- Claim photos timestamped outside the return window
- No pickup photos but detailed damage claim (no baseline to compare)

**Renter-side fraud indicators:**
- Pattern of filing pre-rental condition disputes to get free cancellations
- Dispute filed on day 1 of rental, then renter proceeds with gear anyway
- Multiple late returns across accounts (checked by device fingerprint)

Admin flags these patterns and may escalate to platform ban.

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Lister files damage claim on pre-existing damage they disclosed | Renter references the listing description; admin reviews original listing photos. Lister claim likely denied. |
| Renter and lister agree privately to skip the dispute | Admin cannot prevent this, but Kitlo's deposit/payout hold enforces the formal process. Private agreements don't release holds. |
| Damage exceeds deposit amount | Deposit applied first; remainder billed to renter's card on file. If card fails, admin escalates. Thimble insurance may cover remainder depending on policy. |
| Lister loses one photo before submitting claim | Minimum 2 photos required. System enforces this. Lister must take new photos at return — they should not be returning gear without doing so. |
| Admin takes longer than 72h to resolve | Platform SLA: target resolution within 72h of both parties responding. Escalation to senior admin if first admin misses SLA. |
| Dispute involves gear worth more than $5K | Higher scrutiny, mandatory senior admin review. Insurance claim likely required. |
| Renter claims damage was caused by lister after return | No evidence pathway for this. If renter can prove contact after return (message thread), admin considers. Otherwise not accepted. |

---

## Trust & Safety

- The deposit hold is the leverage mechanism — neither party is at financial risk of zero-cost fraud
- Fraudulent lister claims are penalized (lister loses credibility score, potential suspension) — the platform depends on lister trust as much as renter trust
- Admin decisions are logged with full reasoning — patterns are reviewable if a party believes they're being treated unfairly across multiple bookings
- No auto-resolution — every dispute gets a human review in Phase 1. Automation considered for Phase 2 only after pattern data exists.

---

## UI Notes

- Dispute status shown as a banner on the booking detail page: "Dispute in progress — resolution expected within 72 hours"
- Both parties can see the dispute timeline: "Claim filed," "Renter responded," "Under admin review," "Resolved"
- Evidence submitted by either party is shown to the other party (transparency — both see what admin sees)
- Admin decision includes a plain-language explanation, not legal language
- After resolution: booking moves to Completed, dispute archived (still accessible to both parties in booking history)

---

## Open Questions

- [ ] Should we offer mediation (a live call between both parties + admin) before admin rules? (Reduces formal rulings, but scales poorly)
- [ ] What is the lister penalty for a confirmed fraudulent damage claim? (Warning → suspension → ban?)
- [ ] Phase 2: Should renters be able to appeal admin decisions? (Appeals add cost; most platforms don't offer them)
- [ ] Should Kitlo share dispute outcome data in aggregate to show platform fairness? ("70% of disputes resolved in renter's favor" — builds trust or backfires?)
