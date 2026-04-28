# Feature: Admin — User Management

**Personas:** Admin  
**Trigger:** User report, dispute pattern, verification failure, or policy violation  
**Depends on:** 01-registration-onboarding, 17-identity-verification, 14-dispute-resolution  
**Blocks:** Nothing (but actions here affect every other feature)

---

## Goal

Keep bad actors off the platform without harming good-faith users. Most accounts never get touched by admin. When they do, actions should be proportionate, documented, and reversible where possible.

---

## Pre-conditions

- User account exists
- Admin has a reason to review: user report, automated flag, dispute escalation, or verification anomaly

---

## User Record View

### Account overview panel

Admin can search any user by email, name, booking reference, or phone number.

User record shows:
- Account created date
- Verification status (Stripe Identity result + date)
- Role: renter / lister / both
- Active listings (count, with links)
- Booking history (as renter + as lister)
- Review history (avg rating as renter, avg rating as lister)
- Dispute history (disputes filed against user, disputes filed by user, outcomes)
- Warning history (prior admin actions)
- Flag log (user reports from other members)
- Payout history (listers)
- Stripe account status

### Red flags panel (computed)

Auto-surfaced risk indicators:
- 2+ disputes with renter found at fault in last 12 months
- 2+ late returns in last 6 months
- Multiple flag reports from different users
- Lister: 2+ confirmed fraudulent damage claims
- Lister: Condition accuracy score below 3.0 (based on renter reviews)
- Account age < 30 days with high-value listing

Red flags do not trigger automatic action — they surface context for admin judgment.

---

## Admin Actions

### Warning

Least severe. Used for:
- First-time policy violations
- Minor condition misrepresentation
- Slow response pattern (lister)

Actions:
- Admin writes warning note (required)
- Warning logged to user record (permanent)
- User notified via email: "Your account has received a notice regarding [issue]. Please review our community guidelines."
- Warning does NOT restrict account functionality

### Temporary restriction

Used when behavior needs to stop immediately but account suspension is premature.

Options:
- **Listing pause:** All active listings moved to Paused state. User can still message and complete existing bookings.
- **Booking block:** User cannot initiate new bookings as renter. Existing bookings unaffected.
- **Both:** Listing pause + booking block simultaneously.

Duration: 7 days / 30 days / custom. Admin sets duration or sets it as indefinite pending investigation.

User notified: "Your account has been temporarily restricted. [Reason]. Contact support to discuss."

### Suspension

Full account suspension. Reserved for:
- Confirmed fraud (damage claims, identity fraud)
- Repeated violations after warnings
- Unreachable renter with unreturned gear (72+ hours)

Actions:
- Account access revoked (cannot log in)
- All active listings deactivated immediately
- In-progress bookings: admin manually reviews each — active rentals with gear out are escalated, not auto-cancelled
- Stripe Connect payouts paused (for lister suspensions)
- User notified: "Your account has been suspended. [Reason]. [Appeal instructions]."

Suspension is reversible — admin can unsuspend.

### Permanent ban

Reserved for:
- Fraud causing financial harm to another user
- Criminal activity (theft, identity crime)
- Repeated suspension + return + re-offense pattern
- Harassment or threats to other users or admin

Actions:
- Account permanently deactivated
- Email address + device fingerprint added to ban list (prevents re-registration)
- Any outstanding financial obligations still enforced (debt survives ban)
- User notified: "Your account has been permanently closed. You are not permitted to create new accounts on Kitlo."

Permanent ban requires senior admin approval.

### Account verification review

Triggered if:
- Stripe flags the original identity verification as suspicious
- User reports their account was compromised
- Admin suspects account sharing

Actions:
- Listing pause (user cannot take new bookings)
- Re-verification required via Stripe Identity
- If re-verification passes: restrictions lifted
- If fails: suspend pending investigation

---

## User Reports

Other users can report accounts via:
- "Report listing" (06-listing-detail)
- "Report message" (09-pre-pickup-messaging)
- Support contact

