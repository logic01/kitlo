# Kitlo — Task Tracker

> Restart instructions: Open this file, check the status column, pick up at the first non-completed item. Completed work is archived in `docs/done-tasks.md`. All feature docs live in `/features`. Brand assets in `/brand`. Docs in `/docs`.

Last updated: 2026-05-01

> **Phase 0, Phase 1, Phase 2, and Phase 3.1–3.24 + 3.26 are complete — see `docs/done-tasks.md`. 3.25 (manual walkthrough) is ⚠️ partial — automated checks pass, full 22-workflow human walkthrough still owed.** Phase 4 (backend) is the next major block.

---

## Phase 3 — Frontend Development (in progress)

> **Goal of Phase 3**: a runnable Angular site that walks through every persona's full workflow using in-memory mock data — no backend, no Stripe, no Cloudinary, no real WebSocket. Real integrations move to Phase 5.

### Page Shells with Mocks
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.12 | Public page shells |  ✅ Done | Wired Home, Search, Listing detail through `ListingsService` + `ReviewsService`; sidebar filters now propagate. See `docs/done-tasks.md`. |
| 3.13 | Auth flow page shells |  ✅ Done | login/signup/forgot-password/verify-email — error + submitting signals; signup persists intent via `UsersService.saveIntent`. See `docs/done-tasks.md`. |
| 3.14 | Renter dashboard page shells |  ✅ Done | bookings, booking-detail/cancel/checkout/leave-review, messages inbox/thread, profile, reviews, notifications all read/write through mock services. See `docs/done-tasks.md`. |
| 3.15 | Lister dashboard page shells |  ✅ Done | listings list, listing-create/edit, bundle-create, earnings, setup-onboarding routed through `ListingsService` / `PayoutsService` / `UsersService`. See `docs/done-tasks.md`. |
| 3.16 | Admin dashboard page shells |  ✅ Done | listings queue + detail, disputes queue + detail, users search + detail, payouts; actions hit `AdminService` (approve/reject/rule/warn/restrict/suspend/reinstate). See `docs/done-tasks.md`. |

### Cross-cutting UX
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.17 | Global error handling + toast service |  ✅ Done | `ToastService` (signal-backed queue with success/error/info/warning + dedupe + auto-dismiss), `Toast` + `ToastContainer` components mounted in `app.html`, functional `errorInterceptor` mapping HTTP failures to toasts (and 5xx → `/server-error`), `GlobalErrorHandler` for uncaught exceptions, new `ServerError` (500) page. Wired via `provideHttpClient(withInterceptors([...]))` + `{ provide: ErrorHandler }` in `app.config.ts`. |
| 3.18 | Loading states + skeleton patterns |  ✅ Done | Card-shaped skeleton components (`ListingCardSkeleton`, `ProfileCardSkeleton`, `BookingCardSkeleton`, `TableRowSkeleton`) sized to match their real counterparts. `loadable()` helper in `core/loading/loadable.ts` returns `{ data, loading, error, hasData }` signals from an `Observable<T>`. Applied to `PublicHome`, `PublicSearch`, `PublicListingDetail`, `DashboardBookings`, `AdminListings` — centered spinners replaced with structured skeletons. |
| 3.19 | Form validators + error display patterns |  ✅ Done | `core/forms/validators.ts` — `kitloValidators.zip / dailyRate / photoCount / dateRange`. `core/forms/error-messages.ts` — `DEFAULT_ERROR_MESSAGES` map + `firstErrorMessage()` resolver covering all built-in + Kitlo keys. `FormField` accepts `[control]` for auto-derived errors (after touched/dirty), `[errorMessages]` overrides, `aria-describedby` wiring. Applied to `AuthLogin`, `AuthSignup`, `DashboardListingCreate` (uses `kitloValidators.zip` + `dailyRate`). |
| 3.20 | URL query-string sync for search filters |  ✅ Done | `PublicSearch` hydrates state from `route.queryParamMap` once on init, then writes `q / location / conditions / gearTypes / minPrice / maxPrice / verifiedOnly / radius / sort` back via `router.navigate({ replaceUrl: true })`. Default values omitted to keep URLs clean. |

