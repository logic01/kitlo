# Feature: Pickup & Gear Inspection

**Personas:** Renter (P1/P2), Lister (P3/P4), Dual User (P5)  
**Trigger:** Pickup date arrives  
**Depends on:** 09-pre-pickup-messaging  
**Blocks:** 11-active-rental (rental only begins when pickup is confirmed)

---

## Goal

This is the highest-trust moment in the entire rental lifecycle. Both parties meet, the renter inspects the gear, and both confirm the handoff in the app. Funds move only after this step. Disputes filed here are pre-rental and result in cancellation, not damage claims.

---

## Pre-conditions

- Booking is confirmed and payment is held in escrow
- Pickup date is today (or lister has initiated early pickup)
- Both parties have the app open

---

## Happy Path

### Morning of pickup — Notifications (both parties)

Push notification + email, sent at 7:00am local time on pickup day:
- **Renter:** "Pickup today: [Gear Name] with [Lister Name]. [Address]. Tap to open your booking."
- **Lister:** "Handoff today: [Renter Name] is picking up [Gear Name]. [Time]. Tap to prepare."

### At the meeting

**Physical inspection checklist (shown in app to renter):**
1. Power the unit on and confirm it functions
2. Check optics glass for scratches or dust inside the tube
3. Confirm all accessories listed are present (spec table shown for reference)
4. Check battery charge level
5. Note any wear not shown in listing photos

This checklist is advisory — the renter confirms or disputes, they don't check boxes.

### Renter action — Confirm or dispute

**Option A: Condition matches listing**
- Renter taps "Confirm pickup — gear is as described"
- Confirmation modal: "Once you confirm, your rental has started and the payment will be released to [Jake R.] at the end of your rental. Inspect carefully before confirming."
- Renter confirms → rental state begins

**Option B: Condition does not match listing**
- Renter taps "Flag a condition issue"
- Prompted to: describe the issue (text) + attach photos (required — min 1 photo)
- Issue submitted → dispute opened → escrow held → rental does NOT begin
- Both parties notified; Kitlo admin alerted (see 14-dispute-resolution)
- Renter may choose to proceed anyway ("Accept with noted condition") — this is logged but dispute protection is reduced

### Lister action — Confirm handoff

Lister taps "I've handed over the gear to [Renter Name]" — separate confirmation from renter's pickup confirmation.

Both confirmations must complete for rental to officially begin. If only one confirms, system waits 2 hours then sends reminder to the other party.

### Escrow behavior at pickup

- Pickup confirmed by both → rental begins, but escrow NOT released yet
- Escrow releases to lister's payout queue only after return is confirmed (see 12-return-confirmation)
- Deposit hold remains on renter's card through entire rental period

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Renter no-show (lister at location, renter doesn't appear) | Lister taps "Renter did not show up" after 30-minute grace period. Booking cancelled. Renter charged a no-show fee (suggest: 50% of first day rate). Deposit released back to renter. |
| Lister no-show (renter at location, lister doesn't appear) | Renter taps "Lister did not show up" after 30-minute grace period. Full refund to renter. Deposit released. Lister receives warning or suspension. |
| Gear is damaged on pickup inspection (before rental starts) | Renter flags condition issue → dispute opened → rental cancelled → full refund to renter → damage investigated (lister may have damaged it themselves, or it was pre-existing but not disclosed) |
| Gear is missing accessories listed | Renter can flag this as a condition issue, or accept with noted condition (reduced dispute protection) |
| Battery is dead at pickup | Lister should have provided a charged unit. Minor issue — renter can note in messages. If lister refuses to charge it, renter can flag. |
| Renter confirms pickup without actually inspecting | App cannot force inspection. Reminder shown: "Have you powered the unit on and checked the glass?" — one soft gate. After confirming, any damage claims are harder to dispute. |
| Both parties can't agree on time — one arrives early/late | Coordination handled in messaging (09). If lister is significantly late (>30 min), renter can flag. |

---

## Trust & Safety

- Pickup confirmation is the single most important event in the transaction flow — do not rush it with a big green "CONFIRM" button
- Show the inspection checklist prominently before the confirm button
- "Flag condition issue" must be equally visible to "Confirm pickup" — don't bury it
- Photos submitted with a condition flag are stored permanently and cannot be deleted by either party
- Kitlo admin is notified of all condition flags within 15 minutes (SLA target)
- No funds move to the lister until return is confirmed — pickup confirmation only begins the rental state

---

## UI Notes

- Both parties see the same booking screen but different actions are shown based on their role
- Inspection checklist shown as a scrollable card — renter must scroll past it before the confirm button appears (soft friction is intentional)
- "Flag condition issue" is shown as a secondary CTA below confirm — same visual weight, different color (amber vs. slate)
- Gear photos from the listing are shown inline during inspection so the renter can compare to what they're holding
- Lister's "Confirm handoff" screen is simpler — just a single confirmation with the renter's name
- Both confirmations shown in the booking timeline: "Gear picked up — confirmed by both parties [timestamp]"

---

## Open Questions

- [ ] Should there be a photo requirement at pickup even if there's no dispute? (Turo requires photos at every pickup — provides protection for both parties)
- [ ] What is the no-show fee amount and who sets it — platform or lister?
- [ ] Should we support a QR code exchange at pickup to confirm proximity? (prevents remote confirmation fraud)
- [ ] Grace period before a no-show is logged — 30 minutes? Adjustable by lister?