Reports are anonymous from the reported user's perspective. Admin receives:
- Reporter identity (internal only)
- Reason selected + free text
- Relevant booking reference (if applicable)

Admin reviews and takes appropriate action. Reporter receives: "We've reviewed your report and taken appropriate action." — no specifics (privacy).

Multiple reports from different users on the same account trigger an automatic escalation flag.

---

## Content Moderation

### Listing content
- Admin can edit or remove specific listing fields if they violate policy
- Example: remove a phone number embedded in lister notes (off-platform contact solicitation)
- Edit is logged with reason; lister notified of what changed and why

### Message content
- Admin can view all messages via dispute review (14) or user report
- Admin cannot delete message content — it's permanent record (by design)
- Admin can flag a message as "reviewed" to clear the report

### Review content
- Admin can remove a review that violates review policy
- Removals logged with reason
- Both parties see: "[Review removed by Kitlo — policy violation]" — not just a blank slot

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Suspended user creates a new account | Device fingerprint + email ban catches most attempts. Not foolproof. Phase 2: phone number verification adds another layer. |
| User claims their account was hacked | Admin investigates: recent login history, device changes, IP anomalies. If credible: temporary restriction, re-verification required, assist with account recovery. |
| Lister suspended mid-booking (gear is with renter) | Active booking proceeds normally — rental is not cancelled. Lister's payout queued but not released until admin resolves suspension. Renter is not penalized. |
| Admin receives legal order for user data | Legal escalation path: preserve all records, do not delete, forward to legal counsel. Not handled by admin user management UI. |
| High-volume lister (P4) receives a warning | Warning logged but account stays active. If Brad (P4) has 15 active listings and one bad renter, a warning shouldn't tank his business. Context matters. |
| User disputes their own suspension | Appeal via support contact. Senior admin reviews. Original admin's reasoning is documented — appeals require new evidence or argument. |

---

## Audit Log

Every admin action on every user account is logged:

- Admin user ID
- Action type (warning / restriction / suspension / ban / reinstatement)
- Reason (required text field)
- Duration (for temporary restrictions)
- Timestamp
- Related booking reference (if applicable)

Permanent. Immutable. Exportable.

---

## Trust & Safety Principles

- **Proportionality:** warnings before restrictions, restrictions before suspension, suspension before ban. Skip steps only for serious violations.
- **Documentation:** every action requires a written reason. "Seemed sketchy" is not a reason. "2 confirmed fraudulent damage claims in 30 days" is.
- **Reversibility:** most actions can be undone. Permanent bans are the exception — they require senior approval.
- **Privacy:** reported users don't know who reported them. Reporter outcomes are not shared in detail.
- **No automated bans:** every suspension requires human review. Automated flags surface context; humans make decisions.

---

## UI Notes (Admin Interface)

- User search: prominent at top of admin panel — admins spend a lot of time looking up specific users by support ticket
- User record is a single scrollable page — not tabbed (admin needs full context visible, not hidden in tabs)
- Red flags panel uses amber/red color coding; each flag has a "why this is flagged" tooltip
- Action buttons: Warning (amber) / Restrict (orange) / Suspend (red) / Ban (dark red) — color signals severity
- All destructive actions (suspend, ban) require typing the user's name to confirm — prevents accidental action
- Audit log tab shows full history with collapsible entries — most recent first

---

## Open Questions

- [ ] Should Kitlo notify the reporting user when action is taken? (More transparency, but risks doxxing admin decisions)
- [ ] Appeal process: email-based in Phase 1 (support ticket). Phase 2: in-app appeal form with structured input.
- [ ] Automated restriction triggers: should reaching 2+ late returns automatically restrict new bookings, or is this always a human decision?
- [ ] Platform-wide ban sharing: industry coalitions (Airbnb, Turo) share ban lists for serious fraud cases. Worth joining or creating one for the outdoor rental vertical.