### Verification & Testing
| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.21 | Unit tests for components & services |  ✅ Done | 58 vitest tests across 9 files: existing `services.spec.ts` (10) + new `toast.service.spec.ts` (8), `loadable.spec.ts` (3), `validators.spec.ts` (15), `error-messages.spec.ts` (7), `error-interceptor.spec.ts` (6), `global-error-handler.spec.ts` (2), `form-field.spec.ts` (5), `app.spec.ts` (2). All green. Coverage focus: new core modules from 3.17–3.19. |
| 3.22 | E2E tests for critical workflows |  ✅ Done | Playwright wired (`playwright.config.ts`) with chromium project pointing at `npm start` dev server. 9 specs across `e2e/` covering home/search/listing-detail browse, auth login validation, signup wizard, forgot-password, 404/500/forbidden error pages. Coverage of full booking + dispute + admin workflows is partial — see notes in `done-tasks.md`. |
| 3.23 | Lint & type checking |  ✅ Done | `npm run lint` clean (ESLint flat config + angular-eslint template-accessibility rules). `npm run build` runs full TS strict check with no errors. ESLint ignores `dist/`, `e2e/`, `playwright.config.ts`. |
| 3.24 | Build production bundle |  ✅ Done | `npm run build` produces `404.86 kB` initial / `102.47 kB` transfer (under the 500 kB warning budget in `angular.json`). Lazy chunks per route. Zero warnings. |
| 3.25 | Manual workflow walkthrough (THE Phase 3 acceptance gate) |  ⚠️ Partial | `npm start` boots cleanly; all key routes return 200; all 15 E2E (incl. axe) pass. **Full 22-workflow walkthrough through the dev role switcher (features/01–22 end-to-end, desktop + mobile devtools) requires a human in a browser — that part is owed by the user before declaring Phase 3 closed.** |
| 3.26 | Accessibility audit |  ✅ Done | Automated AXE via `@axe-core/playwright` runs against home/search/login/signup/500/404 (`e2e/a11y.spec.ts`) — 0 critical or serious violations across all 6 pages with WCAG 2 A + AA + 2.1 AA tags. Fixes applied: `--color-muted` darkened to `#5e6469`, `--color-faint` to `#6f757b`, `--color-on-dark-muted/faint` opacity bumped to 0.85/0.80 for AA on charcoal & olive, primary button text changed `text-white → text-ink` (4.6:1 vs amber), `<select>` labelling on search sort + role-switcher, `role="region"` on toast container, removed nested-interactive in `Toggle` by moving `role="switch"` onto the input, decorative step-card numerals marked `aria-hidden`. Lighthouse + manual keyboard-nav audit still owed if user wants belt-and-braces. |

---

## Phase 4 — Backend Development & Database

### Database Setup
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Scaffold C# .NET project |  ⬜ Pending | backend/ — ASP.NET Core 10+ Web API, Entity Framework Core, PostgreSQL provider, project structure (Controllers/, Services/, Models/, Data/). |
| 4.2 | Create Entity Framework Core models |  ⬜ Pending | backend/Kitlo.Core — User, Listing+Photos+Specs, Bundle, AvailabilityBlock, Booking + BookingEvent (state machine), Payment, Payout, MessageThread+Message, Review (blind two-way), Dispute, Notification + Preferences, AdminAction audit log, Report. All money in cents. |
| 4.3 | Configure PostgreSQL & migrations |  ⬜ Pending | backend/Kitlo.Data — DbContext, connection string via appsettings.json, initial migration. Run `dotnet ef database update` to create schema. |
| 4.4 | Seed initial data |  ⬜ Pending | Sample users, listings, categories for testing. Can be disabled in production. |

### Authentication & Authorization
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.5 | JWT authentication service |  ⬜ Pending | backend/Kitlo.Api/Services/AuthService — Generate JWT tokens, validate signatures, refresh token flow. Configuration via appsettings.json. |
| 4.6 | Auth middleware & route protection |  ⬜ Pending | backend/Kitlo.Api/Middleware — JWT validation middleware, role-based authorization (User/Lister/Admin), [Authorize] attributes on controllers. |
| 4.7 | Auth API endpoints |  ⬜ Pending | POST /api/auth/login, POST /api/auth/signup, POST /api/auth/refresh, POST /api/auth/logout. Password hashing with bcrypt or ASP.NET Identity. |

