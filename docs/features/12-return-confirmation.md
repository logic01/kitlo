# Feature: Return Confirmation

**Personas:** Renter (P1/P2), Lister (P3/P4), Dual User (P5)  
**Trigger:** Return date arrives, or renter initiates early return  
**Depends on:** 11-active-rental  
**Blocks:** 13-ratings-reviews, 15-payouts-earnings (both trigger after return confirmed)

---

## Goal

Close the rental loop cleanly. Both parties confirm return, the deposit is released to the renter, and earnings are queued for the lister. If anything is wrong with the gear, this is where disputes begin.

---

## Pre-conditions

- Rental is in Active state
- Return date has arrived (or early return was agreed upon)

---

## Happy Path

### Return day — Notifications

Sent at 7:00am local time on return day:
- **Renter:** "Return today: [Gear Name] due back to [Jake R.] today. [Address]. Confirm return in the app when done."
- **Lister:** "[Renter Name] is returning [Gear Name] today. Inspect on return and confirm in the app."

### Physical return

Renter brings gear to agreed location. Lister inspects:
1. Power the unit on — still functional?
2. Glass — any new scratches or damage?
3. All accessories present?
4. Any obvious physical damage?

### Lister action — Confirm or dispute

**Option A: Gear returned in acceptable condition**
- Lister taps "Return confirmed — gear in good condition"
- Confirmation modal: "Confirming this releases [Renter Name]'s deposit and queues your payout."
- Lister confirms → payout queued (released after dispute window clears — 48 hours)
- Renter's deposit hold released (cancelled authorization on card)

**Option B: Gear returned damaged**
- Lister taps "Gear returned with damage"
- Required: description of damage (text) + photos (min 2 photos required)
- Dispute opened → deposit held → admin notified (see 14-dispute-resolution)
- Neither party can leave a review until dispute resolves

### Renter action — Confirm return

Renter taps "I've returned the gear" — separate from lister's confirmation.

Both confirmations required to fully close the booking. If only one confirms:
- After 24 hours: system sends reminder to the non-confirming party
- After 48 hours: if renter confirms but lister doesn't respond, deposit auto-released and payout queued
- After 48 hours: if lister confirms but renter doesn't respond, rental closed normally (renter's non-response doesn't block payout)

### Post-confirmation

- Booking moves to "Completed" state
- Both parties prompted to leave a review (see 13-ratings-reviews)
- Lister's earnings queued (released after 48-hour dispute window)
- Renter's deposit released (immediate — deposit hold cancelled)

---

## Late Return Handling

If renter does not return gear by the agreed return time:

| Time past due | Action |
|---|---|
| 0–4 hours (grace period) | No automatic action. System nudge sent to renter at 2h mark. |
| 4–24 hours | Late fee applied automatically: 150% of daily rate per additional day. Lister notified. |
| 24+ hours | Escalated to Kitlo support. Lister can flag as "Gear not returned." |
| 72+ hours unreachable | Admin initiates recovery process. Insurance and police report advised. |

Late fees are automatically charged to the renter's card on file.

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Renter returns gear, lister is not present | Renter photographs returned gear in situ, sends photos via message thread. Both can confirm remotely for items left at agreed location. |
| Lister disputes damage that renter claims was pre-existing | Dispute resolution compares: pickup photos (if taken), listing photos, pickup inspection message thread, return photos. See 14-dispute-resolution. |
| Gear is partially damaged (one accessory missing, unit functions fine) | Lister can open a partial damage dispute — deposit held proportionally or in full per admin determination |
| Renter and lister can't agree on return location | Should be resolved in pre-pickup messaging. If it becomes a dispute, admin mediated. |
| Lister claims damage that photos don't support | Admin reviews photos. Fraudulent damage claims result in lister penalty and potential suspension. |
| Renter fails to return for 72+ hours and is unreachable | Police report advised. Deposit applied to lister's claim. Insurance claim initiated for remainder. |
| Gear condition is "battle-scarred" pre-rental — hard to distinguish new damage | Pickup inspection photos (or their absence) are the key evidence. This is why pickup photos are recommended even when there's no immediate dispute. |

---

## Escrow & Payout Timing

```
Return confirmed by both parties
        ↓
48-hour dispute window begins
        ↓
If no dispute filed within 48h:
  - Lister's payout released to bank (via Stripe Connect)
  - Payout = rental fee - platform take rate - protection plan cost
        ↓
If dispute filed within 48h:
  - Payout held until dispute resolves (see 14)
  - Deposit held until dispute resolves
```

---

## Trust & Safety

- Lister's confirmation is the primary trigger — they are the ones inspecting the gear
- Renter's deposit is never released while a dispute is open — it's the leverage for damage claims
- Fraudulent damage claims (lister claiming damage that didn't occur) tracked by admin — repeat fraudulent claims result in removal
- 48-hour dispute window is the only period to file a damage claim — after that, payout is released and deposit cleared

---

## UI Notes

- Same-day return: both parties see a "Return today" banner at the top of their booking view all day
- Lister's confirm screen shows the pickup photos side-by-side with a "take return photo" prompt — visual comparison helps accurate assessment
- Deposit release shown on renter's confirmation screen: "Your $150 deposit hold has been released" — this matters to them
- "Gear returned with damage" must not be visually hidden or de-emphasized — it's critical functionality, not an edge case
- Payout status shown in lister dashboard: "Payout of $X queued — releases [date]"

---

## Open Questions

- [ ] Should we require return photos (even for clean returns) as standard? This adds friction but provides protection.
- [ ] Late fee rate — 150% of daily rate per day? Platform keeps it or passes to lister?
- [ ] 48-hour dispute window — long enough? Short enough? Some platforms use 72h.
- [ ] Auto-confirm after 48h if lister doesn't respond — does this expose Kitlo to fraudulent renters who just don't return the gear?
