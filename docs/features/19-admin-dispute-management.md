# Feature: Admin — Dispute Management

**Personas:** Admin  
**Trigger:** Dispute opened (via 10-pickup-inspection or 12-return-confirmation)  
**Depends on:** 14-dispute-resolution  
**Blocks:** 13-ratings-reviews, 15-payouts-earnings (both held until dispute resolves)

---

## Goal

Give admin the tools to resolve disputes accurately and quickly. Every dollar of every held payout is a lister waiting on their earnings. Every held deposit is a renter watching a charge they can't use. Disputes should close within 72 hours. The tools must make this possible.

---

## Pre-conditions

- Dispute has been opened by one party (10 or 12)
- Booking is in Dispute state
- Admin has been alerted (15-minute SLA for initial review)

---

## Admin Dispute Queue

### Queue view

Disputes are sorted by:
1. **Type priority:** Late return (most time-sensitive) → Damage claim → Pre-rental condition
2. **Age:** Oldest first within each type
3. **SLA breach flag:** Red badge if approaching 72h without ruling

Queue columns:
- Booking reference
- Dispute type
- Gear name + MSRP
- Amounts at stake (deposit held, payout held)
- Both party names
- Filed at timestamp
- Renter response status (responded / pending / window open)
- SLA countdown

---

## Dispute Detail View

### Layout

Full-width split view:

**Left panel — Evidence**
- Photo comparison: pickup photos (left column) vs. return photos (right column), synced scroll
- Photos are labeled by who submitted them and timestamp
- Listing photos (at time of publish) shown below as baseline
- Message thread viewer: full booking message history, searchable
- Booking timeline: every state transition with timestamp (confirmed → pickup confirmed → active → return filed → dispute opened)

**Right panel — Admin actions + context**
- Dispute summary (type, amounts, both party statements)
- Renter's statement + any counter-photos
- Lister's claim + damage photos
- Admin notes field (internal, never shown to parties)
- Ruling form (see below)

---

## Admin Ruling Form

### Ruling options

**For damage disputes:**

1. **Damage confirmed — renter responsible**
   - Required: damage description field (for notification to both parties)
   - Required: deposit allocation amount (up to full deposit)
   - If damage exceeds deposit: additional charge amount (charged to renter card on file)
   - System preview: "Lister receives $X from deposit. Renter charged additional $X (if any). Payout of $X released."

2. **Damage confirmed — pre-existing / not renter's fault**
   - Deposit released to renter
   - Payout released to lister (full, no deduction)
   - Optional: flag for lister to update condition rating

3. **Partial liability**
   - Deposit split: $X to lister, remainder released to renter
   - Payout released to lister

4. **Claim dismissed (fraudulent or unsupported)**
   - Deposit released to renter
   - Payout released to lister
   - Lister warning issued automatically
   - Repeat fraudulent claims → escalate to account suspension

**For pre-rental condition disputes:**
- Rental proceeds (with logged condition note) OR
- Rental cancelled (full refund to renter, warning to lister)

**For late return disputes:**
- Late fees confirmed + deposit allocation
- Police report recommended (auto-generates a template for the admin to send)

### Ruling submission

- Admin must enter plain-language explanation (required, shown to both parties)
- No checkbox-only rulings — every ruling gets a written reason
- Confirm button triggers: Stripe disbursement actions, notifications to both parties, booking state update to Completed, review unlock

---

## Communication Tools

Admin can send messages directly to either party through the dispute interface:

- "Message renter" → sends in-app message from "Kitlo Support" in the booking thread
- "Message lister" → same
- Messages are logged to the dispute record (separate from the booking message thread — labeled "Support communication")

Use cases:
- "We need additional photos — can you send two more showing the [specific area]?"
- "We've reviewed your claim. A decision will be made by [time]. Thank you for your patience."
- "Your deposit will be released within 24 hours."

---

## Financial Actions

Admin dispute tools interface directly with Stripe:

| Action | Stripe operation |
|---|---|
| Release deposit to renter | Cancel deposit authorization |
| Apply deposit to lister | Capture deposit authorization, transfer to lister Connect account |
| Release payout to lister | Transfer from escrow to lister Connect account |
| Charge additional damage to renter | Charge saved payment method on file |
| Reverse a payout (admin error) | Stripe Connect reversal — only within 90 days |

All financial actions require a second-admin confirmation for amounts > $500. Audit log captures both admin IDs.

---

## Escalation Paths

### From dispute to account review

If admin identifies during dispute review that the issue is systemic (not a one-time mistake):

- Renter pattern: multiple disputes, late returns, or damage incidents → flag account for 20-admin-user-management review
- Lister pattern: fraudulent damage claims, condition misrepresentation, multiple flags → flag account for suspension review

Escalation is not automatic — admin judgment call. Flag adds a note to the user's account record.

### Legal escalation

- Disputes involving > $10,000 in claims
- Suspected criminal activity (theft, fraud scheme)
- Lister files a police report on an unreturned item

Legal escalation sends an internal alert to senior admin + logs the booking as legally sensitive (all records preserved, not subject to routine data deletion).

---

## SLA Tracking

| SLA target | Threshold | Action on breach |
|---|---|---|
| Initial review | 15 min after dispute opened | Alert to admin on-call |
| Both parties respond | 72h from dispute open | Admin can rule without renter response after this |
| Admin ruling | 72h from both parties' responses | Escalate to senior admin |
| Financial action after ruling | 24h from ruling | Automated Stripe action if not manually triggered |

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Renter and lister both stop responding | Admin can rule unilaterally after 72h response window. Both notified of ruling. |
| New evidence submitted after ruling | Admin can reopen a dispute within 7 days of ruling if new evidence materially changes the case. After 7 days: final. |
| Admin makes a financial error (wrong amount) | Stripe reversal within 90 days. Internal incident logged. Both parties notified of correction. |
| Lister and renter resolve privately before admin rules | Admin receives message "we've resolved this" — admin can close dispute without ruling, releasing all holds. Both parties must confirm. |
| Admin has a conflict of interest (friend of lister) | Admin recuses themselves and reassigns. Currently informal — Phase 2 should formalize recusal. |
| Dispute involves gear that was also insured (Thimble claim) | Dispute resolved first; insurance claim filed after. Insurance doesn't replace the admin dispute process. |

---

## Audit Log

Every admin action on every dispute is logged:

- Admin user ID
- Action type
- Amounts involved
- Written reason entered
- Timestamp
- Stripe transaction IDs for all financial actions

Log is permanent, immutable, exportable for legal/compliance review.

---

## UI Notes (Admin Interface)

- Photo comparison is the centerpiece of the dispute UI — it must be responsive to large images (4K thermal photos), side-by-side layout, lightbox zoom
- Timeline view uses a visual timeline component — not a table. State transitions shown as nodes with connectors.
- Ruling form is a wizard: step 1 = select ruling type, step 2 = fill amounts, step 3 = write explanation, step 4 = preview + confirm
- "Preview ruling notification" button shows exactly what both parties will receive before admin submits
- Financial preview shows exact Stripe operations that will be triggered — no surprises

---

## Open Questions

- [ ] Should there be a structured appeal process for disputed rulings in Phase 2? (Admin ruling is currently final)
- [ ] Two-admin confirmation threshold: $500 is a starting point — adjust based on volume and error rate
- [ ] Should we integrate Stripe's Radar fraud signals into the dispute evidence panel? (Might surface useful signals about renter payment risk)
- [ ] Dispute outcome data: should anonymized aggregate data be published? ("85% of damage disputes resolved within 48 hours") — trust signal for the platform
