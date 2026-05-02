# Feature: Lister Onboarding

**Personas:** New Lister (P3), Power Lister (P4), Dual User (P5)  
**Trigger:** User selects "List gear" intent at registration, or clicks "List your gear" for the first time with an existing account  
**Depends on:** 01-registration-onboarding  
**Blocks:** 03-create-listing (cannot publish until onboarding complete)

---

## Goal

Verify the lister's identity and set up their payout account before any listing goes live. This is a one-time gate. Once through, they can create unlimited listings.

---

## Pre-conditions

- User has a registered Kitlo account
- User has not completed lister onboarding before

---

## Happy Path

### Step 1 — Onboarding intro screen
- Headline: "Before you list, we need to verify your identity."
- Explain what's required and why (trust, insurance eligibility, payout)
- Three things shown: ID verification, payout account, lister agreement
- CTA: "Let's get started"

### Step 2 — Identity verification
- Powered by Stripe Identity (or Clerk's ID verification add-on)
- User prompted to:
  1. Select document type: Driver's license, Passport, State ID
  2. Upload front (and back for DL/State ID)
  3. Take or upload selfie for liveness check
- Auto-verification result in real time (typically < 30 seconds)
- Pass → proceed to Step 3
- Fail → see edge cases

### Step 3 — Connect payout account (Stripe Connect)
- Explain: "This is where your earnings go after each rental."
- Options: bank account (routing + account number) or debit card
- Stripe Connect onboarded flow — Kitlo does not store bank details
- For Power Listers (Brad): single payout account applies to all listings
- Requires: SSN last 4 digits (IRS requirement for 1099-K), DOB, address

### Step 4 — Lister Agreement
- Scroll-to-accept legal agreement covering:
  - Listing accuracy requirements (condition rating must be honest)
  - Gear must be owned by lister, not borrowed or leased
  - Prohibited gear categories (tree stands, drone thermal, etc.)
  - Platform take rate (displayed explicitly — no surprises)
  - Insurance terms and lister liability for fraudulent listings
- Checkbox: "I agree to the Kitlo Lister Agreement" + timestamp recorded

### Step 5 — Onboarding complete
- Confirmation screen: "You're verified. Time to list your first piece of gear."
- CTA: "Add your first listing" → routes to 03-create-listing
- Secondary: "I'll do this later" → returns to dashboard with reminder banner

---

## Edge Cases

| Scenario | Handling |
|---|---|
| ID verification fails (bad photo quality) | Allow re-upload with tips: better lighting, flat surface, no glare |
| ID verification fails (document expired) | Block until valid document provided; show specific reason |
| ID verification fails (name mismatch with account) | Flag for manual review; 24h turnaround; notify user |
| Non-US ID presented | Accept for manual review — Phase 1 is US-only but don't hard-block international hunters |
| Stripe Connect onboarding fails | Allow retry; if repeated failure, surface support contact |
| Lister abandons mid-onboarding | Save progress; resume from where they left off on next visit |
| Lister tries to create listing without completing onboarding | Show gate prompt with progress indicator showing what's missing |

---

## Trust & Safety

- Identity verification is mandatory for all listers — no exceptions
- Raw ID document data handled entirely by Stripe Identity — Kitlo stores only the verification status and Stripe's verification ID
- SSN last 4 collected solely for IRS 1099-K compliance — not used for identity matching
- Gear valued > $5,000 MSRP triggers enhanced review at listing creation (admin queue) — the onboarding here is the same for all listers
- Lister agreement timestamp and IP logged for legal record

---

## UI Notes

- Show a persistent progress bar across all 4 steps (Step 1 of 4)
- Never ask for information you don't immediately need — no upsells or extras in this flow
- Payout account step: explicitly show "Kitlo uses Stripe — your bank details are never stored by us"
- Lister agreement: show the take rate percentage in plain language before they accept
- Mobile: camera access for ID upload must work natively — test on iOS Safari and Android Chrome

---

## Open Questions

- [x] What is Kitlo's take rate from listers? **Phase 1: 5% deducted from each payout.** See `docs/business-plan.md` for the phased rollout.
- [ ] Do we offer a lender protection guarantee beyond Thimble coverage? (affects agreement terms)
- [ ] At what earnings level does Kitlo issue a 1099-K? (IRS threshold is $600/year — confirm this applies)
- [ ] Should we allow corporate entities (LLCs) to list gear, or individuals only in Phase 1?
