# Feature: Payouts & Earnings

**Personas:** Lister (P3/P4), Dual User (P5)  
**Trigger:** Return confirmed, 48-hour dispute window clears  
**Depends on:** 12-return-confirmation, 14-dispute-resolution (if dispute filed)  
**Blocks:** None

---

## Goal

Listers need to know exactly when their money arrives and why the math works out the way it does. Trust breaks down when earnings feel arbitrary. Every deduction is visible, every payout is traceable.

---

## Pre-conditions

- Booking is in "Completed" state
- No open dispute (or dispute has resolved)
- 48-hour dispute window has passed
- Lister's Stripe Connect account is active and bank connected (02-lister-onboarding)

---

## Payout Calculation

### Earnings formula

```
Lister payout = Rental charge
              - Platform service fee (%)
              - Protection plan cost
              + Late fees (if applicable)
              - Any damage-related deductions (if dispute ruled against lister)
```

### Fee structure (Phase 1 — see `docs/business-plan.md` for phased rollout)

| Line item | Rate | Direction |
|---|---|---|
| Rental charge | Set by lister (daily rate × days) | + to lister |
| Lister payout fee | 5% of rental charge | − from lister |
| Protection plan | $X/day (varies by MSRP tier) | pass-through (no Kitlo margin in Phase 1) |
| Late fee income | 150% of daily rate per late day | + to lister (100% to lister) |

**Example payout (5-day rental, $135/day thermal scope):**

```
Rental charge:           $675.00
Lister payout fee (5%):  −$33.75
Protection plan:         −$45.00 ($9/day × 5 days, pass-through)
─────────────────────────────────
Lister payout:           $596.25
```

Renter paid $753.75 total: rental ($675) + 5% renter service fee ($33.75) + protection ($45). The split fee model means each side sees a small percentage rather than one party absorbing the full take rate. Total Kitlo take in Phase 1 = renter fee + lister fee = 10% of rental.

---

## Payout Timing

### Standard timeline

```
Return confirmed by both parties
        ↓
48-hour dispute window begins
        ↓
No dispute filed within 48h:
        ↓
Payout initiated to Stripe Connect
        ↓
Stripe Connect → bank account: 2 business days (standard)
        ↓
Total from confirmation to bank: ~2–3 business days
```

### Dispute holds payout

If a dispute is filed within 48 hours of return confirmation:
- Payout held until dispute resolves
- After resolution: payout released (or adjusted if damage found) within 24 hours of admin ruling

### First-time payout delay

Stripe may hold first payout for new Connect accounts for 7–14 days as a fraud prevention measure. Listers are informed of this at onboarding (02). After first payout, standard timeline applies.

---

## Lister Earnings Dashboard

### Overview panel

- **Total earned (all time):** $X,XXX.XX
- **Pending (in dispute window or dispute):** $XXX.XX
- **Next payout:** $XXX.XX — releases [date]
- **YTD earnings:** $X,XXX.XX (useful for tax reporting)

### Payout history table

| Booking | Gear | Rental dates | Gross | Deductions | Net payout | Status |
|---|---|---|---|---|---|---|
| KTL-2026-00847 | ATN Thor 4 640 | Apr 18–23 | $675 | −$126 | $549 | Paid Apr 26 |
| KTL-2026-00831 | ... | ... | ... | ... | ... | ... |

Each row is expandable — taps to show full fee breakdown.

### Per-listing performance

- Total rentals for this listing
- Total earned from this listing
- Average daily rate achieved
- Occupancy rate (days booked / days available in last 90 days)
- Average review rating

This data helps Brad (P4) optimize his listing prices and availability windows.

---

## Tax Reporting

### 1099-K threshold

Listers earning over $600/year via Stripe Connect will receive a 1099-K. Stripe handles this automatically for connected accounts.

- Listers are informed of this at onboarding (02)
- Dashboard shows YTD earnings with a note: "You may receive a 1099-K from Stripe if earnings exceed $600 this year"
- Kitlo does not provide tax advice — link to Stripe's tax documentation

### W-9 requirement

