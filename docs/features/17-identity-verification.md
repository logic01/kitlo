# Feature: Identity Verification

**Personas:** Lister (P3/P4), Dual User (P5), optionally Renter (P1/P2)  
**Trigger:** Lister onboarding (required); renter onboarding (optional Phase 1, required Phase 2)  
**Depends on:** 01-registration-onboarding  
**Blocks:** 02-lister-onboarding (listing cannot publish until ID verified), 03-create-listing

---

## Goal

Verify that people listing high-value gear are who they say they are. Reduce fraud and theft risk. Give renters confidence that the person handing them a $5,000 scope is a real, traceable identity — not a throwaway account.

---

## Pre-conditions

- User has created an account (01)
- User has selected "I want to list gear" or "both" in intent selection

---

## Verification Provider

**Stripe Identity** — integrated with Stripe Connect (already in the payment stack).

- Handles document scanning + liveness check
- Supports: US driver's license, state ID, passport
- Data stored by Stripe — Kitlo does not store raw identity documents
- Returns a verification status: `verified`, `unverified`, `requires_input`

---

## Lister Identity Verification (Required)

### Flow

Part of the lister onboarding flow (02-lister-onboarding), Step 2.

1. Lister taps "Verify your identity" on onboarding step 2
2. Stripe Identity SDK launches (within Kitlo app)
3. User scans ID document (front + back for DL; photo page for passport)
4. Liveness check: selfie + match to document photo
5. Stripe processes — returns result within 60 seconds (usually faster)

**On success:**
- `verified` status set on user account
- Lister onboarding proceeds to Step 3 (bank account)
- "Verified Hunter" badge on profile (brand element — not just verification status)

**On failure:**
- Stripe returns specific failure reason: document unreadable, liveness failed, name mismatch, expired document
- User shown actionable guidance: retry with better lighting, use passport instead of DL
- 3 attempts before admin review required

### What Stripe verifies

- Document is genuine (not a photo of a photo, not digitally altered)
- Liveness: the person submitting is physically present
- Name on document matches name on Stripe Connect account (if already completed)
- Document is not expired

### What Kitlo stores

- Verification status (`verified` / `unverified`)
- Stripe verification session ID (for audit trail)
- Date verified
- No raw document images or personal data — all held by Stripe

---

## Renter Identity Verification (Phase 1: Optional, Phase 2: Required)

Phase 1: Renters are not required to verify identity. The deposit hold and review system provides enough friction for most fraud scenarios.

Phase 2: Required for renters booking gear over $3,000 MSRP.

### Renter verification trigger (Phase 1 optional path)

- Renter profile shows "Verify identity → earn Trusted Renter badge"
- Listers can filter search results to show only bookings from verified renters (Phase 2)
- Renter can voluntarily verify via account settings

### Renter verification trigger (Phase 2 mandatory path)

- At booking request (07), if listing MSRP > $3,000: "This listing requires identity verification before booking."
- Renter redirected to verification flow before booking can proceed
- After verification: booking continues normally

### Verification flow (renter)

Same as lister flow above — Stripe Identity SDK, document + liveness.

---

## Verification Badge

The "Verified Hunter" badge (defined in brand.md) is awarded after:
1. Identity verified by Stripe
2. Bank account connected (listers only)
3. Lister agreement signed (listers only)

For renters: badge awarded on identity verification alone (Phase 2 requirement).

Badge display locations:
- Lister profile card on listing detail (06)
- Search result listing card (05) — small badge icon
- Message thread header (09)
- Booking confirmation screen (08)

---

## Repeat Verification

- Verification is permanent unless revoked. Users do not re-verify on each booking.
- Kitlo can trigger re-verification if:
  - Stripe flags the original verification as suspicious
  - Admin determines the account may have been compromised
  - User requests account name change (name mismatch triggers re-verification)

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Non-US document (Canadian DL, passport) | Stripe Identity supports international passports. Non-US DLs may fail — user prompted to use passport. |
| ID is expired | Stripe returns `expired_document` — user prompted to use a valid document |
| Liveness check fails (poor lighting, obscured face) | Specific guidance shown: "Find a well-lit area, remove glasses, face the camera directly." |
| Name on ID doesn't match Stripe Connect account name | Stripe returns mismatch. User can update their Stripe Connect display name or contact support. |
| User is under 18 | Cannot list gear. Cannot rent (Phase 2 minimum age gate). Phase 1: not enforced except via ID document review. |
| User refuses to verify | Cannot list gear. Can rent (Phase 1 only). Unverified badge on profile. |
| Admin receives a suspicious account report | Admin can manually trigger re-verification and suspend listing until complete. |
| Stripe Identity is down | Verification step shown as "temporarily unavailable." Lister onboarding pauses at that step. SLA: retry within 4 hours. |

---

## Trust & Safety

- **Identity verification is a gate, not a guarantee** — it confirms the person is who they say they are, not that they're a good renter/lister. Review history and rental history are additional trust signals.
- **Stripe holds all sensitive data** — Kitlo's exposure to identity document liability is zero
- **Verification cannot be shared** — each account has its own verification session; creating a second account to bypass verification is detectable via device fingerprint and name match
- **Admin can revoke verification status** for cause (fraud, dispute pattern, identity theft report)

---

## UI Notes

- Verification UI is Stripe's native SDK — styled to match Kitlo brand via Stripe's appearance options, but Kitlo does not build a custom camera interface
- Progress indicator during verification: "Reviewing your document... this takes about 30 seconds"
- Success state: green checkmark, "Identity verified — you're good to go"
- Failure state: specific reason + retry button — not a generic error
- "Why do you need my ID?" expandable FAQ on the verification prompt screen:
  > "We verify identities so everyone knows who they're dealing with. Your ID is processed by Stripe — Kitlo never sees or stores your document."

---

## Open Questions

- [ ] Phase 2 renter verification threshold: $3,000 MSRP? $1,500? Depends on how much fraud we see in Phase 1.
- [ ] Should listers be able to require verified renters for their specific listing? (Power lister feature — Brad might want this for his $8K ATN unit)
- [ ] Verification for dual-users (P5): verify once, applies to both sides? (Yes — one verification per account, role doesn't matter)
- [ ] SSN collection: Stripe Connect may require SSN for 1099-K purposes at certain earnings thresholds — is this part of lister onboarding or deferred until threshold is hit?
