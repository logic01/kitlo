# Feature: Notifications

**Personas:** All (P1–P5)  
**Trigger:** Platform events across all workflows  
**Depends on:** All features (cross-cutting)  
**Blocks:** None (but is a dependency of nearly every other feature's communication layer)

---

## Goal

Reach users at the right moment with the minimum words needed. Hunters are in the field — push notifications need to be glanceable. Emails are for confirmation and record-keeping. Don't send both for the same thing unless it matters enough for both.

---

## Channels

| Channel | Use case |
|---|---|
| Push notification | Time-sensitive events requiring action or awareness |
| Email | Confirmations, receipts, summaries, anything the user might want to reference later |
| In-app banner | Persistent reminders for things requiring action (review prompt, dispute status) |
| SMS | Phase 2 only — reserved for critical escalations (missed return, admin contact) |

---

## Notification Inventory

### 01 — Registration & Onboarding

| Event | Renter | Lister | Channel |
|---|---|---|---|
| Email verification sent | ✅ Email with verify link | — | Email |
| Lister onboarding complete | — | ✅ "You're approved to list" | Push + Email |
| Lister onboarding stalled (48h incomplete) | — | ✅ "Finish setting up your listing" | Push + Email |

---

### 03/04 — Listings

| Event | Lister | Channel |
|---|---|---|
| Listing published | ✅ "Your [Gear Name] is live" | Push + Email |
| Listing pending admin review | ✅ "Your listing is under review — 24h" | Email |
| Admin review approved | ✅ "Your listing is live" | Push + Email |
| Admin review rejected | ✅ "Your listing needs changes" + reason | Email |
| Listing paused by admin (flagged) | ✅ "Your listing has been paused" | Email |

---

### 07/08 — Booking Request & Payment

| Event | Renter | Lister | Channel |
|---|---|---|---|
| Booking confirmed (payment processed) | ✅ Receipt + booking details | ✅ "New booking" | Push + Email |
| Booking request declined (Phase 2) | ✅ "Request declined" | — | Push |
| Booking payment failed | ✅ "Payment failed — retry" | — | Push + Email |

---

### 09 — Messaging

| Event | Recipient | Channel |
|---|---|---|
| New message received | ✅ | Push; Email if unread for 15+ min |
| Lister hasn't responded in 24h | Renter + Lister | Push (to lister: reminder to respond) |

---

### 10 — Pickup Inspection

| Event | Renter | Lister | Channel |
|---|---|---|---|
| Pickup day (7:00am local) | ✅ "Pickup today" + address | ✅ "Handoff today" + renter name | Push + Email |
| Pickup confirmed by renter | — | ✅ "Renter confirmed pickup" | Push |
| Pickup confirmed by lister | ✅ "Lister confirmed handoff — rental active" | — | Push |
| Condition flag filed by renter | — | ✅ "Renter flagged a condition issue" | Push + Email |
| No-show filed (renter or lister) | Counterparty | Admin | Push + Email |
| 2h reminder (only one party confirmed) | Non-confirming party | — | Push |

---

### 11 — Active Rental

| Event | Renter | Lister | Channel |
|---|---|---|---|
| 48h before return | ✅ "Return in 2 days" | ✅ "Return in 2 days" | Push |
| 24h before return | ✅ "Return tomorrow" + address | ✅ "Return tomorrow" | Push + Email |
| Extension request submitted | — | ✅ "Extension request — respond within 12h" | Push + Email |
| Extension approved | ✅ "Extension approved — new return date" | — | Push + Email |
| Extension declined | ✅ "Extension declined — original return date stands" | — | Push |
| Extension auto-declined (conflict) | ✅ "Extension not available — gear booked" | — | Push |
| Early return submitted | — | ✅ "Renter is returning early — coordinate pickup" | Push |

---

### 12 — Return Confirmation

| Event | Renter | Lister | Channel |
|---|---|---|---|
| Return day (7:00am local) | ✅ "Return today" + address | ✅ "[Renter] returning today" | Push + Email |
| Renter confirmed return | — | ✅ "Renter says gear is returned — confirm in app" | Push |
| Lister confirmed return (clean) | ✅ "Return confirmed — deposit released" | — | Push + Email |
| Lister filed damage claim | ✅ "Damage claim filed on your rental" | — | Push + Email |
| Deposit released | ✅ "Your $150 deposit hold has been released" | — | Push + Email |
| Payout queued | — | ✅ "Payout of $X queued — releases [date]" | Push + Email |
| 24h reminder (one party hasn't confirmed) | Non-confirming party | — | Push |
| Late return (2h nudge) | ✅ "Your return was due 2h ago" | — | Push |
| Late return (4h — fee applied) | ✅ "Late fee applied: $X" | ✅ "Renter is 4h late — late fee applied" | Push + Email |
| Late return (24h — escalation) | ✅ "Gear overdue — escalated to support" | ✅ "Gear not returned after 24h — support notified" | Push + Email |

---

### 13 — Ratings & Reviews

| Event | Renter | Lister | Channel |
|---|---|---|---|
| Review prompt (booking closed) | ✅ "How was [Gear Name]?" | ✅ "How was [Renter]?" | Push + Email |
| Review window closing soon (2 days left) | ✅ Reminder if not submitted | ✅ Reminder if not submitted | Push |
| Reviews revealed | ✅ "See what [Jake R.] wrote" | ✅ "See what [Marcus] wrote" | Push + Email |

---

### 14 — Dispute Resolution

| Event | Renter | Lister | Admin | Channel |
|---|---|---|---|---|
| Dispute opened | ✅ "Damage claim filed" | — | ✅ Alert | Push + Email |
| Renter response submitted | — | ✅ "Renter responded to your claim" | ✅ | Push |
| 72h response window closing | Non-responding party | — | — | Push + Email |
| Admin ruling issued | ✅ | ✅ | — | Push + Email |

---

### 15 — Payouts

| Event | Lister | Channel |
|---|---|---|
| Payout initiated | ✅ "Payout of $X is on the way" | Push + Email |
| Payout landed in bank | ✅ "Payout of $X deposited" | Email |
| Payout failed | ✅ "Payout failed — update bank info" | Push + Email |
| Dispute window cleared (no dispute) | ✅ "Payout of $X releasing now" | Push |

---

## Notification Preferences

Users can configure per-channel preferences in account settings:

- **Push notifications:** All / Important only / Off
- **Email notifications:** All / Receipts + summaries only / Off
- Important always-on (cannot be disabled): payment receipts, dispute alerts, identity verification results

Default: Push = All, Email = All. Users tend not to change defaults, so defaults should be reasonable — not spam.

---

## Push Notification Copy Guidelines

- **Lead with action or context, not platform name.** Not "Kitlo: New message" — just "New message from Jake R."
- **Never truncate the critical word.** "Your $150 dep..." is worse than no notification. Keep under 60 chars for body.
- **Use names.** "Jake R. confirmed return" > "Your return has been confirmed."
- **One call to action per notification.** "Tap to confirm" or "Tap to review" — not "Tap to see details and confirm your return and check your payout."

---

## Email Guidelines

- **Subject line = the outcome, not the process.** "Booking confirmed — ATN Thor 4, Apr 18–23" not "Your booking request has been processed."
- **First line visible in inbox = the number that matters.** Booking: total charge. Payout: payout amount. Receipt: booking reference.
- **Plain-text fallback required.** Some hunters check email on old phones or low-bandwidth connections.
- **Transactional, not marketing.** No upsell, no "while you're here," no social sharing prompts in transactional emails.

---

### 21 — Cancellation

| Event | Renter | Lister | Channel |
|---|---|---|---|
| Renter cancels booking (7+ days out) | ✅ "Booking cancelled — full refund" | ✅ "[Renter] cancelled [dates] — now available" | Push + Email |
| Renter cancels booking (48h–7 days out) | ✅ "Booking cancelled — 50% refund" | ✅ "[Renter] cancelled — dates now open" | Push + Email |
| Renter cancels booking (< 48h out) | ✅ "Booking cancelled — no refund" | ✅ "[Renter] cancelled last minute" | Push + Email |
| Lister cancels booking | ✅ "Lister cancelled — full refund + credit" | ✅ "Your cancellation has been processed" | Push + Email |
| Mutual cancellation requested | Non-initiating party | — | Push |
| Mutual cancellation confirmed | ✅ "Booking cancelled — full refund" | ✅ "Booking cancelled — no penalty" | Push + Email |
| Refund processed | ✅ "Refund of $X is on the way" | — | Email |

---

### 22 — Bundle Listing

| Event | Lister | Channel |
|---|---|---|
| Bundle listing published | ✅ "Your [Bundle Name] is live" | Push + Email |
| Bundle booked | ✅ "New bundle booking" + renter name | Push + Email |
| Bundle availability conflict (individual item booked first) | ✅ "[Gear Name] just booked — bundle unavailable for those dates" | Push |

---

## Do Not Notify

Things that should NOT generate a notification:

- Listing views (vanity metric, no action required)
- Search result appearances
- Price changes on a listing (renter is already booked; future renters see current prices)
- Admin reviewing a listing (lister is notified on outcome, not on every admin action)
- Routine system status (maintenance windows, etc.) — only notify if it affects a current booking

---

## Edge Cases

| Scenario | Handling |
|---|---|
| User has push disabled on their device | Fall back to email for time-sensitive events; in-app banner on next open |
| User's email bounces | Flag account; prompt to update email on next login |
| Notification sent but user is mid-booking on that item | Don't interrupt active flow — queue notification for after session |
| Multiple rapid events (e.g., renter confirms + lister confirms within 5 minutes) | Batch into a single notification if both events are the same nature |
| Notification about a dispute the user already resolved | Suppress if booking is in Completed state at send time |

---

## Technical Notes

- Push: Firebase Cloud Messaging (FCM) for both iOS and Android in Phase 1
- Email: Resend or Postmark for transactional delivery (high deliverability, not marketing ESPs)
- All notifications linked back to specific booking or listing — no orphaned notifications
- Notification log stored per user (accessible in account settings: "Notification history")
- 7:00am local time for morning-of notifications requires storing user timezone (captured during account setup)

---

## Open Questions

- [ ] Should we support SMS in Phase 1? Hunters in remote areas may have push unreliable and email slow. Twilio is straightforward to add.
- [ ] Notification batching: if a user gets 3 events in 10 minutes (message, extension approved, payout queued), do we send 3 pushes or one summary?
- [ ] Quiet hours: should we suppress non-urgent push notifications between 10pm–7am local? (Users in different time zones — if lister is in TX and renter is in MN, whose timezone governs?)