Stripe requires W-9 (SSN or EIN) for listers who cross the 1099-K threshold. This is collected by Stripe at onboarding — not by Kitlo.

---

## Stripe Connect Architecture

### Account type

**Standard Connect** for Phase 1:
- Lister has a full Stripe account (they log into Stripe directly)
- Stripe handles KYC, bank verification, tax forms
- Kitlo is not the merchant of record for lister payouts — Stripe is
- Less Kitlo liability for payout compliance

**Express Connect** as Phase 2 alternative:
- Lighter onboarding (no full Stripe account required)
- Kitlo controls the UI more tightly
- More work to implement; more liability for compliance

### Escrow flow

1. Renter pays rental charge + service fee → Stripe charges to renter's card
2. Funds held in Stripe escrow (platform account) — not in lister's Stripe account yet
3. Return confirmed + dispute window clears → Stripe transfer to lister's Connect account
4. Lister's Connect account → their bank account (2 business days)

Deposit hold is separate: authorized against renter's card, cancelled at return confirmation (or applied to damage claim).

---

## Power Lister Features (P4 — Brad)

Brad runs multiple listings across several gear categories and needs aggregate reporting.

- **Multi-listing earnings view:** Filter by listing; see earnings per listing side-by-side
- **CSV export:** Download full payout history for accounting
- **Upcoming payouts:** Calendar view of pending payouts by expected release date
- **Occupancy report:** Which weeks/months is his gear sitting idle?
- **Late fee tracking:** How often are renters late? Late fee income by listing.

These views are in the lister dashboard, visible only when the account has 3+ listings.

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Payout fails (bank account closed or invalid) | Stripe notifies lister and Kitlo. Lister must update bank info in Stripe Connect. Payout retried after update. |
| Lister closes Stripe Connect account before payout | Payout held. Kitlo admin contacts lister to resolve. Funds not forfeited — held in Kitlo's Stripe escrow. |
| Lister disputes payout amount | Lister contacts support. Admin reviews fee breakdown. If calculation error, corrected and reissued. |
| Rental charge was $0 (test booking / admin booking) | No payout initiated. Filtered from earnings dashboard. |
| Damage deduction exceeds payout amount | Payout zeroed; no negative payout to lister. Excess damage recovery is a separate admin process. |
| Late fee applied; renter's card declines | Late fee charged separately after rental charge. If card declines, admin escalates. Late fees are not deducted from deposit unless admin rules otherwise. |
| Currency (non-USD renters) | Phase 1: USD only. Stripe handles conversion if renter's card is non-USD — renter's bank applies exchange rate. |

---

## Trust & Safety

- Kitlo never holds lister funds longer than necessary — the 48-hour dispute window is the only delay, and it's disclosed upfront
- All fee deductions are shown before the lister publishes a listing (03) and shown again on the payout receipt
- Stripe Connect means lister funds are in Stripe's regulated infrastructure — Kitlo cannot misappropriate them
- Listers are not paid until the renter confirms return — this is the primary protection against lister abandonment post-pickup

---

## UI Notes

- Earnings dashboard accessible from lister profile menu: "My Earnings"
- Show "Next payout" prominently at the top — this is the number listers care about most
- Deduction line items use red color only for negative amounts — not for the service fee (it's expected; red makes it feel punitive)
- "Why was I charged a protection plan fee?" → tooltip with one-sentence explanation
- Mobile: earnings overview is a scrollable card stack; payout history below it
- Empty state (new lister, no payouts yet): "Your first payout will appear here after your first confirmed return."

---

## Open Questions

- [x] Platform service fee split. **Resolved: 5% renter + 5% lister = 10% total in Phase 1.** See `docs/business-plan.md` §4.
- [x] Late fee revenue. **Resolved: 100% to lister in Phase 1.** Lister incurs the inconvenience; Kitlo earns nothing on late fees.
- [ ] Instant payouts: should listers be able to pay a fee (e.g., 1%) to get same-day payout instead of 2 business days? Stripe supports this.
- [ ] Earnings dashboard: should we show a "rental income vs. gear cost" payoff calculator? (Helps Marcus-type listers understand ROI of listing their gear)
