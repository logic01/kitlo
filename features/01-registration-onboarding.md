# Feature: Registration & Account Onboarding

**Personas:** Visitor (P6) → Renter (P1/P2) or Lister (P3/P4) or Dual User (P5)  
**Trigger:** User clicks "Sign in", "List your gear", "Book this gear", or any gated action  
**Depends on:** Nothing — this is the root workflow  
**Blocks:** All authenticated workflows

---

## Goal

Get the user from anonymous visitor to verified account holder in the fewest steps possible. Defer everything non-essential until it's actually needed.

---

## Pre-conditions

- User is not logged in
- User has clicked a gated CTA or navigated to /sign-in

---

## Happy Path

### Step 1 — Auth entry (Clerk modal or page)
- Options: email/password, Sign in with Google, Sign in with Apple
- Email: enter email → password → confirm
- OAuth: one tap, handled entirely by Clerk
- No username required. Legal name collected at step 3.

### Step 2 — Email verification (email/password only)
- Verification code sent to email
- 6-digit code entry, 10-minute expiry
- Resend code available after 30 seconds

### Step 3 — Basic profile
Fields:
- First name, last name (required)
- Profile photo (optional — can skip, prompted again later)
- Location: city/state (required — used to seed search and show local listings)

### Step 4 — Intent selection
- "I want to rent gear" → routes to renter dashboard / continues to original destination
- "I want to list gear" → routes to lister onboarding (feature/02)
- "Both" → routes to lister onboarding, renter dashboard accessible immediately after

### Step 5 — Destination redirect
- If user clicked a specific listing to trigger sign-in: return them to that listing
- If they signed in from the nav: route to their selected dashboard

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Email already registered | Show "Sign in instead" with pre-filled email |
| OAuth account email matches existing email account | Merge accounts (Clerk handles) |
| User drops off after email verification but before profile | Account created, profile prompted on next visit |
| User clicks "List your gear" but doesn't complete lister onboarding | Renter account active; lister onboarding prompted when they next try to create a listing |
| Under-18 user (if detectable) | No hard gate in Phase 1 — collect DOB at verification step and enforce there |

---

## Trust & Safety

- Clerk handles all credential storage and OAuth — Kitlo never touches raw passwords
- Profile photo not required at signup — reduces friction while allowing trust to build organically
- No SSN, no payment info collected at registration — those come at booking (Stripe) and lister onboarding (Stripe Connect)

---

## UI Notes

- Maximum 3 screens from click to dashboard
- Progress indicator during multi-step (steps 1–4)
- Skip options clearly visible for optional fields
- OAuth buttons above the fold, email/password collapsed by default on mobile
- "Why do we need your location?" tooltip on location field

---

## Open Questions

- [ ] Do we support magic link (passwordless) login? Reduces friction for field use.
- [ ] At what point do we prompt for phone number? (needed for SMS notifications)
- [ ] Hunter license number — collect here or later? (potential future trust signal)
