# Feature: Pre-Pickup Messaging

**Personas:** Renter (P1/P2), Lister (P3/P4), Dual User (P5)  
**Trigger:** Booking confirmed — messaging thread unlocks for both parties  
**Depends on:** 08-payment-checkout  
**Blocks:** 10-pickup-inspection (pickup can only succeed if logistics are coordinated)

---

## Goal

Allow renter and lister to coordinate pickup logistics, ask gear questions, and build the peer trust that makes handoff smooth — all within the platform, where messages are on record for dispute purposes.

---

## Pre-conditions

- Booking is confirmed (payment processed)
- Both parties have verified accounts

---

## Happy Path

### Thread creation

When booking is confirmed, a message thread is automatically created between renter and lister. Both parties receive a notification (push + email) with a link to the thread.

**First message is auto-sent from the system on behalf of the lister:**
> "Booking confirmed for [Gear Name], [Pickup Date]. I'll share exact pickup details here. Feel free to ask any questions."

This is a template — listers can customize their default message in their account settings.

### Conversation flow

- Both parties can send text messages
- Both parties can send photos (useful for documenting condition questions pre-pickup)
- Read receipts shown (delivered / read)
- Notification on new message: push notification + email fallback if app not open within 15 minutes

### Common pre-pickup exchanges
- Lister confirms exact address: "Meet me at [address] — gate code is 1234."
- Renter asks about zeroing: "Is the scope zeroed? What range?"
- Lister shares gear tips: "The battery door is a little stiff — just firm pressure."
- Renter adjusts pickup time: "Can we move to 7am instead of 8am?"

### Pickup time change requests
- Either party can suggest a new pickup time via messaging
- No formal flow for this in Phase 1 — handled conversationally in the thread
- If pickup date itself needs to change → formal modification request (Phase 2 feature)

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Lister is non-responsive for 24+ hours after booking | Platform sends lister a reminder push + email. After 48h non-response, renter can escalate to support. |
| Renter attempts to arrange off-platform transaction (e.g., "just Venmo me and skip the app") | Platform cannot prevent this. In-app banner: "Keeping communication on Kitlo protects both of you in a dispute." Off-platform transactions forfeit dispute protection. |
| Harassment or inappropriate content | "Report message" available on each message. Flagged messages reviewed by admin. |
| Cancellation request initiated through message | Redirect: "To cancel, use the [Cancel Booking] button in your booking details — this thread is for logistics only." |
| Renter asks a question about gear that isn't listed | Lister responsible for answering accurately. If answer contradicts listing, renter can use the message as evidence in a dispute. |
| Either party is using a language other than English | No translation in Phase 1. Note for Phase 2. |

---

## Trust & Safety

- All messages stored permanently and are retrievable by Kitlo admin in a dispute
- Message content is the primary evidence layer in condition disputes — renters should document any pre-pickup concerns in writing here
- No personal contact information shared by platform — phone/address revealed only after booking confirmation, not through the message thread
- Platform messages (system notifications) are visually distinct from human messages

---

## UI Notes

- Thread UI: standard chat interface, messages in alternating alignment (renter right, lister left)
- System messages displayed as centered, gray banners (not chat bubbles)
- Photo attachment: tap photo icon, select from camera roll or take new photo — max 5MB, JPG/PNG only
- Unread message count shown on the "Messages" tab in nav and as a badge on the booking card
- Thread is accessible from: booking detail page, Messages tab in nav
- Archive thread after booking is fully closed (both parties rated) — accessible in booking history but not in primary inbox
- Mobile: thread is full-screen, keyboard-aware

---

## Open Questions

- [ ] Should we build in a "Suggested responses" feature for common messages? (reduces lister response time for P4/Brad)
- [ ] Response time SLA enforcement — do we penalize listers who take > 24h to respond to a booking message?
- [ ] Can renters message before booking (to ask questions)? (adds friction but reduces bad bookings — Fat Llama allows this; Airbnb does too)
