# Kitlo — Task Tracker

> Restart instructions: Open this file, check the status column, pick up at the first non-completed item. All feature docs live in `/features`. Brand assets in `/brand`. Docs in `/docs`.

Last updated: 2026-04-27

---

## Phase 0 — Foundation
| # | Task | Status | Notes |
|---|------|--------|-------|
| 0.1 | Define tech stack | ✅ Done | Next.js 15, Prisma, PostgreSQL, Clerk, Stripe Connect, Cloudinary — see CLAUDE.md |
| 0.2 | Brand design (8 options) | ✅ Done | brand/homepage-1 through 8 |
| 0.3 | Lock brand — Stewardship direction | ✅ Done | brand/brand.md, brand/style.css |

---

## Phase 1 — Research & Product Definition
| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Research top P2P rental platforms | ✅ Done | Airbnb, Turo, Fat Llama, GeerGarage, Outdoorsy, Spinlister studied |
| 1.2 | Identify key P2P feature requirements | ✅ Done | See P2P findings below |
| 1.3 | Define all user personas | ✅ Done | features/personas.md |
| 1.4 | Map all workflows per persona | ✅ Done | 22 workflows identified |
| 1.5 | Write individual feature .md files | ✅ Done | features/01 through features/22 |
| 1.6 | Iterate and refine all feature files | ✅ Done | Second pass complete — edge cases, cross-links, open questions resolved |

---

## Phase 2 — Design (Next)
| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Create a pages.md doc that lists every page that needs to be built. The purpose of the page, any API endpoints it will rely on, any component that will need styling and any other usefull detail about the page, such as what each link/button will do. Use the feature files to determine what pages are needed, | ✅ Done | pages.md — 35 pages, 9 areas, ~65 API endpoints |
| 2.2 | Create a visual sitemap so we can understand how all the pages are connected in the workflow | ✅ Done | sitemap.html — 5-column visual with 4 flow diagrams |
| 2.3 | Design component library (shadcn + style.css). Use the pages.md to find similar components and create the proper styles for them in style.css, it should follow our brand and use example.html styling as the base.| ✅ Done | brand/style.css — sections 1–44, 25 new component groups |
| 2.4 | Create a template.html that uses the style.css and shows all the compnents so I can verify the look/feel.  | ✅ Done | brand/template.html — 27 sections, all components demonstrated |
| 2.5 | Design all page layouts (wireframes or HTML) | ⬜ Pending | |
| 2.6 | Design mobile views | ⬜ Pending | |

## Phase 3 — Development (Next)
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Scaffold Next.js project | ⬜ Pending | |
| 3.2 | Prisma schema from domain models | ⬜ Pending | |
| 3.3 | Clerk auth integration | ⬜ Pending | |
| 3.4 | Stripe Connect integration | ⬜ Pending | |
| 3.5 | Core listing CRUD | ⬜ Pending | |
| 3.6 | Search & discovery | ⬜ Pending | |
| 3.7 | Booking & payment flow | ⬜ Pending | |
| 3.8 | Messaging | ⬜ Pending | |
| 3.9 | Reviews & ratings | ⬜ Pending | |
| 3.10 | Dispute resolution | ⬜ Pending | |
| 3.11 | Admin dashboard | ⬜ Pending | |
| 3.12 | Notifications (push + email) | ⬜ Pending | |

---

## P2P Platform Research Findings

### Top platforms studied
| Platform | Category | Key lesson for Kitlo |
|---|---|---|
| **Airbnb** | Accommodation | Trust via two-way reviews + payment escrow. Map-first search. Profile photos build human connection. |
| **Turo** | Car rental | Risk scoring with 50+ data sources. Insurance tiers by vehicle value. Instant book vs. approve flow. |
| **Fat Llama** | Equipment | Insurance up to £25K is table-stakes. Lenders get 80% take. Condition at handoff is the critical trust moment. |
| **GeerGarage** | Outdoor gear | Matching algorithm (Uber-style) vs. browse model. Lend-to-own program for supply acquisition. Pickup confirmation closes the rental loop. |
| **Outdoorsy** | RV rental | Insurance bundled into every booking, not optional. Verification is non-negotiable before keys exchange. |

