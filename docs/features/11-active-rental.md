# Feature: Active Rental

**Personas:** Renter (P1/P2), Dual User (P5)  
**Trigger:** Pickup confirmed by both parties  
**Depends on:** 10-pickup-inspection  
**Blocks:** 12-return-confirmation

---

## Goal

Minimal platform involvement during the rental period. The renter has the gear, they're in the field. The platform's job is to stay out of the way unless something goes wrong, and to ensure the renter knows exactly when and how to return.

---

## Pre-conditions

- Pickup has been confirmed by both renter and lister
- Rental is in "Active" state

---

## Active State — What Both Parties See

### Renter's active booking view
- Gear name and photo
- Rental status: **ACTIVE** (green badge)
- Return date and time (countdown: "Returns in 2 days, 14 hours")
- Lister name + phone number (revealed at booking)
- "Message [Lister]" → opens thread (09)
- "Request extension" → extension flow (see below)
- "Return early" → early return flow (see below)
- "I have an emergency" → support contact

### Lister's active booking view
- Renter name + photo
- Gear name
- Return date countdown
- "Message [Renter]" → opens thread

---

## Extension Request Flow

Renter needs more time than originally booked.

### Happy path
1. Renter taps "Request extension"
2. Renter selects new return date (calendar — can only extend, not shorten)
3. Extension cost calculated: additional days × daily rate + prorated protection plan
4. Renter submits request → lister notified
5. Lister approves or declines:
   - **Approve:** Extension cost charged to renter's card on file; return date updated for both parties
   - **Decline:** Renter notified; original return date stands; lister may message reason
6. If lister doesn't respond within 12 hours: extension auto-declined (lister may have a subsequent booking)

### Edge cases
- Extension conflicts with a subsequent booking for the same gear → extension declined automatically; lister notified
- Renter requests extension during a dispute → blocked until dispute resolves

---

## Early Return Flow

Renter finishes the hunt early and wants to return gear before the booked return date.

### Happy path
1. Renter taps "Return early"
2. Select new return date/time
3. Early return policy shown:
   - Refund for unused full days (suggest: refund 80% of remaining days; lister keeps 20% as availability cost)
4. Renter confirms → lister notified
5. Both parties coordinate via messaging to agree on new return time
6. Return proceeds via 12-return-confirmation flow

---

## Emergency / Support

- "I have an emergency" → shows Kitlo support contact + escalation instructions
- Use cases: gear failure in field, safety emergency, renter theft/loss
- Platform does not provide gear support (we don't know their scope model's quirks) but connects them with lister and admin
- Gear theft/loss during rental: advise renter to file police report; Kitlo initiates insurance claim process (Thimble); deposit applied first

---

## Notifications During Active Rental

| Event | Renter | Lister |
|---|---|---|
| Rental begins (pickup confirmed) | ✅ Push + email | ✅ Push + email |
| 48h before return date | ✅ Push | ✅ Push |
| 24h before return date | ✅ Push + email | ✅ Push + email |
| Extension approved | ✅ Push + email | — |
| Extension declined | ✅ Push | — |
| Early return confirmed | ✅ Push | ✅ Push |
| Return date passes with no confirmation | ✅ Push + email + escalation | ✅ Push + email |

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Renter loses the gear in the field | Renter contacts support immediately. Police report advised. Deposit applied. Insurance claim via Thimble for remainder. Full deposit is not sufficient for most items — renter remains liable for difference if not covered. |
| Gear malfunctions in the field | Not Kitlo's liability. Renter should contact lister via messaging. If gear was materially non-functional from the start, that's a condition dispute (should have been caught at pickup). |
| Renter is in a location with no cell service for the return | Renter should flag this pre-trip in the message thread. Both parties can pre-arrange return confirmation offline. |
| Return date falls on a federal holiday | No special handling — platform operates normally. |
| Renter extends and then wants to return early again | Allowed. Apply the same early return refund logic on the extended period. |
| Lister stops responding during active rental | Renter can reach out to support. Lister is expected to be reachable during active bookings. |

---

## UI Notes

- Active rental screen is the "home" for the renter during the booking period — accessible from the bookings tab
- Keep it minimal: gear photo, status badge, return countdown, two primary actions (message, request extension)
- Return countdown uses a large, prominent display — hunters plan around it
- Do not surface upsell or other listings during an active rental — this is a tool, not a marketing surface
- "I have an emergency" should be easy to find but not so prominent it causes unnecessary support volume

---

## Open Questions

- [ ] Early return refund rate — 80% of remaining days returned to renter? This needs a policy decision.
- [ ] Should extensions be capped? (e.g., maximum 2 extensions per booking, max 30-day total rental)
- [ ] Do we charge lister a deposit for insurance during extensions, or is the original protection plan extended automatically?