### Core API Services
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.8 | Listings API (CRUD) |  ⬜ Pending | GET /api/listings (search/filter), POST /api/listings (create), GET /api/listings/{id}, PUT /api/listings/{id}, DELETE /api/listings/{id}, POST /api/listings/{id}/photos, GET /api/listings/{id}/availability. |
| 4.9 | Users API |  ⬜ Pending | GET /api/users/me, PUT /api/users/{id}, GET /api/users/{id}/profile, GET /api/users/{id}/ratings. |
| 4.10 | Bookings API |  ⬜ Pending | GET /api/bookings, POST /api/bookings (create), GET /api/bookings/{id}, PUT /api/bookings/{id}/status (confirm, cancel, return), GET /api/bookings/{id}/timeline. |
| 4.11 | Search & discovery API |  ⬜ Pending | GET /api/listings?location=&category=&priceMin=&priceMax=&availability=. Full-text search, geolocation filtering. |

### Payment & Stripe Integration
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.12 | Stripe Connect setup |  ⬜ Pending | backend/Kitlo.Api/Services/StripeService — Account onboarding links, identity verification URLs, payment intents. Configuration via Stripe keys. |
| 4.13 | Payment flow endpoints |  ⬜ Pending | POST /api/payments/intent, POST /api/payments/confirm, POST /api/payments/refund. Two-PI pattern (charge + manual-capture). |
| 4.14 | Stripe webhook receiver |  ⬜ Pending | POST /api/webhooks/stripe — Handle identity.verification.session.completed, account.updated, payment_intent events, transfer events, dispute events. |
| 4.15 | Payouts logic |  ⬜ Pending | backend/Kitlo.Api/Services/PayoutService — Calculate earnings minus platform fee, release funds to lister bank account, track payout history. |

### Additional Features
| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.16 | Messaging API |  ⬜ Pending | POST /api/messages, GET /api/messages/threads, GET /api/messages/threads/{threadId}. Real-time updates via WebSocket or polling. |
| 4.17 | Reviews & ratings API |  ⬜ Pending | POST /api/reviews, GET /api/reviews?userId=, GET /api/listings/{id}/reviews. Blind two-way reviews (each party rates, not visible until both done). |
| 4.18 | Dispute resolution API |  ⬜ Pending | POST /api/disputes, GET /api/disputes/{id}, PUT /api/disputes/{id}/resolution. Evidence upload, admin approval. |
| 4.19 | Notifications API |  ⬜ Pending | GET /api/notifications, PUT /api/notifications/{id}/read, DELETE /api/notifications/{id}. Background job for email/push delivery. |
| 4.20 | Admin API |  ⬜ Pending | GET /api/admin/listings (review queue), GET /api/admin/disputes, GET /api/admin/users, PUT /api/admin/users/{id}/status (suspend/ban), GET /api/admin/payouts. |

---

## Phase 5 — Integration (Frontend ↔ Backend & Third-Party)

> Phase 3 ships with mocks and stubs so the site is walkable without a backend. Phase 5 replaces those one-by-one once Phase 4 is live.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | HTTP client + JWT interceptor |  ⬜ Pending | frontend/src/app/core/http — real API client, JWT injection, refresh-token flow, error mapping to ToastService. |
| 5.2 | Swap mock services for live API calls |  ⬜ Pending | Replace in-memory implementations in core/services with HTTP-backed ones. Service signatures already match — should be mechanical. Remove core/mock-data. |
| 5.3 | Real AuthService + guards |  ⬜ Pending | Replace mock AuthService from 3.8 with real JWT login, signup, refresh. Remove dev role switcher (or gate behind env flag). |
| 5.4 | Stripe Elements integration |  ⬜ Pending | Replace StripePaymentForm stub from 3.4 with Stripe Elements (card collection, PaymentIntent confirm). Stripe Connect onboarding redirect for listers. |
| 5.5 | Cloudinary upload integration |  ⬜ Pending | Replace PhotoUpload stub with real Cloudinary uploader (signed uploads). Wire to listing photos and avatars. Add responsive srcset helpers. |
| 5.6 | Real-time messaging client |  ⬜ Pending | Replace polled mock chat with WebSocket/SignalR client against backend (4.16). Online presence, typing indicators if scoped. |
| 5.7 | Map / location component |  ⬜ Pending | Replace MapView stub with Mapbox or Leaflet. Pickup-location display on listing detail, map view on search. ZIP/proximity filtering against backend. |
| 5.8 | E2E tests against real backend |  ⬜ Pending | Re-run Cypress/Playwright suite from 3.22 with backend running. Add happy-path Stripe test mode and Cloudinary test bucket. |
| 5.9 | Production deployment |  ⬜ Pending | Backend container deploy, frontend host (Vercel/Netlify/self-hosted — TBD), domain, env-var injection, smoke tests. |

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