### Universal P2P requirements (every platform has these)
1. **Identity verification** — government ID, selfie match, before first transaction
2. **Two-way profiles & ratings** — both sides have reputation on the line
3. **Secure payment escrow** — funds held until transaction confirmed by both parties
4. **Insurance / damage coverage** — required, not optional, for any high-value item
5. **In-app messaging** — keep communication on-platform for dispute evidence
6. **Availability calendar** — real-time blocking, prevent double-booking
7. **Dispute resolution** — admin-mediated with evidence submission
8. **Cancellation policy** — tiered refunds based on notice period
9. **Search with location + filters** — proximity, category, date range, price
10. **Mobile-first UX** — hunters use phones in the field
11. **Notifications** — critical events must reach users via push + email
12. **Admin tooling** — listing review, user management, payout control

### Kitlo-specific differentiators
- **Bundle listing** — thermal + NV in one booking. No competitor offers this.
- **Condition rating system** — Mint / Field-Ready / Battle-Scarred. Honest, specific to field gear.
- **Verified Hunter badge** — ID-verified listers build community trust in a trust-insular market.
- **Spec-first listing cards** — hunters evaluate on specs (resolution, detection range, magnification), not marketing copy.

---

## Feature File Index
| File | Workflow | Persona(s) |
|---|---|---|
| features/personas.md | All personas defined | — |
| features/01-registration-onboarding.md | Sign up and create account | Visitor → Renter/Lister |
| features/02-lister-onboarding.md | Verify identity, connect bank | New Lister |
| features/03-create-listing.md | Add gear to the platform | Verified Lister |
| features/04-manage-listings.md | Edit, pause, archive listings | Lister |
| features/05-search-discovery.md | Find gear by location and type | Renter / Visitor |
| features/06-listing-detail.md | Evaluate a listing before booking | Renter |
| features/07-booking-request.md | Request dates and submit booking | Renter |
| features/08-payment-checkout.md | Pay, hold deposit, confirm booking | Renter |
| features/09-pre-pickup-messaging.md | Coordinate pickup details | Renter + Lister |
| features/10-pickup-inspection.md | Meet, inspect, confirm handoff | Renter + Lister |
| features/11-active-rental.md | Gear in use — extensions, support | Renter |
| features/12-return-confirmation.md | Return gear, release funds | Renter + Lister |
| features/13-ratings-reviews.md | Rate the other party post-return | Renter + Lister |
| features/14-dispute-resolution.md | File and resolve a dispute | Renter or Lister + Admin |
| features/15-payouts-earnings.md | Receive earnings, view dashboard | Lister |
| features/16-notifications.md | All platform notification events | All users |
| features/17-identity-verification.md | Verify government ID | Lister (required), Renter (high-value) |
| features/18-admin-listing-review.md | Review and approve premium listings | Admin |
| features/19-admin-dispute-management.md | Mediate disputes between users | Admin |
| features/20-admin-user-management.md | Warn, suspend, ban users | Admin |
| features/21-cancellation.md | Cancel a confirmed booking | Renter or Lister |
| features/22-bundle-listing.md | Create and book thermal+NV bundle | Lister + Renter |

---

## Open Questions (cross-cutting)
- [ ] Do we require lister approval on every booking, or default to instant book?
- [ ] What is Kitlo's take rate? (industry range: 5–20% from renter, 10–20% from lister)
- [ ] Minimum rental period? (suggest: 1 day minimum, 30-day maximum per booking)
- [ ] Extension policy: how long can a rental be extended, and does the deposit increase?
- [ ] International renters: US-only for Phase 1?
- [ ] Does Kitlo charge a membership/subscription, or purely transaction-based?
- [ ] What is the grace period for late returns before a late fee kicks in?
